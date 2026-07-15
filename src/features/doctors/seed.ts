// DOC-3: the initial doctors directory. Seeded once on app start via the repo
// (which is idempotent), so a reload never duplicates them.
import type { NewDoctor } from './doctor.schema';
import { doctorRepo } from './doctor.repo';

export const SEED_DOCTORS: readonly NewDoctor[] = [
  { name: 'Dr. Alice Chen', specialty: 'Cardiology' },
  { name: 'Dr. Ben Okafor', specialty: 'Dermatology' },
  { name: 'Dr. Carla Reyes', specialty: 'Pediatrics' },
  { name: 'Dr. David Novak', specialty: 'Orthopedics' },
  { name: 'Dr. Elena Petrova', specialty: 'Neurology' },
];

export function seedDoctors(): void {
  doctorRepo.seedIfEmpty(SEED_DOCTORS);
}
