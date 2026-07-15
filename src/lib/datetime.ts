import dayjs from 'dayjs';

/** Human-readable slot label, e.g. "Mon, Jul 20 2026, 2:30 PM" (DOC-6 AC-1). */
export function formatSlot(iso: string): string {
  const d = dayjs(iso);
  return d.isValid() ? d.format('ddd, MMM D YYYY, h:mm A') : iso;
}

/** Same calendar day as the given ISO date (used by the date filter, DOC-9). */
export function isSameDay(iso: string, day: dayjs.Dayjs): boolean {
  return dayjs(iso).isSame(day, 'day');
}
