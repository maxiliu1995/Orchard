import { server } from '../mocks/server';

beforeAll(() => {
  // Enable API mocking
  server.listen({ onUnhandledRequest: 'warn' });
});

afterEach(() => {
  // Reset handlers between tests
  server.resetHandlers();
});

afterAll(() => {
  // Clean up after tests
  server.close();
}); 