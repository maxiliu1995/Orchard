interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export const authService = {
  async register(userData: { email: string; password: string; firstName: string; lastName: string }): Promise<{ user: User }> {
    // Mock implementation for tests
    return {
      user: {
        id: 'test-user-id',
        ...userData
      }
    };
  }
}; 