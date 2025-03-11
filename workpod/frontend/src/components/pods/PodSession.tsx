'use client';

import { useState, useEffect } from 'react';
import { AddOnSelector } from '@/components/addons/AddOnSelector';
import { SessionSummary } from './SessionSummary';
import { LockStatus } from './LockStatus';
import { PaymentFlow } from '@/components/payments/PaymentFlow';
import { podsApi } from '@/lib/pods/api';
import { lockApi } from '@/lib/locks/api';
import { showToast } from '@/utils/toast';
import { debugLog } from '@/utils/debug';
import type { Pod, Reservation } from '@/lib/pods/types';
import type { AddOn } from '@/lib/addons/types';
import { PodSocket } from '@/lib/pods/socket';
import { lockStorage } from '@/lib/locks/storage';

interface PodSessionProps {
    pod: Pod;
    reservation: Reservation;
    onSessionEnded: () => void;
}

export function PodSession({ pod, reservation, onSessionEnded }: PodSessionProps) {
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [activeAddOns, setActiveAddOns] = useState<AddOn[]>([]);
    const [hasUnreturnedAddOns, setHasUnreturnedAddOns] = useState(false);
    const [isVerifyingLock, setIsVerifyingLock] = useState(false);
    const [lockStatus, setLockStatus] = useState<'locked' | 'unlocked' | null>(null);
    const socket = PodSocket.getInstance();

    useEffect(() => {
        socket.connect();
        socket.watchPod(pod.id);

        // Try to get stored status first
        const storedStatus = lockStorage.get(pod.id);
        if (storedStatus) {
            setLockStatus(storedStatus);
            debugLog('lock', 'Using stored lock status', { 
                podId: pod.id, 
                status: storedStatus 
            });
        }

        // Get initial lock status from API
        lockApi.verifyLockStatus(pod.id)
            .then(status => {
                setLockStatus(status);
                lockStorage.save(pod.id, status);
            })
            .catch(error => debugLog('lock', 'Failed to get initial lock status', { error }));

        // Listen for real-time updates
        const unsubscribe = socket.onLockStatusUpdate((podId, status) => {
            if (podId === pod.id) {
                setLockStatus(status);
                lockStorage.save(podId, status);
                debugLog('lock', 'Lock status updated', { status });
            }
        });

        return () => {
            unsubscribe();
            socket.unwatchPod(pod.id);
            socket.disconnect();
            lockStorage.clear();
        };
    }, [pod.id]);

    const handleAddOnToggled = (addOn: AddOn, isSelected: boolean) => {
        setActiveAddOns(prev => 
            isSelected 
                ? [...prev, addOn]
                : prev.filter(a => a.id !== addOn.id)
        );
        setHasUnreturnedAddOns(isSelected);
    };

    const handleCheckout = async () => {
        if (hasUnreturnedAddOns) {
            showToast.error('Cannot checkout', {
                description: 'Please return all add-ons before ending the session'
            });
            return;
        }

        if (lockStatus === 'unlocked') {
            showToast.error('Pod is unlocked', {
                description: 'Please lock the pod before checking out'
            });
            return;
        }
        
        setIsCheckingOut(true);
    };

    const handlePaymentCompleted = async () => {
        try {
            await podsApi.endSession(reservation.id);
            debugLog('session', 'Session ended successfully', { 
                podId: pod.id,
                reservationId: reservation.id 
            });
            onSessionEnded();
        } catch (error) {
            debugLog('session', 'Failed to end session', { error });
            showToast.error('Failed to end session', {
                description: 'Please try again or contact support'
            });
        }
    };

    const handleLockStatusChange = (newStatus: 'locked' | 'unlocked') => {
        setLockStatus(newStatus);
        lockStorage.save(pod.id, newStatus);
        debugLog('lock', 'Lock status changed manually', { 
            podId: pod.id, 
            status: newStatus 
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Pod #{pod.id} Session</h2>
                    <LockStatus
                        podId={pod.id}
                        status={lockStatus}
                        onStatusChange={handleLockStatusChange}
                    />
                </div>
                
                <div className="space-y-8">
                    <div>
                        <h3 className="text-lg font-medium mb-4">Available Add-ons</h3>
                        <AddOnSelector
                            reservationId={reservation.id}
                            onAddOnToggled={handleAddOnToggled}
                        />
                    </div>

                    <SessionSummary
                        reservation={reservation}
                        onCheckout={handleCheckout}
                        isVerifyingLock={isVerifyingLock}
                    />
                </div>
            </div>

            {isCheckingOut && (
                <PaymentFlow
                    reservation={reservation}
                    onPaymentCompleted={handlePaymentCompleted}
                    onPaymentFailed={() => setIsCheckingOut(false)}
                />
            )}
        </div>
    );
} 