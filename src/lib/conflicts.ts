import type { Appointment, NewAppointment } from '../types';

// DOC-5: a slot is a conflict if the SAME doctor is already booked for the
// exact same slot. Same slot, different doctor is fine. Pure + testable.
export function hasConflict(existing: Appointment[], input: NewAppointment): boolean {
  return existing.some((a) => a.doctorId === input.doctorId && a.slot === input.slot);
}
