// code-design-solid skill: business rule as a PURE function, tested on its own.
import type { Appointment, NewAppointment } from './appointment.schema';

// DOC-5: same doctor + same exact slot = conflict. Same slot, other doctor is OK.
export function hasConflict(existing: Appointment[], input: NewAppointment): boolean {
  return existing.some((a) => a.doctorId === input.doctorId && a.slot === input.slot);
}
