"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'

export default function OnboardingPage() {
    const [step, setStep] = useState(1)
    const [yearGroup, setYearGroup] = useState('')
    const [examBoard, setExamBoard] = useState('')
    const [targetGrade, setTargetGrade] = useState('')
    const [enemyQuestion, setEnemyQuestion] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // Simple check to ensure user is logged in
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
            }
        }
        checkUser()
    }, [router])

    const handleNext = () => setStep(step + 1)
    const handleBack = () => setStep(step - 1)

    const handleComplete = async () => {
        setLoading(true)
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
            const { error } = await supabase
                .from('profiles')
                .update({
                    year_group: yearGroup,
                    exam_board: examBoard,
                    target_grade: targetGrade,
                    enemy_question: enemyQuestion
                })
                .eq('id', session.user.id)

            if (!error) {
                router.push('/dashboard')
            } else {
                console.error("Error saving diagnostic data:", error)
            }
        }
        setLoading(false)
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-muted/30 px-4 py-8">
            <Card className="w-full max-w-lg shadow-lg border-primary/20">
                <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-primary">Elite Diagnostic</span>
                        <span className="text-sm font-medium text-muted-foreground">Step {step} of 4</span>
                    </div>
                    <CardTitle className="text-2xl">Calibration Phase A</CardTitle>
                    <CardDescription>
                        To calibrate your LumenForge Mentor, we need to understand your current trajectory.
                        Your AI will adapt its pacing and challenge level based on these answers.
                    </CardDescription>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden mt-4">
                        <div
                            className="bg-primary h-full transition-all duration-300"
                            style={{ width: `${(step / 4) * 100}%` }}
                        />
                    </div>
                </CardHeader>

                <CardContent className="pt-6">
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                            <h3 className="text-lg font-medium">What is your current Year Group?</h3>
                            <RadioGroup value={yearGroup} onValueChange={setYearGroup} className="space-y-3">
                                <div className="flex items-center space-x-3 border p-4 rounded-lg hover:bg-muted/50 cursor-pointer">
                                    <RadioGroupItem value="Year 9" id="year-9" />
                                    <Label htmlFor="year-9" className="flex-1 cursor-pointer">Year 9 (Foundation / Preparation)</Label>
                                </div>
                                <div className="flex items-center space-x-3 border p-4 rounded-lg hover:bg-muted/50 cursor-pointer">
                                    <RadioGroupItem value="Year 10" id="year-10" />
                                    <Label htmlFor="year-10" className="flex-1 cursor-pointer">Year 10 (Syllabus Coverage)</Label>
                                </div>
                                <div className="flex items-center space-x-3 border p-4 rounded-lg hover:bg-muted/50 cursor-pointer border-primary/30 bg-primary/5">
                                    <RadioGroupItem value="Year 11" id="year-11" />
                                    <Label htmlFor="year-11" className="flex-1 cursor-pointer font-medium">Year 11 (Exam Crunch)</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                            <h3 className="text-lg font-medium">Which Examining Board do you use mostly?</h3>
                            <RadioGroup value={examBoard} onValueChange={setExamBoard} className="space-y-3">
                                <div className="flex items-center space-x-3 border p-4 rounded-lg hover:bg-muted/50 cursor-pointer">
                                    <RadioGroupItem value="AQA" id="aqa" />
                                    <Label htmlFor="aqa" className="flex-1 cursor-pointer">AQA</Label>
                                </div>
                                <div className="flex items-center space-x-3 border p-4 rounded-lg hover:bg-muted/50 cursor-pointer">
                                    <RadioGroupItem value="Edexcel" id="edexcel" />
                                    <Label htmlFor="edexcel" className="flex-1 cursor-pointer">Edexcel</Label>
                                </div>
                                <div className="flex items-center space-x-3 border p-4 rounded-lg hover:bg-muted/50 cursor-pointer">
                                    <RadioGroupItem value="OCR" id="ocr" />
                                    <Label htmlFor="ocr" className="flex-1 cursor-pointer">OCR</Label>
                                </div>
                                <div className="flex items-center space-x-3 border p-4 rounded-lg hover:bg-muted/50 cursor-pointer">
                                    <RadioGroupItem value="Mixed / Not Sure" id="mixed" />
                                    <Label htmlFor="mixed" className="flex-1 cursor-pointer text-muted-foreground">Mixed / Not Sure</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                            <h3 className="text-lg font-medium">What is your Target Grade baseline?</h3>
                            <RadioGroup value={targetGrade} onValueChange={setTargetGrade} className="space-y-3">
                                <div className="flex items-center space-x-3 border p-4 rounded-lg hover:bg-muted/50 cursor-pointer">
                                    <RadioGroupItem value="Grades 4-5" id="grade-4-5" />
                                    <Label htmlFor="grade-4-5" className="flex-1 cursor-pointer">Grades 4-5 (Securing a Strong Pass)</Label>
                                </div>
                                <div className="flex items-center space-x-3 border p-4 rounded-lg hover:bg-muted/50 cursor-pointer">
                                    <RadioGroupItem value="Grades 6-7" id="grade-6-7" />
                                    <Label htmlFor="grade-6-7" className="flex-1 cursor-pointer">Grades 6-7 (High Performance)</Label>
                                </div>
                                <div className="flex items-center space-x-3 border p-4 rounded-lg hover:bg-muted/50 cursor-pointer border-primary/30 bg-primary/5">
                                    <RadioGroupItem value="Grades 8-9" id="grade-8-9" />
                                    <Label htmlFor="grade-8-9" className="flex-1 cursor-pointer font-medium">Grades 8-9 (Elite Academic Mastery)</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                            <h3 className="text-lg font-medium">The "Enemy" Question</h3>
                            <p className="text-sm text-muted-foreground mt-1 mb-4">
                                Don't just tell us what subjects you dislike. Name the specific <em>type of moment</em> where you lose marks or feel overwhelmed during an exam.
                            </p>
                            <div className="space-y-2">
                                <Label htmlFor="enemyQuestion">What is your biggest blocker?</Label>
                                <Textarea
                                    id="enemyQuestion"
                                    placeholder="e.g., 'I understand the content in class, but my mind goes completely blank under timed conditions' or 'I struggle to connect concepts together in 6-mark biology questions.'"
                                    className="h-32 resize-none"
                                    value={enemyQuestion}
                                    onChange={(e) => setEnemyQuestion(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex justify-between border-t pt-6 bg-muted/10">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={step === 1 || loading}
                    >
                        Back
                    </Button>

                    {step < 4 ? (
                        <Button
                            onClick={handleNext}
                            disabled={(step === 1 && !yearGroup) || (step === 2 && !examBoard) || (step === 3 && !targetGrade)}
                        >
                            Next Step
                        </Button>
                    ) : (
                        <Button
                            onClick={handleComplete}
                            disabled={!enemyQuestion || enemyQuestion.length < 10 || loading}
                            className="bg-primary text-primary-foreground"
                        >
                            {loading ? 'Calibrating AI...' : 'Complete Initialization'}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
