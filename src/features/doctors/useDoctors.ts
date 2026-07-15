import { useSyncExternalStore } from 'react';
import { subscribeKey } from '../../lib/storage';
import { doctorRepo } from './doctor.repo';
import type { Doctor } from './doctor.schema';

export function useDoctors(): Doctor[] {
  return useSyncExternalStore((cb) => subscribeKey('doctors', cb), doctorRepo.list);
}
