import { useEffect, useState } from 'react';
import { PodSocket } from './socket';
import { showToast } from '@/utils/toast';
import { debugLog } from '@/utils/debug';

const TIMEOUT_WARNING = 60; // Show warning when 60 seconds remain

export function useReservationTimeout(reservationId: string | null) {
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const socket = PodSocket.getInstance();

    useEffect(() => {
        if (!reservationId) return;

        socket.onTimeoutWarning(({ reservationId: id, timeLeft }) => {
            if (id === reservationId) {
                setTimeLeft(timeLeft);
                if (timeLeft <= TIMEOUT_WARNING) {
                    showToast.error('Reservation expiring soon', {
                        description: `Your reservation will expire in ${timeLeft} seconds`
                    });
                }
            }
        });

        return () => {
            setTimeLeft(null);
        };
    }, [reservationId]);

    return timeLeft;
} 