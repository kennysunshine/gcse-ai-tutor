
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SUBJECTS } from '@/lib/subjects'
import { supabase } from '@/lib/supabase'
import { Flame, User, Award, BookOpen } from 'lucide-react'

import { Progress } from "@/components/ui/progress"
import { Target } from 'lucide-react'
import { PhaseBModal } from '@/components/PhaseBModal'
import { WellbeingWidget } from '@/components/WellbeingWidget'

// Dummy efficacy data correlating practice scores to Target Grades
const efficacyData: Record<string, { targetGrade: number, currentMastery: number, projectedGrade: number }> = {
    "maths": { targetGrade: 8, currentMastery: 72, projectedGrade: 7 },
    "english-language": { targetGrade: 6, currentMastery: 85, projectedGrade: 7 },
    "biology": { targetGrade: 7, currentMastery: 40, projectedGrade: 5 }
}

export default function DashboardPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [masteryData, setMasteryData] = useState<Record<string, number>>({})

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
            } else {
                setUser(session.user)

                // Concurrent fetching for better performance
                const [profileRes, masteryRes] = await Promise.all([
                    supabase.from('profiles').select('*').eq('id', session.user.id).single(),
                    supabase.from('curriculum_mastery').select('subject, mastery_score').eq('student_id', session.user.id)
                ])

                if (profileRes.data) setProfile(profileRes.data)

                if (masteryRes.data) {
                    // Aggregate mastery scores by subject
                    const aggregated: Record<string, { total: number, count: number }> = {}
                    masteryRes.data.forEach(m => {
                        if (!aggregated[m.subject]) aggregated[m.subject] = { total: 0, count: 0 }
                        aggregated[m.subject].total += m.mastery_score
                        aggregated[m.subject].count += 1
                    })

                    const finalMastery: Record<string, number> = {}
                    Object.keys(aggregated).forEach(sub => {
                        finalMastery[sub] = Math.round(aggregated[sub].total / aggregated[sub].count)
                    })
                    setMasteryData(finalMastery)
                }
            }
            setLoading(false)
        }
        checkUser()
    }, [router])

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading dashboard...</div>
    }

    if (!user) return null

    // Extract first name robustly
    const firstName = profile?.full_name?.trim().split(/\s+/)[0] || 'Scholar'

    return (
        <div className="container px-4 py-8 mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Welcome back, {firstName}</h1>
                    <p className="text-muted-foreground">Ready to master your KS2 & GCSE subjects today?</p>
                </div>
                <div className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full font-bold">
                    <Flame className="fill-current" />
                    <span>3 Day Streak</span>
                </div>
            </div>

            <WellbeingWidget />

            {/* Profile Summary Card */}
            <Card className="border-primary/20 bg-muted/30">
                <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-4 rounded-full">
                            <User className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-bold">Student Profile</h3>
                                {user?.user_metadata?.isPremium ? (
                                    <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                                        Elite Tier
                                    </span>
                                ) : (
                                    <span className="bg-muted-foreground/20 text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                        Standard Tier
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                                <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {profile?.year_group || 'Year Not Set'}</span>
                                <span className="flex items-center gap-1"><Award className="h-3 w-3" /> {profile?.exam_board || 'No Board Set'}</span>
                                <span className="flex items-center gap-1">
                                    <Target className="h-3 w-3" />
                                    Target: {profile?.target_grade ? (
                                        <span className="text-foreground font-semibold">{profile.target_grade}</span>
                                    ) : (
                                        <Link href="/settings/profile" className="text-primary hover:underline flex items-center gap-1">
                                            Set your goal →
                                        </Link>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                    {user?.user_metadata?.isPremium && profile?.year_group && (
                        <div className="text-sm bg-primary/10 text-primary px-4 py-2 rounded-lg border border-primary/20 flex-shrink-0">
                            <strong>Active Framework:</strong> {profile.year_group.includes('Year 6') || profile.year_group.includes('KS2') ? 'Junior Foundry Socratic Mentor' : 'Elite GCSE Mentor'}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Efficacy Tracking & Goals
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {SUBJECTS.map((subject) => {
                        // Use real mastery data if available, else 0
                        const currentMastery = masteryData[subject.name] || masteryData[subject.slug] || 0;

                        // Infer projected grade from mastery for UI purposes
                        // 100% mastery ≈ Target Grade. 50% mastery ≈ 2 grades below.
                        const projectedGradeNote = currentMastery > 80 ? "On Track" : currentMastery > 50 ? "Steady" : "Action Required";

                        return (
                            <Card key={subject.slug} className="hover:shadow-md transition-shadow flex flex-col">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xl font-bold">{subject.name}</CardTitle>
                                    <div className={`text-2xl p-2 rounded-lg ${subject.color}`}>
                                        {subject.icon}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <CardDescription>
                                        Master key topics in {subject.name} with Socratic guidance.
                                    </CardDescription>

                                    <div className="space-y-2 pt-2 border-t">
                                        <div className="flex justify-between text-xs items-center h-5">
                                            <span className="font-semibold text-muted-foreground uppercase tracking-tighter flex items-center gap-1">
                                                Target: {profile?.target_grade ? (
                                                    <span className="text-foreground">{profile.target_grade.replace('Grades ', '')}</span>
                                                ) : (
                                                    <Link href="/settings/profile" className="text-primary hover:underline">Set Goal →</Link>
                                                )}
                                            </span>
                                            <span className={`font-bold uppercase tracking-tighter ${currentMastery > 70 ? 'text-green-500' : 'text-amber-500'}`}>
                                                {currentMastery > 90 ? "Grade 9" : projectedGradeNote}
                                            </span>
                                        </div>
                                        <Progress value={currentMastery} className="h-2" />
                                        <p className="text-[10px] text-muted-foreground text-center">Current Syllabus Mastery: {currentMastery}%</p>
                                    </div>
                                </CardContent>
                                <CardFooter className="mt-auto pt-4">
                                    <Link href={`/chat/${subject.slug}`} className="w-full">
                                        <Button className="w-full group">
                                            Continue Learning
                                            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </div>

            <PhaseBModal userId={user.id} />
        </div>
    )
}
