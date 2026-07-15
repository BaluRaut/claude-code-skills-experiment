// localstorage-repo skill: the reactive hook (useSyncExternalStore).
import { useSyncExternalStore } from 'react';
import { storeEvent } from '../../lib/storage';
import { appointmentRepo } from './appointment.repo';
import type { Appointment } from './appointment.schema';

const EVENT = storeEvent('appointments');

export function useAppointments(): Appointment[] {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener(EVENT, cb);
      return () => window.removeEventListener(EVENT, cb);
    },
    () => appointmentRepo.list(), // STABLE reference between writes
  );
}
