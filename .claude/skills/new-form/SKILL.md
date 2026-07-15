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
const appointments = useAppointments();

const onFinish = (values: NewAppointment) => {
  const parsed = newAppointmentSchema.safeParse(values); // boundary guard
  if (!parsed.success) return; // antd rules normally catch this first
  if (hasConflict(appointments, parsed.data)) {          // pure business rule
    form.setFields([{ name: 'slot', errors: ['That slot is already booked'] }]);
    return;
  }
  appointmentRepo.create(parsed.data);
  message.success('Appointment booked');
  navigate('/appointments');
};
```

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
- Business rules (double-booking) are a PURE function (`hasConflict`) tested
  independently (write-unit-tests) — never inline in `onFinish`
- Submit disabled/loading while working; success → antd `message` + navigate
- DatePicker returns a dayjs object (antd 6) — convert to ISO string for
  storage (`value.toISOString()` / a mapper) so zod `.datetime()` passes
- `data-testid` on every field + submit; antd renders wrapper DOM, so verify
  the id lands on the control

## Verification contract

- **Inputs**: the zod schema, the field design, the repository to submit to.
- **Outputs**: an antd Form, validation (rules + zod guard), a tested pure
  business-rule function, submit→persist→navigate, testids.
- **Verify**: `npm run typecheck` · `npm test` (invalid blocked; valid
  persists once; conflict rejected) · submit once valid and once invalid in
  the app.
- **Failure modes**: business rule inside the handler instead of a pure fn;
  no zod guard before persisting; dayjs stored raw (breaks `.datetime()`);
  double-submit (button not disabled); missing field labels/testids;
  hardcoded messages instead of i18n-ready copy.
