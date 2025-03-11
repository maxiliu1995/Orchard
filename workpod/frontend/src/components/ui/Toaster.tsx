'use client';

import { Toaster as Sonner } from 'sonner';

export function Toaster() {
    return (
        <Sonner
            position="top-right"
            toastOptions={{
                style: {
                    background: 'white',
                    border: '1px solid #E2E8F0',
                    borderRadius: '0.5rem'
                }
            }}
        />
    );
} 