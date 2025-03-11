import { StripeProvider } from '@/components/payments/StripeProvider';
import { PayPalProvider } from '@/components/payments/PayPalProvider';
import { AddPaymentMethodForm } from '@/components/payments/AddPaymentMethodForm';
import { PaymentMethodList } from '@/components/payments/PaymentMethodList';
import { TransactionHistory } from '@/components/payments/TransactionHistory';
import { InvoiceList } from '@/components/payments/InvoiceList';
import { PaymentAnalytics } from '@/components/payments/PaymentAnalytics';

export default function PaymentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Payments & Billing</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="mb-8">
            <PaymentAnalytics />
          </div>
          <PayPalProvider>
            <StripeProvider>
              <AddPaymentMethodForm />
            </StripeProvider>
          </PayPalProvider>
          <div className="mt-8">
            <PaymentMethodList />
          </div>
        </div>
        
        <div className="space-y-8">
          <TransactionHistory />
          <InvoiceList />
        </div>
      </div>
    </div>
  );
}