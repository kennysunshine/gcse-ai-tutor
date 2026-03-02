
"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import Link from 'next/link'

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent')
        if (!consent) {
            setTimeout(() => setIsVisible(true), 0)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted')
        setIsVisible(false)
    }

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined')
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg z-50 animate-in slide-in-from-bottom duration-500">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground flex-1">
                    <p>
                        We use cookies to enhance your learning experience and analyze our traffic.
                        By continuing to use our site, you consent to our use of cookies.
                        Read our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={handleDecline}>
                        Decline
                    </Button>
                    <Button size="sm" onClick={handleAccept}>
                        Accept Cookies
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 ml-2 md:hidden" onClick={() => setIsVisible(false)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
