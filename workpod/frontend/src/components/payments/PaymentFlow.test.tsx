import { render, screen, waitFor } from '@testing-library/react';
import { PaymentFlow } from '../PaymentFlow';
import { TestProviders } from '@/__tests__/providers';

const mockReservation = {
  id: 'test-res',
  podId: 'test-pod',
  userId: 'test-user',
  startTime: new Date().toISOString(),
  status: 'Active' as const
};

describe('PaymentFlow', () => {
  const renderComponent = () => 
    render(
      <PaymentFlow 
        reservation={mockReservation}
        onPaymentCompleted={jest.fn()}
        onPaymentFailed={jest.fn()}
      />,
      { wrapper: TestProviders }
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', async () => {
    renderComponent();
    await waitFor(() => {
      // First check for loading state
      expect(screen.getByRole('status')).toBeInTheDocument();
      // Then check for payment flow container
      const paymentFlow = screen.getByTestId('payment-flow');
      expect(paymentFlow).toBeInTheDocument();
    });
  });
}); 