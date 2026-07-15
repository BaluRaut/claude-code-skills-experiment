// localstorage-repo skill: the reactive hook. useSyncExternalStore is the
// React 19 idiom for subscribing to an external (non-reactive) store.
import { useSyncExternalStore } from 'react';
import { storeEvent } from '../../lib/storage';
import { doctorRepo } from './doctor.repo';
import type { Doctor } from './doctor.schema';

const EVENT = storeEvent('doctors');

export function useDoctors(): Doctor[] {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener(EVENT, cb);
      return () => window.removeEventListener(EVENT, cb);
    },
    () => doctorRepo.list(), // STABLE reference between writes
  );
}
