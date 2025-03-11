// src/utils/auth/tokenUtils.ts

interface DecodedToken {
    exp: number;
    userId: string;
    email: string;
}

export const tokenUtils = {
    getToken: () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    },
    
    setToken: (token: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
        }
    },
    
    removeToken: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
    },
    
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token && tokenUtils.isTokenValid(token);
    },
    
    isTokenValid: (token: string): boolean => {
        if (!token) return false;
        
        try {
            // Basic structure check
            if (!token.includes('.')) return false;

            // Check expiration
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );

            const decoded: DecodedToken = JSON.parse(jsonPayload);
            const currentTime = Date.now() / 1000;

            return decoded.exp > currentTime;
        } catch (error) {
            console.error('Token validation error:', error);
            return false;
        }
    },

    getDecodedToken: (): DecodedToken | null => {
        const token = tokenUtils.getToken();
        
        if (!token) return null;
        
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );

            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Token decoding error:', error);
            return null;
        }
    },

    getUserId: (): string | null => {
        const decoded = tokenUtils.getDecodedToken();
        return decoded?.userId || null;
    },

    getEmail: (): string | null => {
        const decoded = tokenUtils.getDecodedToken();
        return decoded?.email || null;
    }
};

