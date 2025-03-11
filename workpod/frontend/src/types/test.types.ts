/// <reference types="@testing-library/jest-dom" />

declare global {
    var fetch: ReturnType<typeof jest.fn>;
    var ResizeObserver: { new(callback: ResizeObserverCallback): ResizeObserver };
}

export {}; 