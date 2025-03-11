// src/utils/dashboard/helpers.ts

import { DashboardStats, MetricData, DateRange } from '@/types/dashboard';
import { DASHBOARD_CONSTANTS } from './constants';

export const dashboardHelpers = {
    formatNumber(value: number): string {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
        }
        if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}K`;
        }
        return value.toString();
    },

    formatDate(date: string | Date): string {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    formatTime(date: string | Date): string {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    getDateRange(range: string): DateRange {
        const now = new Date();
        const startDate = new Date();

        switch (range) {
            case DASHBOARD_CONSTANTS.DATE_RANGES.TODAY:
                startDate.setHours(0, 0, 0, 0);
                break;
            case DASHBOARD_CONSTANTS.DATE_RANGES.WEEK:
                startDate.setDate(now.getDate() - 7);
                break;
            case DASHBOARD_CONSTANTS.DATE_RANGES.MONTH:
                startDate.setMonth(now.getMonth() - 1);
                break;
            case DASHBOARD_CONSTANTS.DATE_RANGES.QUARTER:
                startDate.setMonth(now.getMonth() - 3);
                break;
            case DASHBOARD_CONSTANTS.DATE_RANGES.YEAR:
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                startDate.setDate(now.getDate() - 7); // Default to week
        }

        return {
            startDate,
            endDate: now
        };
    },

    calculateGrowth(current: number, previous: number): {
        percentage: number;
        isPositive: boolean;
    } {
        if (previous === 0) return { percentage: 100, isPositive: true };
        const growth = ((current - previous) / previous) * 100;
        return {
            percentage: Math.abs(Math.round(growth)),
            isPositive: growth >= 0
        };
    },

    aggregateMetrics(data: MetricData[], dateRange: DateRange): MetricData[] {
        return data.filter(item => {
            const date = new Date(item.date);
            return date >= dateRange.startDate && date <= dateRange.endDate;
        });
    },

    getStatusColor(status: string): string {
        return DASHBOARD_CONSTANTS.STATUS_COLORS[status as keyof typeof DASHBOARD_CONSTANTS.STATUS_COLORS] 
            || DASHBOARD_CONSTANTS.STATUS_COLORS.inactive;
    },

    calculateCompletionRate(stats: DashboardStats): number {
        if (stats.totalProjects === 0) return 0;
        return Math.round((stats.completedProjects / stats.totalProjects) * 100);
    }
};
