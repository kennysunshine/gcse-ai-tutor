import { NextResponse } from 'next/server';

/**
 * Scholar's Redirect: Generate a Whop Checkout Link
 */
export async function POST() {
  const planId = process.env.WHOP_PLAN_ID;

  if (!planId) {
    console.error('WHOP_PLAN_ID is missing in environment variables.');
    return NextResponse.json(
      { error: 'Checkout is currently unavailable.' }, 
      { status: 500 }
    );
  }

  // Construct the direct Whop Checkout URL
  const checkoutUrl = `https://whop.com/checkout/${planId}`;

  // Return the URL for the client-side redirect
  return NextResponse.json({ url: checkoutUrl });
}
