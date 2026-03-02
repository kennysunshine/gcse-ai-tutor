"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { supabase } from '@/lib/supabase'

export function PhaseBModal({ userId }: { userId: string }) {
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState(1)
    const [sessionLength, setSessionLength] = useState('')
    const [distraction, setDistraction] = useState('')
    const [tutoringHistory, setTutoringHistory] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const checkEligibility = async () => {
            // Check if study_context is already filled
            const { data: profile } = await supabase
                .from('profiles')
                .select('study_context')
                .eq('id', userId)
                .single()

            if (!profile || profile.study_context) return

            // Check if they have at least one chat
            const { data: chats } = await supabase
                .from('chats')
                .select('id')
                .eq('user_id', userId)
                .limit(1)

            if (chats && chats.length > 0) {
                setOpen(true)
            }
        }

        checkEligibility()
    }, [userId])

    const handleComplete = async () => {
        setLoading(true)

        const studyContext = {
            session_length_preference: sessionLength,
            distraction_level: distraction,
            tutoring_history: tutoringHistory
        }

        const { error } = await supabase
            .from('profiles')
            .update({ study_context: studyContext })
            .eq('id', userId)

        if (!error) {
            // Trigger the AI synthesis route in the background
            fetch('/api/profile/synthesize', { method: 'POST' }).catch(console.error)
            setOpen(false)
        } else {
            console.error("Failed to save study context", error)
        }
        setLoading(false)
    }

    if (!open) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="text-xl text-primary">Post-Session Triage</DialogTitle>
                    <DialogDescription>
                        We noticed you just completed your first session! Help us fine-tune your AI's teaching style with two quick questions.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in">
                            <div className="space-y-3">
                                <Label className="text-base font-semibold">How do you usually study?</Label>
                                <RadioGroup value={sessionLength} onValueChange={setSessionLength}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Short Bursts (25m)" id="short" />
                                        <Label htmlFor="short">Short pomodoro bursts (25 mins)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Long Sessions (1h+)" id="long" />
                                        <Label htmlFor="long">Long deep-dive sessions (1+ hours)</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="space-y-3 pt-4 border-t">
                                <Label className="text-base font-semibold">What is your biggest distraction?</Label>
                                <RadioGroup value={distraction} onValueChange={setDistraction}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Phone/Social Media" id="phone" />
                                        <Label htmlFor="phone">My phone / Social Media</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Losing Focus" id="focus" />
                                        <Label htmlFor="focus">Just drifting off / Losing focus naturally</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="None" id="none" />
                                        <Label htmlFor="none">I don't struggle with distractions</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-2">
                            <Label className="text-base font-semibold">Prior Tutoring History</Label>
                            <p className="text-sm text-muted-foreground mb-4">Have you had a private tutor before, and how did you respond to them?</p>
                            <RadioGroup value={tutoringHistory} onValueChange={setTutoringHistory} className="space-y-3">
                                <div className="flex items-center space-x-3 border p-3 rounded-lg hover:bg-muted/50">
                                    <RadioGroupItem value="Yes - push me hard" id="tut-1" />
                                    <Label htmlFor="tut-1" className="flex-1 cursor-pointer">Yes. I respond well to being pushed and challenged.</Label>
                                </div>
                                <div className="flex items-center space-x-3 border p-3 rounded-lg hover:bg-muted/50">
                                    <RadioGroupItem value="Yes - need scaffolding" id="tut-2" />
                                    <Label htmlFor="tut-2" className="flex-1 cursor-pointer">Yes, but I prefer step-by-step guidance over being pushed.</Label>
                                </div>
                                <div className="flex items-center space-x-3 border p-3 rounded-lg hover:bg-muted/50">
                                    <RadioGroupItem value="First time" id="tut-3" />
                                    <Label htmlFor="tut-3" className="flex-1 cursor-pointer">No, this is my first time having 1-on-1 tutoring.</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex justify-between sm:justify-between w-full">
                    {step === 2 ? (
                        <>
                            <Button variant="outline" onClick={() => setStep(1)} disabled={loading}>Back</Button>
                            <Button onClick={handleComplete} disabled={!tutoringHistory || loading}>
                                {loading ? 'Saving...' : 'Complete Triage'}
                            </Button>
                        </>
                    ) : (
                        <>
                            <div /> {/* Spacer */}
                            <Button onClick={() => setStep(2)} disabled={!sessionLength || !distraction}>Next Segment</Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
