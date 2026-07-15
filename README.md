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

## Takeaways

1. **Not a quality multiplier on one feature.** Disproven twice, head-to-head.
2. **A consistency / governance mechanism.** Value = every dev and every AI run
   converging on *your* house style, across many repos and PRs. Invisible in one
   app; compounding at team scale.
3. **Ticket quality was the dominant lever.** Good acceptance criteria carried
   every arm. The highest-ROI "skill" may be the one that forces good tickets.
4. **Encode the non-obvious, not the default** — your error envelope,
   least-privilege IAM, "don't retry at two layers," tenant isolation. For what
   a good model already nails, a skill mostly adds ceremony.

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

*If this changes how you think about AI coding "skills / rules / playbooks" — or
if you think it's flawed — [open an issue](../../issues). Honest disagreement is
the point.*
