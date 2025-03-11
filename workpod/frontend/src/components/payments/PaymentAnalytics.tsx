'use client';

import { useGetPaymentAnalyticsQuery } from '@/store/api/payments';
import { formatCurrency } from '@/utils/format';

export function PaymentAnalytics() {
  const { data, isLoading } = useGetPaymentAnalyticsQuery();

  if (isLoading) return <div>Loading analytics...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Payment Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Monthly Revenue</h3>
          <p className="mt-2 text-3xl font-bold">
            {formatCurrency(data?.monthlyRevenue ?? 0, 'USD')}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            vs {formatCurrency(data?.lastMonthRevenue ?? 0, 'USD')} last month
          </p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Subscriptions</h3>
          <p className="mt-2 text-3xl font-bold">{data?.activeSubscriptions ?? 0}</p>
          <div className="mt-1 text-sm">
            <span className="text-green-500">+{data?.newSubscriptions ?? 0} new</span>
            <span className="mx-1">•</span>
            <span className="text-red-500">-{data?.cancelledSubscriptions ?? 0} cancelled</span>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Payment Success Rate</h3>
          <p className="mt-2 text-3xl font-bold">
            {((data?.successRate ?? 0) * 100).toFixed(1)}%
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {data?.failedPayments ?? 0} failed payments this month
          </p>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Revenue by Plan</h3>
        <div className="space-y-4">
          {data?.revenueByPlan?.map(plan => (
            <div key={plan.id} className="flex items-center">
              <div className="flex-1">
                <p className="font-medium">{plan.name}</p>
                <p className="text-sm text-gray-500">
                  {plan.subscribers} subscribers
                </p>
              </div>
              <p className="font-bold">
                {formatCurrency(plan.revenue, 'USD')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 