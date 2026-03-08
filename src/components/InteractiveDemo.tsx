"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Lightbulb, Pencil } from "lucide-react"

export function InteractiveDemo() {
    const [step, setStep] = useState(0)
    const [masteryWidth, setMasteryWidth] = useState(70)
    const [errorMsg, setErrorMsg] = useState("")

    const handleChoiceClick1 = () => {
        setErrorMsg("")
        setStep(1)
        setTimeout(() => setStep(2), 800)
    }

    const handleError1 = () => {
        setErrorMsg("Hint: We need to isolate the (x-4) term first.")
    }

    const handleChoiceClick2 = () => {
        setErrorMsg("")
        setStep(3)
        setTimeout(() => {
            setStep(4)
            setTimeout(() => setMasteryWidth(72), 300)
        }, 800)
    }

    const handleError2 = () => {
        setErrorMsg("Hint: The -4 is attached to the x. How do we move it to the other side?")
    }

    return (
        <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-200 to-primary/20 dark:from-purple-900/40 dark:to-primary/20 rounded-[3rem] transform rotate-3 scale-105 z-0"></div>
            <Card className="relative border-0 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white dark:bg-card z-10">
                <CardHeader className="bg-[#583D72] text-white border-b-0 py-4">
                    <CardTitle className="flex items-center justify-center gap-2 text-lg font-medium">
                        Tutor Me: Maths & Science
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-8 space-y-6 font-sans bg-slate-50 dark:bg-muted/10 h-[500px] flex flex-col justify-end">
                    <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="bg-[#583D72] text-white px-5 py-3 rounded-t-3xl rounded-bl-3xl max-w-[85%] shadow-sm text-[15px] font-medium leading-relaxed">
                            Can you help us solve the equation for X? <br /><code className="bg-black/20 px-1.5 py-0.5 rounded mt-2 inline-block font-mono">9(x-4)=-18</code>
                        </div>
                    </div>
                    <div className="flex justify-start gap-3 items-end animate-in fade-in slide-in-from-bottom-2 duration-700 delay-150 fill-mode-both">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm border-2 border-white dark:border-background object-cover">
                            <GraduationCap className="w-5 h-5" />
                        </div>
                        <div className="bg-white dark:bg-muted text-foreground px-5 py-4 rounded-t-3xl rounded-br-3xl max-w-[85%] shadow-sm border border-slate-100 dark:border-slate-800 text-[15px] leading-relaxed">
                            Absolutely! This is a basic algebraic equation. Let's solve it together. <br /><br />
                            What's the first step we should take to get <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-primary font-bold font-mono">x</code> on its own?
                        </div>
                    </div>

                    {step === 0 && (
                        <div className="mt-4 pt-6 border-t border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300 fill-mode-both">
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={handleChoiceClick1}
                                    className="bg-white dark:bg-card border-2 border-primary/20 hover:border-primary text-foreground rounded-full px-5 py-3 text-[15px] text-left shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                >
                                    Divide both sides by 9
                                </button>
                                <button
                                    onClick={handleError1}
                                    className="bg-white dark:bg-card border-2 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 text-muted-foreground hover:text-destructive rounded-full px-5 py-3 text-[15px] text-left shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2"
                                >
                                    Add 4 to both sides
                                </button>
                            </div>
                            {errorMsg && <p className="text-destructive text-sm font-semibold mt-3 animate-pulse px-2">{errorMsg}</p>}
                        </div>
                    )}

                    {step >= 1 && (
                        <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="bg-[#583D72] text-white px-5 py-3 rounded-t-3xl rounded-bl-3xl max-w-[85%] shadow-sm text-[15px] font-medium leading-relaxed">
                                Let's divide both sides by 9.
                            </div>
                        </div>
                    )}

                    {step >= 2 && (
                        <div className="flex justify-start gap-3 items-end animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm border-2 border-white dark:border-background object-cover inline-flex">
                                <GraduationCap className="w-5 h-5" />
                            </div>
                            <div className="bg-white dark:bg-muted text-foreground px-5 py-4 rounded-t-3xl rounded-br-3xl max-w-[85%] shadow-sm border border-slate-100 dark:border-slate-800 text-[15px] leading-relaxed">
                                <p className="font-bold text-foreground mb-1">Spot on! 🎯</p>
                                <p>That leaves us with: <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-primary font-bold font-mono">x - 4 = -2</code></p>
                                <p className="mt-2">What should we do next to get x completely on its own?</p>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="mt-2 pt-4 border-t border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300 fill-mode-both">
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={handleChoiceClick2}
                                    className="bg-white dark:bg-card border-2 border-primary/20 hover:border-primary text-foreground rounded-full px-5 py-3 text-[15px] text-left shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                >
                                    Add 4 to both sides
                                </button>
                                <button
                                    onClick={handleError2}
                                    className="bg-white dark:bg-card border-2 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 text-muted-foreground hover:text-destructive rounded-full px-5 py-3 text-[15px] text-left shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2"
                                >
                                    Multiply by -2
                                </button>
                            </div>
                            {errorMsg && <p className="text-destructive text-sm font-semibold mt-3 animate-pulse px-2">{errorMsg}</p>}
                        </div>
                    )}

                    {step >= 3 && (
                        <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="bg-[#583D72] text-white px-5 py-3 rounded-t-3xl rounded-bl-3xl max-w-[85%] shadow-sm text-[15px] font-medium leading-relaxed">
                                Add 4 to both sides?
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="flex justify-start gap-3 items-end animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm border-2 border-white dark:border-background object-cover inline-flex">
                                <span aria-hidden="true">🧠</span>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 text-foreground px-5 py-4 rounded-t-3xl rounded-br-3xl max-w-[85%] shadow-sm border border-green-200 dark:border-green-800 text-[15px] leading-relaxed w-full">
                                <p className="font-bold text-green-700 dark:text-green-400 mb-2">Nailed it! 🚀</p>
                                <p>You figured it out! <code className="bg-green-100 dark:bg-green-800 px-1.5 py-0.5 rounded text-green-800 dark:text-green-200 font-bold font-mono">x = 2</code>.</p>
                                <div className="mt-4 pt-3 border-t border-green-200 dark:border-green-800/50 flex flex-col gap-2">
                                    <div className="flex justify-between text-xs font-bold text-green-700 dark:text-green-400">
                                        <span>Target Grade 8 tracking</span>
                                        <span>{masteryWidth}% Mastery</span>
                                    </div>
                                    <div className="h-2 w-full bg-green-200 dark:bg-green-800/50 rounded-full overflow-hidden shadow-inner">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${masteryWidth}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </CardContent>
            </Card>
            {/* Decorative Floating Elements */}
            <div className="absolute -left-6 top-1/4 animate-bounce hidden md:block" style={{ animationDuration: '3s' }}>
                <Lightbulb className="w-12 h-12 text-yellow-500" />
            </div>
            <div className="absolute -right-8 bottom-1/4 animate-bounce hidden md:block" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                <Pencil className="w-12 h-12 text-blue-500" />
            </div>
            <div className="absolute top-10 -right-6 bg-yellow-100 dark:bg-yellow-900/50 p-2 px-3 rounded-xl rotate-12 shadow-md text-yellow-600 font-bold border-2 border-yellow-200 dark:border-yellow-800 z-20">A+</div>
        </div>
    )
}
