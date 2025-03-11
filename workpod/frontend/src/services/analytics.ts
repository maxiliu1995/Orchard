export interface EventData {
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
}

export const AnalyticsService = {
  trackEvent({ category, action, label, value, metadata }: EventData) {
    // Send to analytics provider (e.g., Google Analytics)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value,
        ...metadata,
      });
    }
  },

  trackPageView(path: string) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
        page_path: path,
      });
    }
  },

  trackError(error: Error, context?: Record<string, any>) {
    this.trackEvent({
      category: 'Error',
      action: error.name,
      label: error.message,
      metadata: context,
    });
  },

  trackBookingFlow(stage: string, metadata?: Record<string, any>) {
    this.trackEvent({
      category: 'Booking',
      action: stage,
      metadata,
    });
  },

  trackPodUsage(podId: string, duration: number) {
    this.trackEvent({
      category: 'Pod',
      action: 'Usage',
      label: podId,
      value: duration,
    });
  },
}; 