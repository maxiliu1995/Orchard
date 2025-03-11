import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyPayPalWebhook } from '@/lib/paypal';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const paypalHeaders = {
      'paypal-auth-algo': headers().get('paypal-auth-algo')!,
      'paypal-cert-url': headers().get('paypal-cert-url')!,
      'paypal-transmission-id': headers().get('paypal-transmission-id')!,
      'paypal-transmission-sig': headers().get('paypal-transmission-sig')!,
      'paypal-transmission-time': headers().get('paypal-transmission-time')!,
    };

    const event = await verifyPayPalWebhook(body, paypalHeaders);

    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        await handlePaymentSuccess(event.resource);
        break;
      case 'PAYMENT.CAPTURE.DENIED':
        await handlePaymentFailure(event.resource);
        break;
      case 'PAYMENT.CAPTURE.REFUNDED':
        await handleRefund(event.resource);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('PayPal webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}

async function handlePaymentSuccess(payment: any) {
  await prisma.booking.update({
    where: { paypalOrderId: payment.id },
    data: { status: 'CONFIRMED' }
  });
}

async function handlePaymentFailure(payment: any) {
  await prisma.booking.update({
    where: { paypalOrderId: payment.id },
    data: { status: 'FAILED' }
  });
}

async function handleRefund(refund: any) {
  await prisma.transaction.update({
    where: { paypalOrderId: refund.payment_id },
    data: { status: 'refunded' }
  });
} 