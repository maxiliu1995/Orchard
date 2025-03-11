import { debugLog } from '@/utils/debug';
import type { AuthResponse, TokenValidationResponse, UserProfile } from './types';
import { authStorage } from '@/lib/auth/storage';
import { API_CONFIG } from '../api/config';

export const authApi = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        debugLog('auth', 'Initiating login request', { email });
        
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.login}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            debugLog('auth', 'Login failed', { error });
            throw new Error(error.message || 'Login failed');
        }

        const data = await response.json();
        debugLog('auth', 'Login successful', { email });
        return data;
    },
    
    register: async (data: {
        fullName: string;
        email: string;
        password: string;
    }): Promise<AuthResponse> => {
        debugLog('auth', 'Initiating registration request', { email: data.email });
        
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.register}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            debugLog('auth', 'Registration failed', { error });
            throw new Error(error.message || 'Registration failed');
        }

        const result = await response.json();
        debugLog('auth', 'Registration successful', { email: data.email });
        return result;
    },
    
    validateToken: async (token: string): Promise<TokenValidationResponse> => {
        debugLog('auth', 'Validating token with backend');
        
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.validateToken}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            debugLog('auth', 'Token validation failed');
            return { isValid: false };
        }

        const data = await response.json();
        debugLog('auth', 'Token validated successfully');
        return data;
    },
    
    refreshToken: async (): Promise<AuthResponse> => {
        debugLog('auth', 'Refreshing token');
        const currentToken = await authStorage.getToken();
        
        if (!currentToken) {
            throw new Error('No token to refresh');
        }

        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.refreshToken}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            debugLog('auth', 'Token refresh failed', { error });
            throw new Error(error.message || 'Token refresh failed');
        }

        const data = await response.json();
        debugLog('auth', 'Token refreshed successfully');
        return data;
    },
    
    getProfile: async (): Promise<UserProfile> => {
        const token = await authStorage.getToken();
        const response = await fetch(`${API_CONFIG.baseUrl}/api/users/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch profile');
        }
        return response.json();
    },
    
    updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
        const token = await authStorage.getToken();
        const response = await fetch(`${API_CONFIG.baseUrl}/api/users/profile`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update profile');
        }
        return response.json();
    }
};