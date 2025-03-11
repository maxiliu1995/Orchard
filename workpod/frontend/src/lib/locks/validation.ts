import { debugLog } from '@/utils/debug';

export interface LockValidation {
    isValid: boolean;
    lastVerified: number;
    retryCount: number;
}

const MAX_RETRIES = 3;
const VALIDATION_INTERVAL = 30000; // 30 seconds
const VALIDATION_TIMEOUT = 5000; // 5 seconds

export class LockValidator {
    private static instance: LockValidator;
    private validations: Map<string, LockValidation>;
    private validationTimers: Map<string, NodeJS.Timeout>;

    private constructor() {
        this.validations = new Map();
        this.validationTimers = new Map();
    }

    static getInstance(): LockValidator {
        if (!LockValidator.instance) {
            LockValidator.instance = new LockValidator();
        }
        return LockValidator.instance;
    }

    startValidation(podId: string, onInvalid: () => void): void {
        if (this.validationTimers.has(podId)) {
            return;
        }

        const validate = async () => {
            const validation = this.validations.get(podId) || {
                isValid: true,
                lastVerified: Date.now(),
                retryCount: 0
            };

            try {
                const response = await fetch(`/api/locks/${podId}/validate`, {
                    signal: AbortSignal.timeout(VALIDATION_TIMEOUT)
                });

                if (!response.ok) {
                    throw new Error('Validation failed');
                }

                this.validations.set(podId, {
                    ...validation,
                    isValid: true,
                    lastVerified: Date.now(),
                    retryCount: 0
                });

                debugLog('lock', 'Lock validation successful', { podId });
            } catch (error) {
                validation.retryCount++;
                validation.isValid = false;

                debugLog('lock', 'Lock validation failed', { 
                    podId, 
                    retryCount: validation.retryCount,
                    error 
                });

                if (validation.retryCount >= MAX_RETRIES) {
                    this.stopValidation(podId);
                    onInvalid();
                }

                this.validations.set(podId, validation);
            }
        };

        validate();
        const timer = setInterval(validate, VALIDATION_INTERVAL);
        this.validationTimers.set(podId, timer);
    }

    stopValidation(podId: string): void {
        const timer = this.validationTimers.get(podId);
        if (timer) {
            clearInterval(timer);
            this.validationTimers.delete(podId);
            this.validations.delete(podId);
            debugLog('lock', 'Lock validation stopped', { podId });
        }
    }

    getValidation(podId: string): LockValidation | null {
        return this.validations.get(podId) || null;
    }
} 