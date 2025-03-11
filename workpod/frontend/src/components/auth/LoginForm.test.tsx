import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { LoginForm } from '../LoginForm';
import { api } from '../../store/api';

describe('LoginForm', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: { api: api.reducer },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
    });
  });

  it('should handle login submission', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );

    fireEvent.change(getByTestId('email-input'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(getByTestId('password-input'), {
      target: { value: 'password123' }
    });
    fireEvent.submit(getByTestId('login-form'));

    await waitFor(() => {
      // Add assertions
    });
  });
}); 