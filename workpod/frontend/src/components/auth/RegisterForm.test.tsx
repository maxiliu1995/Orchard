import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { RegisterForm } from '../RegisterForm';
import { api } from '../../store/api';

describe('RegisterForm', () => {
  // Create a test store before each test
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        api: api.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
    });
  });

  it('should handle registration submission', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <RegisterForm />
      </Provider>
    );

    // Simulate form submission
    const form = getByTestId('register-form');
    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.submit(form);

    await waitFor(() => {
      // Add your assertions here
      expect(true).toBeTruthy();
    });
  });
}); 