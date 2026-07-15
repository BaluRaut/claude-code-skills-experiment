# DOC-5 · Prevent double-booking (conflict rule)

Type: Story · Points: 3 · Priority: High

## Description
As a clinic, we must not book the same doctor for the same time slot twice.

## Acceptance criteria
- AC-1 Booking a doctor for a slot that is already taken for that doctor is
  rejected with a clear, field-level error ("That slot is already booked").
- AC-2 The same slot for a DIFFERENT doctor is allowed.
- AC-3 The rejected booking is not persisted.
- AC-4 The conflict check is implemented as a standalone function that takes
  the existing appointments + the proposed booking and returns whether it
  conflicts — so it can be unit-tested on its own (see DOC-8).

## Out of scope
- Appointment duration/overlap windows — treat a slot as an exact match.
