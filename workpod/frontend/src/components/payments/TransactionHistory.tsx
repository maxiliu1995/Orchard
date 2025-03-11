'use client';

import { useState } from 'react';
import { useGetTransactionsQuery } from '@/store/api/payments';
import { formatCurrency } from '@/utils/format';
import type { Transaction } from '@/types/payment.types';

export function TransactionHistory() {
  const { data: transactions, isLoading } = useGetTransactionsQuery();
  const [filter, setFilter] = useState<'all' | 'completed' | 'failed'>('all');

  const filteredTransactions = transactions?.filter(tx => {
    if (filter === 'all') return true;
    return tx.status === filter;
  });

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      case 'refunded': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return <div>Loading transactions...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Transaction History</h2>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="form-select"
        >
          <option value="all">All Transactions</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="space-y-2">
        {filteredTransactions?.map(tx => (
          <div 
            key={tx.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
          >
            <div>
              <p className="font-medium">
                {tx.metadata.podName} - {tx.metadata.duration} hours
              </p>
              <p className="text-sm text-gray-500">
                {new Date(tx.createdAt).toLocaleDateString()}
              </p>
              <p className={`text-sm ${getStatusColor(tx.status)} capitalize`}>
                {tx.status}
              </p>
            </div>

            <div className="text-right">
              <p className="font-medium">
                {formatCurrency(tx.amount, tx.currency)}
              </p>
              <p className="text-sm text-gray-500">
                {tx.paymentMethod.type === 'card' 
                  ? `${tx.paymentMethod.brand} •••• ${tx.paymentMethod.last4}`
                  : 'PayPal'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 