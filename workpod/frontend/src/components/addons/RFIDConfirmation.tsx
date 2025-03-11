'use client';

import { useState, useEffect } from 'react';
import { addonsApi } from '@/lib/addons/api';
import { showToast } from '@/utils/toast';
import { debugLog } from '@/utils/debug';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { AddOn } from '@/lib/addons/types';

interface RFIDConfirmationProps {
    addOn: AddOn;
    reservationId: string;
    onConfirmed: () => void;
    onCancelled: () => void;
}

export function RFIDConfirmation({ 
    addOn, 
    reservationId, 
    onConfirmed, 
    onCancelled 
}: RFIDConfirmationProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30); // 30 second timeout

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onCancelled();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [onCancelled]);

    const handleConfirm = async () => {
        setIsProcessing(true);
        try {
            await addonsApi.confirmReturn(addOn.id, reservationId);
            debugLog('addons', 'Add-on return confirmed', { 
                addOnId: addOn.id,
                reservationId 
            });
            onConfirmed();
        } catch (error) {
            debugLog('addons', 'Failed to confirm add-on return', { error });
            showToast.error('Failed to confirm return', {
                description: 'Please try scanning the RFID tag again'
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full space-y-4">
                <h3 className="text-lg font-semibold">
                    Return {addOn.name}
                </h3>
                
                <p className="text-sm text-gray-600">
                    Please scan the RFID tag on the {addOn.name.toLowerCase()} to confirm return.
                </p>

                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                        Time remaining: {timeLeft}s
                    </span>
                    {isProcessing && <LoadingSpinner />}
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={onCancelled}
                        disabled={isProcessing}
                        className="flex-1 py-2 px-4 border border-gray-300 rounded-md
                            text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isProcessing}
                        className="flex-1 py-2 px-4 bg-primary text-white rounded-md
                            text-sm font-medium hover:bg-primary-dark"
                    >
                        Confirm Return
                    </button>
                </div>
            </div>
        </div>
    );
} 