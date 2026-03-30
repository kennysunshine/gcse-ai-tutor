
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

export default function DashboardPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [masteryData, setMasteryData] = useState<Record<string, number>>({})
    const [lumensData, setLumensData] = useState<any>(null)

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
            } else {
                setUser(session.user)

                // Concurrent fetching for better performance
                const [profileRes, masteryRes, lumensRes] = await Promise.all([
                    supabase.from('profiles').select('*').eq('id', session.user.id).single(),
                    supabase.from('curriculum_mastery').select('subject, mastery_score').eq('student_id', session.user.id),
                    supabase.from('student_lumens').select('*').eq('student_id', session.user.id).maybeSingle()
                ])

                if (profileRes.data) setProfile(profileRes.data)
                if (lumensRes.data) setLumensData(lumensRes.data)

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

    // Foundry Ranks (matching implementation_plan.md)
    const FOUNDRY_RANKS = [
        { name: 'Initiate',    min: 0 },
        { name: 'Scholar',     min: 100 },
        { name: 'Apprentice',  min: 300 },
        { name: 'Journeyman',  min: 700 },
        { name: 'Artisan',     min: 1500 },
        { name: 'Sovereign',   min: 3000 },
        { name: 'Luminary',    min: 6000 },
    ]

    const currentLumens = lumensData?.lumens || 0
    const rank = [...FOUNDRY_RANKS].reverse().find(r => currentLumens >= r.min) || FOUNDRY_RANKS[0]
    const nextRank = FOUNDRY_RANKS.find(r => r.min > currentLumens) || null
    const rankProgress = nextRank 
        ? ((currentLumens - rank.min) / (nextRank.min - rank.min)) * 100 
        : 100

    // Extract first name robustly
    const firstName = profile?.full_name?.trim().split(/\s+/)[0] || 'Scholar'

    return (
        <div className="container px-4 py-8 mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Welcome back, {firstName}</h1>
                    <p className="text-muted-foreground">Ready to master your KS2 & GCSE subjects today?</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl">
                        <Flame className="h-5 w-5 text-amber-500 animate-pulse" />
                        <div className="text-sm">
                            <p className="font-bold text-amber-500 leading-tight">{lumensData?.streak_days || 0} Day Streak</p>
                            <p className="text-[10px] text-amber-600/70 font-semibold uppercase tracking-widest">Sovereign Habit</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Rank & Lumens Card */}
                <Card className="lg:col-span-2 border-amber-500/20 bg-gradient-to-br from-slate-900 to-slate-950 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Award className="h-40 w-40 text-amber-500 rotate-12" />
                    </div>
                    <CardContent className="p-8 relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="space-y-2">
                                <p className="text-amber-500 font-bold uppercase tracking-[0.2em] text-xs">Current Foundry Rank</p>
                                <h2 className="text-4xl font-black text-white tracking-tight">{rank.name}</h2>
                                <div className="flex items-center gap-4 pt-2">
                                    <div className="bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                        <span className="text-amber-400 font-bold text-sm">{currentLumens.toLocaleString()} Lumens</span>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-64 space-y-3">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                                    <span>Progress to {nextRank?.name || 'Max Rank'}</span>
                                    <span>{Math.round(rankProgress)}%</span>
                                </div>
                                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700 p-0.5">
                                    <div 
                                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-1000 ease-out" 
                                        style={{ width: `${rankProgress}%` }}
                                    />
                                </div>
                                <p className="text-[10px] text-slate-500 font-medium italic text-right">
                                    {nextRank ? `${(nextRank.min - currentLumens).toLocaleString()} Lumens until ${nextRank.name}` : 'Highest Rank Achieved'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Profile Snapshot */}
                <Card className="border-primary/20 bg-muted/30">
                    <CardContent className="p-8 flex flex-col h-full justify-center">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-primary/10 p-3 rounded-xl">
                                <User className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white leading-tight">Student Profile</h3>
                                {user?.user_metadata?.isPremium ? (
                                    <span className="text-[10px] font-black uppercase text-amber-500 tracking-tighter">Elite Tier Member</span>
                                ) : (
                                    <span className="text-[10px] font-bold uppercase text-slate-500">Standard Tier</span>
                                )}
                            </div>
                        </div>
                        <div className="space-y-3 text-sm border-t border-slate-800 pt-4">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Year Group</span>
                                <span className="font-bold text-slate-200">{profile?.year_group || 'Not set'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Exam Board</span>
                                <span className="font-bold text-slate-200">{profile?.exam_board || 'Not set'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Target Grade</span>
                                <span className="font-bold text-primary">{profile?.target_grade || 'Not set'}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

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
