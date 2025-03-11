// src/services/auth/authService.ts

import axios from 'axios';

interface User {
    id: string;
    email: string;
    fullName: string;
    role: string;
    avatar?: string;
}

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const authService = {
    async login({ email, password, remember }: { email: string; password: string; remember?: boolean }) {
        try {
            const response = await api.post('/users/login', {
                email,
                password,
                remember
            });
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async register({ fullName, email, password }: { fullName: string; email: string; password: string }) {
        try {
            const response = await api.post('/users/signup', {
                fullName,
                email,
                password
            });
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getCurrentUser() {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async logout() {
        try {
            await api.post('/auth/logout');
            localStorage.removeItem('token');
        } catch (error) {
            throw error;
        }
    },

    async updateProfile(data: Partial<User>) {
        try {
            const response = await api.put('/users/profile', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

