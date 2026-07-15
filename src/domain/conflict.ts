// DOC-5: standalone, unit-testable double-booking rule.
import type { Appointment } from './types';

export interface ProposedBooking {
  doctorId: string;
  /** ISO-8601 datetime string of the requested slot. */
  slot: string;
}

/**
 * Returns true when the proposed booking collides with an existing appointment
 * for the SAME doctor at the SAME slot (exact match — no overlap windows).
 * The same slot for a different doctor does NOT conflict (DOC-5 AC-2).
 *
 * Pure function of (existing appointments, proposed booking) so it can be
 * unit-tested in isolation (DOC-5 AC-4 / DOC-8 AC-1).
 */
export function hasConflict(existing: readonly Appointment[], proposed: ProposedBooking): boolean {
  return existing.some(
    (appt) => appt.doctorId === proposed.doctorId && appt.slot === proposed.slot,
  );
}
