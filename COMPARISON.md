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
