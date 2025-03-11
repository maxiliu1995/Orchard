import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import './mocks/navigation';

// Configure Jest timers
jest.useFakeTimers();

// Mock fetch
global.fetch = jest.fn(() => 
    Promise.resolve({
        json: () => Promise.resolve({}),
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
    } as Response)
);

// Mock ResizeObserver
class MockResizeObserver {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
}

global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
}); 