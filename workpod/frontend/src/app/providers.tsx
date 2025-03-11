'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';

export function Providers({ children }: { children: React.ReactNode }) {
  console.log('Providers - Attempting to render');
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
} 