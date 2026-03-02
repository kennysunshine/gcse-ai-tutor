import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(req: Request) {
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get('Stripe-Signature') as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        console.error('Webhook signature verification failed:', error.message)
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }

    const session = event.data.object as Stripe.Checkout.Session

    if (event.type === 'checkout.session.completed') {
        const userId = session.metadata?.userId

        if (userId && supabaseServiceKey) {
            const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
                auth: { autoRefreshToken: false, persistSession: false }
            })

            const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
                user_metadata: { isPremium: true }
            })

            if (error) {
                console.error('Error updating user premium status:', error)
                return new NextResponse('Error updating user', { status: 500 })
            }
        } else if (!supabaseServiceKey) {
            console.error('SUPABASE_SERVICE_ROLE_KEY is missing. Cannot upgrade user.')
        }
    }

    return new NextResponse('Webhook processed successfully', { status: 200 })
}
