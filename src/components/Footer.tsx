"use client"

import Link from 'next/link'
import { BookOpen, ShieldCheck, Github, Twitter } from 'lucide-react'

export function Footer() {
    return (
        <footer className="py-16 border-t bg-slate-50 dark:bg-[#0A1118] text-muted-foreground text-sm font-medium">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                            <span className="text-2xl" aria-hidden="true">🎓</span>
                            <span>LumenForge</span>
                        </Link>
                        <p className="max-w-xs text-sm leading-relaxed">
                            The elite AI Socratic Mentor for UK GCSE students.
                            Building high-status thinkers through curriculum-aligned pedagogical frameworks.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
                            <a href="#" className="hover:text-primary transition-colors"><Github className="h-5 w-5" /></a>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-foreground font-bold uppercase tracking-wider text-xs">Platform</h4>
                        <ul className="space-y-2 text-xs">
                            <li><Link href="/dashboard" className="hover:text-primary transition-colors">Subjects Dashboard</Link></li>
                            <li><Link href="/library" className="hover:text-primary transition-colors font-bold text-primary/80 flex items-center gap-1">
                                <ShieldCheck className="h-3 w-3" /> Sovereign Library
                            </Link></li>
                            <li><Link href="/faq" className="hover:text-primary transition-colors">Frequently Asked Questions</Link></li>
                            <li><Link href="/scholars" className="hover:text-primary transition-colors">Foundry Scholars</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-foreground font-bold uppercase tracking-wider text-xs">Legal & Safety</h4>
                        <ul className="space-y-2 text-xs">
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/privacy#safeguarding" className="hover:text-primary transition-colors">Safeguarding Protocol</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] uppercase tracking-widest font-bold opacity-70">
                        &copy; {new Date().getFullYear()} LumenForge. Built for UK Students.
                    </p>
                    <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest font-bold">
                        <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-green-500" /> DfE 2026 Compliant</span>
                        <span className="hidden sm:inline opacity-30">|</span>
                        <span>Zero-Training Data Policy</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
