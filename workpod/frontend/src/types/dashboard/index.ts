// src/types/dashboard/index.ts

export interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    totalProjects: number;
    completedProjects: number;
    metrics: {
        daily: number;
        weekly: number;
        monthly: number;
    };
}

export interface MetricData {
    date: string;
    value: number;
    label: string;
}

export interface RecentActivity {
    id: string;
    type: ActivityType;
    description: string;
    timestamp: string;
    user: {
        id: string;
        name: string;
        avatar: string;
    };
    metadata?: Record<string, any>;
}

export type ActivityType = 
    | 'PROJECT_CREATED'
    | 'PROJECT_UPDATED'
    | 'PROJECT_DELETED'
    | 'USER_JOINED'
    | 'USER_LEFT'
    | 'COMMENT_ADDED'
    | 'STATUS_CHANGED';

export interface DashboardFilters {
    dateRange: DateRange;
    status: string[];
    type: string[];
}

export interface DateRange {
    startDate: Date;
    endDate: Date;
}

export interface MenuItem {
    id: string;
    title: string;
    path: string;
    icon: string;
    children?: MenuItem[];
    permissions?: string[];
}

export interface DashboardLayout {
    sidebarOpen: boolean;
    theme: 'light' | 'dark' | 'system';
    compactMode: boolean;
}

export interface NotificationItem {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    actionUrl?: string;
}

export interface DashboardUser {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: UserRole;
    status: UserStatus;
    lastActive: string;
}

export type UserRole = 'admin' | 'user' | 'guest';
export type UserStatus = 'active' | 'inactive' | 'pending';

export interface DashboardState {
    stats: DashboardStats | null;
    recentActivity: RecentActivity[];
    notifications: NotificationItem[];
    filters: DashboardFilters;
    layout: DashboardLayout;
    isLoading: boolean;
    error: string | null;
}

export interface DashboardActivity {
    id: string;
    type: string;
    description: string;
    timestamp: string;
    user: {
        name: string;
        avatar: string;
        role: string;
    };
}
