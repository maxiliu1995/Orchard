// src/app/dashboard/page.tsx

'use client';

import { useDashboard } from '@/hooks/dashboard/useDashboard';
import { dashboardHelpers } from '@/utils/dashboard/helpers';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';
import { useGetUserBookingsQuery } from '@/store/api/bookings';
import { BookingSummary } from '@/components/bookings/BookingSummary';
import { NotificationList } from '@/components/notifications/NotificationList';

export default function DashboardPage() {
    const { stats, recentActivity, isLoading } = useDashboard();
    const { data: bookings } = useGetUserBookingsQuery();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[600px]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Here's what's happening in your workspace today.
                    </p>
                </div>
                <Button variant="primary" size="lg">
                    <i className="fas fa-plus mr-2" />
                    New Project
                </Button>
            </div>

            {/* Stats Grid */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Users"
                        value={dashboardHelpers.formatNumber(stats.totalUsers)}
                        icon="users"
                        trend={{
                            value: "+12.5%",
                            isPositive: true
                        }}
                    />
                    <StatCard
                        title="Active Users"
                        value={dashboardHelpers.formatNumber(stats.activeUsers)}
                        icon="user-check"
                        trend={{
                            value: "+5.2%",
                            isPositive: true
                        }}
                    />
                    <StatCard
                        title="Total Projects"
                        value={dashboardHelpers.formatNumber(stats.totalProjects)}
                        icon="folder"
                        trend={{
                            value: "-2.4%",
                            isPositive: false
                        }}
                    />
                    <StatCard
                        title="Completion Rate"
                        value={`${dashboardHelpers.calculateCompletionRate(stats)}%`}
                        icon="chart-line"
                        trend={{
                            value: "+8.1%",
                            isPositive: true
                        }}
                    />
                </div>
            )}

            {/* Recent Activity */}
            <Card>
                <div className="px-6 py-5 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Recent Activity
                        </h2>
                        <Button variant="ghost" size="sm">
                            View all
                            <i className="fas fa-arrow-right ml-2" />
                        </Button>
                    </div>
                </div>
                <div className="divide-y divide-gray-100">
                    {recentActivity.map((activity) => (
                        <ActivityItem key={activity.id} activity={activity} />
                    ))}
                </div>
            </Card>

            {/* Bookings Section */}
            <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-4">Your Bookings</h2>
                {isLoading ? (
                    <div>Loading bookings...</div>
                ) : (
                    <div className="space-y-4">
                        {bookings?.map(booking => (
                            <BookingSummary key={booking.id} booking={booking} />
                        ))}
                    </div>
                )}
            </div>

            {/* Notifications Section */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Notifications</h2>
                <NotificationList />
            </div>
        </motion.div>
    );
}

interface StatCardProps {
    title: string;
    value: string;
    icon: string;
    trend: {
        value: string;
        isPositive: boolean;
    };
}

function StatCard({ title, value, icon, trend }: StatCardProps) {
    return (
        <Card className="hover:shadow-lg transition-shadow duration-200">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <i className={`fas fa-${icon} text-primary text-xl`} />
                    </div>
                    <Badge 
                        variant={trend.isPositive ? "success" : "danger"}
                        className="flex items-center"
                    >
                        <i className={`fas fa-arrow-${trend.isPositive ? 'up' : 'down'} mr-1`} />
                        {trend.value}
                    </Badge>
                </div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
        </Card>
    );
}

interface Activity {
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

function ActivityItem({ activity }: { activity: Activity }) {
    return (
        <div className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
            <div className="flex items-start space-x-4">
                <div className="relative">
                    <img
                        src={activity.user.avatar}
                        alt={activity.user.name}
                        className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <span className="absolute -bottom-1 -right-1 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                            {activity.user.name}
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-gray-500 font-normal">{activity.user.role}</span>
                        </p>
                        <time className="text-xs text-gray-500">
                            {dashboardHelpers.formatDate(activity.timestamp)}
                        </time>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                        {activity.description}
                    </p>
                </div>
            </div>
        </div>
    );
}
