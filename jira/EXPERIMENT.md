# A/B experiment: building with vs without skills

Goal: measure what the skill library + conventions actually buy, on identical
work.

## Setup (done)

- `main` — app shell + `.claude/skills` (13) + `CLAUDE.md` + `jira/`
- `without-skills` — branched from main, then **removed** `.claude/`,
  `CLAUDE.md`, `how-to-use-skills.md`. Claude sees only the shell + tickets.
- `with-skills` — branched from main, keeps everything.

Both branches share: the same `jira/` tickets, the same scaffolded shell, the
same package.json (so the stack is identical). The ONLY difference is the
guidance layer.

## Protocol (keep it fair)

1. Same model, same session style on both branches.
2. Work the tickets in the same order (DOC-2 → … → DOC-9).
3. For each branch, prompt from the TICKET (paste/point at `jira/DOC-N.md`).
   - `without-skills`: "Implement DOC-4 (see jira/DOC-4.md)."
   - `with-skills`: same — let Claude auto-match skills, or name them.
4. Don't hand-fix between — measure what each produces.
5. Stop each ticket at: `npm run typecheck && npm test` green + ACs met (or
   record where it fell short).

## Scorecard (fill per ticket, or totals)

| Metric | without-skills | with-skills |
|--------|----------------|-------------|
| Prompts / turns to done | | |
| Typecheck passed first try? | | |
| Tests written (Y/N, count) | | |
| ACs met without hand-fixing | | |
| `localStorage` touched in components? (a leak) | | |
| Business logic in JSX handlers? | | |
| zod validation at boundaries? | | |
| testids present? | | |
| Consistent structure across tickets? | | |
| Rework/corrections needed | | |
| Bugs found after "done" | | |

## What to look for (the hypothesis)

Skills shouldn't make Claude *smarter* — they make output **consistent and
convention-correct without re-prompting**. Expect the `without-skills` branch
to still work, but drift: ad-hoc folder layout, `localStorage` called inside
components, validation skipped or inconsistent, fewer/no tests unless asked,
different patterns per ticket. The `with-skills` branch should hold the same
structure across every ticket and hit the DoD items (testids, zod, pure
logic, tests) without being told each time.

If the branches look about the same → the skills aren't earning their keep,
and that's worth knowing too. Measure honestly.
