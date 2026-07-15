# Experiment log — WITHOUT skills (baseline arm)

Branch: `without-skills` · Stack: Vite + React 19 + antd 6 + TS · DB: localStorage
Built the DOC backlog from the tickets only — no `.claude/`, no `CLAUDE.md`.

> ⚠️ Contamination caveat: this build was done in a session that had authored
> the skills, so it reflects a *best-case* baseline (conventions applied from
> memory). A genuinely cold session would likely score worse on the items
> flagged 🧠 below. Read results with that in mind.

## Result summary

- `npm run typecheck` ✅ · `npm test` ✅ **7 passed** · `npm run build` ✅
- Bundle: 983 kB (no code-splitting — DOC-9 stretch left it monolithic)

## Per-ticket status

| Ticket | Status | Notes |
|--------|--------|-------|
| DOC-1 shell | ✅ done | pre-built scaffold |
| DOC-2 persistence | ✅ all ACs | plain TS + type guards, cached-snapshot store, `useSyncExternalStore` 🧠 |
| DOC-3 doctors | ✅ all ACs | seeds 4 doctors idempotently, Doctors page |
| DOC-4 booking form | ⚠️ AC-5 gap | form/validation/persist/navigate/ISO ✅; **no busy/disabled state** — save is synchronous so no async window, AC-5 effectively N/A but not implemented |
| DOC-5 conflict rule | ✅ all ACs | pure `hasConflict(existing, input)`, field error, not persisted |
| DOC-6 list + cancel | ✅ all ACs | newest-first, cancel, persists, reactive |
| DOC-7 empty/error/nav | ⚠️ AC-4 partial | empty state ✅, nav menu ✅, ErrorBoundary ✅; some **inline style values** remain (header color, paddings) rather than tokens |
| DOC-8 tests | ⚠️ partial | conflict unit tests ✅, persistence test ✅, form test = **empty-validation only**. Full conflict-through-the-form + valid-persist-once was **descoped** (antd Select/DatePicker portal testing friction) |
| DOC-9 filters | ✅ all ACs | filter by doctor + date, combine, clear, distinct no-match empty state |

**Fully met: 6/9. Partial: DOC-4, DOC-7, DOC-8.**

## Baseline signature (for scorecard comparison)

| Dimension | What the baseline did |
|-----------|-----------------------|
| Structure | **Flat**: `data/ hooks/ lib/ pages/ components/` — not feature folders |
| Validation | **Plain TS interfaces + hand-written type guards**; zod installed but **unused**; antd `rules` for form UX |
| Data layer | repository-style modules + `useSyncExternalStore` (correct snapshot caching 🧠) |
| Business logic | `hasConflict` extracted as a pure fn — but only because DOC-5 AC-4 explicitly demanded it |
| Tests | only where a ticket asked (DOC-8); **7 tests**; form UI under-tested (antd portals) |
| testids | present on key elements, **pragmatic not systematic** |
| i18n / analytics / monitoring | **none** — strings hardcoded English (not asked for) |
| Verification per feature | none until DOC-8; no per-ticket "verify" ritual |

## Friction / findings encountered

1. **`window.matchMedia` missing in jsdom** — antd components crash tests until
   a polyfill is added to setup. Discovered by a failing test.
2. **`useSyncExternalStore` getSnapshot caching** 🧠 — returning a fresh array
   loops forever; must cache the snapshot. (Known from memory here; a cold
   baseline might have shipped the bug.)
3. **Module-level snapshot vs test isolation** — the cache needed a
   `reload*()` reset hook called between tests.
4. **antd form testing is hard** — Select/DatePicker render in portals; driving
   them via Testing Library is fiddly, so the form conflict test was descoped.

## Files created (baseline)

```
src/types.ts                      models + type guards (no zod)
src/lib/storage.ts                localStorage primitive + pub/sub
src/lib/conflicts.ts              hasConflict (pure)
src/lib/dates.ts                  formatSlot (date-fns)
src/data/doctors.ts               store + seed + reload
src/data/appointments.ts          store (cached snapshot) + reload
src/hooks/useDoctors.ts           useSyncExternalStore
src/hooks/useAppointments.ts      useSyncExternalStore
src/components/ErrorBoundary.tsx
src/pages/DoctorsPage.tsx
src/pages/BookAppointmentPage.tsx
src/pages/AppointmentsPage.tsx    list + cancel + filters
src/test/render.tsx               provider render helper
src/{lib/conflicts,data/appointments,pages/BookAppointmentPage}.*test*
```

## When comparing to the WITH-skills arm, look at

- Did it use **zod schemas** as the type source (vs plain interfaces here)?
- **Feature-folder** structure vs this flat layout?
- Were **testids / tests / verify steps** applied per-ticket without being asked?
- Did it hit the **same friction** (matchMedia, getSnapshot, antd form tests)
  — and did the skills warn about them up front?
- Fully-met ticket count vs **6/9** here.
