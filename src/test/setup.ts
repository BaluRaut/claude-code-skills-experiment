import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// localStorage is the "database" here — clear it between tests so nothing
// leaks (the msw-mocking skill's reset discipline, applied to storage).
afterEach(() => {
  cleanup();
  localStorage.clear();
});
