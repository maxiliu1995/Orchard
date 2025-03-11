import { io, Socket } from 'socket.io-client';
import { debugLog } from '@/utils/debug';
import { API_CONFIG } from '../api/config';
import { authStorage } from '@/lib/auth/storage';
import type { Pod, Reservation } from './types';
import { showToast } from '@/utils/toast';

interface ServerToClientEvents {
    'pod:status_update': (pod: Pod) => void;
    'reservation:update': (reservation: Reservation) => void;
    'reservation:timeout_warning': (data: { reservationId: string, timeLeft: number }) => void;
    'reconnect_attempt': (attempt: number) => void;
    'reconnect_failed': () => void;
}

interface ClientToServerEvents {
    'pod:watch': (podId: string) => void;
    'pod:unwatch': (podId: string) => void;
}

export class PodSocket {
    private static instance: PodSocket;
    private socket: Socket | null = null;
    private podUpdateCallbacks: ((pod: Pod) => void)[] = [];
    private lockStatusCallbacks: ((podId: string, status: 'locked' | 'unlocked') => void)[] = [];

    private constructor() {}

    static getInstance(): PodSocket {
        if (!PodSocket.instance) {
            PodSocket.instance = new PodSocket();
        }
        return PodSocket.instance;
    }

    connect() {
        if (this.socket) return;

        this.socket = io(`${API_CONFIG.baseUrl}/pods`, {
            auth: { token: authStorage.getToken() }
        });

        this.socket.on('pod:update', (pod: Pod) => {
            this.podUpdateCallbacks.forEach(cb => cb(pod));
        });

        this.socket.on('lock:status', ({ podId, status }: { 
            podId: string, 
            status: 'locked' | 'unlocked' 
        }) => {
            debugLog('lock', 'Received lock status update', { podId, status });
            this.lockStatusCallbacks.forEach(cb => cb(podId, status));
        });
    }

    watchPod(podId: string) {
        if (!this.socket) return;
        this.socket.emit('pod:watch', { podId });
        this.socket.emit('lock:watch', { podId });
    }

    unwatchPod(podId: string) {
        if (!this.socket) return;
        this.socket.emit('pod:unwatch', { podId });
        this.socket.emit('lock:unwatch', { podId });
    }

    onPodUpdate(callback: (pod: Pod) => void) {
        this.podUpdateCallbacks.push(callback);
        return () => {
            this.podUpdateCallbacks = this.podUpdateCallbacks.filter(cb => cb !== callback);
        };
    }

    onLockStatusUpdate(callback: (podId: string, status: 'locked' | 'unlocked') => void) {
        this.lockStatusCallbacks.push(callback);
        return () => {
            this.lockStatusCallbacks = this.lockStatusCallbacks.filter(cb => cb !== callback);
        };
    }

    disconnect() {
        if (!this.socket) return;
        this.socket.disconnect();
        this.socket = null;
        this.podUpdateCallbacks = [];
        this.lockStatusCallbacks = [];
    }
}