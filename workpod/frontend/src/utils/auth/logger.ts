export const debugLog = (context: string, message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[${context.toUpperCase()}] ${message}`, data || '');
    }
};

export const errorLog = (context: string, message: string, error?: any) => {
    console.error(`[${context.toUpperCase()}] ${message}`, error || '');
};
