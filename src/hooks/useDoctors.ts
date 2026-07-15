import { useSyncExternalStore } from 'react';
import { listDoctors, subscribeDoctors } from '../data/doctors';
import type { Doctor } from '../types';

export function useDoctors(): Doctor[] {
  return useSyncExternalStore(subscribeDoctors, listDoctors);
}
