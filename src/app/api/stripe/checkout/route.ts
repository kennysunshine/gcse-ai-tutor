import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase-server'

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const { tier, priceAmount, successUrl } = await req.json()

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: successUrl || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/`,
            payment_method_types: ['card'],
            mode: 'subscription',
            billing_address_collection: 'auto',
            customer_email: session.user.email,
            line_items: [
                {
                    price_data: {
                        currency: 'gbp',
                        product_data: {
                            name: 'LumenForge Elite Subscription',
                            description: 'Unlocks the Elite Pedagogical Framework and Institutional Power Structures.',
                        },
                        unit_amount: priceAmount || 2499, // default to £24.99
                        recurring: {
                            interval: 'month',
                        },
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                userId: session.user.id,
                tier: tier || 'elite',
            },
        })

        return NextResponse.json({ url: stripeSession.url })
    } catch (error) {
        console.error('Stripe Checkout Error:', error)
        return new NextResponse('Internal server error', { status: 500 })
    }
}
