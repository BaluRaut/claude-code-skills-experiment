# Do Claude Code "skills" actually improve AI-generated code?

**An honest A/B/C experiment — and a result that surprised me.**

I've been building a large library of [Claude Code skills](https://github.com/BaluRaut/claude-code-skills)
(reusable playbooks that tell an AI coding agent *how my team writes code*:
validation with zod, testing conventions, folder structure, error handling,
etc.). Before rolling them out to a 12-developer team, I wanted evidence: **do
the skills actually make the output better, or do they just feel productive?**

So I ran the same feature backlog three ways and measured it. This repo is the
full, reproducible result. **I'd genuinely like the community to poke holes in
it.**

> The analysis below was written by the AI (Claude) that ran the experiment,
> reported honestly — including the part that undercuts the tool it was
> promoting. Scrutinize accordingly.

---

## The setup

A small **doctor-appointment app** — Vite + React 19 + antd 6 + TypeScript,
with `localStorage` as the database (no backend). A 9-ticket backlog
(`jira/DOC-1..9.md`) with real Given/When/Then acceptance criteria: models +
persistence, seed doctors, a booking form with validation, a no-double-booking
rule, a list with cancel, empty/error states, filters, and a test suite.

Built three ways, one branch each:

| Arm | Branch | Builder | Had the skills? |
|-----|--------|---------|-----------------|
| Contaminated baseline | `without-skills` | The session that *authored* the skills | No files, but knew them by heart |
| **Cold baseline** ⭐ | `without-skills-cold` | A **fresh AI agent**, zero prior context | No — tickets only |
| With skills | `with-skills` | Same authoring session | Yes — 13 skills + conventions |

**Why the "cold baseline" is the one that matters:** the first baseline was
built by the same AI session that wrote all the skills — so it "knew" every
convention even with the skill files deleted. That's contaminated. To get an
honest baseline I spawned a **fresh agent with no conversation history** on a
branch with no skills and no `CLAUDE.md`, and prompted it *only* from the
tickets. It had no idea skills existed.

---

## The results (all three: typecheck ✅, build ✅)

| Metric | Contaminated baseline | **Cold baseline (no skills)** | With skills |
|--------|:---------------------:|:-----------------------------:|:-----------:|
| **Tests passing** | 7 | **15** | 10 |
| **Tickets fully met** | 6 / 9 | **9 / 9** | ~8 / 9 |
| Through-the-form conflict test | ✗ | **✓** | ✗ |
| Valid-booking-persists UI test | ✗ | **✓** | ✗ |
| Corrupt-data resilience tested | ✗ | ✓ | ✓ |
| `useSyncExternalStore` bug avoided | ✓ (knew it) | **✓ (figured it out)** | ✓ (skill warns) |
| jsdom polyfills added | matchMedia | **matchMedia + ResizeObserver** | matchMedia |
| Form busy state | ✗ | ✓ | ✓ |
| Persistence isolated from UI | ✓ | ✓ | ✓ |
| Pure, testable conflict rule | ✓ | ✓ | ✓ |
| Validation approach | plain TS (zod unused) | **hand-rolled, resilient** | **zod as source of truth** |
| Folder structure | flat | layered (`domain/ data/`) | feature folders |

**The cold, no-skills arm was the most complete and best-tested of the three.**
It wrote 15 passing tests and hit 9/9 tickets — including two through-the-form
tests that *both* skill-aware arms skipped, plus a `ResizeObserver` polyfill
neither of mine bothered with. It even dodged a `useSyncExternalStore` caching
bug on its own.

(And the "contaminated baseline" was the *worst* arm — proof that a human/AI
role-playing a baseline is unreliable in both directions. Ignore it; the cold
agent is the honest one.)

---

## What the skills actually added

Stripped of bias, the **only** things the with-skills arm did that the cold
baseline didn't:

1. **zod as the single source of truth** for types + validation. The cold model
   hand-rolled its own resilient parsing, which worked fine. zod-everywhere is
   a *house convention*, not a correctness win.
2. **Feature-folder structure** vs the cold model's layer folders. Also a
   convention, not "better."

On **correctness, completeness, and test coverage, the skills did not beat a
capable model working from good tickets** — they arguably trailed it.

---

## The gyan (honest takeaways)

1. **Skills are not a quality multiplier on a single feature.** A capable model
   + well-written tickets already produces excellent, tested, structured code.
   This experiment shows it plainly.
2. **Skills are a _consistency & governance_ mechanism.** Their real value is
   making N developers and every AI run produce code in *your* house style —
   same validation, structure, error shapes, testids — *without re-deciding
   each time*. That uniformity pays off across many repos and hundreds of PRs
   (fewer review nits, faster onboarding, safer refactors). It does **not**
   show up in one 9-ticket app.
3. **Ticket quality was the biggest lever.** The well-specified acceptance
   criteria carried every arm. Investing in good tickets may beat investing in
   code-gen skills. (The most valuable "skill" might be the one that forces
   good Given/When/Then ACs.)
4. **Encode the non-obvious, not the default.** Skills earn their keep where the
   right choice *isn't* what a model does by default — your specific error
   envelope, least-privilege IAM, "don't retry at two layers," tenant
   isolation. For things a good model already nails, a skill mostly adds
   ceremony (and burns context budget).
5. **Don't oversell it.** If you pitch skills as "the AI writes better code,"
   the first person who runs a cold baseline disproves it. Pitch what's true:
   **consistent, house-conformant output at scale, and a home for decisions
   that aren't the model's default.**

---

## Limitations (please attack these)

- **n = 1 app**, small, single stack (React/antd/localStorage). A backend
  service, a legacy codebase, or a fuzzier spec might swing it the other way —
  skills may matter *more* where defaults are wrong or the domain is unusual.
- **Same model family** built all arms; a weaker model might benefit more from
  skills.
- **"Completeness/tests" ≠ "maintainability."** The skills' consistency payoff
  is explicitly a multi-PR, multi-dev effect this single-app test can't measure.
- **The cold agent's prompt** (`the neutral prompt is in the git history`) still
  came from me; wording effects are possible.
- My conclusions are *one interpretation.* If you read the diffs differently, I
  want to hear it.

---

## Reproduce / inspect

```bash
git clone <this repo>
cd react-app-skills && npm install

# each arm builds + tests independently:
git checkout without-skills-cold && npm run typecheck && npm test   # 15 tests, 9/9
git checkout with-skills          && npm run typecheck && npm test   # 10 tests
git checkout without-skills        && npm run typecheck && npm test   # 7 tests (biased)

# see cold-baseline vs skills side by side:
git diff without-skills-cold with-skills -- src
```

- Full write-up: [`COMPARISON.md`](COMPARISON.md)
- The tickets: [`jira/`](jira/)
- The skills under test: [`.claude/skills/`](.claude/skills/) (present on `main`/`with-skills`)
- The broader skills catalog: https://github.com/BaluRaut/claude-code-skills

## Branch map

```
main                 docs + skills library + jira backlog (this README, COMPARISON.md)
without-skills-cold  ⭐ honest baseline — fresh agent, no skills   (15 tests, 9/9)
with-skills          skills arm — zod, feature folders            (10 tests, ~8/9)
without-skills       contaminated baseline — ignore               (7 tests, 6/9)
```

---

*If this changes how you think about AI coding "skills / rules / playbooks" —
or if you think the experiment is flawed — open an issue. Honest disagreement
is the point.*
