// date-fns-utils skill: one place formats dates; components don't call format
// directly. Slots are ISO strings in storage, parsed here for display.
import { format, parseISO } from 'date-fns';

export function formatSlot(iso: string): string {
  return format(parseISO(iso), 'PPp'); // e.g. "Aug 1, 2026, 10:00 AM"
}
