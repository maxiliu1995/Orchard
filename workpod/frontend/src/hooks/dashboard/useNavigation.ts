// src/hooks/dashboard/useNavigation.ts

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MenuItem } from '@/types/dashboard';
import { useUserStore } from '@/store/user/userStore';

// Navigation items configuration
const navigationItems: MenuItem[] = [
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

export const useNavigation = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { profile } = useUserStore();

    // Filter navigation items based on user permissions
    const allowedNavItems = useMemo(() => {
        if (!profile) return [];
        
        return navigationItems.filter(item => {
            if (!item.permissions) return true;
            return item.permissions.includes(profile.role);
        });
    }, [profile]);

    // Check if a path is active
    const isActivePath = useCallback((path: string) => {
        if (path === '/dashboard' && pathname === '/dashboard') {
            return true;
        }
        return pathname.startsWith(path) && path !== '/dashboard';
    }, [pathname]);

    // Navigate to a path
    const navigateTo = useCallback((path: string) => {
        router.push(path);
    }, [router]);

    return {
        navigationItems: allowedNavItems,
        currentPath: pathname,
        isActivePath,
        navigateTo
    };
};
