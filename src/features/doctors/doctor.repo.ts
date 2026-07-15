import { notify, readList, writeList } from '../../lib/storage';
import { doctorSchema, type Doctor } from './doctor.schema';

const KEY = 'doctors';

let snapshot: Doctor[] = read();

function read(): Doctor[] {
  return readList(KEY).flatMap((x) => {
    const parsed = doctorSchema.safeParse(x);
    return parsed.success ? [parsed.data] : [];
  });
}

function commit(items: Doctor[]): void {
  writeList(KEY, items);
  snapshot = read();
  notify(KEY);
}

export const doctorRepo = {
  list: (): Doctor[] => snapshot,
  // DOC-3: seed once, only if empty.
  seedIfEmpty(): void {
    if (snapshot.length > 0) return;
    commit([
      { id: crypto.randomUUID(), name: 'Dr. Sarah Chen', specialty: 'Cardiology' },
      { id: crypto.randomUUID(), name: 'Dr. Marcus Reed', specialty: 'Dermatology' },
      { id: crypto.randomUUID(), name: 'Dr. Priya Nair', specialty: 'Pediatrics' },
      { id: crypto.randomUUID(), name: 'Dr. Tom Alvarez', specialty: 'Orthopedics' },
    ]);
  },
};

export function reloadDoctors(): void {
  snapshot = read();
}
