export const testContext = {
  userId: null as string | null,
  email: null as string | null,

  setUserId(id: string) {
    this.userId = id;
  },

  setEmail(email: string) {
    this.email = email;
  },

  clear() {
    this.userId = null;
    this.email = null;
  }
};

// Default test values when needed
export const DEFAULT_TEST_USER = {
  id: 'test-user-id',
  email: 'test@example.com'
}; 