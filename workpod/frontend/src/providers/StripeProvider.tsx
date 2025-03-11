import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const StripeProvider = ({ 
  children,
  clientSecret 
}: { 
  children: React.ReactNode;
  clientSecret: string;
}) => {
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const
    }
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}; 