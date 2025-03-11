import { http, HttpResponse } from 'msw';
import type { PaymentResponse } from '@/modules/payments/types';

const mockPaymentResponse: PaymentResponse = {
  id: 'test_payment_id',
  status: 'succeeded'
};

export const handlers = [
  http.post('/api/payments/stripe', () => {
    return HttpResponse.json(mockPaymentResponse);
  }),

  http.post('/api/payments/paypal', () => {
    return HttpResponse.json(mockPaymentResponse);
  }),

  http.get('/api/pods/:podId/availability', ({ params }) => {
    const { podId } = params;
    return HttpResponse.json({
      isAvailable: podId === 'available-pod'
    });
  }),

  http.post('/api/bookings', () => {
    return HttpResponse.json({
      id: 'test-booking-id',
      status: 'PENDING'
    });
  })
]; 