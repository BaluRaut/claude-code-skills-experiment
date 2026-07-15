// localstorage-repo skill: typed repository over localStorage. Parse on read
// (corrupt rows dropped), validate on write, cache the snapshot for a stable
// getSnapshot, and commit in persist -> refresh -> notify order.
import { notify, readList, writeList } from '../../lib/storage';
import { appointmentSchema, type Appointment, type NewAppointment } from './appointment.schema';

const KEY = 'appointments';

let snapshot: Appointment[] = read();

function read(): Appointment[] {
  return readList(KEY)
    .flatMap((x) => {
      const parsed = appointmentSchema.safeParse(x);
      return parsed.success ? [parsed.data] : []; // drop corrupt rows
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)); // newest-first
}

function commit(items: Appointment[]): void {
  writeList(KEY, items);
  snapshot = read();
  notify(KEY);
}

export const appointmentRepo = {
  list: (): Appointment[] => snapshot, // stable reference (see skill §3)
  create(input: NewAppointment): Appointment {
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
};

// Test helper: re-read the cached snapshot after localStorage is reset.
export function reloadAppointments(): void {
  snapshot = read();
}
