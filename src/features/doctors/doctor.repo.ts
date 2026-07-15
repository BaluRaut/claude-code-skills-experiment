// localstorage-repo skill: typed CRUD over the storage primitive, zod at the
// boundary. Components/pages go through this + the hook, never localStorage.
import { readList, writeList, notify } from '../../lib/storage';
import { doctorSchema, type Doctor, type NewDoctor } from './doctor.schema';

const KEY = 'doctors';

function read(): Doctor[] {
  return readList(KEY)
    .map((x) => doctorSchema.safeParse(x))
    .filter((r): r is { success: true; data: Doctor } => r.success)
    .map((r) => r.data); // drop corrupt/old rows rather than crash the list
}

// Cached snapshot with a STABLE reference — required by useSyncExternalStore.
let snapshot: Doctor[] = read();

function commit(items: Doctor[]): void {
  writeList(KEY, items); // 1. persist
  snapshot = read(); // 2. refresh cache BEFORE notifying
  notify(KEY); // 3. subscribers now read fresh data
}

export const doctorRepo = {
  list: (): Doctor[] => snapshot,

  create(input: NewDoctor): Doctor {
    const created = doctorSchema.parse({ ...input, id: crypto.randomUUID() });
    commit([...snapshot, created]);
    return created;
  },

  /** DOC-3 AC-1/AC-4: seed once. Idempotent — only writes when empty, so a
   * reload never duplicates doctors. */
  seedIfEmpty(seed: readonly NewDoctor[]): void {
    if (snapshot.length > 0) return;
    const created = seed.map((d) => doctorSchema.parse({ ...d, id: crypto.randomUUID() }));
    commit(created);
  },

  /** Test-only reset so suites start from a known state. */
  reset(): void {
    snapshot = read();
  },
};
