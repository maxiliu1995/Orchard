'use client';

import { useState, useEffect } from 'react';
import { lockApi } from '@/lib/locks/api';
import { showToast } from '@/utils/toast';
import { debugLog } from '@/utils/debug';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { LockValidator, LockValidation } from '@/lib/locks/validation';

interface LockStatusProps {
    podId: string;
    status: 'locked' | 'unlocked' | null;
    onStatusChange?: (status: 'locked' | 'unlocked') => void;
    onValidationFailed?: () => void;
}

export function LockStatus({ 
    podId, 
    status, 
    onStatusChange,
    onValidationFailed 
}: LockStatusProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [validation, setValidation] = useState<LockValidation | null>(null);
    const validator = LockValidator.getInstance();

    useEffect(() => {
        if (status === 'locked') {
            validator.startValidation(podId, () => {
                debugLog('lock', 'Lock validation failed', { podId });
                onValidationFailed?.();
            });

            const checkValidation = setInterval(() => {
                const current = validator.getValidation(podId);
                setValidation(current);
            }, 1000);

            return () => {
                clearInterval(checkValidation);
                validator.stopValidation(podId);
            };
        }
    }, [podId, status, onValidationFailed]);

    const handleToggle = async () => {
        if (!status || isProcessing) return;

        setIsProcessing(true);
        setIsAnimating(true);
        try {
            if (status === 'locked') {
                await lockApi.unlock(podId);
                onStatusChange?.('unlocked');
            } else {
                await lockApi.lock(podId);
                onStatusChange?.('locked');
            }
        } catch (error) {
            debugLog('lock', `Failed to ${status === 'locked' ? 'unlock' : 'lock'} pod`, { error });
            showToast.error(`Failed to ${status === 'locked' ? 'unlock' : 'lock'} pod`, {
                description: 'Please try again'
            });
        } finally {
            setIsProcessing(false);
            setTimeout(() => setIsAnimating(false), 300);
        }
    };

    return (
        <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={status || 'loading'}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ 
                            scale: 1, 
                            opacity: 1,
                            backgroundColor: status === 'locked' 
                                ? validation?.isValid === false
                                    ? '#fbbf24' // yellow-400 for validation warning
                                    : '#22c55e'
                                : status === 'unlocked'
                                    ? '#ef4444'
                                    : '#d1d5db'
                        }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-3 h-3 rounded-full"
                    />
                </AnimatePresence>
                <motion.span 
                    className="text-sm font-medium"
                    animate={{ opacity: isAnimating ? 0.5 : 1 }}
                    transition={{ duration: 0.2 }}
                >
                    {status ? (
                        status === 'locked' 
                            ? validation?.isValid === false
                                ? 'Verifying Lock...'
                                : 'Pod Locked'
                            : 'Pod Unlocked'
                    ) : (
                        'Checking Status...'
                    )}
                </motion.span>
            </div>

            <button
                onClick={handleToggle}
                disabled={!status || isProcessing}
                className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200
                    ${status === 'locked' 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed transform
                    ${isProcessing ? 'scale-95' : 'hover:scale-105'}
                `}
            >
                {isProcessing ? (
                    <LoadingSpinner />
                ) : status === 'locked' ? (
                    'Unlock Pod'
                ) : (
                    'Lock Pod'
                )}
            </button>
        </div>
    );
} 