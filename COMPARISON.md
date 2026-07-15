# The comparison — four arms, two independent cold baselines

Same 9-ticket backlog (DOC-1…DOC-9), same stack (Vite + React 19 + antd 6 +
localStorage), built **four** ways:

| Arm | Branch / repo | Builder | Skills? |
|-----|---------------|---------|---------|
| Contaminated baseline | `without-skills` | the session that *authored* the skills | knew them, files removed |
| Cold baseline #1 | `without-skills-cold` | a fresh **subagent**, I wrote its prompt | no |
| **Cold baseline #2** ⭐ | [separate repo](https://github.com/BaluRaut/claude-skills-cold-baseline) | a fresh **session in a separate folder**, not my prompt | no |
| With skills | `with-skills` | the authoring session, following 13 skills | yes |

The two **cold baselines** are the honest comparison — no shared context, no
skills. Cold #2 is the strongest: a completely separate folder and session, so
even "the subagent's prompt came from me" doesn't apply.

## Scorecard (every arm verified: typecheck ✅, build ✅)

| Metric | contaminated | cold #1 (subagent) | **cold #2 (fresh session)** | with-skills |
|--------|:---:|:---:|:---:|:---:|
| Tests passing | 7 | 15 | **15** | 10 |
| Tickets fully met | 6/9 | 9/9 | **9/9** | ~8/9 |
| Through-the-form conflict + persist tests | ✗ | ✓ | **✓** | ✗ |
| Validation approach | plain TS | hand-rolled | **zod (unprompted)** | zod |
| Structure | flat | layered | layered | feature folders |
| `useSyncExternalStore` bug avoided | ✓ | ✓ | ✓ | ✓ |

## What the two cold baselines prove

1. **A capable model + good tickets already produces excellent code.** Both
   cold, no-skills arms hit 15 tests and 9/9 — *more* than the with-skills arm
   (10 tests, ~8/9), including through-the-form tests the skills arm skipped.
2. **"zod everywhere" is not a skills-only outcome.** I'd claimed zod-as-source
   -of-truth was the skills' unique contribution. Cold #2 reached for zod on its
   own, unprompted. Cold #1 hand-rolled validation instead.
3. **The two cold runs were both excellent — and different from each other.**
   Different validation (zod vs hand-rolled), different file layouts, different
   test structures. Same quality, different shape.

That third point is the whole finding:

> **Skills don't make the output better. They make it uniform.** Two cold runs
> were both great and both different; skills would have made them the same.

## Code quality (I read both arms, not just the test counts)

On correctness, architecture, error handling, and test realism the **no-skills
arm won or tied every axis**; the with-skills arm's only edge was convention
consistency. The sharpest finding is about the skills, not the model:

**The with-skills build enforced the double-booking invariant *only in the
form*; the repo had no guard — a bypassable bug.** The no-skills arm enforced it
in the data layer (throws, persists nothing). Root cause: the `new-form` skill's
example checked it in the component, while `localstorage-repo` said "in the repo,
not the component" and *lists that as a failure mode*. Two skills contradicted
each other; the model followed one and shipped the failure mode the other warned
about.

> **A wrong or self-contradictory skill is worse than no skill — it overrides
> the model's better instinct.** Skills must be reviewed like code, for mutual
> consistency. (Fixed: `new-form` now defers to a data-layer guard.)

## Why didn't the skills help?

My interpretation (the experiment measures outcomes, not mechanism): **the
skills mostly restated what a 2025 frontier model already knows.**
React, zod, Testing Library, "extract a pure function," "handle empty states,"
"write tests from the spec" — the model has these as defaults. Telling it to do
them is a no-op on a well-specified task.

- The skills encoded **mainstream best practice = the model's default** (not
  team-specific, not non-obvious).
- The **tickets already did the prompting** — precise ACs are themselves a
  playbook, and they got there first.
- Skills help where the default is **wrong or undetermined**; this CRUD app had
  neither.
- The payoff (convergence) is **invisible at n=1**.

Caveat: the with-skills arm's lower test count (10 vs 15) is confounded — it was
built by the contaminated session, not a cold one. The clean test *not yet run*
is **cold + skills vs cold − skills.**

**Corollary:** a skill only earns its place if it encodes something the model
*doesn't already default to*. Test: delete it; if a cold model still does the
right thing, it was documentation, not leverage. (Full reasoning in the
[README](README.md#why-didnt-the-skills-help-the-part-that-actually-matters).)

## Follow-up: fix the skill, rerun (fifth arm)

I fixed `new-form` (defer the invariant to the data layer) and reran with a fresh
cold subagent told to follow the corrected skills — no findings leaked. Verified:
typecheck ✅, build ✅.

| | cold, no skills | with-skills (buggy) | **cold + fixed skills** |
|---|:---:|:---:|:---:|
| Tests | 15 | 10 | **20** |
| Invariant | data layer | **form (bug)** | **data layer (cites the skill)** |

**Fixing the skill fixed the output** — the rebuilt arm enforced the invariant in
the data layer and its comment cites the corrected skill. So skills *do* steer
output; the direction is set by their content.

> **A correct skill steered a cold model to correct architecture; a buggy one
> steered it to a bug. Skills are as good — or as harmful — as their content.**

Caveats: "buggy → bug" is confounded (that arm was the contaminated build; no
cold + buggy run exists), and 20 vs 15 tests is n = 1. The clean signal is the
placement.

## The honest conclusion

- **Not a quality multiplier on one feature.** Measured head-to-head on a
  well-specified backlog, skills did *not* beat a cold capable model — twice.
- **A consistency / governance mechanism.** Their value is making N developers
  and every AI run converge on *your* house style — same validation, structure,
  error shapes, testids — instead of each producing a different (good) shape.
  That uniformity is what pays off across many repos and hundreds of PRs; it
  does not show up in one app.
- **Ticket quality was the dominant variable.** Well-written acceptance
  criteria carried every arm. Investing in tickets (and the skill that *forces*
  good Given/When/Then ACs) likely beats investing in code-gen skills.
- **Encode the non-obvious, not the default.** Skills earn their keep on things
  a model won't do by default — your error envelope, least-privilege IAM,
  "don't retry at two layers," tenant isolation. For what a good model already
  nails, a skill mostly adds ceremony and burns context.

## Don't oversell it

Pitching skills as "the AI writes better code" is disproven the first time
someone runs a cold baseline — I ran two, and both beat the skills arm on
completeness. Pitch what's true and defensible: **consistent, house-conformant
output at scale, and a home for decisions that aren't the model's default.**

## Reproduce / inspect

```bash
# in this repo:
git checkout without-skills-cold && npm i && npm test   # cold #1: 15 tests, 9/9
git checkout with-skills          && npm i && npm test   # skills:  10 tests
git diff without-skills-cold with-skills -- src          # cold vs skills

# cold baseline #2 (separate repo, the cleanest run):
#   https://github.com/BaluRaut/claude-skills-cold-baseline
```
