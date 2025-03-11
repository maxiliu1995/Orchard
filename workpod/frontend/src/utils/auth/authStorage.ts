import { debugLog } from '../logger';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const authStorage = {
    setToken: (token: string) => {
        try {
            localStorage.setItem(TOKEN_KEY, token);
            debugLog('auth', 'Token stored successfully');
        } catch (error) {
            debugLog('auth', 'Failed to store token', { error });
            throw new Error('Failed to store authentication token');
        }
    },

    getToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },

    removeToken: () => {
        localStorage.removeItem(TOKEN_KEY);
        debugLog('auth', 'Token removed');
    },

    setUser: (user: any) => {
        try {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            debugLog('auth', 'User data stored');
        } catch (error) {
            debugLog('auth', 'Failed to store user data', { error });
        }
    },

    getUser: () => {
        const userData = localStorage.getItem(USER_KEY);
        return userData ? JSON.parse(userData) : null;
    },

    clearAuth: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        debugLog('auth', 'Auth data cleared');
    }
};
