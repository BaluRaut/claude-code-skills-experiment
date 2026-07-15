import { notify, persist, readRaw, subscribe } from '../lib/storage';
import { isDoctor, type Doctor } from '../types';

const KEY = 'doctors';

let snapshot: Doctor[] = readRaw(KEY, isDoctor);

export function listDoctors(): Doctor[] {
  return snapshot;
}

// Used by seeding (DOC-3) and any future doctor management.
export function saveDoctors(doctors: Doctor[]): void {
  persist(KEY, doctors);
  snapshot = readRaw(KEY, isDoctor);
  notify(KEY);
}

export function subscribeDoctors(listener: () => void): () => void {
  return subscribe(KEY, listener);
}
