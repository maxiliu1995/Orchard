'use client';

import { useEffect, useState } from 'react';
import { addonsApi } from '@/lib/addons/api';
import { showToast } from '@/utils/toast';
import { debugLog } from '@/utils/debug';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner/index';
import type { AddOn } from '@/lib/addons/types';
import { RFIDConfirmation } from './RFIDConfirmation';

interface AddOnSelectorProps {
    reservationId: string;
    onAddOnToggled?: (addOn: AddOn, isSelected: boolean) => void;
}

export function AddOnSelector({ reservationId, onAddOnToggled }: AddOnSelectorProps) {
    const [addOns, setAddOns] = useState<AddOn[]>([]);
    const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [returningAddOn, setReturningAddOn] = useState<AddOn | null>(null);

    useEffect(() => {
        const loadAddOns = async () => {
            try {
                const items = await addonsApi.listAddOns();
                debugLog('addons', 'Loaded add-ons', { count: items.length });
                setAddOns(items);
            } catch (error) {
                debugLog('addons', 'Failed to load add-ons', { error });
                showToast.error('Failed to load add-ons', {
                    description: 'Please try refreshing the page'
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadAddOns();
    }, []);

    const handleToggle = async (addOn: AddOn) => {
        if (processingId) return;
        setProcessingId(addOn.id);

        try {
            if (selectedAddOns.has(addOn.id)) {
                setReturningAddOn(addOn);
                return;
            }

            await addonsApi.toggleAddOn(addOn.id, reservationId);
            
            setSelectedAddOns(prev => {
                const next = new Set(prev);
                next.add(addOn.id);
                return next;
            });

            onAddOnToggled?.(addOn, !selectedAddOns.has(addOn.id));
            debugLog('addons', `Add-on ${selectedAddOns.has(addOn.id) ? 'removed' : 'added'}`, { 
                addOnId: addOn.id 
            });
        } catch (error) {
            debugLog('addons', 'Failed to toggle add-on', { error });
            showToast.error('Failed to toggle add-on', {
                description: error instanceof Error ? error.message : 'Please try again'
            });
        } finally {
            setProcessingId(null);
        }
    };

    const handleReturnConfirmed = async () => {
        if (!returningAddOn) return;
        
        try {
            await addonsApi.toggleAddOn(returningAddOn.id, reservationId);
            setSelectedAddOns(prev => {
                const next = new Set(prev);
                next.delete(returningAddOn.id);
                return next;
            });
            onAddOnToggled?.(returningAddOn, false);
        } catch (error) {
            debugLog('addons', 'Failed to remove add-on after return', { error });
            showToast.error('Failed to remove add-on', {
                description: 'The add-on was returned but system update failed'
            });
        } finally {
            setReturningAddOn(null);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-4">
            <LoadingSpinner />
        </div>;
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addOns.map(addOn => (
                    <div 
                        key={addOn.id}
                        className={`p-4 rounded-lg border transition-colors
                            ${selectedAddOns.has(addOn.id) 
                                ? 'border-primary bg-primary/5' 
                                : 'border-gray-200 hover:border-gray-300'
                            }
                            ${addOn.status !== 'Available' ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-medium">{addOn.name}</h3>
                            <span className="text-sm text-gray-500">
                                ${addOn.price.toFixed(2)}
                            </span>
                        </div>
                        <button
                            onClick={() => handleToggle(addOn)}
                            disabled={processingId === addOn.id || addOn.status !== 'Available'}
                            className={`mt-2 w-full py-2 px-4 rounded text-sm font-medium
                                ${selectedAddOns.has(addOn.id)
                                    ? 'bg-primary text-white hover:bg-primary-dark'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }
                                ${addOn.status !== 'Available' ? 'cursor-not-allowed' : ''}
                            `}
                        >
                            {processingId === addOn.id ? (
                                <LoadingSpinner />
                            ) : selectedAddOns.has(addOn.id) ? (
                                'Remove'
                            ) : (
                                'Add'
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {returningAddOn && (
                <RFIDConfirmation
                    addOn={returningAddOn}
                    reservationId={reservationId}
                    onConfirmed={handleReturnConfirmed}
                    onCancelled={() => {
                        setReturningAddOn(null);
                        setProcessingId(null);
                    }}
                />
            )}
        </>
    );
} 