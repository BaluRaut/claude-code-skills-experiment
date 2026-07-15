// DOC-3: doctors directory with one-time seeding.
import type { Doctor } from '../domain/types';
import { Collection } from './storage';

function isDoctor(value: unknown): value is Doctor {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    typeof v.name === 'string' &&
    typeof v.specialty === 'string'
  );
}

const collection = new Collection<Doctor>('doc.doctors', isDoctor);

const SEED_DOCTORS: Doctor[] = [
  { id: 'doc-avery', name: 'Dr. Avery Chen', specialty: 'Cardiology' },
  { id: 'doc-brooks', name: 'Dr. Sam Brooks', specialty: 'Dermatology' },
  { id: 'doc-patel', name: 'Dr. Nina Patel', specialty: 'Pediatrics' },
  { id: 'doc-owens', name: 'Dr. Jordan Owens', specialty: 'General Practice' },
  { id: 'doc-reyes', name: 'Dr. Maria Reyes', specialty: 'Orthopedics' },
];

/**
 * Seeds the doctor list on first run only (DOC-3 AC-1, AC-4). Idempotent:
 * reloading never duplicates doctors because it no-ops when data exists.
 */
export function seedDoctors(): void {
  if (collection.read().length === 0) {
    collection.write(SEED_DOCTORS);
  }
}

export function listDoctors(): Doctor[] {
  return collection.read();
}

export function getDoctor(id: string): Doctor | undefined {
  return collection.read().find((d) => d.id === id);
}

export function subscribeDoctors(listener: () => void): () => void {
  return collection.subscribe(listener);
}

// Exposed for tests.
export const doctorsCollection = collection;
