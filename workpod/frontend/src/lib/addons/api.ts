import { authStorage } from '@/lib/auth/storage';
import { API_CONFIG } from '../api/config';
import type { AddOn } from './types';
import { debugLog } from '@/utils/debug';

export const addonsApi = {
    async listAddOns(): Promise<AddOn[]> {
        const token = await authStorage.getToken();
        const response = await fetch(`${API_CONFIG.baseUrl}/api/addons`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
            const error = await response.json();
            debugLog('addons', 'Failed to fetch add-ons', { error });
            throw new Error(error.message || 'Failed to fetch add-ons');
        }

        return response.json();
    },

    async toggleAddOn(addOnId: string, reservationId: string): Promise<void> {
        const token = await authStorage.getToken();
        const response = await fetch(`${API_CONFIG.baseUrl}/api/addons/${addOnId}/toggle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ reservationId })
        });

        if (!response.ok) {
            const error = await response.json();
            debugLog('addons', 'Failed to toggle add-on', { error });
            throw new Error(error.message || 'Failed to toggle add-on');
        }
    },

    async confirmReturn(addOnId: string, reservationId: string): Promise<void> {
        const token = await authStorage.getToken();
        const response = await fetch(`${API_CONFIG.baseUrl}/api/addons/${addOnId}/return`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ 
                reservationId,
                rfidConfirmation: true // This would come from actual RFID reading
            })
        });

        if (!response.ok) {
            const error = await response.json();
            debugLog('addons', 'Failed to confirm add-on return', { error });
            throw new Error(error.message || 'Failed to confirm add-on return');
        }
    }
}; 