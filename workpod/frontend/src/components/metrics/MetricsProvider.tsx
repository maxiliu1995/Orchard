import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AnalyticsService } from '@/services/analytics';

export const MetricsProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      AnalyticsService.trackPageView(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  useEffect(() => {
    // Track initial page load
    AnalyticsService.trackPageView(window.location.pathname);
  }, []);

  return <>{children}</>;
}; 