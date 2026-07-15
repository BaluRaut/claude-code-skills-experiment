// write-unit-tests skill: derived from DOC-5 acceptance criteria.
import { describe, expect, it } from 'vitest';
import { hasConflict } from './conflicts';
import type { Appointment } from './appointment.schema';

const existing: Appointment = {
  id: crypto.randomUUID(),
  doctorId: 'd1',
  patientName: 'Existing',
  slot: '2026-08-01T10:00:00.000Z',
  createdAt: '2026-07-15T00:00:00.000Z',
};

describe('hasConflict (DOC-5)', () => {
  it('flags same doctor + same slot', () => {
    expect(
      hasConflict([existing], { doctorId: 'd1', patientName: 'New', slot: '2026-08-01T10:00:00.000Z' }),
    ).toBe(true);
  });

  it('allows the same slot for a different doctor', () => {
    expect(
      hasConflict([existing], { doctorId: 'd2', patientName: 'New', slot: '2026-08-01T10:00:00.000Z' }),
    ).toBe(false);
  });

  it('allows the same doctor at a different slot', () => {
    expect(
      hasConflict([existing], { doctorId: 'd1', patientName: 'New', slot: '2026-08-02T10:00:00.000Z' }),
    ).toBe(false);
  });

  it('never conflicts against an empty list', () => {
    expect(
      hasConflict([], { doctorId: 'd1', patientName: 'New', slot: '2026-08-01T10:00:00.000Z' }),
    ).toBe(false);
  });
});
