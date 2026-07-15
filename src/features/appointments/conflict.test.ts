// DOC-8 AC-1: unit tests for the double-booking rule (DOC-5), derived from the
// acceptance criteria (write-unit-tests) — same doctor+slot conflicts, a
// different doctor or slot does not.
import { describe, it, expect } from 'vitest';
import { hasConflict } from './conflict';
import type { Appointment } from './appointment.schema';

const existing: Appointment[] = [
  {
    id: 'a1',
    doctorId: 'doc-1',
    patientName: 'Sam',
    slot: '2026-08-01T09:00:00.000Z',
    createdAt: '2026-07-15T10:00:00.000Z',
  },
];

describe('hasConflict', () => {
  it('detects a conflict for the same doctor and same slot (DOC-5 AC-1)', () => {
    expect(hasConflict(existing, { doctorId: 'doc-1', slot: '2026-08-01T09:00:00.000Z' })).toBe(true);
  });

  it('allows the same slot for a DIFFERENT doctor (DOC-5 AC-2)', () => {
    expect(hasConflict(existing, { doctorId: 'doc-2', slot: '2026-08-01T09:00:00.000Z' })).toBe(false);
  });

  it('allows a different slot for the same doctor', () => {
    expect(hasConflict(existing, { doctorId: 'doc-1', slot: '2026-08-01T10:00:00.000Z' })).toBe(false);
  });

  it('never conflicts against an empty schedule', () => {
    expect(hasConflict([], { doctorId: 'doc-1', slot: '2026-08-01T09:00:00.000Z' })).toBe(false);
  });
});
