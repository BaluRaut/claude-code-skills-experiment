// DOC-2 / DOC-4 / DOC-6: appointments repository.
import type { Appointment } from '../domain/types';
import { hasConflict, type ProposedBooking } from '../domain/conflict';
import { Collection, createId } from './storage';

function isAppointment(value: unknown): value is Appointment {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    typeof v.doctorId === 'string' &&
    typeof v.patientName === 'string' &&
    typeof v.slot === 'string' &&
    typeof v.createdAt === 'string'
  );
}

const collection = new Collection<Appointment>('doc.appointments', isAppointment);

export class SlotConflictError extends Error {
  constructor() {
    super('That slot is already booked');
    this.name = 'SlotConflictError';
  }
}

// Memoize the sorted view so listAppointments returns a stable reference while
// the underlying data is unchanged (safe as a useSyncExternalStore snapshot).
let sortedSource: Appointment[] | null = null;
let sortedCache: Appointment[] = [];

/** All appointments, newest-first by booking time (DOC-6 AC-2). */
export function listAppointments(): Appointment[] {
  const source = collection.read();
  if (source !== sortedSource) {
    sortedSource = source;
    sortedCache = source
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  return sortedCache;
}

/**
 * Creates and persists an appointment. Rejects double-bookings via the shared
 * conflict rule (DOC-5) so nothing is written on conflict (DOC-5 AC-3).
 */
export function bookAppointment(input: ProposedBooking & { patientName: string }): Appointment {
  const existing = collection.read();
  if (hasConflict(existing, input)) {
    throw new SlotConflictError();
  }
  const appointment: Appointment = {
    id: createId(),
    doctorId: input.doctorId,
    patientName: input.patientName,
    slot: input.slot,
    createdAt: new Date().toISOString(),
  };
  collection.write([...existing, appointment]);
  return appointment;
}

export function cancelAppointment(id: string): void {
  collection.write(collection.read().filter((appt) => appt.id !== id));
}

export function subscribeAppointments(listener: () => void): () => void {
  return collection.subscribe(listener);
}

// Exposed for tests.
export const appointmentsCollection = collection;
