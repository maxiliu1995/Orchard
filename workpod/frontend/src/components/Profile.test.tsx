import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Profile } from '../Profile';
import { api } from '../../store/api';

describe('Profile', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: { api: api.reducer },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
    });
  });

  it('should display user information', async () => {
    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );

    expect(await screen.findByTestId('profile-name')).toBeInTheDocument();
  });
}); 