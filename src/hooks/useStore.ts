// DOC-2 AC-5: subscribe to the persistence layer so screens re-render on any
// create/delete without a manual refresh. Built on useSyncExternalStore.
import { useSyncExternalStore } from 'react';
import type { Appointment, Doctor } from '../domain/types';
import { listAppointments, subscribeAppointments } from '../data/appointments';
import { listDoctors, subscribeDoctors } from '../data/doctors';

export function useDoctors(): Doctor[] {
  return useSyncExternalStore(subscribeDoctors, listDoctors);
}

export function useAppointments(): Appointment[] {
  return useSyncExternalStore(subscribeAppointments, listAppointments);
}
