"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function FoundryScholarsPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="container mx-auto px-4 py-20 min-h-[calc(100vh-4rem)] flex items-center justify-center">
            <Card className="w-full max-w-2xl shadow-2xl border-primary/20">
                {!submitted ? (
                    <>
                        <CardHeader className="text-center space-y-2">
                            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-2">
                                <ShieldCheck className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle className="text-3xl font-bold">Foundry Scholars Program</CardTitle>
                            <CardDescription className="text-lg">
                                Apply for subsidized, elite AI tutoring for disadvantaged pupils, funded by our B2C premium tier.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-8" onSubmit={handleSubmit}>

                                {/* Applicant Type */}
                                <div className="space-y-3">
                                    <Label className="text-base">I am applying as a:</Label>
                                    <Select defaultValue="parent">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="parent">Parent / Guardian</SelectItem>
                                            <SelectItem value="teacher">Teacher / School Admin</SelectItem>
                                            <SelectItem value="authority">Local Authority Representative</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Eligibility Check - Critical for Social Value Score */}
                                <div className="p-6 bg-muted/50 rounded-lg border border-primary/10 space-y-4">
                                    <Label className="text-base block mb-2 font-semibold flex items-center gap-2">
                                        <span className="text-primary italic">DfE 2026</span> Eligibility Status:
                                    </Label>
                                    <div className="space-y-3 pl-2">
                                        <div className="flex items-center space-x-3">
                                            <Checkbox id="fsm" />
                                            <Label htmlFor="fsm" className="font-normal text-muted-foreground">Pupil is eligible for Free School Meals (FSM)</Label>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Checkbox id="pupil-premium" />
                                            <Label htmlFor="pupil-premium" className="font-normal text-muted-foreground">Pupil attracts Pupil Premium funding</Label>
                                        </div>
                                    </div>
                                </div>

                                {/* Learning Focus */}
                                <div className="space-y-3">
                                    <Label className="text-base">Primary Learning Gap:</Label>
                                    <Textarea
                                        placeholder="e.g. Year 6 Fractions and Ratio (White Rose v3.0 focus)"
                                        rows={3}
                                        className="resize-none"
                                    />
                                </div>

                                <div className="pt-4">
                                    <Button type="submit" size="lg" className="w-full text-lg h-14">
                                        Submit Scholarship Application
                                    </Button>
                                    <p className="text-xs text-center text-muted-foreground mt-4">
                                        By submitting, you agree to the <Link href="/terms" className="text-primary hover:underline">LumenForge Safeguarding and Data Privacy terms</Link>.
                                    </p>
                                </div>
                            </form>
                        </CardContent>
                    </>
                ) : (
                    <CardContent className="text-center py-20 space-y-4">
                        <div className="mx-auto bg-green-500/10 w-24 h-24 rounded-full flex items-center justify-center mb-6">
                            <ShieldCheck className="h-12 w-12 text-green-600" />
                        </div>
                        <h3 className="text-3xl font-bold text-green-600">Application Received</h3>
                        <p className="text-lg text-muted-foreground max-w-md mx-auto">
                            Thank you. We will review your eligibility against the DfE 2026 criteria. If approved, your activation token will be sent via email within 48 hours.
                        </p>
                        <div className="pt-8">
                            <Link href="/">
                                <Button variant="outline">Return to Home</Button>
                            </Link>
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
