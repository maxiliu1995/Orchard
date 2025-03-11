// src/services/user/userService.ts

import { apiClient } from '@/lib/api/apiClient';
import { API_ENDPOINTS } from '@/lib/api/config';
import { UserProfile, UserSettings } from '@/types/auth';

export const userService = {
    async getUserProfile(): Promise<UserProfile> {
        return await apiClient.get(API_ENDPOINTS.USER.PROFILE);
    },

    async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
        return await apiClient.put(API_ENDPOINTS.USER.PROFILE, data);
    },

    async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
        return await apiClient.put(API_ENDPOINTS.USER.SETTINGS, settings);
    },

    async updateAvatar(file: File): Promise<{ avatarUrl: string }> {
        const formData = new FormData();
        formData.append('avatar', file);

        return await apiClient.post(API_ENDPOINTS.USER.AVATAR, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    async changePassword(currentPassword: string, newPassword: string): Promise<void> {
        return await apiClient.post(API_ENDPOINTS.USER.CHANGE_PASSWORD, {
            currentPassword,
            newPassword,
        });
    },

    async deleteAccount(password: string): Promise<void> {
        return await apiClient.delete(API_ENDPOINTS.USER.DELETE_ACCOUNT, {
            body: JSON.stringify({ password }),
        });
    }
};
