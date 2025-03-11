import { useEffect, useCallback } from 'react';
import { AnalyticsService } from '@/services/analytics';

export const useMetrics = () => {
  const trackBookingStart = useCallback((podId: string, price: number) => {
    AnalyticsService.trackBookingFlow('start', { podId, price });
  }, []);

  const trackBookingComplete = useCallback((bookingId: string, amount: number) => {
    AnalyticsService.trackBookingFlow('complete', { bookingId, amount });
  }, []);

  const trackBookingCancel = useCallback((reason?: string) => {
    AnalyticsService.trackBookingFlow('cancel', { reason });
  }, []);

  const trackPodSearch = useCallback((filters: Record<string, any>) => {
    AnalyticsService.trackEvent({
      category: 'Search',
      action: 'PodSearch',
      metadata: filters,
    });
  }, []);

  return {
    trackBookingStart,
    trackBookingComplete,
    trackBookingCancel,
    trackPodSearch,
  };
}; 