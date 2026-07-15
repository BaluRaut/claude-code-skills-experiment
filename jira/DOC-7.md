# DOC-7 · Empty / error states & UX polish

Type: Story · Points: 3 · Priority: Medium

## Description
As a patient, I want the app to guide me when there is nothing to show or
something goes wrong.

## Acceptance criteria
- AC-1 When there are no appointments, the list shows a designed empty state
  with a clear "Book appointment" call to action (not a blank screen).
- AC-2 Navigation lets me move between Doctors, Appointments, and Book without
  editing the URL by hand.
- AC-3 A rendering error in one screen does not blank out the whole app.
- AC-4 Colors/spacing come from the theme, not hardcoded values.

## Out of scope
- Full visual design system; loading spinners (reads are synchronous).
