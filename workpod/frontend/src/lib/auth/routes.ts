import { redirect } from 'next/navigation';

export const AUTH_ROUTES = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    DASHBOARD: '/dashboard',
    FORGOT_PASSWORD: '/auth/forgot-password'
} as const;

export const authRoutes = {
    toDashboard: () => redirect(AUTH_ROUTES.DASHBOARD),
    toLogin: () => redirect(AUTH_ROUTES.LOGIN)
}; 