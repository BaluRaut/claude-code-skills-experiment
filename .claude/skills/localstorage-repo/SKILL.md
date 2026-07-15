---
name: localstorage-repo
description: The data layer for this no-backend app — a typed, zod-validated repository over localStorage plus a useSyncExternalStore hook. Replaces http-client/tanstack-query; components never touch localStorage directly.
---

# localStorage repository

This app has NO backend — localStorage is the database. This skill is the
adaptation of the catalog's http-client + new-data-hook pattern to that
reality. The layering is the same; only the storage swaps:

```
storage primitive (JSON get/set)  →  repository (typed CRUD, zod at boundary)
   →  useCollection hook (reactive)  →  components
```

Components and pages NEVER call `localStorage` directly — always through a
repository/hook (the same rule as "never call fetch in a component").

## 1. The storage primitive — one module

`src/lib/storage.ts`: typed JSON get/set with a namespaced key. Nothing
app-specific here.

```ts
export function readList<T>(key: string): unknown[] {
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try { return JSON.parse(raw) as unknown[]; } catch { return []; }
}
export function writeList(key: string, items: unknown[]): void {
  localStorage.setItem(key, JSON.stringify(items));
  window.dispatchEvent(new Event(`store:${key}`)); // reactivity signal (§3)
}
```

## 2. The repository — typed CRUD, zod at the boundary

One per entity, e.g. `src/features/appointments/appointment.repo.ts`.
**Parse on read** (localStorage data is untrusted — could be an old schema
or hand-edited) and **validate on write**:

```ts
const KEY = 'appointments';
export const appointmentRepo = {
  list(): Appointment[] {
    return readList(KEY)
      .map((x) => appointmentSchema.safeParse(x))
      .filter((r) => r.success)
      .map((r) => r.data); // drop corrupt rows rather than crash the app
  },
  create(input: NewAppointment): Appointment {
    const created = appointmentSchema.parse({ ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
    writeList(KEY, [...readList(KEY), created]);
    return created;
  },
  remove(id: string): void {
    writeList(KEY, appointmentRepo.list().filter((a) => a.id !== id));
  },
};
```

IDs via `crypto.randomUUID()`; timestamps ISO strings (date-fns to format).
Business rules (no double-booking a slot) live in a PURE function checked
here before write (code-design-solid) — not in the component.

## 3. The reactive hook — useSyncExternalStore

localStorage isn't reactive; `useSyncExternalStore` is the idiomatic React 19
way to subscribe to an external store so components re-render on change:

```ts
export function useAppointments(): Appointment[] {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener('store:appointments', cb);
      return () => window.removeEventListener('store:appointments', cb);
    },
    () => appointmentRepo.list(),
  );
}
```

Mutations are plain calls: `appointmentRepo.create(...)` — the dispatched
event re-renders every subscriber. No React Query here (there's no server
cache to manage); if this app grew a backend, THIS is the seam you'd swap.

## 4. Boundaries

- Server-cache concerns (staleness, refetch, invalidation) don't apply —
  don't reach for them
- Cross-tab sync is free if you also listen to the native `storage` event
  [optional]
- Quota: localStorage is ~5MB and synchronous — fine for this app; a real
  DB is the answer if data grows

## Verification contract

- **Inputs**: the entity's zod schema (zod-schemas), the access patterns
  (list / create / remove / query).
- **Outputs**: `storage.ts` primitive, a typed repository, a
  `useSyncExternalStore` hook, unit tests.
- **Verify**: `npm run typecheck` · `npm test` (repo CRUD + the reactive
  hook re-renders) · drive it in the app and refresh the page (data persists).
- **Failure modes** (review + tests must catch): a component reading
  `localStorage` directly; no zod parse on read (a corrupt/old row crashes
  the list); business rule (double-booking) in the component instead of a
  pure function; forgetting the change event so the UI goes stale until
  refresh; `JSON.parse` without a try/catch.
