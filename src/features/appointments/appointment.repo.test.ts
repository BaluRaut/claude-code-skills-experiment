// DOC-8 AC-2 (persistence round-trip) + DOC-5 AC-3 (rejected booking not
// persisted) + DOC-2 (resilient reads). Derived from the ACs (write-unit-tests).
import { describe, it, expect, beforeEach } from 'vitest';
import { appointmentRepo, bookAppointment } from './appointment.repo';
import { SlotConflictError } from './conflict';
import type { NewAppointment } from './appointment.schema';

const booking: NewAppointment = {
  doctorId: 'doc-1',
  patientName: 'Sam',
  slot: '2026-08-01T09:00:00.000Z',
};

beforeEach(() => {
  localStorage.clear();
  appointmentRepo.reset(); // re-sync the cached snapshot to empty storage
});

describe('appointmentRepo', () => {
  it('create → list returns it → remove removes it (DOC-8 AC-2)', () => {
    const created = appointmentRepo.create(booking);
    expect(appointmentRepo.list()).toHaveLength(1);
    expect(appointmentRepo.list()[0]?.id).toBe(created.id);

    appointmentRepo.remove(created.id);
    expect(appointmentRepo.list()).toHaveLength(0);
  });

  it('generates a unique id and a createdAt on create (DOC-2 AC-4)', () => {
    const created = appointmentRepo.create(booking);
    expect(created.id).toMatch(/.+/);
    expect(() => new Date(created.createdAt).toISOString()).not.toThrow();
  });

  it('round-trips through localStorage — data survives a fresh read (DOC-2 AC-2)', () => {
    const created = appointmentRepo.create(booking);
    const raw = localStorage.getItem('appointments');
    expect(raw).toContain(created.id);

    // Simulate a page refresh: drop the in-memory cache, re-read from storage.
    appointmentRepo.reset();
    expect(appointmentRepo.list()[0]?.id).toBe(created.id);
  });

  it('rejects a double-booking and does NOT persist it (DOC-5 AC-1/AC-3)', () => {
    appointmentRepo.create(booking);
    expect(() => bookAppointment(booking)).toThrow(SlotConflictError);
    expect(appointmentRepo.list()).toHaveLength(1);
  });

  it('allows the same slot for a different doctor (DOC-5 AC-2)', () => {
    appointmentRepo.create(booking);
    expect(() => appointmentRepo.create({ ...booking, doctorId: 'doc-2' })).not.toThrow();
    expect(appointmentRepo.list()).toHaveLength(2);
  });

  it('drops a corrupt/old row instead of crashing the list (DOC-2 AC-3)', () => {
    localStorage.setItem(
      'appointments',
      JSON.stringify([{ id: 'ok', doctorId: 'd', patientName: 'p', slot: '2026-08-01T09:00:00.000Z', createdAt: '2026-07-15T10:00:00.000Z' }, { garbage: true }]),
    );
    appointmentRepo.reset();
    expect(appointmentRepo.list()).toHaveLength(1);
  });
});
