// src/components/dashboard/DashboardLayout.tsx

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Toast } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const { toasts } = useToast();

    useEffect(() => {
        // Check authentication
        if (!isAuthenticated) {
            router.push('/auth/login');
            return;
        }
        setIsLoading(false);
    }, [isAuthenticated, router]);

    // Handle window resize for mobile responsiveness
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <AnimatePresence mode="wait">
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                            className="fixed inset-y-0 left-0 z-50"
                        >
                            <Sidebar onClose={() => setSidebarOpen(false)} />
                        </motion.div>
                        
                        {/* Mobile overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div
                className={cn(
                    'flex flex-col min-h-screen transition-all duration-300 ease-in-out',
                    sidebarOpen ? 'lg:pl-72' : 'lg:pl-0'
                )}
            >
                {/* Header */}
                <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

                {/* Main Content Area */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={router.asPath}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>

                {/* Footer */}
                <footer className="mt-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="border-t border-gray-200 py-4">
                            <p className="text-center text-sm text-gray-500">
                                © {new Date().getFullYear()} WorkPod. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Toast Notifications */}
            <div className="fixed bottom-4 right-4 z-50">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <Toast
                            key={toast.id}
                            {...toast}
                            onClose={() => toast.onClose?.(toast.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
