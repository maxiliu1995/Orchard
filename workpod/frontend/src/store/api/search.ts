import { api } from '../api';
import { Pod } from '@/types/api.types';

export interface SearchFilters {
  status?: string[];
  priceRange?: { min: number; max: number };
  distance?: number;
  availability?: { from: string; to: string };
}

export const searchApi = api.injectEndpoints({
  endpoints: (builder) => ({
    searchPods: builder.query<
      Pod[],
      { location: { lat: number; lng: number }; filters?: SearchFilters }
    >({
      query: ({ location, filters }) => ({
        url: '/search/pods',
        params: {
          lat: location.lat,
          lng: location.lng,
          ...filters,
        },
      }),
      providesTags: ['Pod'],
    }),

    getNearbyPods: builder.query<
      Pod[],
      { lat: number; lng: number; radius: number }
    >({
      query: (params) => ({
        url: '/search/nearby',
        params,
      }),
    }),
  }),
});

export const {
  useSearchPodsQuery,
  useGetNearbyPodsQuery,
} = searchApi; 