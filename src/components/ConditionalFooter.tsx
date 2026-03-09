"use client"

import { usePathname } from 'next/navigation'
import { Footer } from './Footer'

export function ConditionalFooter() {
    const pathname = usePathname()

    // Pages that should NOT show the marketing footer (app-like pages)
    const hiddenRoutes = ['/chat', '/dashboard', '/sandbox', '/discovery', '/onboarding']

    // Check if the current pathname starts with any of the hidden routes
    const isHidden = hiddenRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))

    if (isHidden) return null

    return <Footer />
}
