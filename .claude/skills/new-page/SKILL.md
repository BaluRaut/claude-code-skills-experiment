---
name: new-page
description: Add a screen — route registration, the four states, thin page composing antd components. Adapted for this app's localStorage data layer (no async loading spinner needed, but empty/error/success still matter).
---

# New page

Thin page: it composes; data comes from a hook (localstorage-repo), business
logic from pure functions (code-design-solid). No `localStorage` and no rules
inside the page.

## 1. Create + register

`src/features/<feature>/pages/<Name>Page.tsx`, then add the route in
`src/router.tsx` (react-router pattern already set up):

```tsx
<Route path="/appointments" element={<AppointmentsPage />} />
<Route path="/appointments/new" element={<NewAppointmentPage />} />
```

## 2. States (adapted to synchronous storage)

localStorage reads are synchronous, so there's usually no loading spinner —
but the OTHER states still matter and are the #1 review miss:

- **Empty** — a designed antd `<Empty>` with a primary action
  (`Book appointment`), never a blank page
- **Error** — wrap risky UI in the ErrorBoundary; for recoverable issues
  (corrupt data dropped by the repo) show an antd `<Alert type="error">`
- **Content** — the list/detail itself

```tsx
export function AppointmentsPage() {
  const appointments = useAppointments();
  if (appointments.length === 0) return <Empty description="No appointments yet" ... />;
  return <List dataSource={appointments} renderItem={...} data-testid="appointments-list" />;
}
```

## 3. antd + house rules

- Use antd components (`Table`/`List`/`Card`/`Empty`) — see the `antd` skill;
  colors/spacing from tokens via ConfigProvider, never inline hex
- `data-testid` on interactive elements + assertion targets (add-testids)
- All user-facing text is real copy (i18n-ready); no logic inside JSX handlers

## 4. Navigation

`<Link>` / `useNavigate` (react-router); a `New appointment` action links to
the form page (new-form). Always a catch-all 404 (already in router.tsx).

## Verification contract

- **Inputs**: the feature's data hook (localstorage-repo), the screen design,
  which states apply.
- **Outputs**: a thin page component, its route registered, empty/error/
  content handled, testids, a render test.
- **Verify**: `npm run typecheck` · `npm test` · open the route in the app,
  see the empty state, then content after adding data.
- **Failure modes**: page reads `localStorage` or holds business logic;
  missing empty state (blank screen); raw hex/px instead of tokens; missing
  testids; route not registered / no 404.
