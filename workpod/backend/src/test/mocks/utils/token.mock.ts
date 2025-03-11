// First, mock the token service
jest.mock('@/shared/utils/token', () => ({
  tokenService: {
    generateAccessToken: jest.fn().mockImplementation((userId) => {
      return `mock-valid-token-${userId}`;
    }),
    verifyToken: jest.fn().mockImplementation((token: string) => {
      // Handle both JWT and mock tokens
      if (token.startsWith('mock-valid-token-')) {
        const userId = token.split('mock-valid-token-')[1];
        return Promise.resolve({ userId });
      }
      // For JWT tokens
      return Promise.resolve({ userId: 'test-user-id' });
    })
  }
}));

// Export for use in tests
export const mockTokenService = {
  generateToken: jest.fn().mockReturnValue('mock-token'),
  verifyToken: jest.fn().mockReturnValue({ userId: 'test-user-id' }),
  refreshToken: jest.fn().mockReturnValue('new-mock-token')
};

export const mockToken = {}; 