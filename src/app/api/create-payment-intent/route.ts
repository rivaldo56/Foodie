import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import type { BookingRequest } from '@/types/booking';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const booking: BookingRequest = await req.json();

    // Fetch chef's connected account ID from your database
    // const chef = await getChefById(booking.chefId);
    const chefStripeAccountId = 'acct_dummy'; // Replace with actual DB lookup

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalAmount * 100), // Convert to cents
      currency: 'usd',
      application_fee_amount: Math.round(booking.totalAmount * 0.10 * 100), // 10% platform fee
      transfer_data: {
        destination: chefStripeAccountId,
      },
      metadata: {
        bookingId: 'pending', // Will be updated after booking is created
        chefId: booking.chefId,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Payment intent creation failed:', error);
    return NextResponse.json(
      { message: 'Payment intent creation failed' },
      { status: 500 }
    );
  }
}