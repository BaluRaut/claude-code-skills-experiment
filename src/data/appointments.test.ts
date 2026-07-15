// DOC-8 AC-2: persistence round-trip; DOC-8 AC-1 (integration): conflict is
// enforced by the repository and nothing is persisted on conflict.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  appointmentsCollection,
  bookAppointment,
  cancelAppointment,
  listAppointments,
  SlotConflictError,
} from './appointments';

const STORAGE_KEY = 'doc.appointments';

beforeEach(() => {
  localStorage.clear();
  // Reset the in-memory cache so each test starts from empty storage.
  appointmentsCollection.write([]);
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('appointments persistence', () => {
  it('create -> list returns it -> remove removes it, round-tripping storage', () => {
    const created = bookAppointment({
      doctorId: 'doc-avery',
      patientName: 'Jamie',
      slot: '2026-07-20T14:30:00.000Z',
    });

    // In-memory list reflects the create.
    expect(listAppointments()).toHaveLength(1);
    expect(listAppointments()[0]?.id).toBe(created.id);

    // It actually round-trips through localStorage (survives a refresh).
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    expect(raw).toHaveLength(1);
    expect(raw[0].id).toBe(created.id);
    expect(raw[0].slot).toBe('2026-07-20T14:30:00.000Z');

    // Remove clears it from the list and storage.
    cancelAppointment(created.id);
    expect(listAppointments()).toHaveLength(0);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')).toHaveLength(0);
  });

  it('generates a unique id and createdAt on create (DOC-2 AC-4)', () => {
    const a = bookAppointment({ doctorId: 'doc-avery', patientName: 'A', slot: '2026-07-20T10:00:00.000Z' });
    const b = bookAppointment({ doctorId: 'doc-avery', patientName: 'B', slot: '2026-07-20T11:00:00.000Z' });
    expect(a.id).not.toBe(b.id);
    expect(Number.isNaN(Date.parse(a.createdAt))).toBe(false);
  });

  it('rejects a double-booking and does not persist it (DOC-5 AC-1/AC-3)', () => {
    bookAppointment({ doctorId: 'doc-avery', patientName: 'Jamie', slot: '2026-07-20T14:30:00.000Z' });
    expect(() =>
      bookAppointment({ doctorId: 'doc-avery', patientName: 'Alex', slot: '2026-07-20T14:30:00.000Z' }),
    ).toThrow(SlotConflictError);
    // Still only the first booking is stored.
    expect(listAppointments()).toHaveLength(1);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')).toHaveLength(1);
  });

  it('orders newest-first by createdAt (DOC-6 AC-2)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-15T09:00:00.000Z'));
    const first = bookAppointment({ doctorId: 'doc-avery', patientName: 'A', slot: '2026-07-20T10:00:00.000Z' });
    vi.setSystemTime(new Date('2026-07-15T09:05:00.000Z'));
    const second = bookAppointment({ doctorId: 'doc-brooks', patientName: 'B', slot: '2026-07-20T10:00:00.000Z' });
    const ids = listAppointments().map((a) => a.id);
    // second was created after first, so it should come first.
    expect(ids.indexOf(second.id)).toBeLessThan(ids.indexOf(first.id));
  });

  it('skips corrupt records instead of crashing (DOC-2 AC-3)', () => {
    // One valid record plus one garbage record in storage.
    localStorage.setItem(
      STORAGE_KEY,
      '[{"id":"ok","doctorId":"d","patientName":"P","slot":"s","createdAt":"c"},{"garbage":true}]',
    );
    // A storage event (as another tab would fire) invalidates the cache so the
    // next read reflects what is really in localStorage.
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
    const list = appointmentsCollection.read();
    expect(list).toHaveLength(1);
    expect(list[0]?.id).toBe('ok');
  });

  it('returns an empty list for totally corrupt JSON (DOC-2 AC-3)', () => {
    localStorage.setItem(STORAGE_KEY, '{ not json');
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
    expect(appointmentsCollection.read()).toEqual([]);
  });
});
