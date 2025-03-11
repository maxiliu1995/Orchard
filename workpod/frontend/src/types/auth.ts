// src/types/auth.ts

export interface LoginCredentials {
    email: string;
    password: string;
    remember?: boolean;
}

export interface RegisterCredentials {
    fullName: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    refreshToken: string;
    user: User;
}

export interface User {
    id: string;
    email: string;
    fullName: string;
    avatar?: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserProfile extends User {
    phoneNumber?: string;
    location?: string;
    bio?: string;
    settings?: UserSettings;
}

export interface UserSettings {
    notifications: {
        email: boolean;
        push: boolean;
        desktop: boolean;
    };
    theme: 'light' | 'dark' | 'system';
    language: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface AuthContextType extends AuthState {
    login: (email: string, password: string, remember?: boolean) => Promise<void>;
    register: (fullName: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
    updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
}

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
    exp: number;
    iat: number;
}

export interface ApiError {
    statusCode: number;
    message: string;
    errors?: string[];
}
