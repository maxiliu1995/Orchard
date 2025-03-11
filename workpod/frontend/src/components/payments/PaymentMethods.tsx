import { useEffect, useState } from 'react';
import { PaymentService } from '@/services/payment';
import { CreditCardIcon } from '@/components/icons/CreditCard';

export const PaymentMethods = () => {
  const [methods, setMethods] = useState<Array<{ id: string; type: string; last4: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    PaymentService.getPaymentMethods()
      .then(setMethods)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading payment methods...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Saved Payment Methods</h3>
      {methods.length === 0 ? (
        <p className="text-gray-500">No saved payment methods</p>
      ) : (
        <div className="space-y-2">
          {methods.map(method => (
            <div key={method.id} className="flex items-center p-3 border rounded-lg">
              <CreditCardIcon className="w-6 h-6 text-gray-400" />
              <div className="ml-3">
                <p className="font-medium">{method.type}</p>
                <p className="text-sm text-gray-500">•••• {method.last4}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 