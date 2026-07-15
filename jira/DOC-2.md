# DOC-2 · Domain model & localStorage persistence

Type: Story · Points: 5 · Priority: High

## Description
As a developer, I need typed domain models and a persistence layer over
localStorage so features can read/write data that survives a page refresh.
There is no backend.

## Acceptance criteria
- AC-1 A `Doctor` model (id, name, specialty) and an `Appointment` model
  (id, doctorId, patientName, slot as ISO datetime, createdAt) exist as typed
  entities.
- AC-2 Data is persisted in localStorage and survives a full page refresh.
- AC-3 Reading persisted data is resilient: a corrupt/old record does not
  crash the app (it is skipped or handled).
- AC-4 Creating a record generates a unique id and a createdAt timestamp.
- AC-5 UI code can subscribe to data and re-render when it changes (no manual
  refresh needed after a create/delete).

## Out of scope
- Any network/API calls. Editing records (only create/list/delete for now).

## Notes
Keep persistence isolated from UI — screens should not read localStorage
directly.
