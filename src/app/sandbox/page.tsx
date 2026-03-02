"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Lightbulb, Target, TrendingUp, ShieldAlert, Sparkles, Send, Lock } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { CheckoutButton } from "@/components/CheckoutButton"

export default function SandboxPage() {
    const [idea, setIdea] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const [isPremium, setIsPremium] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    useEffect(() => {
        const checkPremiumStatus = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.user_metadata?.isPremium) {
                setIsPremium(true);
            }
            setIsLoadingAuth(false);
        };
        checkPremiumStatus();
    }, []);

    const handleAnalyze = async () => {
        if (!idea.trim()) return;
        setIsAnalyzing(true);
        // Simulate an API call to Gemini extraction agent
        setTimeout(() => {
            setAnalysis(`
### Market Research (Edexcel Topic 1.2)
Your idea targets a niche demographic. Primary research (like surveys) would be essential to validate the £15 price point you mentioned.

### Financial Literacy (Edexcel Topic 1.4)
Consider your fixed vs variable costs. If material costs increase, how does that impact your break-even point?

### Anti-Dependency Note
I have extracted these analytical points based on the GCSE Business specification. The creative execution and success of the business rely entirely on your implementation.
            `);
            setIsAnalyzing(false);
        }, 1500);
    };

    return (
        <div className="container px-4 py-8 mx-auto max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Lightbulb className="h-8 w-8 text-yellow-500" />
                    Idea Validation Sandbox
                </h1>
                <p className="text-muted-foreground mt-2">
                    Test your original business ideas against GCSE Business Studies specifications (Market Research, Finance, Operations).
                </p>
            </div>

            <div className="relative">
                {/* Paywall Overlay */}
                {!isLoadingAuth && !isPremium && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl border border-border shadow-lg p-6 text-center">
                        <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 p-4 rounded-full mb-4">
                            <Lock className="h-8 w-8" />
                        </div>
                        <Badge variant="outline" className="mb-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none py-1 px-3">
                            GCSEmigo PRO
                        </Badge>
                        <h2 className="text-2xl font-bold mb-2">Unlock the Entrepreneurship Sandbox</h2>
                        <p className="text-muted-foreground max-w-md mb-6">
                            Upgrade to Premium to test your business ideas against the Edexcel curriculum. Get instant feedback on market research, cash flow, and more, while keeping 100% of your Intellectual Property.
                        </p>
                        <div className="flex gap-4">
                            <CheckoutButton
                                tier="elite"
                                priceAmount={2499}
                                className="h-11 px-8 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
                            >
                                Upgrade Now - £24.99/mo
                            </CheckoutButton>
                            <Button size="lg" variant="outline">
                                View Demo Example
                            </Button>
                        </div>
                    </div>
                )}

                <div className={`grid md:grid-cols-2 gap-6 transition-opacity duration-300 ${!isPremium ? 'opacity-30 pointer-events-none' : ''}`}>
                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle>Pitch Your Idea</CardTitle>
                            <CardDescription>Detail your business concept.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="idea">What is the product or service?</Label>
                                <Textarea
                                    id="idea"
                                    placeholder="E.g., A subscription box for eco-friendly school supplies..."
                                    className="min-h-[120px]"
                                    value={idea}
                                    onChange={(e) => setIdea(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="audience">Who is your target market?</Label>
                                <Input
                                    id="audience"
                                    placeholder="E.g., Students aged 11-16"
                                    value={targetAudience}
                                    onChange={(e) => setTargetAudience(e.target.value)}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || !idea.trim()}
                            >
                                {isAnalyzing ? (
                                    <span className="animate-pulse">Analyzing against Syllabus...</span>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Extract Business Analysis
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="bg-muted/50 flex flex-col h-[500px]">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-primary">
                                <Target className="h-5 w-5" />
                                GCSE Syllabus Application
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-hidden p-0">
                            <ScrollArea className="h-full px-6">
                                {analysis ? (
                                    <div className="prose prose-sm dark:prose-invert pb-6 whitespace-pre-wrap">
                                        {analysis}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-6 space-y-4">
                                        <TrendingUp className="h-12 w-12 opacity-20" />
                                        <p>Submit your pitch to see how it aligns with key business concepts like cash flow forecasting and market segmentation.</p>
                                        <div className="flex items-center gap-2 text-xs bg-background p-2 rounded border max-w-xs">
                                            <ShieldAlert className="h-4 w-4 text-blue-500 shrink-0" />
                                            <span>Data Output Policy: We extract patterns, you own the IP.</span>
                                        </div>
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
