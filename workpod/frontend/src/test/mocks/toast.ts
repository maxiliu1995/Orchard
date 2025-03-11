export const mockToast = {
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warning: jest.fn(),
  loading: jest.fn(),
  dismiss: jest.fn()
};

// Mock both the function and object versions
jest.mock('@/utils/toast', () => ({
  showToast: jest.fn((type, message) => {
    mockToast[type]?.(message);
  }),
  toast: mockToast
})); 