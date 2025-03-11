import { apiClient } from './apiClient';
import { debugLog } from '@/utils/logger';
import { AuthResponse, LoginData, RegisterData } from './types';

export const authApi = {
    login: async (data: LoginData): Promise<AuthResponse> => {
        try {
            debugLog('auth', 'Attempting login', { email: data.email });
            const response = await apiClient.post<AuthResponse>('/users/login', data);
            debugLog('auth', 'Login successful', { email: data.email });
            return response.data;
        } catch (error) {
            debugLog('auth', 'Login failed', { error });
            throw error;
        }
    },

    register: async (data: RegisterData): Promise<AuthResponse> => {
        try {
            debugLog('auth', 'Attempting registration', { email: data.email });
            const response = await apiClient.post<AuthResponse>('/users/signup', data);
            debugLog('auth', 'Registration successful', { email: data.email });
            return response.data;
        } catch (error) {
            debugLog('auth', 'Registration failed', { error });
            throw error;
        }
    }
};
