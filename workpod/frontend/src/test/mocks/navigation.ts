export const mockNavigation = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn()
};

jest.mock('next/navigation', () => ({
    useRouter: () => mockNavigation,
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams()
})); 