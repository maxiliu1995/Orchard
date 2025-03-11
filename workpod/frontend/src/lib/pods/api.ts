import { authStorage } from '@/lib/auth/storage';
import { API_CONFIG } from '../api/config';
import { debugLog } from '@/utils/debug';
import type { Pod, Reservation } from './types';

export const podsApi = {
    async listPods(): Promise<Pod[]> {
        const response = await fetch('/api/pods');
        if (!response.ok) {
            throw new Error('Failed to fetch pods');
        }
        return response.json();
    },

    async createReservation(podId: string): Promise<Reservation> {
        const response = await fetch('/api/reservations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ podId })
        });
        if (!response.ok) {
            throw new Error('Failed to create reservation');
        }
        return response.json();
    },

    async cancelReservation(reservationId: string): Promise<void> {
        const response = await fetch(`/api/reservations/${reservationId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to cancel reservation');
        }
    },

    async endSession(reservationId: string): Promise<void> {
        const response = await fetch(`/api/reservations/${reservationId}/end`, {
            method: 'POST'
        });
        if (!response.ok) {
            throw new Error('Failed to end session');
        }
    }
};