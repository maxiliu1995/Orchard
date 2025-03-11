// src/lib/auth/auth-config.ts

export const AUTH_CONFIG = {
    TOKEN_KEY: 'workpod_token',
    REFRESH_TOKEN_KEY: 'workpod_refresh_token',
    TOKEN_EXPIRY: 3600, // 1 hour in seconds
    REFRESH_TOKEN_EXPIRY: 2592000, // 30 days in seconds
};

export const OAUTH_CONFIG = {
    GOOGLE: {
        CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        REDIRECT_URI: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
        SCOPE: 'email profile',
    },
    APPLE: {
        CLIENT_ID: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
        REDIRECT_URI: process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI,
        SCOPE: 'email name',
    },
};

export const AUTH_ROUTES = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    PROTECTED_ROUTES: ['/dashboard', '/profile', '/settings'],
};

export const isAuthenticated = (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
};

export const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
};

export const setToken = (token: string): void => {
    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
};

export const removeToken = (): void => {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
};

export const handleAuthError = (error: any): void => {
    if (error.statusCode === 401) {
        removeToken();
        window.location.href = AUTH_ROUTES.LOGIN;
    }
};
