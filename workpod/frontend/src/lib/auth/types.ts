export interface AuthResponse {
    success: boolean;
    token?: string;
    user?: {
        email: string;
        fullName?: string;
    };
    message?: string;
}

export interface TokenValidationResponse {
    isValid: boolean;
    user?: {
        email: string;
        fullName?: string;
    };
}

export interface UserProfile {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    avatar?: string;
    preferences: {
        notifications: boolean;
        newsletter: boolean;
    };
    createdAt: string;
}