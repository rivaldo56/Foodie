import { loadStripe } from '@stripe/stripe-js';
import type { BookingRequest } from '@/types/booking';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export async function createPaymentIntent(booking: BookingRequest) {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(booking),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  } catch (error) {
    console.error('Payment intent creation failed:', error);
    throw error;
  }
}

export async function processPayment(clientSecret: string) {
  const stripe = await stripePromise;
  if (!stripe) throw new Error('Stripe failed to initialize');

  const { error: paymentError } = await stripe.confirmCardPayment(clientSecret);
  if (paymentError) {
    throw new Error(paymentError.message);
  }
}

// For chef payouts
export async function createConnectedAccount() {
  try {
    const response = await fetch('/api/create-connected-account', {
      method: 'POST',
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  } catch (error) {
    console.error('Connected account creation failed:', error);
    throw error;
  }
}

export async function getAccountLink(accountId: string) {
  try {
    const response = await fetch('/api/create-account-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accountId }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.url;
  } catch (error) {
    console.error('Account link creation failed:', error);
    throw error;
  }
}