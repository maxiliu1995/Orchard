export const CI_CONFIG = {
  // Timeouts
  defaultTimeout: 5000,
  extendedTimeout: 10000,
  
  // Test retries
  maxRetries: 2,
  
  // Parallel execution
  maxWorkers: 4,
  
  // Test reporting
  reporters: ['default', 'junit'],
  
  // Coverage thresholds
  coverageThresholds: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
}; 