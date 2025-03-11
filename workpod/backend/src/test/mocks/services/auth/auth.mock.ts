// Move auth service mock
export const mockAuthService = {
  register: jest.fn().mockImplementation(/* ... */),
  login: jest.fn().mockImplementation(/* ... */),
  // ... other auth methods
};

jest.mock('@/core/auth/services/authService', () => ({
  AuthService: jest.fn().mockImplementation(() => mockAuthService),
  authService: mockAuthService
})); 