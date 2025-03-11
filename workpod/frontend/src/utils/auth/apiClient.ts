import axios from 'axios';
import { debugLog } from '@/utils/logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor for auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        debugLog('API Request', { url: config.url, method: config.method });
        return config;
    },
    (error) => {
        debugLog('API Request Error', error);
        return Promise.reject(error);
    }
);
