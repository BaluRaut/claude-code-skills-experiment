import { describe, expect, it } from 'vitest';
import { appointmentRepo, reloadAppointments } from './appointment.repo';

const input = { doctorId: 'd1', patientName: 'Sam', slot: '2026-08-01T10:00:00.000Z' };

describe('appointmentRepo (DOC-2 / DOC-6)', () => {
  it('create → list returns it and persists to localStorage', () => {
    const created = appointmentRepo.create(input);
    const list = appointmentRepo.list();
    expect(list).toHaveLength(1);
    expect(list[0]?.id).toBe(created.id);
    expect(localStorage.getItem('appointments')).toContain(created.id);
  });

  it('remove deletes the appointment', () => {
    const created = appointmentRepo.create(input);
    appointmentRepo.remove(created.id);
    expect(appointmentRepo.list()).toHaveLength(0);
  });

  it('drops corrupt rows when reading (DOC-2 AC-3)', () => {
    const valid = {
      id: crypto.randomUUID(),
      doctorId: 'd1',
      patientName: 'Sam',
      slot: '2026-08-01T10:00:00.000Z',
      createdAt: '2026-07-15T00:00:00.000Z',
    };
    localStorage.setItem('appointments', JSON.stringify([{ garbage: true }, valid]));
    reloadAppointments();
    const list = appointmentRepo.list();
    expect(list).toHaveLength(1);
    expect(list[0]?.patientName).toBe('Sam');
  });
});
