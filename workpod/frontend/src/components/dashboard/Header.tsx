// src/components/dashboard/Header.tsx

'use client';

import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Dropdown, DropdownItem, DropdownSeparator, DropdownLabel } from '@/components/ui/Dropdown';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useRouter } from 'next/navigation';

interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [notificationCount] = useState(3); // Example notification count

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/auth/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left side - Menu button & Search */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onMenuClick}
                            className="md:hidden"
                        >
                            <i className="fas fa-bars" />
                        </Button>

                        <div className="hidden md:flex relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <i className="fas fa-search absolute left-3 top-2.5 text-gray-400" />
                        </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex items-center gap-2">
                        {/* Create Button */}
                        <Button
                            variant="primary"
                            size="sm"
                            className="hidden sm:flex"
                            leftIcon={<i className="fas fa-plus" />}
                        >
                            Create
                        </Button>

                        {/* Notifications */}
                        <Dropdown
                            trigger={
                                <Button variant="ghost" size="sm" className="relative">
                                    <i className="fas fa-bell text-gray-600" />
                                    {notificationCount > 0 && (
                                        <Badge
                                            variant="danger"
                                            size="sm"
                                            className="absolute -top-1 -right-1"
                                        >
                                            {notificationCount}
                                        </Badge>
                                    )}
                                </Button>
                            }
                            align="end"
                        >
                            <DropdownLabel>Notifications</DropdownLabel>
                            <DropdownItem>
                                <div className="flex items-center gap-3">
                                    <Badge variant="success" withDot>New message</Badge>
                                    <span className="text-xs text-gray-500">2m ago</span>
                                </div>
                            </DropdownItem>
                            <DropdownSeparator />
                            <DropdownItem>
                                View all notifications
                            </DropdownItem>
                        </Dropdown>

                        {/* User Menu */}
                        <Dropdown
                            trigger={
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <Avatar
                                        src={user?.avatar}
                                        alt={user?.fullName || ''}
                                        size="sm"
                                        status="online"
                                    />
                                    <span className="hidden md:inline-block">
                                        {user?.fullName}
                                    </span>
                                    <i className="fas fa-chevron-down text-gray-400" />
                                </Button>
                            }
                            align="end"
                        >
                            <div className="px-2 py-1.5">
                                <p className="text-sm font-medium text-gray-900">
                                    {user?.fullName}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {user?.email}
                                </p>
                            </div>
                            <DropdownSeparator />
                            <DropdownItem
                                icon={<i className="fas fa-user" />}
                                onClick={() => router.push('/dashboard/profile')}
                            >
                                Profile
                            </DropdownItem>
                            <DropdownItem
                                icon={<i className="fas fa-cog" />}
                                onClick={() => router.push('/dashboard/settings')}
                            >
                                Settings
                            </DropdownItem>
                            <DropdownSeparator />
                            <DropdownItem
                                icon={<i className="fas fa-sign-out-alt" />}
                                onClick={handleLogout}
                                destructive
                            >
                                Logout
                            </DropdownItem>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </header>
    );
}
