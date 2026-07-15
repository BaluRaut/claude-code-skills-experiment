# DOC-4 · Book an appointment (form + validation)

Type: Story · Points: 5 · Priority: High

## Description
As a patient, I want to book an appointment by choosing a doctor, entering my
name, and picking a date/time.

## Acceptance criteria
- AC-1 A booking form has: patient name, doctor (select), and a date/time slot.
- AC-2 Submitting with any required field empty shows a field-level
  validation error and does not create an appointment.
- AC-3 On a valid submit, the appointment is persisted and I am returned to
  the appointments list, where the new appointment is visible.
- AC-4 The date/time is stored in a consistent serializable format (ISO
  string), not a raw picker object.
- AC-5 The submit control is disabled/busy while saving (no double-submit).

## Out of scope
- Editing an existing appointment. Double-booking rule is DOC-5.
