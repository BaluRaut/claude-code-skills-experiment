# DOC-6 · Appointments list + cancel + persistence

Type: Story · Points: 5 · Priority: High

## Description
As a patient, I want to see my booked appointments and cancel one.

## Acceptance criteria
- AC-1 An appointments screen lists all appointments showing doctor name,
  patient name, and a human-readable date/time.
- AC-2 Appointments are ordered newest-first (by booking time).
- AC-3 Each appointment has a Cancel action that removes it from the list and
  from storage.
- AC-4 The list and any cancellation persist across a full page refresh.
- AC-5 Canceling updates the list immediately (no manual refresh).

## Out of scope
- Editing an appointment. Undo of a cancel.
