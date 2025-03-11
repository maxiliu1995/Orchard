// src/contexts/auth/AuthContext.tsx

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth/authService';
import { tokenUtils } from '@/utils/auth/tokenUtils';

interface User {
    id: string;
    email: string;
    fullName: string;
    avatar?: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string, remember?: boolean) => Promise<void>;
    register: (fullName: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
    initialUser?: User;
    skipAuthCheck?: boolean;
}

export function AuthProvider({ children, initialUser, skipAuthCheck }: AuthProviderProps) {
    const router = typeof window !== 'undefined' ? useRouter() : null;
    const [user, setUser] = useState<User | null>(initialUser || null);
    const [isAuthenticated, setIsAuthenticated] = useState(skipAuthCheck ? true : false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (skipAuthCheck) {
            setIsLoading(false);
            return;
        }
        checkAuth();
    }, [skipAuthCheck]);

    const checkAuth = async () => {
        try {
            if (tokenUtils.isAuthenticated()) {
                const userData = await authService.getCurrentUser();
                setUser(userData);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string, remember: boolean = false) => {
        setIsLoading(true);
        try {
            const response = await authService.login({ email, password, remember });
            setUser(response.user);
            router?.push('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (fullName: string, email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await authService.register({ fullName, email, password });
            setUser(response.user);
            router?.push('/dashboard');
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await authService.logout();
            setUser(null);
            router?.push('/auth/login');
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfile = async (data: Partial<User>) => {
        setIsLoading(true);
        try {
            const updatedUser = await authService.updateProfile(data);
            setUser(updatedUser);
        } catch (error) {
            console.error('Profile update failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = useCallback(() => {
        router?.push('/auth/login');
    }, [router]);

    const value = {
        user,
        isAuthenticated: skipAuthCheck ? true : !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}


