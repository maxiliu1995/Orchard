import { debugLog } from '@/utils/debug';

const LOCK_STATUS_KEY = 'workpod_lock_status';

interface StoredLockStatus {
    podId: string;
    status: 'locked' | 'unlocked';
    timestamp: number;
}

export const lockStorage = {
    save(podId: string, status: 'locked' | 'unlocked'): void {
        try {
            const data: StoredLockStatus = {
                podId,
                status,
                timestamp: Date.now()
            };
            localStorage.setItem(LOCK_STATUS_KEY, JSON.stringify(data));
            debugLog('lock', 'Saved lock status', { podId, status });
        } catch (error) {
            debugLog('lock', 'Failed to save lock status', { error });
        }
    },

    get(podId: string): 'locked' | 'unlocked' | null {
        try {
            const stored = localStorage.getItem(LOCK_STATUS_KEY);
            if (!stored) return null;

            const data: StoredLockStatus = JSON.parse(stored);
            
            // Only return status if it's for the same pod and not older than 5 minutes
            const isValid = 
                data.podId === podId && 
                Date.now() - data.timestamp < 5 * 60 * 1000;

            return isValid ? data.status : null;
        } catch (error) {
            debugLog('lock', 'Failed to get lock status', { error });
            return null;
        }
    },

    clear(): void {
        try {
            localStorage.removeItem(LOCK_STATUS_KEY);
            debugLog('lock', 'Cleared lock status');
        } catch (error) {
            debugLog('lock', 'Failed to clear lock status', { error });
        }
    }
}; 