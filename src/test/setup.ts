import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { reloadAppointments } from '../features/appointments/appointment.repo';
import { reloadDoctors } from '../features/doctors/doctor.repo';

// antd responsive components (Menu, DatePicker, Select…) call window.matchMedia,
// which jsdom does not implement. Polyfill it for tests.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// localStorage is the database — reset it AND the cached snapshots between tests.
afterEach(() => {
  cleanup();
  localStorage.clear();
  reloadAppointments();
  reloadDoctors();
});
