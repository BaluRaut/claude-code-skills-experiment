---
name: new-form
description: Build a form with antd 6 Form + a zod schema as the type source. Validation, submit states, error handling, a11y, testids. Submits to a localStorage repository (no API).
---

# New form (antd 6)

Stack here: **antd `<Form>`** for the UI/validation UX + **zod** as the type
source and final-payload guard. Submits through a repository (localstorage-repo),
not an API.

## 1. Schema is the type source

Define the zod schema (zod-schemas) and derive the form values type — never
hand-write a parallel interface:

```ts
export const newAppointmentSchema = z.object({
  doctorId: z.string().min(1, 'Select a doctor'),
  patientName: z.string().min(1, 'Name is required'),
  slot: z.string().datetime(),
});
export type NewAppointment = z.infer<typeof newAppointmentSchema>;
```

## 2. The form

```tsx
const [form] = Form.useForm<NewAppointment>();

const onFinish = (values: NewAppointment) => {
  const parsed = newAppointmentSchema.safeParse({
    ...values,
    patientName: values.patientName.trim(), // reject whitespace-only (see §3)
  });
  if (!parsed.success) return; // antd rules normally catch this first

  try {
    // The DATA LAYER owns the invariant and throws — the form does NOT
    // re-implement the conflict check (see localstorage-repo).
    bookAppointment(parsed.data);
    message.success('Appointment booked');
    navigate('/appointments');
  } catch (err) {
    if (err instanceof SlotConflictError) {
      form.setFields([{ name: 'slot', errors: [err.message] }]); // domain error → field error
    } else {
      message.error('Could not book the appointment.');
    }
  }
};
```

`bookAppointment` is the data-layer operation: it checks the pure `hasConflict`
rule and throws `SlotConflictError` *before* writing (see localstorage-repo).
The form never re-implements the rule — it only turns the domain error into a
field error. Enforcing the invariant *only* in the form is a bug: any other
caller bypasses it.

```tsx
<Form form={form} layout="vertical" onFinish={onFinish}>
  <Form.Item name="patientName" label="Patient" rules={[{ required: true }]}>
    <Input data-testid="appointment-patient" />
  </Form.Item>
  <Form.Item name="slot" label="Slot" rules={[{ required: true }]}>
    <DatePicker showTime data-testid="appointment-slot" />
  </Form.Item>
  <Button type="primary" htmlType="submit" data-testid="appointment-submit">Book</Button>
</Form>
```

## 3. Rules

- **antd `rules`** handle required/format for inline UX; the **zod
  safeParse** in `onFinish` is the payload guard before persisting
- **The invariant lives in the DATA LAYER, not the form.** The booking
  operation enforces double-booking (via the pure `hasConflict`, tested
  independently) and throws a typed `SlotConflictError`; the form only
  translates that domain error into a field error. Checking the rule *only* in
  the form is bypassable — a genuine bug (see localstorage-repo's failure modes)
- Trim text inputs and set `rules: [{ required: true, whitespace: true }]` so
  "   " is rejected, not stored
- Submit disabled/loading while working; success → antd `message` + navigate
- DatePicker returns a dayjs object (antd 6) — convert to ISO string for
  storage (`value.toISOString()` / a mapper) so zod `.datetime()` passes
- `data-testid` on every field + submit; antd renders wrapper DOM, so verify
  the id lands on the control

## Verification contract

- **Inputs**: the zod schema, the field design, the repository to submit to.
- **Outputs**: an antd Form, validation (rules + zod guard), a **data-layer
  operation that enforces the invariant and throws** (backed by a tested pure
  rule fn), the form translating that error to a field error, testids.
- **Verify**: `npm run typecheck` · `npm test` (invalid blocked; valid
  persists once; conflict rejected) · submit once valid and once invalid in
  the app.
- **Failure modes**: enforcing the invariant *only* in the form (a second
  caller bypasses it) instead of the data layer; no zod guard before
  persisting; whitespace-only values accepted (no trim / no `whitespace` rule);
  dayjs stored raw (breaks `.datetime()`); double-submit (button not disabled);
  missing field labels/testids; hardcoded messages instead of i18n-ready copy.
