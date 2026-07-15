# Skills A/B — with vs without, head-to-head

Same 9-ticket backlog (DOC-1…DOC-9), same stack (Vite + React 19 + antd 6 +
localStorage), built twice: once from tickets only (`without-skills`), once
following the 13 installed skills (`with-skills`).

> ⚠️ Read with the caveat: both arms were built in a session that had authored
> the skills, so both are *best-case*. The structural/testing deltas below are
> the skills' genuine signature (they come from following the playbooks); the
> absolute quality of the baseline is flattered.

## Scorecard

| Metric | without-skills | with-skills |
|--------|----------------|-------------|
| Typecheck / build | ✅ / ✅ | ✅ / ✅ |
| Tests | **7** (3 files) | **10** (4 files) |
| Fully-met tickets | **6 / 9** | **~8 / 9** |
| Data validation | plain TS interfaces + hand-written guards; **zod unused** | **zod schemas = source of truth**, parsed at boundaries |
| Corrupt-data resilience (DOC-2 AC-3) | implemented, **not tested** | implemented **and tested** |
| Form busy state (DOC-4 AC-5) | **missing** | present (`loading`) |
| Structure | flat `data/ hooks/ lib/ pages/` | **feature folders** `features/<x>/` |
| testids | pragmatic, partial | **systematic** |
| Error boundary | basic alert | alert **+ retry** |
| List + cancel test (DOC-6) | none | **present** |
| Empty-state test (DOC-7) | none | **present** |
| Per-ticket verify ritual | none until DOC-8 | skill verification contracts |

## Where the arms were the SAME (skills aren't magic)

- Both **work** — typecheck, tests, and build all pass on both branches.
- Both hit **`window.matchMedia`** jsdom friction and needed the same polyfill.
- Both hit **antd Select/DatePicker portal** testing difficulty — neither
  wrote the through-the-form conflict UI test.
- Both trip the **antd 6 `List` deprecation** warning.
- Both extracted `hasConflict` as a pure function — because **the ticket
  (DOC-5 AC-4) demanded it**. Good tickets carry a lot on their own.

## Where the skills changed the outcome

1. **Validation discipline** — zod schemas as the single source of truth vs
   hand-rolled type guards with zod sitting unused. This is the biggest
   correctness/maintenance difference.
2. **Test coverage +43%** (10 vs 7), and crucially the *right* extra tests:
   corrupt-data resilience and list/cancel/empty — behaviors the baseline
   shipped untested.
3. **Consistency & structure** — every feature followed the same
   schema→repo→hook→page shape and testid convention, without being told each
   time. This is what compounds across many tickets, devs, and repos.
4. **Small AC gaps closed** — the form busy state, the tested resilience,
   the error-boundary retry.
5. **A latent bug avoided** — the fixed `localstorage-repo` skill steered
   around the `useSyncExternalStore` infinite-loop trap.

## Honest conclusion

For a **9-ticket toy app**, both arms produce a working, typed, tested,
building app — the baseline is *not* bad, because the tickets were good and
the model is capable. The skills' value shows up as **consistency, boundary
validation, ~40% more (and better-targeted) tests, systematic testids, and a
uniform structure** — i.e. the things that reduce review nits and pay off
across a codebase, not the things that make a single feature "work."

At the scale that actually matters to the team — **12 developers × many repos
× hundreds of tickets** — that per-ticket consistency and the "did the right
thing without being asked" behavior is the whole point. A single toy app
under-samples the benefit; the delta here (6/9 → 8/9, 7 → 10 tests, zod vs
none, flat vs structured) is the *floor*, and it compounds.

What the experiment also proved: **skills are not a substitute for good
tickets or for knowing your stack's quirks** (antd/jsdom bit both arms
equally), and **using skills surfaced and fixed a real bug in a skill** — the
pilot loop working as intended.

## Reproduce / inspect

```
git checkout without-skills   # baseline arm + EXPERIMENT-LOG-without-skills.md
git checkout with-skills      # skills arm + EXPERIMENT-LOG-with-skills.md
git diff without-skills with-skills -- src   # see the two implementations
```
