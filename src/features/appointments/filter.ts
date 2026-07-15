// DOC-9: filtering as a PURE FUNCTION (code-design-solid §2) so the list page
// stays thin and the combine/clear logic is unit-testable without rendering.
import type { Appointment } from './appointment.schema';

export interface AppointmentFilter {
  doctorId?: string;
  /** A calendar day as 'YYYY-MM-DD' (local); matches any slot on that day. */
  date?: string;
}

function localDay(iso: string): string {
  const d = new Date(iso);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Filters combine with AND (DOC-9 AC-3). An empty filter returns everything. */
export function filterAppointments(
  appointments: readonly Appointment[],
  filter: AppointmentFilter,
): Appointment[] {
  return appointments.filter((a) => {
    if (filter.doctorId && a.doctorId !== filter.doctorId) return false;
    if (filter.date && localDay(a.slot) !== filter.date) return false;
    return true;
  });
}

export function isFilterActive(filter: AppointmentFilter): boolean {
  return Boolean(filter.doctorId) || Boolean(filter.date);
}
