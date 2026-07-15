// DOC-3 AC-1/AC-4: seeding creates the directory once and is idempotent —
// running it again (a reload) does not duplicate doctors.
import { describe, it, expect, beforeEach } from 'vitest';
import { doctorRepo } from './doctor.repo';
import { seedDoctors, SEED_DOCTORS } from './seed';

beforeEach(() => {
  localStorage.clear();
  doctorRepo.reset();
});

describe('seedDoctors', () => {
  it('seeds at least 4 doctors on first run (DOC-3 AC-1)', () => {
    seedDoctors();
    expect(doctorRepo.list().length).toBeGreaterThanOrEqual(4);
    expect(doctorRepo.list().length).toBe(SEED_DOCTORS.length);
  });

  it('does not duplicate doctors when run again (DOC-3 AC-4)', () => {
    seedDoctors();
    const first = doctorRepo.list().length;
    seedDoctors();
    expect(doctorRepo.list().length).toBe(first);
  });
});
