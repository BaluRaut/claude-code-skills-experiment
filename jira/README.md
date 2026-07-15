# DOC — Doctor Appointment Booking (Epic)

A small appointment-booking app. **localStorage is the database — no backend.**

## Tech context (applies to every ticket, both experiment branches)

- Vite + React 19 + antd 6 + TypeScript (already scaffolded — DOC-1 done)
- Data persists in `localStorage`; there is no server/API
- Dates via antd's DatePicker (dayjs); store ISO strings

## Backlog

| Ticket | Title | Points | Priority |
|--------|-------|--------|----------|
| DOC-1 | App shell & tooling | 2 | done |
| DOC-2 | Domain model & localStorage persistence | 5 | high |
| DOC-3 | Doctors directory (seed + list) | 3 | high |
| DOC-4 | Book an appointment (form + validation) | 5 | high |
| DOC-5 | Prevent double-booking (conflict rule) | 3 | high |
| DOC-6 | Appointments list + cancel + persistence | 5 | high |
| DOC-7 | Empty / error states & UX polish | 3 | medium |
| DOC-8 | Test suite (booking rules + persistence) | 5 | high |
| DOC-9 | Filter appointments by doctor & date | 3 | low (stretch) |

Suggested order: DOC-2 → DOC-3 → DOC-4 → DOC-5 → DOC-6 → DOC-7 → DOC-8 → DOC-9.

## The experiment

Build this same backlog twice and compare — see **[EXPERIMENT.md](EXPERIMENT.md)**.
- `without-skills` branch: no `.claude/`, no `CLAUDE.md` — just these tickets.
- `with-skills` branch: the full skill library + conventions.

Same tickets, same order, same model. The scorecard is in EXPERIMENT.md.
