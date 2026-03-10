"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import { CheckoutButton } from '@/components/CheckoutButton'

export function PricingSection() {
    const [isYearly, setIsYearly] = useState(false)

    // Pricing Logic
    // Basic: £4.99/mo -> £53.99/yr (10% off)
    // Elite: £24.99/mo -> £254.99/yr (15% off)
    const pricing = {
        basic: {
            monthly: { amount: 499, display: "4.99" },
            yearly: { amount: 5399, display: "4.50" }, // 53.99 / 12 = 4.499
        },
        elite: {
            monthly: { amount: 2499, display: "24.99" },
            yearly: { amount: 25499, display: "21.25" }, // 254.99 / 12 = 21.249
        }
    }

    return (
        <section className="py-32 bg-background relative overflow-hidden" id="pricing">
            <div className="container px-4 mx-auto max-w-6xl relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight text-foreground">Invest in Excellence. <br />Subsidize the Future.</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium mb-10">Choose your tier. Every Elite subscription funds two Foundry Scholarships for disadvantaged students.</p>

                    {/* Pricing Toggle */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <span className={`text-sm font-bold ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className="relative w-14 h-7 bg-slate-200 dark:bg-slate-800 rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            <div className={`w-5 h-5 bg-primary rounded-full shadow-md transform transition-transform duration-200 ${isYearly ? 'translate-x-7' : 'translate-x-0'}`} />
                        </button>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>Yearly</span>
                            <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-green-200 dark:border-green-800">
                                Save up to 15%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Open Tier */}
                    <Card className="flex flex-col relative border-2 border-slate-100 dark:border-slate-800 shadow-md rounded-[2.5rem] bg-white dark:bg-card">
                        <CardHeader className="text-center pb-2 pt-10 px-8">
                            <CardTitle className="text-2xl font-bold">LumenForge Open</CardTitle>
                            <div className="text-5xl font-extrabold mt-6">
                                £{isYearly ? pricing.basic.yearly.display : pricing.basic.monthly.display}
                                <span className="text-lg text-muted-foreground font-medium">/mo</span>
                            </div>
                            {isYearly && (
                                <p className="text-xs text-green-600 font-bold mt-2 uppercase tracking-wider">£53.99 billed yearly (Save 10%)</p>
                            )}
                            <p className="text-sm text-primary font-bold mt-3">Free 30-Day Trial</p>
                        </CardHeader>
                        <CardContent className="flex flex-col flex-grow text-center pt-8 px-8 pb-10">
                            <p className="text-muted-foreground mb-8 text-sm leading-relaxed">For casual users looking for high-quality KS2 & GCSE curriculum access.</p>
                            <ul className="space-y-5 mb-10 text-[15px] text-left mx-auto font-medium text-foreground">
                                <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" /> Standard Socratic Mentoring</li>
                                <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" /> Full Curriculum Access</li>
                            </ul>
                            <div className="mt-auto">
                                <Button className="w-full rounded-full py-7 text-md font-bold shadow-sm" variant="outline">Start Free Trial</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Elite Tier */}
                    <Card className="flex flex-col relative border-0 shadow-2xl scale-105 z-20 bg-primary text-primary-foreground rounded-[2.5rem] overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400"></div>
                        <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md text-white border border-white/30 text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                            Most Popular
                        </div>
                        <CardHeader className="text-center pb-2 pt-16 px-8">
                            <CardTitle className="text-2xl font-bold">LumenForge Elite</CardTitle>
                            <div className="text-5xl font-extrabold mt-6">
                                £{isYearly ? pricing.elite.yearly.display : pricing.elite.monthly.display}
                                <span className="text-lg text-primary-foreground/70 font-medium">/mo</span>
                            </div>
                            {isYearly && (
                                <p className="text-xs text-amber-300 font-bold mt-2 uppercase tracking-wider">£254.99 billed yearly (Save 15%)</p>
                            )}
                            <p className="text-sm text-amber-300 mt-3 font-bold uppercase tracking-wider">Private / High-performers</p>
                        </CardHeader>
                        <CardContent className="flex flex-col flex-grow text-center pt-8 px-8 pb-10">
                            <p className="text-primary-foreground/90 mb-8 text-sm leading-relaxed">Fully unlocks premium teaching strategies designed to build exceptional confidence and exam technique.</p>
                            <ul className="space-y-5 mb-10 text-[15px] text-left mx-auto font-medium">
                                <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-amber-300 shrink-0 mt-0.5" /> <strong>Disruptor Mode</strong> (Challenges & Alternate Methods)</li>
                                <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-amber-300 shrink-0 mt-0.5" /> <strong>Active Affirmations</strong> (Mantra Entry Lock UI)</li>
                                <li className="flex items-start gap-3"><div className="bg-amber-100 p-0.5 rounded-full"><CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" /></div> <strong>Funds 2 Foundry Scholars</strong></li>
                            </ul>
                            <div className="mt-auto">
                                <CheckoutButton
                                    tier="elite"
                                    priceAmount={isYearly ? pricing.elite.yearly.amount : pricing.elite.monthly.amount}
                                    className="w-full rounded-full py-7 text-md font-bold bg-white text-primary hover:bg-slate-100 shadow-xl hover:-translate-y-1 transition-all"
                                >
                                    Upgrade to Elite
                                </CheckoutButton>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Scholar Tier */}
                    <Card className="flex flex-col relative border-2 border-slate-100 dark:border-slate-800 shadow-md rounded-[2.5rem] bg-slate-50 dark:bg-muted/10">
                        <CardHeader className="text-center pb-2 pt-10 px-8">
                            <CardTitle className="text-2xl font-bold">Foundry Scholar</CardTitle>
                            <div className="text-5xl font-extrabold mt-6">£0<span className="text-lg text-muted-foreground font-medium">/mo</span></div>
                            <p className="text-sm text-muted-foreground mt-3 font-bold uppercase tracking-wider">Disadvantaged Students</p>
                        </CardHeader>
                        <CardContent className="flex flex-col flex-grow text-center pt-8 px-8 pb-10">
                            <p className="text-muted-foreground mb-8 text-sm leading-relaxed">Full Elite access subsidized by our premium members and government tender.</p>
                            <ul className="space-y-5 mb-10 text-[15px] text-left mx-auto font-medium text-foreground">
                                <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" /> Full Elite Mentorship</li>
                                <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" /> Granted via School Token</li>
                            </ul>
                            <div className="mt-auto">
                                <Link href="/scholars" className="w-full">
                                    <Button className="w-full rounded-full py-7 text-md font-bold bg-white dark:bg-card border-slate-200 shadow-sm" variant="outline">Redeem Token</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
