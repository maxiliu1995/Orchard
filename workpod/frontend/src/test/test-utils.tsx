import { render, screen, waitFor } from '@testing-library/react';
import { ReactElement } from 'react';
import { TestProviders } from './providers';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { api } from '@/store/api';
import { authApi } from '@/store/api/auth';
import { podsApi } from '@/store/api/pods';

const createTestStore = () => {
  return configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      [authApi.reducerPath]: authApi.reducer,
      [podsApi.reducerPath]: podsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([
        api.middleware,
        authApi.middleware,
        podsApi.middleware
      ])
  });
};

export function customRender(ui: React.ReactElement) {
  const testStore = createTestStore();
  
  return render(
    <Provider store={testStore}>
      <TestProviders>
        {ui}
      </TestProviders>
    </Provider>
  );
}

// re-export everything
export * from '@testing-library/react';

// Helper functions
export const flushPromises = async () => {
    await Promise.resolve();
    await new Promise(resolve => setTimeout(resolve, 0));
};

export async function waitForLoadingToFinish() {
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
} 