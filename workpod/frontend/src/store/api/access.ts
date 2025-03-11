import { api } from '../api';

interface AccessCode {
  id: string;
  code: string;
  bookingId: string;
  podId: string;
  validFrom: string;
  validUntil: string;
  status: 'ACTIVE' | 'USED' | 'EXPIRED' | 'REVOKED';
}

export const accessApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAccessCode: builder.query<AccessCode, string>({
      query: (bookingId) => `/bookings/${bookingId}/access-code`,
      providesTags: ['AccessCode'],
    }),

    validateAccessCode: builder.mutation<
      { valid: boolean; podId?: string },
      { code: string; bookingId: string }
    >({
      query: (data) => ({
        url: '/access/validate',
        method: 'POST',
        body: data,
      }),
    }),

    revokeAccessCode: builder.mutation<void, string>({
      query: (bookingId) => ({
        url: `/bookings/${bookingId}/access-code/revoke`,
        method: 'POST',
      }),
      invalidatesTags: ['AccessCode'],
    }),
  }),
});

export const {
  useGetAccessCodeQuery,
  useValidateAccessCodeMutation,
  useRevokeAccessCodeMutation,
} = accessApi; 