# react-app-skills — Doctor Appointments

A learning app for practicing Claude Code skills. Vite + **React 19** + **antd 6**
+ TypeScript. **localStorage is the database — there is no backend.**

## Commands

- `npm run dev` — Vite dev server (http://localhost:5173)
- `npm run build` — typecheck + production build
- `npm run typecheck` — tsc --noEmit
- `npm test` / `npm run test:watch` — Vitest
- `npm run format` — Prettier

## Structure

- `src/features/<feature>/` — a feature owns its schema, repository, hook,
  pages, components, and tests (start with `appointments`, `doctors`)
- `src/lib/` — cross-cutting: `storage.ts` (the localStorage primitive)
- `src/theme/tokens.ts` — design tokens; the antd theme is mapped from them
- `src/router.tsx` — central routes · `src/pages/` — top-level screens

## Conventions (these resolve the skills' `[adapt]` markers)

- **Data layer = localStorage repository pattern** (see the `localstorage-repo`
  skill). Components/pages NEVER touch `localStorage` — always a repository +
  a `useSyncExternalStore` hook. There is no React Query / axios here.
- **Schemas = types**: zod schemas are the source of truth (`z.infer`);
  parse on read from storage, validate before write.
- **Forms = antd `<Form>`** + zod as the payload guard (see `new-form`).
- **UI = antd 6**: style via `ConfigProvider` tokens mapped from
  `theme/tokens.ts` — never override `.ant-*` classes. dayjs is antd's date
  lib; convert to ISO strings for storage.
- **Business logic = pure functions**, tested independently (no logic in JSX
  handlers). See `code-design-solid`.
- **Tests = Vitest + Testing Library**; `data-testid` on interactive +
  assertion targets. localStorage is cleared between tests.
- Copy is plain English but written i18n-ready (no logic baked into strings).

## Note

This repo installs **13 skills** in `.claude/skills/` for learning. A real
production repo would trim to the 5–8 it uses most (see how-to-use-skills.md).
