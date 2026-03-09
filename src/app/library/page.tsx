"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Book, Shield, Zap, Search, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function LibraryPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="flex flex-col gap-4 mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold w-fit">
                    <Shield className="w-4 h-4" />
                    Sovereign Library
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Curriculum Source of Truth</h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                    Explore the raw pedagogical data and curriculum frameworks that power our Socratic Mentors. Verified, transparent, and DfE 2026 compliant.
                </p>
                <div className="relative max-w-md mt-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search syllabus topics..." className="pl-10" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="group hover:border-primary/50 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Book className="h-5 w-5 text-primary" />
                            White Rose Maths v3.0
                        </CardTitle>
                        <CardDescription>KS2 & GCSE Foundation/Higher</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">The gold standard for mastery-based mathematics. Includes Concrete-Pictorial-Abstract (CPA) logic mapping.</p>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">KS2</Badge>
                                <Badge variant="secondary">GCSE</Badge>
                                <Badge variant="outline" className="border-green-500/30 text-green-600">Verified</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="group hover:border-primary/50 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-amber-500" />
                            AQA Science (Combined)
                        </CardTitle>
                        <CardDescription>8464 Specification Path</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">Full breakdown of required practicals, physics equations, and biological processes for the 2025/26 cycle.</p>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">Combined Science</Badge>
                                <Badge variant="outline" className="border-green-500/30 text-green-600">Verified</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-dashed border-muted-foreground/30 opacity-60">
                    <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                        <div className="flex flex-col items-center gap-2 text-center p-4">
                            <Lock className="h-6 w-6 text-muted-foreground" />
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Elite Discovery Only</p>
                        </div>
                    </div>
                    <CardHeader>
                        <CardTitle>Millfield Ethos Framework</CardTitle>
                        <CardDescription>Advanced Pedagogical Rules</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground italic">Proprietary logic for disruptive cognitive training...</p>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-20 p-8 rounded-[2rem] bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="space-y-4 relative z-10">
                    <h2 className="text-2xl font-bold italic">Intellectual Sovereignty</h2>
                    <p className="max-w-md text-slate-300">
                        LumenForge's library is not just a repository; it is a commitment to data resident education. We extract patterns from these documents to guide you, but the intellectual property of your learning remains yours.
                    </p>
                </div>
                <Badge variant="outline" className="border-slate-700 text-slate-400 py-2 px-4 relative z-10">
                    Sovereign Standards v1.0
                </Badge>
            </div>
        </div>
    )
}
