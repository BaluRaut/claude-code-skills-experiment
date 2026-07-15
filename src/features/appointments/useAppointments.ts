import { useSyncExternalStore } from 'react';
import { subscribeKey } from '../../lib/storage';
import { appointmentRepo } from './appointment.repo';
import type { Appointment } from './appointment.schema';

export function useAppointments(): Appointment[] {
  return useSyncExternalStore(
    (cb) => subscribeKey('appointments', cb),
    appointmentRepo.list, // stable snapshot — see localstorage-repo §3
  );
}
