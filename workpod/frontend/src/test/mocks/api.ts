export const mockApiResponses = {
  login: {
    success: {
      token: 'fake-token',
      user: { id: '1', email: 'test@example.com' }
    },
    error: {
      message: 'Invalid credentials'
    }
  },
  register: {
    success: {
      id: '1',
      email: 'test@example.com'
    },
    error: {
      message: 'Email already exists'
    }
  }
}; 