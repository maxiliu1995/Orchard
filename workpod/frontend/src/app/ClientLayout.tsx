'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from '@/store';
import { ErrorProvider } from '@/contexts/ErrorContext';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { SocketProvider } from '@/contexts/SocketContext';
import { AuthProvider } from '@/contexts/auth/AuthContext';
import { PayPalProvider } from '@/components/payments/providers/PayPalProvider';
import { Toaster } from '@/components/ui/Toaster';
import { ToastProvider } from '@/providers/ToastProvider';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  console.log('ClientLayout - Attempting to render');
  const pathname = usePathname();
  const router = useRouter();
  
  useEffect(() => {
    const isPublicRoute = pathname?.startsWith('/auth');
    const token = localStorage.getItem('token');

    if (!token && !isPublicRoute) {
      router.replace('/auth/login');
    }
  }, [pathname, router]);

  return (
    <PersistGate loading={null} persistor={persistor}>
      <ErrorProvider>
        <ErrorBoundary>
          <SocketProvider>
            <AuthProvider>
              <PayPalProvider>
                <main className="min-h-screen bg-gray-50">
                  {children}
                  <Toaster />
                  <ToastProvider />
                </main>
              </PayPalProvider>
            </AuthProvider>
          </SocketProvider>
        </ErrorBoundary>
      </ErrorProvider>
    </PersistGate>
  );
} 