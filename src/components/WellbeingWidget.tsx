"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BrainCircuit, Smile, Frown, Meh, Zap, Heart } from 'lucide-react'

const moods = [
    { label: 'Energized', icon: <Zap className="h-5 w-5" />, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20', insight: 'Today is perfect for tackling your "Enemy Questions". Push your boundaries.' },
    { label: 'Good', icon: <Smile className="h-5 w-5" />, color: 'text-green-500 bg-green-50 dark:bg-green-900/20', insight: 'Consistency is the hallmark of a Sovereign Learner. Keep the momentum.' },
    { label: 'Neutral', icon: <Meh className="h-5 w-5" />, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20', insight: 'Focus on small wins today. Master one topic deeply rather than many broadly.' },
    { label: 'Anxious', icon: <Heart className="h-5 w-5" />, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20', insight: 'Take a deep breath. Use Socratic hints to break the problem into smaller pieces.' },
    { label: 'Struggling', icon: <Frown className="h-5 w-5" />, color: 'text-red-500 bg-red-50 dark:bg-red-900/20', insight: 'It’s okay to pause. A short rest can provide the clarity needed for a breakthrough.' },
]

export function WellbeingWidget() {
    const [selectedMood, setSelectedMood] = useState<number | null>(null)

    return (
        <Card className="border-primary/20 bg-gradient-to-br from-background to-muted/30">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-1">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">State of Mind</CardTitle>
                </div>
                <CardDescription>Calibrate your focus for today's mission.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-3 mb-6">
                    {moods.map((mood, idx) => (
                        <button
                            key={mood.label}
                            onClick={() => setSelectedMood(idx)}
                            className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all ${selectedMood === idx
                                    ? 'border-primary bg-primary/5 shadow-sm scale-105'
                                    : 'border-transparent bg-muted/50 hover:bg-muted text-muted-foreground'
                                }`}
                        >
                            <div className={`${selectedMood === idx ? mood.color : ''} p-2 rounded-full transition-colors`}>
                                {mood.icon}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-tighter">{mood.label}</span>
                        </button>
                    ))}
                </div>

                {selectedMood !== null ? (
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-primary mb-1">
                            <Zap className="h-3 w-3 fill-current" />
                            Elite Insight
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed italic">
                            "{moods[selectedMood].insight}"
                        </p>
                    </div>
                ) : (
                    <div className="p-4 rounded-xl bg-muted/20 border border-dashed border-muted-foreground/20 text-center">
                        <p className="text-xs text-muted-foreground italic">How are we feeling today, Scholar?</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
