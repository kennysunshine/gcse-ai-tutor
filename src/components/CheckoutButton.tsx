"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface CheckoutButtonProps {
    tier: string
    priceAmount: number
    children: React.ReactNode
    className?: string
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}

export function CheckoutButton({ tier, priceAmount, children, className, variant = 'default' }: CheckoutButtonProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleCheckout = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tier,
                    priceAmount,
                    // If user is already on sandbox, return there to see premium unlock
                    successUrl: window.location.pathname.includes('/sandbox')
                        ? `${window.location.origin}/sandbox?success=true`
                        : `${window.location.origin}/dashboard?success=true`
                }),
            })

            if (response.status === 401) {
                // Not logged in, redirect to login
                window.location.href = '/login?redirect=/sandbox'
                return
            }

            const data = await response.json()
            if (data.url) {
                window.location.href = data.url
            } else {
                console.error("No checkout URL returned")
            }
        } catch (error) {
            console.error("Error creating checkout session:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            className={className}
            variant={variant}
            onClick={handleCheckout}
            disabled={isLoading}
        >
            {isLoading ? 'Processing...' : children}
        </Button>
    )
}
