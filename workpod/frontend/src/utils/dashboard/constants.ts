// src/utils/dashboard/constants.ts

export const DASHBOARD_CONSTANTS = {
    REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutes
    DATE_RANGES: {
        TODAY: 'today',
        WEEK: 'week',
        MONTH: 'month',
        QUARTER: 'quarter',
        YEAR: 'year',
        CUSTOM: 'custom'
    },
    CHART_COLORS: {
        primary: '#4F46E5',
        secondary: '#10B981',
        tertiary: '#F59E0B',
        danger: '#EF4444',
        gray: '#9CA3AF'
    },
    STATUS_COLORS: {
        active: '#10B981',
        pending: '#F59E0B',
        inactive: '#EF4444'
    },
    SIDEBAR_WIDTH: {
        expanded: 256,
        collapsed: 64
    }
};

export const NAVIGATION_ITEMS = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        path: '/dashboard',
        icon: 'home',
        permissions: ['user', 'admin']
    },
    {
        id: 'projects',
        title: 'Projects',
        path: '/dashboard/projects',
        icon: 'folder',
        permissions: ['user', 'admin']
    },
    {
        id: 'tasks',
        title: 'Tasks',
        path: '/dashboard/tasks',
        icon: 'tasks',
        permissions: ['user', 'admin']
    },
    {
        id: 'team',
        title: 'Team',
        path: '/dashboard/team',
        icon: 'users',
        permissions: ['admin']
    },
    {
        id: 'settings',
        title: 'Settings',
        path: '/dashboard/settings',
        icon: 'cog',
        permissions: ['user', 'admin']
    }
];
