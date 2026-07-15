import { notify, persist, readRaw, subscribe } from '../lib/storage';
import { isAppointment, type Appointment, type NewAppointment } from '../types';

const KEY = 'appointments';

// Cache the snapshot so the hook's getSnapshot returns a stable reference
// (a fresh array every call would re-render forever).
let snapshot: Appointment[] = read();

function read(): Appointment[] {
  return readRaw(KEY, isAppointment).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function commit(items: Appointment[]): void {
  persist(KEY, items);
  snapshot = read();
  notify(KEY);
}

export function listAppointments(): Appointment[] {
  return snapshot;
}

export function createAppointment(input: NewAppointment): Appointment {
  const appointment: Appointment = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  commit([...snapshot, appointment]);
  return appointment;
}

export function removeAppointment(id: string): void {
  commit(snapshot.filter((a) => a.id !== id));
}

export function subscribeAppointments(listener: () => void): () => void {
  return subscribe(KEY, listener);
}

// Test helper: re-read the cached snapshot after localStorage is reset.
export function reloadAppointments(): void {
  snapshot = read();
}
