# DOC-8 · Test suite (booking rules + persistence)

Type: Story · Points: 5 · Priority: High

## Description
As a team, we want automated tests covering the risky logic so refactors are
safe.

## Acceptance criteria
- AC-1 The double-booking conflict function (DOC-5) has unit tests: conflict
  detected for same doctor+slot, allowed for different doctor or slot.
- AC-2 The persistence layer has a test: create → list returns it → remove
  removes it, and data round-trips through storage.
- AC-3 The booking form has a test: a conflicting slot shows the field error
  and does NOT persist; a valid booking persists once.
- AC-4 Tests derive from the acceptance criteria above, and `npm test` is
  green.

## Notes
Tests should be able to fail — verify at least one by breaking the rule.
