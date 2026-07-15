import { notify, persist, readRaw, subscribe } from '../lib/storage';
import { isDoctor, type Doctor } from '../types';

const KEY = 'doctors';

let snapshot: Doctor[] = readRaw(KEY, isDoctor);

export function listDoctors(): Doctor[] {
  return snapshot;
}

// Used by seeding (DOC-3) and any future doctor management.
export function saveDoctors(doctors: Doctor[]): void {
  persist(KEY, doctors);
  snapshot = readRaw(KEY, isDoctor);
  notify(KEY);
}

// DOC-3: seed a starter set of doctors once, only if none exist yet.
export function seedDoctorsIfEmpty(): void {
  if (snapshot.length > 0) return;
  saveDoctors([
    { id: crypto.randomUUID(), name: 'Dr. Sarah Chen', specialty: 'Cardiology' },
    { id: crypto.randomUUID(), name: 'Dr. Marcus Reed', specialty: 'Dermatology' },
    { id: crypto.randomUUID(), name: 'Dr. Priya Nair', specialty: 'Pediatrics' },
    { id: crypto.randomUUID(), name: 'Dr. Tom Alvarez', specialty: 'Orthopedics' },
  ]);
}

export function subscribeDoctors(listener: () => void): () => void {
  return subscribe(KEY, listener);
}

// Test helper: re-read the cached snapshot after localStorage is reset.
export function reloadDoctors(): void {
  snapshot = readRaw(KEY, isDoctor);
}
