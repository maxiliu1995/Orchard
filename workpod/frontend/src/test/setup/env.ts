Object.defineProperty(process.env, 'NEXT_PUBLIC_API_URL', {
  value: 'http://localhost:3000/api',
  configurable: true
});

Object.defineProperty(process.env, 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', {
  value: 'pk_test_123',
  configurable: true
});

Object.defineProperty(process.env, 'NEXT_PUBLIC_PAYPAL_CLIENT_ID', {
  value: 'test_client_id',
  configurable: true
}); 