/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testTimeout: 30000,

  // Test setup configuration
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  globalSetup: '<rootDir>/src/test/setup/globalSetup.ts',

  // Fix path mapping
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/core/(.*)$': '<rootDir>/src/core/$1',
    '^@/shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@/test/(.*)$': '<rootDir>/src/test/$1'
  },

  // Test patterns
  testMatch: ['**/__tests__/**/*.test.ts'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__mocks__/',
    '/helpers/',
    '/setup/'
  ],

  // Test execution settings
  maxWorkers: 1,
  detectOpenHandles: true,
  forceExit: true,

  // TypeScript configuration
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },

  // Global constants
  globals: {
    NotificationStatus: {
      PENDING: 'PENDING',
      SENT: 'SENT',
      FAILED: 'FAILED'
    },
    PodStatus: {
      AVAILABLE: 'AVAILABLE',
      OCCUPIED: 'OCCUPIED',
      MAINTENANCE: 'MAINTENANCE'
    }
  }
};