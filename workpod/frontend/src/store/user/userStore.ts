// src/store/user/userStore.ts

import { create } from 'zustand';
import { userService } from '@/services/user/userService';
import { UserProfile, UserSettings } from '@/types/auth';

interface UserState {
    profile: UserProfile | null;
    settings: UserSettings | null;
    isLoading: boolean;
    error: string | null;
    fetchProfile: () => Promise<void>;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
    updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
    updateAvatar: (file: File) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
    profile: null,
    settings: null,
    isLoading: false,
    error: null,

    fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
            const profile = await userService.getUserProfile();
            set({ profile, isLoading: false });
        } catch (error) {
            set({ 
                error: error instanceof Error ? error.message : 'Failed to fetch profile',
                isLoading: false 
            });
        }
    },

    updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const updatedProfile = await userService.updateProfile(data);
            set({ profile: updatedProfile, isLoading: false });
        } catch (error) {
            set({ 
                error: error instanceof Error ? error.message : 'Failed to update profile',
                isLoading: false 
            });
        }
    },

    updateSettings: async (settings) => {
        set({ isLoading: true, error: null });
        try {
            const updatedSettings = await userService.updateSettings(settings);
            set({ settings: updatedSettings, isLoading: false });
        } catch (error) {
            set({ 
                error: error instanceof Error ? error.message : 'Failed to update settings',
                isLoading: false 
            });
        }
    },

    updateAvatar: async (file) => {
        set({ isLoading: true, error: null });
        try {
            const { avatarUrl } = await userService.updateAvatar(file);
            set(state => ({
                profile: state.profile ? { ...state.profile, avatar: avatarUrl } : null,
                isLoading: false
            }));
        } catch (error) {
            set({ 
                error: error instanceof Error ? error.message : 'Failed to update avatar',
                isLoading: false 
            });
        }
    }
}));
