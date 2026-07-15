// DOC-8 AC-1: unit tests for the double-booking rule (DOC-5).
import { describe, expect, it } from 'vitest';
import { hasConflict } from './conflict';
import type { Appointment } from './types';

const base: Appointment = {
  id: 'a1',
  doctorId: 'doc-avery',
  patientName: 'Jamie',
  slot: '2026-07-20T14:30:00.000Z',
  createdAt: '2026-07-15T09:00:00.000Z',
};

describe('hasConflict', () => {
  it('detects a conflict for the same doctor + same slot', () => {
    expect(hasConflict([base], { doctorId: 'doc-avery', slot: base.slot })).toBe(true);
  });

  it('allows the same slot for a different doctor (DOC-5 AC-2)', () => {
    expect(hasConflict([base], { doctorId: 'doc-brooks', slot: base.slot })).toBe(false);
  });

  it('allows the same doctor at a different slot', () => {
    expect(
      hasConflict([base], { doctorId: 'doc-avery', slot: '2026-07-20T15:00:00.000Z' }),
    ).toBe(false);
  });

  it('reports no conflict against an empty list', () => {
    expect(hasConflict([], { doctorId: 'doc-avery', slot: base.slot })).toBe(false);
  });
});
