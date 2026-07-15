import { describe, expect, it } from 'vitest';
import { createAppointment, listAppointments, removeAppointment } from './appointments';

const input = { doctorId: 'd1', patientName: 'Sam', slot: '2026-08-01T10:00:00.000Z' };

describe('appointments store (DOC-2 / DOC-6)', () => {
  it('create → list returns it and it is persisted to localStorage', () => {
    const created = createAppointment(input);
    const list = listAppointments();
    expect(list).toHaveLength(1);
    expect(list[0]?.id).toBe(created.id);
    expect(localStorage.getItem('appointments')).toContain(created.id);
  });

  it('remove deletes the appointment', () => {
    const created = createAppointment(input);
    removeAppointment(created.id);
    expect(listAppointments()).toHaveLength(0);
  });
});
