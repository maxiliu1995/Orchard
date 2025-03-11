import { rest } from 'msw';

export const handlers = [
  rest.post('/auth/register', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: '1',
        email: 'test@example.com'
      })
    );
  }),

  rest.post('/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        token: 'fake-token',
        user: { id: '1', email: 'test@example.com' }
      })
    );
  }),

  rest.get('/api/user/notifications', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: '1',
          message: 'Your booking is confirmed',
          read: false,
          createdAt: new Date().toISOString()
        }
      ])
    );
  }),

  rest.post('/api/payments/webhook', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ received: true })
    );
  }),

  rest.get('/api/user/bookings/history', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: '1',
          podId: '123',
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          status: 'completed'
        }
      ])
    );
  })
]; 