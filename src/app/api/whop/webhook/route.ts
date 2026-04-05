import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase Service Role (Admin access for updating profiles)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

/**
 * Whop Membership Synchronization Webhook
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const event = body.action; // Whop event type
    const membership = body.data;

    if (!membership || !membership.email) {
       return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
    }

    const email = membership.email;
    let isMasteryScholar = false;

    // Handle membership status transitions (Harmonized for V1 and V2)
    switch (event) {
      case 'membership.went_active':
      case 'membership_activated':
        isMasteryScholar = true;
        console.log(`[Whop Webhook] Membership ACTIVE: ${email}`);
        break;
      case 'membership.went_inactive':
      case 'membership_deactivated':
        isMasteryScholar = false;
        console.log(`[Whop Webhook] Membership INACTIVE: ${email}`);
        break;
      default:
        console.log(`[Whop Webhook] Ignored event: ${event}`);
        return NextResponse.json({ received: true });
    }

    // Sync with Supabase profiles
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ is_mastery_scholar: isMasteryScholar })
      .eq('email', email);

    if (error) {
       console.error('[Whop Webhook] Supabase Sync Error:', error);
       return NextResponse.json({ error: 'Failed to sync with database' }, { status: 500 });
    }

    return NextResponse.json({ success: true, synced: email });
  } catch (err) {
    console.error('[Whop Webhook] Unexpected Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
