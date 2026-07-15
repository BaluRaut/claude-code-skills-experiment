# Skills A/B/C — the bias-corrected comparison

Same 9-ticket backlog (DOC-1…DOC-9), same stack (Vite + React 19 + antd 6 +
localStorage), built **three** ways:

| Arm | Branch | Who built it |
|-----|--------|--------------|
| **contaminated baseline** | `without-skills` | this session (had authored the skills — knew every convention) |
| **cold baseline** ⭐ | `without-skills-cold` | a **fresh subagent**, zero conversation history, no `.claude/`, no `CLAUDE.md` — tickets only |
| **with-skills** | `with-skills` | this session, following the 13 installed skills |

The **cold baseline is the trustworthy one**: it removes the contamination we
kept flagging. Its result changes the conclusion — read on honestly.

## Scorecard (all three verified: typecheck ✅, build ✅)

| Metric | contaminated baseline | **cold baseline (no skills)** | with-skills |
|--------|------------------------|-------------------------------|-------------|
| Tests passing | 7 | **15** | 10 |
| Tickets fully met | 6 / 9 | **9 / 9** | ~8 / 9 |
| Through-the-form conflict test | ✗ | **✓** | ✗ |
| Valid-booking-persists UI test | ✗ | **✓** | ✗ |
| Corrupt-data resilience tested | ✗ | ✓ | ✓ |
| `getSnapshot` infinite-loop avoided | ✓ (I knew it) | **✓ (figured it out)** | ✓ (skill) |
| jsdom polyfills added | matchMedia | **matchMedia + ResizeObserver** | matchMedia |
| Form busy state (DOC-4 AC-5) | ✗ | ✓ | ✓ |
| Persistence isolated from UI | ✓ | ✓ | ✓ |
| Pure conflict function | ✓ | ✓ | ✓ |
| Validation approach | plain TS, zod unused | **hand-rolled resilient parsing** | **zod = source of truth** |
| Structure | flat `data/ hooks/` | layered `domain/ data/ hooks/` | `features/<x>/` folders |

## The headline finding (it partly overturns the earlier writeup)

**The cold, no-skills arm was the most complete and best-tested of the three.**
A capable model, given *good acceptance criteria*, produced 15 passing tests
and 9/9 tickets — including the two through-the-form tests that **both** of my
arms descoped, and a `ResizeObserver` polyfill neither of mine bothered with.
It even avoided the `useSyncExternalStore` caching bug on its own.

And note: my "contaminated baseline" was the **weakest** arm (6/9, 7 tests).
Lesson — *me pretending to be a baseline is unreliable in both directions*: I
under-invested there and the numbers were meaningless. The cold agent is the
only honest baseline, and it's excellent.

## So what did the skills actually add?

Stripped of bias, the with-skills arm's **unique** contributions were:

1. **zod as the single source of truth** — the cold model used its own
   hand-rolled validation (which worked fine); the skill mandates zod at every
   boundary. This is a *house-convention* choice, not a correctness win.
2. **Feature-folder structure** (`features/appointments/`) vs the cold model's
   layer folders (`domain/ data/`). Again a convention, not "better."

That's essentially it. On **correctness, completeness, and test coverage the
skills did not beat a cold capable model** on this task — they arguably trailed
it.

## The honest conclusion for the team

- **Skills are not a quality multiplier on a single feature.** A capable model
  + well-written tickets already produces excellent, tested, well-structured
  code. This experiment shows that clearly.
- **Skills are a _consistency and conformance_ mechanism.** Their value is
  making 12 developers and every AI run produce code in **your** house style —
  same validation (zod), same structure, same error shape, same testids —
  *without re-deciding each time*. That uniformity is what pays off across many
  repos and hundreds of PRs (fewer review nits, easier onboarding, safer
  refactors). It does not show up in a single 9-ticket app.
- **The highest-leverage lever this experiment revealed is TICKET QUALITY.**
  The neutral, well-specified acceptance criteria carried the outcome in every
  arm. Investing in good tickets (and the `start-task` skill that forces
  Given/When/Then ACs) may beat investing in the code-gen skills.
- **Encode the non-obvious, not the default.** Skills earn their keep where the
  right choice ISN'T what a model does by default — your specific error
  envelope, least-privilege IAM, "no double-retry across layers," tenant
  isolation. For things a good model already does (extract a pure function,
  handle empty states, write tests from ACs), a skill mostly adds ceremony.

## Don't oversell it

If you pitch skills to the team as "AI writes better code," this experiment
will embarrass that claim the first time someone runs a cold baseline. Pitch
it as what it is: **governance — consistent, house-conformant output at scale,
and a place to encode decisions that aren't the model's default.** That's a
real and defensible value for a 12-dev org; it's just not a magic quality
boost.

## Reproduce / inspect

```
git checkout without-skills-cold   # the trustworthy baseline (15 tests, 9/9)
git checkout with-skills           # the skills arm (zod, feature folders)
git checkout without-skills        # the contaminated baseline (ignore — biased)
git diff without-skills-cold with-skills -- src   # cold-baseline vs skills
```
