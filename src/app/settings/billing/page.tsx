"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { CreditCard, ShieldCheck, Zap, History, ExternalLink, Sparkles } from 'lucide-react'

export default function BillingSettingsPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [isPremium, setIsPremium] = useState(false)
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }
            setUser(user)
            setIsPremium(user.user_metadata?.isPremium === true)
            setLoading(false)
        }
        checkAuth()
    }, [router])

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading billing portal...</div>
    }

    return (
        <div className="container px-4 py-8 mx-auto max-w-2xl space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Billing & Sovereignty</h1>
                <p className="text-muted-foreground">Manage your subscription tier and account standing.</p>
            </div>

            <Card className="border-primary/20 overflow-hidden">
                <div className={`h-2 w-full ${isPremium ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-muted'}`}></div>
                <CardHeader className="flex flex-row items-center justify-between pb-6">
                    <div className="space-y-1">
                        <CardTitle className="text-xl">Current Plan</CardTitle>
                        <CardDescription>Your active membership level on LumenForge.</CardDescription>
                    </div>
                    {isPremium ? (
                        <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 px-4 py-1 text-xs font-bold shadow-sm">
                            SOVEREIGN TIER
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="px-4 py-1 text-xs font-bold">
                            BASIC TIER
                        </Badge>
                    )}
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                        <div className={`p-3 rounded-full ${isPremium ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                            {isPremium ? <ShieldCheck className="h-6 w-6" /> : <Zap className="h-6 w-6" />}
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-bold">{isPremium ? 'LumenForge Sovereign' : 'Standard Access'}</h3>
                            <p className="text-sm text-muted-foreground">
                                {isPremium
                                    ? 'Unlimited AI messaging, Disruptor Mode, and full access to the Elite Discovery engine.'
                                    : 'Limited Socratic guidance. Upgrade to unlock full syllabus mastery and high-performance frameworks.'}
                            </p>
                        </div>
                    </div>

                    {!isPremium && (
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-4">
                            <div className="flex items-center gap-2 text-primary font-bold text-sm">
                                <Sparkles className="h-4 w-4" />
                                Unlock the Elite Advantage
                            </div>
                            <ul className="text-xs space-y-2 text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <span className="text-primary font-bold">✓</span>
                                    <strong>Disruptor Mode:</strong> AI identifies your weak points before you do.
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-primary font-bold">✓</span>
                                    <strong>1-for-2 Impact:</strong> Your subscription funds 2 seats for Foundry Scholars.
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-primary font-bold">✓</span>
                                    <strong>Priority Intelligence:</strong> Zero-Training data policy enforced.
                                </li>
                            </ul>
                            <Button className="w-full bg-gradient-to-r from-primary to-indigo-600 hover:opacity-90 border-0 shadow-lg">
                                Upgrade to Sovereign - £24.99/mo
                            </Button>
                        </div>
                    )}

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            Payment Method
                        </h4>
                        <div className="flex items-center justify-between p-4 rounded-lg border border-dashed border-muted-foreground/30 text-sm text-muted-foreground italic">
                            [Stripe / LemonSqueezy Integration Placeholder]
                            <Button variant="outline" size="sm" disabled className="gap-2">
                                Manage <ExternalLink className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="bg-muted/30 border-t p-4 flex justify-between">
                    <Button variant="link" size="sm" className="h-auto p-0 text-muted-foreground">
                        <History className="mr-2 h-4 w-4" />
                        View Invoicing History
                    </Button>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                        2026 Sovereign Standards
                    </p>
                </CardFooter>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="hover:bg-muted/20 transition-colors cursor-pointer border-dashed">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                        </div>
                        <h4 className="font-bold text-sm">School Funding</h4>
                        <p className="text-xs text-muted-foreground">Applying via your school? Enter your Foundry Scholars token here.</p>
                        <Button variant="outline" size="sm" className="mt-2" onClick={() => router.push('/scholars')}>
                            Redemption Portal
                        </Button>
                    </CardContent>
                </Card>
                <Card className="hover:bg-muted/20 transition-colors cursor-pointer border-dashed">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                        <div className="p-2 bg-slate-100 rounded-full">
                            <Zap className="h-5 w-5 text-slate-500" />
                        </div>
                        <h4 className="font-bold text-sm">Need Help?</h4>
                        <p className="text-xs text-muted-foreground">Contact our support team for billing or curriculum inquiries.</p>
                        <Button variant="outline" size="sm" className="mt-2">
                            Contact Support
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
