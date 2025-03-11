import '@testing-library/jest-dom';

// Mock fetch
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    clone: () => ({
      ok: true,
      json: () => Promise.resolve({})
    })
  })
) as jest.Mock;

// Mock window.matchMedia since jsdom doesn't support it
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock Request
global.Request = class Request {
  constructor() {}
} as any;

// Add this to silence expected error boundary errors
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (/Error: Uncaught \[Error: Test error\]/.test(args[0])) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
}); 