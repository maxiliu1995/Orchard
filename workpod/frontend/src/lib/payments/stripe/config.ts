export const STRIPE_CONFIG = {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_KEY!,
    appearance: {
        theme: 'stripe' as const,
        variables: {
            colorPrimary: '#0A2540',
            colorBackground: '#ffffff',
            colorText: '#30313d',
            colorDanger: '#df1b41'
        }
    }
}; 