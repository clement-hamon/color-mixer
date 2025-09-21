// Global test setup for Bun test environment
import { beforeAll, afterAll, beforeEach } from 'bun:test';

// Mock DOM environment for tests
beforeAll(() => {
  // Create minimal DOM mock
  global.document = {
    getElementById: (id) => ({
      id,
      innerHTML: '',
      style: {},
      classList: {
        add: () => {},
        remove: () => {},
        contains: () => false,
        toggle: () => {}
      },
      addEventListener: () => {},
      removeEventListener: () => {},
      appendChild: () => {},
      removeChild: () => {}
    }),
    createElement: (tag) => ({
      tagName: tag.toUpperCase(),
      style: {},
      classList: {
        add: () => {},
        remove: () => {},
        contains: () => false,
        toggle: () => {}
      },
      addEventListener: () => {},
      removeEventListener: () => {},
      appendChild: () => {},
      setAttribute: () => {},
      getAttribute: () => null
    }),
    body: {
      appendChild: () => {},
      removeChild: () => {},
      style: {}
    },
    head: {
      appendChild: () => {}
    },
    querySelectorAll: () => [],
    querySelector: () => null
  };

  // Mock window object
  global.window = {
    getComputedStyle: () => ({}),
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {}
    },
    sessionStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {}
    },
    location: {
      href: 'http://localhost:3000',
      pathname: '/',
      search: '',
      hash: ''
    },
    navigator: {
      userAgent: 'Bun Test Environment'
    },
    addEventListener: () => {},
    removeEventListener: () => {}
  };

  // Mock console for cleaner test output
  global.console = {
    ...console,
    log: () => {}, // Suppress logs during tests
    warn: () => {},
    error: console.error // Keep errors visible
  };
});

beforeEach(() => {
  // Reset DOM state before each test
  if (global.document && global.document.body) {
    global.document.body.innerHTML = '';
  }
});

afterAll(() => {
  // Cleanup after all tests
  console.log('🧪 Test suite completed');
});
