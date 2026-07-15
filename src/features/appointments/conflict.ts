// DOC-5: the double-booking rule as a STANDALONE PURE FUNCTION so it is
// unit-testable on its own (code-design-solid §2). The data layer calls this
// before writing; the form NEVER re-implements it (new-form §3).
import type { Appointment } from './appointment.schema';

export class SlotConflictError extends Error {
  constructor(message = 'That slot is already booked') {
    super(message);
    this.name = 'SlotConflictError';
  }
}

/** A slot is a conflict when the SAME doctor already has an appointment at the
 * EXACT same slot. A different doctor at the same time is allowed (DOC-5 AC-2).
 */
export function hasConflict(
  existing: readonly Appointment[],
  proposed: { doctorId: string; slot: string },
): boolean {
  return existing.some(
    (a) => a.doctorId === proposed.doctorId && a.slot === proposed.slot,
  );
}
