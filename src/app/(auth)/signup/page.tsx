
"use client"

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { supabase } from '@/lib/supabase'

export default function SignupPage() {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const [hasScrolledTerms, setHasScrolledTerms] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleTermsScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement;
        // Check if user has scrolled to the bottom (with 5px margin of error)
        if (target.scrollHeight - target.scrollTop <= target.clientHeight + 5) {
            setHasScrolledTerms(true);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!agreedToTerms) {
            setError("You must agree to the Terms of Service to continue.")
            return
        }
        setLoading(true)
        setError(null)

        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        })

        if (signUpError) {
            setError(signUpError.message)
            setLoading(false)
        } else {
            // Automatically sign in or redirect to confirmation page
            // For simplicity, we'll redirect to dashboard, but Supabase might require email confirmation by default.
            // We'll assume email confirmation is OFF for this demo, or user will see a message.
            // Redirect to the new Elite Diagnostic onboarding instead of dashboard
            router.push('/onboarding')
            // Note: In production you really should handle the "check your email" case.
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-muted/30 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                    <CardDescription>Start your GCSE mastery today.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" placeholder="John Doe" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        {/* Click-Wrap Terms of Service */}
                        <div className="space-y-3 pt-2">
                            <Label className="text-xs font-semibold uppercase text-primary tracking-wider">LumenForge Terms of Service (v2.6)</Label>
                            <ScrollArea
                                className="h-32 w-full rounded-md border p-4 text-xs text-muted-foreground bg-background/50"
                                onScrollCapture={handleTermsScroll}
                            >
                                <div className="space-y-2">
                                    <p><strong>1. AI-Specific Disclaimers:</strong> No Grade Guarantee. We use a Socratic "Hint-First" logic. Not a substitute for human teaching.</p>
                                    <p><strong>2. Sovereign Data Standards:</strong> We enforce a strict "Zero-Training" guarantee. 2026 DfE Compliant.</p>
                                    <p><strong>3. Safeguarding Protocol:</strong> Automated escalation to your school's DSL applies for crisis events.</p>
                                    <p><strong>4. Parental Consent:</strong> Active opt-in required for under-18s.</p>
                                    <p className="pt-4 text-center font-semibold italic text-primary animate-pulse">Scroll to bottom to agree &darr;</p>
                                    <div className="h-4"></div> {/* Buffer for scroll detection */}
                                </div>
                            </ScrollArea>

                            <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <Checkbox
                                    id="terms"
                                    checked={agreedToTerms}
                                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                                    disabled={!hasScrolledTerms}
                                />
                                <div className="space-y-1 leading-none">
                                    <Label htmlFor="terms" className={`${!hasScrolledTerms ? 'text-muted-foreground opacity-50' : ''}`}>
                                        I agree to the <Link href="/terms" target="_blank" className="text-primary hover:underline">Terms of Service</Link>
                                    </Label>
                                    <p className="text-[0.8rem] text-muted-foreground">
                                        {!hasScrolledTerms ? 'Please scroll through the terms to enable this checkbox.' : 'You are legally bound by these terms.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {error && <p className="text-sm text-destructive font-medium">{error}</p>}
                        <Button type="submit" className="w-full" disabled={loading || !agreedToTerms}>
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account? <Link href="/login" className="text-primary hover:underline">Log in</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
