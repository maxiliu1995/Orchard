import { authStorage } from '@/lib/auth/storage';
import { API_CONFIG } from '../api/config';
import { debugLog } from '@/utils/debug';

export const lockApi = {
    async unlock(podId: string): Promise<void> {
        const token = await authStorage.getToken();
        const response = await fetch(`${API_CONFIG.baseUrl}/api/locks/${podId}/unlock`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
            const error = await response.json();
            debugLog('lock', 'Failed to unlock pod', { error });
            throw new Error(error.message || 'Failed to unlock pod');
        }
    },

    async lock(podId: string): Promise<void> {
        const token = await authStorage.getToken();
        const response = await fetch(`${API_CONFIG.baseUrl}/api/locks/${podId}/lock`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
            const error = await response.json();
            debugLog('lock', 'Failed to lock pod', { error });
            throw new Error(error.message || 'Failed to lock pod');
        }
    },

    async verifyLockStatus(podId: string): Promise<'locked' | 'unlocked'> {
        const token = await authStorage.getToken();
        const response = await fetch(`${API_CONFIG.baseUrl}/api/locks/${podId}/status`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
            const error = await response.json();
            debugLog('lock', 'Failed to verify lock status', { error });
            throw new Error(error.message || 'Failed to verify lock status');
        }

        const { status } = await response.json();
        return status;
    }
}; 