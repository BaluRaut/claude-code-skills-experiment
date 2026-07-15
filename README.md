# Do Claude Code "skills" make AI write better code? (Mostly: no. But that's not the point.)

**An honest experiment — the same feature backlog built four ways, including
two independent "cold" baselines with no skills at all.**

> **TL;DR.** On a single well-specified feature, skills did **not** improve
> correctness or test coverage — two separate no-skills runs both *beat* the
> with-skills run. What skills reliably do is make output **uniform** (same
> validation, structure, conventions) across many builders. The value is
> **consistency and policy enforcement at scale, not a quality boost on one
> feature.** Ticket quality mattered more than skills in every arm.

I'm building a [library of Claude Code skills](https://github.com/BaluRaut/claude-code-skills)
(playbooks that tell an AI agent *how my team writes code*) for a 12-dev team.
Before rolling it out I wanted evidence, not vibes. So I measured.

> The analysis was written by the AI (Claude) that ran the experiment, reported
> honestly — including the parts that undercut the tool it was promoting. It ran
> two cold baselines specifically to try to *disprove* the skills' value.
> Scrutinize accordingly, and [open an issue](../../issues) if you read it
> differently.

---

## The setup

A **doctor-appointment app** — Vite + React 19 + antd 6 + TypeScript,
`localStorage` as the database (no backend). A 9-ticket backlog
([`jira/`](jira/)) with real Given/When/Then acceptance criteria. Built four
ways:

| Arm | Where | Builder | Skills? |
|-----|-------|---------|---------|
| Contaminated baseline | `without-skills` | session that authored the skills | knew them |
| Cold baseline #1 | `without-skills-cold` | fresh subagent, my prompt | no |
| **Cold baseline #2** ⭐ | [separate repo](https://github.com/BaluRaut/claude-skills-cold-baseline) | fresh session, separate folder, not my prompt | no |
| With skills | `with-skills` | authoring session, 13 skills | yes |

Why two cold baselines? The first "baseline" was built by the same session that
wrote the skills — contaminated. So I ran a fresh **subagent**, then (to kill
even the "your prompt leaked" objection) a fully **separate folder + session**.
Those two are the honest comparison.

## Results (every arm: typecheck ✅, build ✅)

| Metric | contaminated | cold #1 | **cold #2** | with-skills |
|--------|:---:|:---:|:---:|:---:|
| **Tests passing** | 7 | 15 | **15** | 10 |
| **Tickets fully met** | 6/9 | 9/9 | **9/9** | ~8/9 |
| Through-the-form conflict + persist tests | ✗ | ✓ | **✓** | ✗ |
| Validation | plain TS | hand-rolled | **zod (unprompted)** | zod |
| Structure | flat | layered | layered | feature folders |

**Both cold, no-skills arms matched or beat the with-skills arm** — more tests,
more tickets, and they even wrote through-the-form tests the skills arm skipped.

Every arm had to clear the **same gates — typecheck, production build, and the
automated test suite.** This compares *verified* implementations, not code that
merely looked plausible.

## The finding

The two cold runs were **both excellent and different from each other** — one
used zod, one hand-rolled validation; different layouts, different test
structures. That's the crux:

> **Skills don't make the code better. They make it uniform.** Two capable cold
> runs were both great and both *different*; skills would have made them the
> same. Across 12 developers, that predictability — not quality — is the value.

Notably, "zod as the source of truth" — which I'd assumed was the skills'
signature contribution — showed up **unprompted** in cold baseline #2. A capable
model reaches for it on its own.

## Why didn't the skills help? (the part that actually matters)

Short answer (**my interpretation** — the experiment measures outcomes, not
mechanism): **the skills mostly told a 2025 frontier model things it already
knew.**

A model at this level absorbed React, zod, Testing Library, routing, "extract a
pure function," "handle empty states," "test from the spec" from millions of
examples. A skill telling it to do those isn't teaching — it's **restating the
model's defaults**, so on a well-specified task it's a no-op.

Four things made this task the *worst case* for skills:

1. **The skills encoded mainstream best practice — the model's default.**
   Redundant by construction.
2. **The tickets already did the prompting.** The ACs said "resilient to corrupt
   data," "conflict rule as a standalone testable function," "tests derived from
   ACs." A precise spec *is* a playbook — and it got there first.
3. **Skills only help where the model's default is wrong or undetermined — this
   task had neither.** (Expanded just below.)
4. **Consistency can't be observed at n = 1** — you can't see convergence with a
   single builder. (Expanded just below.)

> **The core principle (this is the real insight).** A skill helps in exactly
> two situations: the model's default is **wrong** (encode the correction), or
> many options are equally valid and you need **everyone to pick the same one**
> (encode the choice). This task had neither — which is why nothing changed.

> **Consistency is a _distribution_, not a data point.** Most prompt-vs-skill
> arguments measure *one* prompt → *one* answer → "it worked." But convergence
> only becomes visible across dozens of developers and hundreds of PRs. A
> single-app test — mine included — structurally *cannot* see the thing skills
> are for. (This, I think, is why these debates never resolve: people compare
> point estimates of a distribution.)

### One honest caveat before over-reading this

The with-skills arm scored slightly *lower* than the cold runs (10 vs 15 tests).
Tempting to call that a "skills tax" (context spent reading 13 skill files
instead of writing tests) — but it's **confounded**: the with-skills arm was
built by the same contaminated authoring session, not a cold one. The truly
clean test I have *not* run is **a cold session WITH skills installed vs a cold
session without.** So the strict claim this experiment supports is narrow: *a
cold model with no skills is already excellent, and skills didn't beat it.* The
pristine A/B is still open.

### The corollary (the actionable bit)

Skills pay off *only to the extent they encode something the model doesn't
already default to.* As models get stronger, the "teaching what it already
knows" fraction grows — so a skill library should shrink toward the
**non-default, team-specific, convergence-forcing** core:

- **Keep:** "our API error shape is `{error:{code,message}}`, the frontend maps
  `code` not `message`" · "secrets via SSM, never env" · "tenant id in every
  query" · "don't retry at both the axios and query layers."
- **Drop:** "use zod" · "write tests from ACs" · "extract pure functions" ·
  "handle empty states" — the model already did these reliably in this experiment.

#### The "Delete Test" — a reusable heuristic

> Delete the skill. Run a cold model on the same task.
> - **Output unchanged** → the skill is *documentation*, not leverage. Drop it.
> - **Output changes** → you've found *knowledge worth encoding*. Keep it.

Run it over every skill in the catalog. It's the cheapest way to tell an
organizational decision (worth encoding) from a restatement of general best
practice (dead weight).

## Takeaways

1. **Not a quality multiplier on one feature (in this experiment).** Across two
   independent cold baselines I found *no evidence* that skills improved
   implementation quality — they did not outperform a capable model.
2. **A consistency / governance mechanism.** Value = every dev and every AI run
   converging on *your* house style, across many repos and PRs. Invisible in one
   app; compounding at team scale. Mechanically, a skill turns an **open decision
   into a settled default** — no re-deciding, no drift, no review argument. The
   catch: it scales *whatever* it encodes, so the default had better be right
   (a good standard or a bad one, applied consistently).
3. **Ticket quality was the dominant lever.** Good acceptance criteria carried
   every arm — in hindsight, the ACs acted like a high-quality prompt: many
   responsibilities I expected the skills to provide had already been specified
   by the tickets. The highest-ROI "skill" may be the one that forces good tickets.
4. **Encode the non-obvious, not the default** — your error envelope,
   least-privilege IAM, "don't retry at two layers," tenant isolation. For what
   a good model already nails, a skill mostly adds ceremony.

## What this experiment *can't* answer (and the one that could)

This tested: greenfield · well-specified · single builder · single feature.
That's the setting where skills should help *least*. The question it can't
touch is the organizational one — which is the whole reason skills exist:

> **12 developers · 3 months · a real repository · AI review enabled · shared
> skills.** Measure review comments per PR, architecture drift, onboarding time,
> PR turnaround, and escaped defects — *with* vs *without* the skill library.

That's where consistency stops being invisible. If someone has run something
like it, I want to see it.

## Limitations (please attack these)

- **n = 1 app**, small, single stack. A backend service, a legacy codebase, or a
  fuzzy spec might favor skills *more* — where the model's defaults are wrong.
- **Same model family** built every arm; a weaker model might benefit more.
- **"Tests/completeness" ≠ "maintainability."** The consistency payoff is a
  multi-PR, multi-dev effect this single app can't measure.
- Conclusions are one interpretation. Read the diffs; tell me if you disagree.

## Reproduce

```bash
git checkout without-skills-cold && npm i && npm test   # cold #1: 15 tests, 9/9
git checkout with-skills          && npm i && npm test   # skills:  10 tests
git diff without-skills-cold with-skills -- src          # cold vs skills
```

- Full write-up: [`COMPARISON.md`](COMPARISON.md)
- Cold baseline #2 (cleanest run, separate repo): https://github.com/BaluRaut/claude-skills-cold-baseline
- The skills catalog under test: https://github.com/BaluRaut/claude-code-skills

## Branch map

```
main                 docs + skills + jira backlog
without-skills-cold  ⭐ honest baseline — fresh subagent    (15 tests, 9/9)
with-skills          skills arm — zod, feature folders      (10 tests, ~8/9)
without-skills       contaminated baseline — ignore         (7 tests, 6/9)
```

---

## The thesis (what I think this is actually about)

Large language models increasingly know general software engineering. So the
remaining value of skills is **encoding organization-specific decisions and
ensuring they're applied consistently** — not re-teaching React or zod. As
models improve, the optimal skill library should get **smaller, more
opinionated, and more organization-specific**, not larger and more generic.

The deeper shift: **as frontier models improve, organizational knowledge — not
programming knowledge — becomes the scarce resource worth encoding.** Stop
encoding React / TypeScript / testing / clean code. Encode retry policy, API
error envelope, tenant isolation, observability, IAM, deployment, release
process, review standards — the things only *your* org knows.

Put another way: **skills are evolving from _teaching software engineering_ to
_encoding organizational memory_.** If I had to compress the whole experiment
into one honest line: *I expected skills to improve code quality; what they
actually seem to buy is preserving organizational knowledge and enforcing
consistency — not teaching a frontier model how to write React.* This is one
reproducible data point toward that, not the last word.

---

*If this changes how you think about AI coding "skills / rules / playbooks" — or
if you think it's flawed — [open an issue](../../issues). Honest disagreement is
the point.*
