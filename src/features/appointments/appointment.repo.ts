// localstorage-repo skill: typed CRUD over storage, zod at the boundary. The
// double-booking INVARIANT is enforced HERE (the data layer), backed by the
// pure hasConflict rule — not in the form (new-form §3, DOC-5 AC-4).
import { readList, writeList, notify } from '../../lib/storage';
import {
  appointmentSchema,
  type Appointment,
  type NewAppointment,
} from './appointment.schema';
import { hasConflict, SlotConflictError } from './conflict';

const KEY = 'appointments';

function read(): Appointment[] {
  return readList(KEY)
    .map((x) => appointmentSchema.safeParse(x))
    .filter((r): r is { success: true; data: Appointment } => r.success)
    .map((r) => r.data); // drop corrupt/old rows rather than crash the list
}

// Cached snapshot with a STABLE reference — required by useSyncExternalStore.
let snapshot: Appointment[] = read();

function commit(items: Appointment[]): void {
  writeList(KEY, items); // 1. persist
  snapshot = read(); // 2. refresh cache BEFORE notifying
  notify(KEY); // 3. subscribers now read fresh data
}

export const appointmentRepo = {
  list: (): Appointment[] => snapshot,

  /** DOC-4/DOC-5: generates id + createdAt, rejects a double-booking BEFORE
   * writing. Throws SlotConflictError so the rejected booking is not persisted
   * (DOC-5 AC-3). */
  create(input: NewAppointment): Appointment {
    if (hasConflict(snapshot, input)) {
      throw new SlotConflictError();
    }
    const created = appointmentSchema.parse({
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    });
    commit([...snapshot, created]);
    return created;
  },

  remove(id: string): void {
    commit(snapshot.filter((a) => a.id !== id));
  },

  /** Test-only reset so suites start from a known state. */
  reset(): void {
    snapshot = read();
  },
};

// new-form references this operation name; the form calls it and only
// translates SlotConflictError into a field error.
export function bookAppointment(input: NewAppointment): Appointment {
  return appointmentRepo.create(input);
}
