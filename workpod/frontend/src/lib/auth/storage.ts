import { debugLog } from '@/utils/debug';
import { API_CONFIG } from '../api/config';

export const authStorage = {
    async setToken(token: string) {
        try {
            // Set HTTP-only cookie via API endpoint
            await fetch(`${API_CONFIG.baseUrl}/api/auth/set-cookie`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
                credentials: 'include' // Important for cookies
            });
            debugLog('auth', 'Token cookie set successfully');
        } catch (error) {
            debugLog('auth', 'Failed to set token cookie', { error });
            throw new Error('Failed to store authentication token');
        }
    },
    
    async getToken(): Promise<string | null> {
        try {
            // Validate cookie via API endpoint
            const response = await fetch(`${API_CONFIG.baseUrl}/api/auth/validate-cookie`, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                return null;
            }
            
            const { valid } = await response.json();
            return valid ? 'valid-session' : null;
            
        } catch (error) {
            debugLog('auth', 'Error validating token cookie', { error });
            return null;
        }
    },
    
    async removeToken() {
        try {
            // Clear HTTP-only cookie via API endpoint
            await fetch(`${API_CONFIG.baseUrl}/api/auth/clear-cookie`, {
                method: 'POST',
                credentials: 'include'
            });
            debugLog('auth', 'Token cookie cleared');
        } catch (error) {
            debugLog('auth', 'Error clearing token cookie', { error });
        }
    }
};