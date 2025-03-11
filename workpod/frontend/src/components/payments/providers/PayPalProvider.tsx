'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { ReactNode } from 'react';

interface PayPalProviderProps {
    children: ReactNode;
}

export function PayPalProvider({ children }: PayPalProviderProps) {
    return (
        <PayPalScriptProvider
            options={{
                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                currency: 'USD',
                intent: 'capture'
            }}
        >
            {children}
        </PayPalScriptProvider>
    );
} 