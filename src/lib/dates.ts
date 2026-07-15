import { format } from 'date-fns';

// Human-readable slot label, e.g. "Aug 1, 2026, 10:00 AM".
export function formatSlot(iso: string): string {
  return format(new Date(iso), 'PPp');
}
