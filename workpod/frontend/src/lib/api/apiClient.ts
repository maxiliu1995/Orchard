// src/lib/api/apiClient.ts

import { authStorage } from '@/lib/auth/storage';
import { errorMiddleware } from '@/middleware/error/errorMiddleware';
import { API_BASE_URL } from './config';
import { debugLog } from '@/utils/debug';
import { AUTH_ROUTES } from '@/lib/auth/routes';

interface RequestConfig extends RequestInit {
    requiresAuth?: boolean;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async handleResponse(response: Response) {
        if (!response.ok) {
            const error = await response.json();
            throw error;
        }
        return response.json();
    }

    private async addAuthHeader(headers: HeadersInit = {}): Promise<HeadersInit> {
        const token = authStorage.getToken();
        if (token) {
            return {
                ...headers,
                'Authorization': `Bearer ${token}`,
            };
        }
        return headers;
    }

    private async refreshTokenIfNeeded(): Promise<boolean> {
        const token = await authStorage.getToken();
        if (token !== null) {
            try {
                const response = await this.post<{ token: string }>('/auth/refresh-token', {}, { requiresAuth: false });
                const newToken = response.token;
                if (newToken) {
                    await authStorage.setToken(newToken);
                }
                return !!newToken;
            } catch (error) {
                debugLog('auth', 'Token refresh failed', { error });
                return false;
            }
        }
        return true;
    }

    async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
        try {
            const { requiresAuth = true, headers = {}, ...restConfig } = config;

            // Check if token refresh is needed
            if (requiresAuth && !(await this.refreshTokenIfNeeded())) {
                throw new Error('Session expired');
            }

            // Prepare headers
            const finalHeaders = requiresAuth
                ? await this.addAuthHeader({
                      'Content-Type': 'application/json',
                      ...headers,
                  })
                : {
                      'Content-Type': 'application/json',
                      ...headers,
                  };

            // Make the request
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...restConfig,
                headers: finalHeaders,
            });

            // Handle the response
            const data = await this.handleResponse(response);
            return data as T;
        } catch (error) {
            const errorResponse = await errorMiddleware.handleError(error);
            if (errorResponse.status === 401) {
                window.location.href = AUTH_ROUTES.LOGIN;
            }
            throw error;
        }
    }

    // Convenience methods
    async get<T>(endpoint: string, config: RequestConfig = {}) {
        return this.request<T>(endpoint, { ...config, method: 'GET' });
    }

    async post<T>(endpoint: string, data?: any, config: RequestConfig = {}) {
        return this.request<T>(endpoint, {
            ...config,
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async put<T>(endpoint: string, data?: any, config: RequestConfig = {}) {
        return this.request<T>(endpoint, {
            ...config,
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async patch<T>(endpoint: string, data?: any, config: RequestConfig = {}) {
        return this.request<T>(endpoint, {
            ...config,
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async delete<T>(endpoint: string, config: RequestConfig = {}) {
        return this.request<T>(endpoint, { ...config, method: 'DELETE' });
    }
}

export const apiClient = new ApiClient(API_BASE_URL);
