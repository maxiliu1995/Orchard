import { apiClient } from '@/lib/api/client';
import { debugLog, LogCategory } from '@/utils/debug';

interface PodAvailabilityResponse {
  isAvailable: boolean;
}

export const podService = {
  async checkAvailability(podId: string, startTime: Date, endTime: Date): Promise<PodAvailabilityResponse> {
    try {
      const response = await apiClient.get<PodAvailabilityResponse>(`/pods/${podId}/availability`, {
        params: {
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString()
        }
      });

      debugLog('pod' as LogCategory, 'Availability check response', response.data);
      return response.data;
    } catch (error) {
      debugLog('pod' as LogCategory, 'Error checking availability', error);
      throw error;
    }
  }
}; 