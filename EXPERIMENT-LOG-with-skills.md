# Experiment log — WITH skills

Branch: `with-skills` · Stack: Vite + React 19 + antd 6 + TS · DB: localStorage
Built the DOC backlog following the 13 skills in `.claude/skills/` + `CLAUDE.md`.

> ⚠️ Same contamination caveat as the baseline: this session authored the
> skills. The structural/testing differences below are the genuine *signature*
> of following the skill playbooks, but treat absolute quality as best-case.

## Result summary

- `npm run typecheck` ✅ · `npm test` ✅ **10 passed** (4 files) · `npm run build` ✅

## Per-ticket status

| Ticket | Status | Notes |
|--------|--------|-------|
| DOC-2 persistence | ✅ all ACs | **zod schemas** = source of truth, repo parses on read, cached snapshot |
| DOC-3 doctors | ✅ all ACs | `doctorRepo.seedIfEmpty()`, DoctorsPage with empty state |
| DOC-4 booking form | ✅ all ACs | antd Form + **zod boundary guard**, **loading/busy state** (AC-5 met) |
| DOC-5 conflict rule | ✅ all ACs | pure `hasConflict`, field error, not persisted |
| DOC-6 list + cancel | ✅ all ACs | list, cancel, reactive — **covered by a test** |
| DOC-7 empty/error/nav | ⚠️ AC-4 partial | empty state (tested), nav, ErrorBoundary **with retry**; a few inline style values remain |
| DOC-8 tests | ⚠️ mostly | **10 tests**: conflict, repo CRUD, **corrupt-data resilience (AC-3)**, form validation, empty state, list+cancel. Still no through-the-form conflict UI test (antd portal friction) |
| DOC-9 filters | ✅ all ACs | doctor + date filter, combine, clear, distinct no-match empty state |

**Fully met: ~8/9** (DOC-7 AC-4 tokens partial; DOC-8 UI-conflict test gap shared with baseline).

## With-skills signature

| Dimension | What the skills produced |
|-----------|--------------------------|
| Structure | **Feature folders**: `src/features/{appointments,doctors}/` (schema, repo, hook, pages, tests co-located) |
| Validation | **zod schemas as the single source of truth** (`z.infer`), parsed at the storage + form boundary |
| Data resilience | corrupt rows dropped on read **and a test proves it** (DOC-2 AC-3) |
| Form busy state | submit `loading` guard (DOC-4 AC-5) |
| Tests | **10** across 4 files, derived from ACs; +resilience, +list/cancel, +empty |
| testids | **systematic** — fields, submit, filters, empty CTAs, rows, cancel |
| Error boundary | Alert **with a Retry action** |
| Verify | each skill's verification contract (typecheck/test) applied |

## Friction the skills did NOT prevent (honest)

1. **`window.matchMedia`** jsdom gap — hit the same wall; had to polyfill. No
   skill mentions it.
2. **antd Select/DatePicker portal testing** — same difficulty; the
   through-the-form conflict test was still not written at the UI level.
3. **antd 6 deprecates `List`** — a runtime warning both arms trip; the `antd`
   skill didn't flag it.
   → Skills are not magic; stack/tooling realities still bite.

## Friction the skills DID prevent

- **`useSyncExternalStore` getSnapshot caching** — the (now-fixed)
  `localstorage-repo` skill prescribes the cached snapshot + notify ordering,
  so the infinite-loop bug never had a chance.

## Files created

```
src/lib/storage.ts
src/lib/dates.ts
src/features/appointments/{appointment.schema,appointment.repo,conflicts,useAppointments}.ts
src/features/appointments/pages/{AppointmentsListPage,BookAppointmentPage}.tsx
src/features/appointments/{conflicts,appointment.repo}.test.ts
src/features/appointments/pages/{BookAppointmentPage,AppointmentsListPage}.test.tsx
src/features/doctors/{doctor.schema,doctor.repo,useDoctors}.ts
src/features/doctors/DoctorsPage.tsx
src/components/ErrorBoundary.tsx
src/test/{render.tsx,setup.ts}
```
