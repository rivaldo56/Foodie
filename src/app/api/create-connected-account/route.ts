import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  try {
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
    });

    return NextResponse.json({ accountId: account.id });
  } catch (error) {
    console.error('Connected account creation failed:', error);
    return NextResponse.json(
      { message: 'Connected account creation failed' },
      { status: 500 }
    );
  }
}