import { api } from '../api';
import type { PaymentMethod, Transaction, Invoice } from '@/types/payment.types';

interface PaymentAnalytics {
  monthlyRevenue: number;
  lastMonthRevenue: number;
  activeSubscriptions: number;
  newSubscriptions: number;
  cancelledSubscriptions: number;
  successRate: number;
  failedPayments: number;
  revenueByPlan: Array<{
    id: string;
    name: string;
    subscribers: number;
    revenue: number;
  }>;
}

export const paymentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentMethods: builder.query<PaymentMethod[], void>({
      query: () => '/payments/methods',
    }),

    addPaymentMethod: builder.mutation<PaymentMethod, {
      paymentMethodId: string;
      type: 'card' | 'paypal';
      email?: string;
    }>({
      query: (data) => ({
        url: '/payments/methods',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PaymentMethods'],
    }),

    removePaymentMethod: builder.mutation<void, string>({
      query: (id) => ({
        url: `/payments/methods/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PaymentMethods'],
    }),

    setDefaultPaymentMethod: builder.mutation<void, string>({
      query: (id) => ({
        url: `/payments/methods/${id}/default`,
        method: 'POST',
      }),
      invalidatesTags: ['PaymentMethods'],
    }),

    getTransactions: builder.query<Transaction[], void>({
      query: () => '/payments/transactions',
    }),

    getInvoices: builder.query<Invoice[], void>({
      query: () => '/payments/invoices',
    }),

    createPaymentIntent: builder.mutation<{ clientSecret: string }, { amount: number; currency: string }>({
      query: (data) => ({
        url: '/payments/intent',
        method: 'POST',
        body: data,
      }),
    }),

    createSubscription: builder.mutation<
      { subscriptionId: string },
      { planId: string }
    >({
      query: (data) => ({
        url: '/payments/subscriptions',
        method: 'POST',
        body: data,
      }),
    }),

    cancelSubscription: builder.mutation<void, void>({
      query: () => ({
        url: '/payments/subscriptions/cancel',
        method: 'POST',
      }),
    }),

    getPaymentAnalytics: builder.query<PaymentAnalytics, void>({
      query: () => '/payments/analytics',
      providesTags: ['PaymentAnalytics']
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPaymentMethodsQuery,
  useAddPaymentMethodMutation,
  useRemovePaymentMethodMutation,
  useSetDefaultPaymentMethodMutation,
  useGetTransactionsQuery,
  useGetInvoicesQuery,
  useCreatePaymentIntentMutation,
  useCreateSubscriptionMutation,
  useCancelSubscriptionMutation,
  useGetPaymentAnalyticsQuery,
} = paymentsApi; 