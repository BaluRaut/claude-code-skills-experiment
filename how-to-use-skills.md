# How to use Claude Code skills in this repo

The shell is built and runs (`npm run dev`). **You** build the Doctor
Appointments feature by invoking the skills in `.claude/skills/`. This guide
shows how skills work and gives a step-by-step build plan.

---

## 1. How skills actually work

A skill is a checked-in playbook Claude follows. Two ways to trigger one:

- **Explicit:** type `/new-page` (slash + skill name), or say
  *"Use the new-page skill to …"*.
- **Implicit:** just describe the task — *"add an appointments list screen"* —
  and Claude matches it to installed skills by their descriptions and pulls
  them in automatically.

Every skill in `.claude/skills/` is a candidate on every task, which is why a
repo installs a focused set, not all 60+ from the catalog.

## 2. What's installed here (13 skills)

**Data & schema**
- `zod-schemas` — schemas are the source of truth (`z.infer`)
- `localstorage-repo` — ⭐ the data layer: typed repository + reactive hook
  over localStorage (this app's replacement for http-client + React Query)

**Building screens**
- `new-page` — a screen: route, states, thin composition
- `new-form` — antd 6 `<Form>` + zod, submit to a repository

**UI**
- `antd` — antd 6 conventions (ConfigProvider tokens, Table/Form/DatePicker)
- `theming` — tokens → antd theme

**Code quality**
- `typescript`, `code-design-solid` — strict TS; layering + pure testable logic

**Testing**
- `write-unit-tests`, `testing-library-react`, `vitest-unit` — AC-driven tests
- `add-testids` — stable testids for assertions

**Review**
- `component-review` — audit a screen against the house thresholds

> Every skill ends with a **Verification contract** (Inputs → Outputs →
> Verify → Failure modes). Read it before you accept the output.

## 3. The adaptation you should notice

The catalog's data skills assume a backend (axios, React Query). This app has
none — so `localstorage-repo` **replaces** them, keeping the SAME layering
(primitive → repository → hook → component). That's the whole point of skills:
the *principle* is portable; the *implementation* adapts to the repo. When you
later build a real app with an API, you'd swap that one skill.

---

## 4. Build plan — Doctor Appointments

Acceptance criteria (your definition of done):

```
AC-1  I can see a list of doctors (seeded) to pick from.
AC-2  I can book an appointment: patient name + doctor + date/time slot.
AC-3  Booking validates — required fields, and no double-booking the same
      doctor+slot — with a field-level error on conflict.
AC-4  Booked appointments show in a list, newest first, and PERSIST across
      page refresh (localStorage).
AC-5  I can cancel (remove) an appointment.
AC-6  Empty state when there are no appointments yet.
AC-7  The double-booking rule is a pure function, unit-tested.
```

Do it one step at a time. After each step: `npm run typecheck && npm test`.

### Step 1 — Schemas  (skill: `zod-schemas`)
> "Use zod-schemas. Create `src/features/doctors/doctor.schema.ts` (id, name,
> specialty) and `src/features/appointments/appointment.schema.ts` (id,
> doctorId, patientName, slot ISO datetime, createdAt), with `z.infer` types
> and a `newAppointmentSchema` for the form."

### Step 2 — Data layer  (skill: `localstorage-repo`)
> "Use localstorage-repo. Create `src/lib/storage.ts`, then a `doctorRepo`
> (seed 4 doctors on first read) and an `appointmentRepo` (list newest-first,
> create, remove). Add `useDoctors()` and `useAppointments()` hooks with
> useSyncExternalStore. Parse rows with zod on read."

### Step 3 — Appointments list  (skills: `new-page`, `antd`, `add-testids`)
> "Use new-page. Build `AppointmentsPage` at `/appointments`: antd List of
> appointments (doctor name + patient + formatted slot) with a Cancel button
> per row (AC-5), an antd Empty state (AC-6), and a 'Book appointment' link.
> Register the route."

### Step 4 — Booking form  (skills: `new-form`, `code-design-solid`)
> "Use new-form. Build `NewAppointmentPage` at `/appointments/new`: antd Form
> with patient name, a doctor Select (from useDoctors), and a DatePicker
> slot. Put the double-booking check in a pure `hasConflict(appointments,
> input)` function; show a field error on conflict (AC-3). On success persist
> and navigate to the list."

### Step 5 — Tests  (skills: `write-unit-tests`, `testing-library-react`, `vitest-unit`)
> "Use write-unit-tests. Cover the ACs: `hasConflict` pure-function tests
> (AC-7), a repo test that create→list persists and remove works (AC-4/5),
> and a form test that a conflicting slot shows the field error and does NOT
> persist (AC-3)."

### Step 6 — Polish  (skills: `theming`, `component-review`)
> "Run component-review on AppointmentsPage and NewAppointmentPage and fix
> what it finds." Then check colors come from tokens, not inline hex.

---

## 5. Tips that make skills work well

- **One skill per step.** Small, verifiable increments beat one giant prompt.
- **Use plan mode** (shift+Tab twice) for steps 2 and 4 — review the plan
  before code; it's cheap insurance.
- **Trust the Verify step.** A skill isn't done because it looks right — run
  `typecheck` + `test`, and drive it in `npm run dev`.
- **Let the hook format for you** — the PostToolUse hook runs Prettier on
  every file Claude edits.
- **Prune later.** This repo carries 13 skills for learning. Once you see
  which you actually use, a real repo keeps 5–8 and moves the rest back to
  the catalog. Unused installed skills just blur skill-matching.
- **When Claude gets a convention wrong twice**, fix it in `CLAUDE.md` — not
  by re-explaining every prompt.

## 6. Verify the whole thing

```
npm run typecheck   # strict TS
npm test            # your AC-driven tests
npm run dev         # book an appointment, refresh — it persists
```

When all three are green and the ACs hold, you've built a real feature
entirely through skills — the proof that this workflow works for your team.
