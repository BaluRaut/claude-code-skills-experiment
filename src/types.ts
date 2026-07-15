export interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientName: string;
  slot: string; // ISO datetime
  createdAt: string; // ISO datetime
}

export type NewAppointment = Omit<Appointment, 'id' | 'createdAt'>;

// Guards so a corrupt or outdated stored record is skipped instead of
// crashing the app (DOC-2 AC-3).
export function isDoctor(x: unknown): x is Doctor {
  if (typeof x !== 'object' || x === null) return false;
  const d = x as Record<string, unknown>;
  return typeof d.id === 'string' && typeof d.name === 'string' && typeof d.specialty === 'string';
}

export function isAppointment(x: unknown): x is Appointment {
  if (typeof x !== 'object' || x === null) return false;
  const a = x as Record<string, unknown>;
  return (
    typeof a.id === 'string' &&
    typeof a.doctorId === 'string' &&
    typeof a.patientName === 'string' &&
    typeof a.slot === 'string' &&
    typeof a.createdAt === 'string'
  );
}
