import { useSyncExternalStore } from 'react';
import { listAppointments, subscribeAppointments } from '../data/appointments';
import type { Appointment } from '../types';

export function useAppointments(): Appointment[] {
  return useSyncExternalStore(subscribeAppointments, listAppointments);
}
