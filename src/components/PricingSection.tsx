"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Building2, User, Mail, Sparkles, ShieldCheck } from 'lucide-react'
import { CheckoutButton } from '@/components/CheckoutButton'
import { Badge } from '@/components/ui/badge'

type Market = 'standard' | 'institutional'

export function PricingSection() {
    const [market, setMarket] = useState<Market>('standard')
    const [isAnnual, setIsAnnual] = useState(true)

    const isInstitutional = market === 'institutional'

    // Theme logic - shifts colors for the institutional mode
    const themeClasses = isInstitutional 
        ? "bg-[#0A0F1A] text-white border-amber-900/20" 
        : "bg-background text-foreground border-border"

    const accentColor = isInstitutional ? "text-amber-500" : "text-primary"
    const buttonVariant = isInstitutional ? "secondary" : "default"

    return (
        <section className={`py-32 relative overflow-hidden transition-colors duration-500 ${isInstitutional ? 'bg-[#050810]' : 'bg-background'}`} id="pricing">
            {/* Background elements for Institutional theme */}
            {isInstitutional && (
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-[120px]"></div>
                </div>
            )}

            <div className="container px-4 mx-auto max-w-6xl relative z-10">
                <div className="text-center mb-16">
                    <h2 className={`text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tighter ${isInstitutional ? 'text-white' : 'text-foreground'}`}>
                        {isInstitutional ? "Sovereign Access for Institutions." : "Invest in Excellence. Subsidise the Future."}
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium mb-12">
                        {isInstitutional 
                            ? "Tailored pedagogical AI frameworks for schools, trusts, and educational authorities." 
                            : "Choose your tier. Every Elite subscription funds two Foundry Scholarships for disadvantaged students."}
                    </p>

                    {/* Market Toggle (High Status) */}
                    <div className="inline-flex p-1 bg-muted/50 dark:bg-muted/10 rounded-full border border-border mb-8 shadow-sm">
                        <button
                            onClick={() => setMarket('standard')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${market === 'standard' ? 'bg-white dark:bg-slate-800 shadow-md text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <User className="w-4 h-4" /> Standard Access
                        </button>
                        <button
                            onClick={() => setMarket('institutional')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${market === 'institutional' ? 'bg-amber-500 text-black shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <Building2 className="w-4 h-4" /> Institutional/Sovereign
                        </button>
                    </div>

                    {/* Billing Toggle (Sub-toggle) */}
                    {!isInstitutional && (
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <span className={`text-xs font-bold uppercase tracking-widest ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
                            <button
                                onClick={() => setIsAnnual(!isAnnual)}
                                className="relative w-12 h-6 bg-slate-200 dark:bg-slate-800 rounded-full p-1 transition-colors focus:outline-none"
                            >
                                <div className={`w-4 h-4 bg-primary rounded-full shadow-md transform transition-transform duration-200 ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold uppercase tracking-widest ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Annual</span>
                                <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[9px] font-black rounded-full border-none px-2">
                                    Save ~20%
                                </Badge>
                            </div>
                        </div>
                    )}
                </div>

                <div className={`grid ${isInstitutional ? 'md:grid-cols-3' : 'md:grid-cols-3'} gap-8 items-stretch`}>
                    {market === 'standard' ? (
                        <>
                            {/* Standard: Open Tier */}
                            <Card className="flex flex-col relative border-2 border-slate-100 dark:border-slate-800 shadow-md rounded-[2.5rem] bg-white dark:bg-card hover:shadow-xl transition-shadow">
                                <CardHeader className="text-center pb-2 pt-10 px-8">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-2">LumenForge Open</h3>
                                    <div className="text-5xl font-black mt-4">
                                        £{isAnnual ? "4.00" : "4.99"}
                                        <span className="text-base text-muted-foreground font-medium">/mo</span>
                                    </div>
                                    {isAnnual && (
                                        <p className="text-xs text-green-600 font-bold mt-2 uppercase tracking-wider italic">~£47.90 billed yearly</p>
                                    )}
                                    <div className="mt-4"><Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">30-Day Free Trial</Badge></div>
                                </CardHeader>
                                <CardContent className="flex flex-col flex-grow text-center pt-8 px-10 pb-10">
                                    <p className="text-muted-foreground mb-8 text-sm leading-relaxed font-medium">For casual users looking for high-quality KS2 & GCSE curriculum access.</p>
                                    <ul className="space-y-4 mb-10 text-[14px] text-left mx-auto font-semibold">
                                        <li className="flex items-start gap-3"><CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> Socratic Mentoring</li>
                                        <li className="flex items-start gap-3"><CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> AI Feedback Framework</li>
                                        <li className="flex items-start gap-3"><CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> Full Curriculum Support</li>
                                    </ul>
                                    <div className="mt-auto">
                                        <Button className="w-full rounded-full py-6 text-sm font-black tracking-wide" variant="outline">Start Free Trial</Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Standard: Elite Tier */}
                            <Card className="flex flex-col relative border-0 shadow-2xl scale-105 z-20 bg-primary text-primary-foreground rounded-[2.5rem] overflow-hidden group">
                                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400"></div>
                                <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md text-white border border-white/30 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-sm">
                                    Recommended
                                </div>
                                <CardHeader className="text-center pb-2 pt-16 px-8 text-white">
                                    <h3 className="text-sm font-black uppercase tracking-widest opacity-80 mb-2">LumenForge Elite</h3>
                                    <div className="text-5xl font-black mt-4">
                                        £{isAnnual ? "19.99" : "24.99"}
                                        <span className="text-base font-medium opacity-70">/mo</span>
                                    </div>
                                    {isAnnual && (
                                        <div className="flex flex-col gap-1 mt-2">
                                            <p className="text-xs text-amber-200 font-bold uppercase tracking-wider">~£239.90 billed yearly</p>
                                            <Badge className="bg-amber-400 text-black border-none self-center font-black rounded-full px-3 py-0.5 text-[10px] uppercase">2 Months Free</Badge>
                                        </div>
                                    )}
                                    <p className="text-[11px] text-amber-300 mt-4 font-black uppercase tracking-widest">Private / High-performers</p>
                                </CardHeader>
                                <CardContent className="flex flex-col flex-grow text-center pt-8 px-10 pb-10">
                                    <p className="text-white/80 mb-8 text-sm leading-relaxed font-medium italic">Unlocks premium teaching strategies designed to build exceptional confidence and exam technique.</p>
                                    <ul className="space-y-4 mb-10 text-[14px] text-left mx-auto font-bold">
                                        <li className="flex items-start gap-3"><CheckCircle2 className="h-4 w-4 text-amber-300 shrink-0 mt-0.5" /> <strong>Disruptor Mode</strong></li>
                                        <li className="flex items-start gap-3"><CheckCircle2 className="h-4 w-4 text-amber-300 shrink-0 mt-0.5" /> <strong>Active Affirmations</strong></li>
                                        <li className="flex items-start gap-3"><div className="bg-amber-400 p-0.5 rounded-full"><CheckCircle2 className="h-3 w-3 text-primary shrink-0" /></div> <strong>Funds 2 Foundry Scholars</strong></li>
                                    </ul>
                                    <div className="mt-auto">
                                        <CheckoutButton
                                            tier="elite"
                                            priceAmount={isAnnual ? 23990 : 2499}
                                            className="w-full rounded-full py-6 text-sm font-black bg-white text-primary hover:bg-slate-100 shadow-xl hover:-translate-y-1 transition-all uppercase tracking-widest"
                                        >
                                            Upgrade to Elite
                                        </CheckoutButton>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Standard: Scholar Tier */}
                            <Card className="flex flex-col relative border-2 border-slate-100 dark:border-slate-800 shadow-md rounded-[2.5rem] bg-slate-50 dark:bg-muted/10 opacity-90 grayscale-[0.5] hover:grayscale-0 transition-all">
                                <CardHeader className="text-center pb-2 pt-10 px-8">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-2">Foundry Scholar</h3>
                                    <div className="text-5xl font-black mt-4">£0<span className="text-base text-muted-foreground font-medium">/mo</span></div>
                                    <p className="text-[11px] text-muted-foreground mt-4 font-black uppercase tracking-widest">Disadvantaged Students</p>
                                </CardHeader>
                                <CardContent className="flex flex-col flex-grow text-center pt-8 px-10 pb-10">
                                    <p className="text-muted-foreground mb-8 text-sm leading-relaxed font-medium">Full Elite access subsidised by our premium members and government tender.</p>
                                    <ul className="space-y-4 mb-10 text-[14px] text-left mx-auto font-semibold">
                                        <li className="flex items-start gap-3"><CheckCircle2 className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" /> Full Elite Mentorship</li>
                                        <li className="flex items-start gap-3"><CheckCircle2 className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" /> Granted via School Token</li>
                                    </ul>
                                    <div className="mt-auto">
                                        <Link href="/scholars" className="w-full">
                                            <Button className="w-full rounded-full py-6 text-sm font-black tracking-wide bg-white dark:bg-card border-slate-200" variant="outline">Redeem Token</Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <>
                            {/* Institutional: Sovereign Institutional Partnership Card */}
                            <Card className="flex flex-col relative border-2 border-slate-800 shadow-2xl rounded-[3rem] bg-[#0D1117] text-white hover:border-amber-500/50 transition-all">
                                <CardHeader className="text-center pb-2 pt-12 px-10">
                                    <div className="flex justify-center mb-6"><Sparkles className="w-8 h-8 text-amber-500" /></div>
                                    <h3 className="text-sm font-black uppercase tracking-[0.25em] text-amber-500 mb-2">Sovereign Institutional Partnership</h3>
                                    <div className="text-4xl font-black mt-6 tracking-tighter leading-tight">Consultative Implementation</div>
                                    <p className="text-xs text-muted-foreground mt-4 font-bold uppercase tracking-widest italic">Global Scale / Regulatory Alignment</p>
                                </CardHeader>
                                <CardContent className="flex flex-col flex-grow text-center pt-8 px-10 pb-12">
                                    <ul className="space-y-6 mb-12 text-[13px] text-left mx-auto font-bold opacity-90">
                                        <li className="flex items-start gap-4">
                                            <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" /> 
                                            <span><strong>Curriculum-Locked RAG</strong>: Native grounding in international curriculum frameworks (CIE, IB, White Rose) and regional academic standards.</span>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" /> 
                                            <span><strong>Sovereign Data Buffer</strong>: Localized data residency architecture to ensure 100% compliance with regional privacy regulations (e.g., GDPR, Qatar PDPPL, KSA PDPL).</span>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" /> 
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2">
                                                    <Badge className="bg-red-500/20 text-red-500 border-red-500/30 text-[8px] font-black uppercase tracking-widest px-1.5 py-0">Crisis Flag</Badge>
                                                    <strong className="text-amber-500">Enterprise Portal</strong>
                                                </div>
                                                <span className="text-xs opacity-70 font-medium">Real-time safeguarding dashboard with localized alert protocols for school DSLs.</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" /> 
                                            <span><strong>Pedagogical Stress-Testing</strong>: Access to proprietary "Virtual Pilot" simulation data to validate logic across diverse student cognitive profiles.</span>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" /> 
                                            <span><strong>Strategic Implementation</strong>: Professional onboarding including staff training and Board-level impact reporting.</span>
                                        </li>
                                    </ul>
                                    <div className="mt-auto">
                                        <Link href="mailto:institutional@lumenforge.ai?subject=Sovereign%20Briefing%20Inquiry" className="w-full">
                                            <Button className="w-full rounded-full py-6 text-sm font-black bg-amber-500 text-black hover:bg-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)] uppercase tracking-tight">Request Sovereign Briefing</Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Institutional: Sovereign License Card */}
                            <Card className="flex flex-col relative border-2 border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.1)] rounded-[3rem] bg-[#0F141D] text-white overflow-hidden md:scale-105 z-20">
                                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-600 to-amber-400"></div>
                                <CardHeader className="text-center pb-2 pt-12 px-10">
                                    <div className="flex justify-center mb-6"><ShieldCheck className="w-8 h-8 text-amber-500" /></div>
                                    <h3 className="text-sm font-black uppercase tracking-[0.25em] text-amber-500 mb-2">Sovereign License</h3>
                                    <div className="text-6xl font-black mt-6 tracking-tighter">£50</div>
                                    <p className="text-xs text-muted-foreground mt-4 font-bold uppercase tracking-widest">Per Student / Annually</p>
                                </CardHeader>
                                <CardContent className="flex flex-col flex-grow text-center pt-10 px-10 pb-12">
                                    <p className="text-slate-400 mb-8 text-base leading-relaxed font-medium">Enterprise-wide adoption for MATs and Authorities.</p>
                                    <ul className="space-y-5 mb-12 text-[15px] text-left mx-auto font-bold opacity-90">
                                        <li className="flex items-start gap-4"><CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" /> Full Data Sovereignty</li>
                                        <li className="flex items-start gap-4"><CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" /> Custom Pedagogical Tuning</li>
                                        <li className="flex items-start gap-4"><CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" /> Deep Analytics Dashboard</li>
                                    </ul>
                                    <div className="mt-auto">
                                        <Link href="mailto:institutional@lumenforge.ai?subject=Sovereign%20License%20Inquiry" className="w-full">
                                            <Button className="w-full rounded-full py-8 text-md font-black bg-white text-black hover:bg-slate-100 uppercase tracking-widest">Request Proposal</Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Institutional: Scholar Card (User requested it remain in mix) */}
                            <Card className="flex flex-col relative border-2 border-slate-800/50 shadow-md rounded-[3rem] bg-slate-900/50 text-white opacity-80 backdrop-blur-sm">
                                <CardHeader className="text-center pb-2 pt-10 px-8">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-2">Impact Tier</h3>
                                    <div className="text-5xl font-black mt-4">Social Impact</div>
                                    <p className="text-[11px] text-slate-500 mt-4 font-black uppercase tracking-widest">Embedded Foundry Model</p>
                                </CardHeader>
                                <CardContent className="flex flex-col flex-grow text-center pt-8 px-10 pb-10">
                                    <p className="text-slate-400 mb-8 text-sm leading-relaxed font-medium">Every Sovereign student license directly funds 2 Scholar seats within your institution or local authority.</p>
                                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl mb-8">
                                        <p className="text-amber-500 text-xs font-black uppercase tracking-widest">1-for-2 model active</p>
                                    </div>
                                    <div className="mt-auto opacity-50">
                                        <p className="text-xs font-bold text-slate-500 italic">Included in all institutional plans</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                <div className="mt-20 text-center">
                    <p className={`text-sm font-bold uppercase tracking-[0.2em] mb-4 ${isInstitutional ? 'text-amber-500/60' : 'text-muted-foreground'}`}>Trusted by Elite Educators</p>
                    <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                        <span className={`text-xl font-black ${isInstitutional ? 'text-white' : 'text-foreground'}`}>DfE 2026 Compliant</span>
                        <span className={`text-xl font-black ${isInstitutional ? 'text-white' : 'text-foreground'}`}>White Rose Maths v3.0</span>
                        <span className={`text-xl font-black ${isInstitutional ? 'text-white' : 'text-foreground'}`}>Sovereign AI Protected</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
