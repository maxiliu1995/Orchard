import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  await prisma.booking.update({
    where: { paymentIntentId: paymentIntent.id },
    data: { status: 'CONFIRMED' }
  });
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  await prisma.booking.update({
    where: { paymentIntentId: paymentIntent.id },
    data: { status: 'FAILED' }
  });
}

async function handlePaymentMethodAttached(paymentMethod: Stripe.PaymentMethod) {
  await prisma.paymentMethod.create({
    data: {
      id: paymentMethod.id,
      userId: paymentMethod.customer as string,
      type: paymentMethod.type,
      // Add other relevant fields
    }
  });
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  await prisma.subscription.create({
    data: {
      id: subscription.id,
      userId: subscription.customer as string,
      planId: subscription.items.data[0].price.id,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      status: 'cancelled',
      cancelledAt: new Date(),
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature')!;
    
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;
      case 'payment_method.attached':
        await handlePaymentMethodAttached(event.data.object);
        break;
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionCancelled(event.data.object);
        break;
      // Add more event handlers as needed
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
} 