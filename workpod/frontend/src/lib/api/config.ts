export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    ENDPOINTS: {
        AUTH: {
            REGISTER: '/auth/register',
            LOGIN: '/auth/login',
            LOGOUT: '/auth/logout',
            CURRENT_USER: '/auth/me',
        },
        USER: {
            PROFILE: '/user/profile',
            SETTINGS: '/user/settings',
        },
        PODS: {
            LIST: '/pods',
            DETAILS: (id: string) => `/pods/${id}`,
        },
        RESERVATIONS: {
            CREATE: '/reservations',
            LIST: '/reservations',
            DETAILS: (id: string) => `/reservations/${id}`,
        },
    },
    HEADERS: {
        'Content-Type': 'application/json',
    },
};

export const API_BASE_URL = API_CONFIG.BASE_URL;
