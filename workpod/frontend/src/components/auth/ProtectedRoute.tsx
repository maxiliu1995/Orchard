// src/components/auth/ProtectedRoute.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authStorage } from '@/lib/auth/storage';
import { AUTH_ROUTES } from '@/lib/auth/routes';
import { debugLog } from '@/utils/debug';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner/index';
import { authApi } from '@/lib/auth/api';
import { showToast } from '@/utils/toast';
import { Toaster } from 'sonner';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 3;
    const REFRESH_INTERVAL = 1000 * 60 * 14; // 14 minutes

    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            debugLog('auth', 'Checking authentication status');
            
            try {
                const token = await authStorage.getToken();
                
                if (!token) {
                    debugLog('auth', 'No token found, redirecting to login');
                    showToast.error('Session expired', {
                        description: 'Please sign in again to continue.'
                    });
                    router.replace(AUTH_ROUTES.LOGIN);
                    return;
                }

                const validation = await authApi.validateToken(token);
                
                if (validation.isValid) {
                    debugLog('auth', 'Token validated successfully');
                    setIsAuthenticated(true);
                    setRetryCount(0);
                } else {
                    throw new Error('Token validation failed');
                }
            } catch (error) {
                debugLog('auth', 'Token validation error', { error });
                const isStorageError = error instanceof Error && 
                    error.message.includes('storage');
                
                if (!isStorageError && retryCount < MAX_RETRIES) {
                    debugLog('auth', `Retrying validation (${retryCount + 1}/${MAX_RETRIES})`);
                    setRetryCount(prev => prev + 1);
                    setTimeout(checkAuth, 1000);
                    return;
                }
                
                authStorage.removeToken();
                showToast.error(
                    isStorageError ? 'Storage error' : 'Authentication error',
                    {
                        description: isStorageError 
                            ? 'Unable to access browser storage. Please check your privacy settings.'
                            : 'Please login again to continue.'
                    }
                );
                router.replace(AUTH_ROUTES.LOGIN);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router, retryCount]);

    // Set up token refresh interval
    useEffect(() => {
        if (isAuthenticated) {
            const refreshInterval = setInterval(async () => {
                try {
                    debugLog('auth', 'Refreshing token');
                    const response = await authApi.refreshToken();
                    if (response.success && response.token) {
                        authStorage.setToken(response.token);
                        debugLog('auth', 'Token refreshed successfully');
                    }
                } catch (error) {
                    debugLog('auth', 'Token refresh failed', { error });
                    // Don't logout immediately on refresh failure
                    // Let the main validation handle that
                }
            }, REFRESH_INTERVAL);

            return () => clearInterval(refreshInterval);
        }
    }, [isAuthenticated]);

    return (
        <>
            <Toaster richColors />
            {isLoading ? (
                <div className="flex min-h-screen items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) : isAuthenticated ? (
                children
            ) : null}
        </>
    );
}
