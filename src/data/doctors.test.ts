// DOC-3: seeding is idempotent and produces varied doctors.
import { beforeEach, describe, expect, it } from 'vitest';
import { doctorsCollection, listDoctors, seedDoctors } from './doctors';

beforeEach(() => {
  localStorage.clear();
  doctorsCollection.write([]);
  localStorage.clear();
});

describe('doctor seeding', () => {
  it('seeds at least 4 doctors with varied specialties on first run (DOC-3 AC-1)', () => {
    seedDoctors();
    const doctors = listDoctors();
    expect(doctors.length).toBeGreaterThanOrEqual(4);
    expect(new Set(doctors.map((d) => d.specialty)).size).toBeGreaterThanOrEqual(4);
  });

  it('does not duplicate doctors when seeding runs again (DOC-3 AC-4)', () => {
    seedDoctors();
    const first = listDoctors().length;
    seedDoctors();
    seedDoctors();
    expect(listDoctors()).toHaveLength(first);
  });
});
