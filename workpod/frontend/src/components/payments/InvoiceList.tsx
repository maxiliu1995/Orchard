'use client';

import { useGetInvoicesQuery } from '@/store/api/payments';
import { formatCurrency } from '@/utils/format';

export function InvoiceList() {
  const { data: invoices, isLoading } = useGetInvoicesQuery();

  const getStatusBadge = (status: string) => {
    const colors = {
      paid: 'bg-green-100 text-green-800',
      unpaid: 'bg-yellow-100 text-yellow-800',
      void: 'bg-gray-100 text-gray-800',
    };
    return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      colors[status as keyof typeof colors]
    }`;
  };

  if (isLoading) {
    return <div>Loading invoices...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Invoices</h2>

      <div className="space-y-2">
        {invoices?.map(invoice => (
          <div 
            key={invoice.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
          >
            <div>
              <p className="font-medium">Invoice #{invoice.number}</p>
              <p className="text-sm text-gray-500">
                Issued: {new Date(invoice.issuedAt).toLocaleDateString()}
              </p>
              {invoice.paidAt && (
                <p className="text-sm text-gray-500">
                  Paid: {new Date(invoice.paidAt).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="text-right space-y-2">
              <p className="font-medium">
                {formatCurrency(invoice.amount, invoice.currency)}
              </p>
              <span className={getStatusBadge(invoice.status)}>
                {invoice.status}
              </span>
              <a
                href={invoice.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 hover:text-blue-800"
              >
                Download PDF
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 