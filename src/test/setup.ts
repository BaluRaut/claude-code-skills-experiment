import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom lacks ResizeObserver; antd's Select/DatePicker triggers use it.
if (!('ResizeObserver' in globalThis)) {
  globalThis.ResizeObserver = class {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  };
}

// jsdom lacks matchMedia; antd's responsive observer needs it. Polyfill once.
if (!window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
}

// localStorage is the "database" here — clear it between tests so nothing
// leaks (the msw-mocking skill's reset discipline, applied to storage).
afterEach(() => {
  cleanup();
  localStorage.clear();
});
