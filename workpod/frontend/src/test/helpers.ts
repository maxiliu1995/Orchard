import { store } from '../store/store';
import { TEST_CONFIG } from './testConfig';

export const loginTestUser = async () => {
  // Simulate login
  store.dispatch({
    type: 'auth/login',
    payload: TEST_CONFIG.MOCK_USER
  });
};

export const clearTestData = () => {
  // Clear test data
  localStorage.clear();
  sessionStorage.clear();
  store.dispatch({ type: 'RESET_STATE' });
};

export const mockApiResponse = (data: any) => {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(data)
  });
};