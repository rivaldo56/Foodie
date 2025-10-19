import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { accountId } = await req.json();

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/payments`,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/payments`,
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error('Account link creation failed:', error);
    return NextResponse.json(
      { message: 'Account link creation failed' },
      { status: 500 }
    );
  }
}