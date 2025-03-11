export const TEST_CONFIG = {
  // API Configuration
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  
  // Test Data
  MOCK_USER: {
    id: '1',
    email: 'test@example.com',
    name: 'Test User'
  },
  
  MOCK_POD: {
    id: '123',
    name: 'Test Pod',
    location: {
      lat: 40.7128,
      lng: -74.0060
    },
    status: 'available'
  },
  
  // Test Timeouts
  DEFAULT_TIMEOUT: 5000,
  EXTENDED_TIMEOUT: 10000
};

export const MOCK_DATA = {
  user: {
    id: TEST_CONFIG.MOCK_USER_ID,
    email: 'test@example.com',
    name: 'Test User'
  },
  pod: {
    id: TEST_CONFIG.MOCK_POD_ID,
    location: 'Test Location',
    status: 'available'
  }
}; 