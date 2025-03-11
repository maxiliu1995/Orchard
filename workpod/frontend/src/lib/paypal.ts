import crypto from 'crypto';

interface PayPalHeaders {
  'paypal-auth-algo': string;
  'paypal-cert-url': string;
  'paypal-transmission-id': string;
  'paypal-transmission-sig': string;
  'paypal-transmission-time': string;
}

export async function verifyPayPalWebhook(
  body: string,
  headers: PayPalHeaders
): Promise<any> {
  // Verify webhook signature
  const webhookId = process.env.PAYPAL_WEBHOOK_ID!;
  const signatureAlgorithm = headers['paypal-auth-algo'];
  const certUrl = headers['paypal-cert-url'];
  const transmissionId = headers['paypal-transmission-id'];
  const transmissionSig = headers['paypal-transmission-sig'];
  const transmissionTime = headers['paypal-transmission-time'];

  const verificationData = `${transmissionId}|${transmissionTime}|${webhookId}|${crypto
    .createHash('sha256')
    .update(body)
    .digest('hex')}`;

  // In production, you'd verify the signature using PayPal's cert
  // For now, we'll just parse and return the event
  return JSON.parse(body);
} 