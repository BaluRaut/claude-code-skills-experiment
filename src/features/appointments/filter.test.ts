// DOC-9: unit tests for the pure filter fn — filter by doctor, by date, the
// AND combination, and the active-filter helper.
import { describe, it, expect } from 'vitest';
import { filterAppointments, isFilterActive } from './filter';
import type { Appointment } from './appointment.schema';

const appts: Appointment[] = [
  { id: '1', doctorId: 'doc-1', patientName: 'A', slot: '2026-08-01T09:00:00.000Z', createdAt: '2026-07-15T10:00:00.000Z' },
  { id: '2', doctorId: 'doc-2', patientName: 'B', slot: '2026-08-01T11:00:00.000Z', createdAt: '2026-07-15T11:00:00.000Z' },
  { id: '3', doctorId: 'doc-1', patientName: 'C', slot: '2026-08-02T09:00:00.000Z', createdAt: '2026-07-15T12:00:00.000Z' },
];

// Anchor "today" to a local day so the YYYY-MM-DD comparison is deterministic.
function localDay(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

describe('filterAppointments', () => {
  it('returns everything with an empty filter', () => {
    expect(filterAppointments(appts, {})).toHaveLength(3);
  });

  it('filters by doctor (DOC-9 AC-1)', () => {
    const result = filterAppointments(appts, { doctorId: 'doc-1' });
    expect(result.map((a) => a.id)).toEqual(['1', '3']);
  });

  it('filters by a specific date (DOC-9 AC-2)', () => {
    const day = localDay('2026-08-01T09:00:00.000Z');
    const result = filterAppointments(appts, { date: day });
    expect(result.map((a) => a.id).sort()).toEqual(['1', '2']);
  });

  it('combines doctor AND date (DOC-9 AC-3)', () => {
    const day = localDay('2026-08-01T09:00:00.000Z');
    const result = filterAppointments(appts, { doctorId: 'doc-1', date: day });
    expect(result.map((a) => a.id)).toEqual(['1']);
  });

  it('returns empty when an active filter matches nothing (DOC-9 AC-4)', () => {
    expect(filterAppointments(appts, { doctorId: 'nope' })).toHaveLength(0);
  });
});

describe('isFilterActive', () => {
  it('is false for an empty filter and true when any field is set', () => {
    expect(isFilterActive({})).toBe(false);
    expect(isFilterActive({ doctorId: 'doc-1' })).toBe(true);
    expect(isFilterActive({ date: '2026-08-01' })).toBe(true);
  });
});
