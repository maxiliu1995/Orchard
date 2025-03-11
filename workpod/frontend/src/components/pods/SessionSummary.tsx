'use client';

import { useEffect, useState } from 'react';
import { addonsApi } from '@/lib/addons/api';
import { showToast } from '@/utils/toast';
import { debugLog } from '@/utils/debug';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { Reservation } from '@/lib/pods/types';
import type { AddOn } from '@/lib/addons/types';

interface SessionSummaryProps {
    reservation: Reservation;
    onCheckout: () => void;
    isVerifyingLock?: boolean;
}

export function SessionSummary({ reservation, onCheckout }: SessionSummaryProps) {
    const [activeAddOns, setActiveAddOns] = useState<AddOn[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sessionDuration, setSessionDuration] = useState(0);

    useEffect(() => {
        const loadAddOns = async () => {
            try {
                const items = await addonsApi.listAddOns();
                const active = items.filter(item => item.status === 'In Use');
                setActiveAddOns(active);
                debugLog('session', 'Loaded active add-ons', { count: active.length });
            } catch (error) {
                debugLog('session', 'Failed to load add-ons', { error });
                showToast.error('Failed to load session details');
            } finally {
                setIsLoading(false);
            }
        };

        loadAddOns();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            const start = new Date(reservation.startTime).getTime();
            const now = Date.now();
            setSessionDuration(Math.floor((now - start) / 1000 / 60)); // minutes
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, [reservation.startTime]);

    const calculateTotal = () => {
        const BASE_RATE = 0.50; // $0.50 per minute
        const baseAmount = sessionDuration * BASE_RATE;
        const addOnsTotal = activeAddOns.reduce((sum, addon) => sum + addon.price, 0);
        return baseAmount + addOnsTotal;
    };

    if (isLoading) {
        return <div className="flex justify-center p-4">
            <LoadingSpinner />
        </div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-4">Session Summary</h2>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Duration</span>
                        <span className="font-medium">{sessionDuration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Base Rate</span>
                        <span className="font-medium">${(sessionDuration * 0.50).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {activeAddOns.length > 0 && (
                <div>
                    <h3 className="font-medium mb-2">Active Add-ons</h3>
                    <div className="space-y-2">
                        {activeAddOns.map(addon => (
                            <div key={addon.id} className="flex justify-between">
                                <span className="text-gray-600">{addon.name}</span>
                                <span className="font-medium">${addon.price.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                    <span>Total Amount</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                </div>
            </div>

            <button
                onClick={onCheckout}
                className="w-full py-3 px-4 bg-primary text-white rounded-lg
                    font-medium hover:bg-primary-dark transition-colors"
            >
                Checkout & End Session
            </button>
        </div>
    );
} 