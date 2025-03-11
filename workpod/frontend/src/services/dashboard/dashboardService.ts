// src/services/dashboard/dashboardService.ts

import { apiClient } from '@/lib/api/apiClient';
import { API_ENDPOINTS } from '@/lib/api/config';

export const dashboardService = {
    async getDashboardData() {
        return await apiClient.get(API_ENDPOINTS.DASHBOARD.OVERVIEW);
    },

    async getUserStats() {
        return await apiClient.get(API_ENDPOINTS.DASHBOARD.STATS);
    },

    async getRecentActivity() {
        return await apiClient.get(API_ENDPOINTS.DASHBOARD.ACTIVITY);
    }
};
