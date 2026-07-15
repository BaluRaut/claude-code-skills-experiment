import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { reloadAppointments } from '../data/appointments';
import { reloadDoctors } from '../data/doctors';

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

// localStorage is the database — reset it AND the in-memory snapshots between
// tests so state never leaks from one test to the next.
afterEach(() => {
  cleanup();
  localStorage.clear();
  reloadAppointments();
  reloadDoctors();
});
