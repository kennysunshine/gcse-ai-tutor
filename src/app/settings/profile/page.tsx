"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { User, Mail, GraduationCap, Trophy, Target, Save, CheckCircle2 } from 'lucide-react'

export default function ProfileSettingsPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState({
        full_name: '',
        email: '',
        year_group: '',
        exam_board: '',
        target_grade: ''
    })

    const [badges, setBadges] = useState<any[]>([])

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser()
            if (!authUser) {
                router.push('/login')
                return
            }
            setUser(authUser)

            const [profileRes, badgesRes] = await Promise.all([
                supabase.from('profiles').select('*').eq('id', authUser.id).single(),
                supabase.from('student_badges').select('*').eq('student_id', authUser.id)
            ])

            if (profileRes.data) {
                setProfile({
                    full_name: profileRes.data.full_name || '',
                    email: authUser.email || '',
                    year_group: profileRes.data.year_group || '',
                    exam_board: profileRes.data.exam_board || '',
                    target_grade: profileRes.data.target_grade || ''
                })
            }
            if (badgesRes.data) {
                setBadges(badgesRes.data)
            }
            setLoading(false)
        }
        fetchProfile()
    }, [router])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setSaved(false)

        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                full_name: profile.full_name,
                year_group: profile.year_group,
                exam_board: profile.exam_board,
                target_grade: profile.target_grade,
                updated_at: new Date().toISOString()
            }, { onConflict: 'id' })

        if (!error) {
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } else {
            console.error("Error saving profile:", error)
        }
        setSaving(false)
    }

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading profile...</div>
    }

    // Badge logic
    const earnedBadgeIds = new Set(badges.map(b => b.badge_id))
    const totalPossible = 43

    return (
        <div className="container px-4 py-8 mx-auto max-w-4xl space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Profile & Achievement</h1>
                <p className="text-muted-foreground">Manage your educational identity and view your Sovereign Library progress.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <form onSubmit={handleSave}>
                        <Card className="border-primary/20 bg-slate-900/50 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <User className="h-5 w-5 text-primary" />
                                    Academic Identity
                                </CardTitle>
                                <CardDescription>This information is used to calibrate your Socratic Mentor.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="full_name" className="flex items-center gap-2 text-sm font-medium text-slate-300">
                                            Full Name
                                        </Label>
                                        <Input
                                            id="full_name"
                                            value={profile.full_name}
                                            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                            placeholder="John Doe"
                                            className="bg-slate-800 border-slate-700 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-slate-300">
                                            <Mail className="h-3.5 w-3.5" /> Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            value={profile.email}
                                            disabled
                                            className="bg-slate-900 border-slate-800 text-slate-500"
                                        />
                                        <p className="text-[10px] text-muted-foreground italic">Email changes must be verified via security portal.</p>
                                    </div>
                                </div>

                                <div className="h-px bg-slate-800 my-2"></div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="year_group" className="flex items-center gap-2 text-sm font-medium text-slate-300">
                                            <GraduationCap className="h-3.5 w-3.5" /> Year Group
                                        </Label>
                                        <Select
                                            value={profile.year_group}
                                            onValueChange={(val) => setProfile({ ...profile, year_group: val })}
                                        >
                                            <SelectTrigger id="year_group" className="bg-slate-800 border-slate-700 text-white">
                                                <SelectValue placeholder="Select year" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-slate-700">
                                                <SelectItem value="Year 9">Year 9</SelectItem>
                                                <SelectItem value="Year 10">Year 10</SelectItem>
                                                <SelectItem value="Year 11">Year 11</SelectItem>
                                                <SelectItem value="KS2 (Year 6)">KS2 (Year 6)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="exam_board" className="flex items-center gap-2 text-sm font-medium text-slate-300">
                                            <Trophy className="h-3.5 w-3.5" /> Exam Board
                                        </Label>
                                        <Select
                                            value={profile.exam_board}
                                            onValueChange={(val) => setProfile({ ...profile, exam_board: val })}
                                        >
                                            <SelectTrigger id="exam_board" className="bg-slate-800 border-slate-700 text-white">
                                                <SelectValue placeholder="Select board" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-slate-700">
                                                <SelectItem value="AQA">AQA</SelectItem>
                                                <SelectItem value="Edexcel">Edexcel</SelectItem>
                                                <SelectItem value="OCR">OCR</SelectItem>
                                                <SelectItem value="WJEC">WJEC</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="target_grade" className="flex items-center gap-2 text-sm font-medium text-slate-300">
                                            <Target className="h-3.5 w-3.5" /> Target Grade
                                        </Label>
                                        <Select
                                            value={profile.target_grade}
                                            onValueChange={(val) => setProfile({ ...profile, target_grade: val })}
                                        >
                                            <SelectTrigger id="target_grade" className="bg-slate-800 border-slate-700 text-white">
                                                <SelectValue placeholder="Select grade" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-slate-700">
                                                <SelectItem value="Grades 4-5">Grades 4-5</SelectItem>
                                                <SelectItem value="Grades 6-7">Grades 6-7</SelectItem>
                                                <SelectItem value="Grades 8-9">Grades 8-9</SelectItem>
                                                <SelectItem value="KS2 Expected">KS2 Expected</SelectItem>
                                                <SelectItem value="KS2 Greater Depth">KS2 Greater Depth</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t border-slate-800 pt-6 bg-slate-900/30">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => router.push('/dashboard')}
                                    className="text-slate-400 hover:text-white"
                                >
                                    Return to Dashboard
                                </Button>
                                <Button
                                    type="submit"
                                    className="gap-2 px-8 font-bold bg-primary hover:bg-primary/90"
                                    disabled={saving}
                                >
                                    {saved ? (
                                        <>
                                            <CheckCircle2 className="h-4 w-4" />
                                            Changes Saved
                                        </>
                                    ) : saving ? (
                                        "Saving..."
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            Update Calibration
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>

                <div className="space-y-6">
                    <Card className="border-amber-500/20 bg-slate-900/50 backdrop-blur">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
                                <Trophy className="h-5 w-5 text-amber-500" />
                                Foundry Canon
                            </CardTitle>
                            <CardDescription>Mastery badges from the Sovereign Library.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-4 gap-3">
                                {badges.length > 0 ? (
                                    badges.map((badge) => (
                                        <div key={badge.id} className="relative group cursor-help" title={badge.badge_name}>
                                            <img
                                                src={badge.badge_image_url || '/api/placeholder/100/150'}
                                                alt={badge.badge_name}
                                                className="w-full aspect-[2/3] object-cover rounded-md shadow-lg ring-1 ring-amber-500/50"
                                            />
                                            <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-0.5 shadow">
                                                <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-4 p-8 text-center border-2 border-dashed border-slate-800 rounded-2xl">
                                        <p className="text-xs text-slate-500 italic">No mastery badges earned yet.</p>
                                        <Link href="/library">
                                            <Button variant="link" className="text-[10px] text-amber-500 h-auto p-0 mt-1">Visit Library →</Button>
                                        </Link>
                                    </div>
                                )}
                                
                                {/* Placeholder "locked" badges to show progress */}
                                {Array.from({ length: Math.max(0, 12 - badges.length) }).map((_, i) => (
                                    <div key={`locked-${i}`} className="w-full aspect-[2/3] bg-slate-800/50 rounded-md border border-slate-700/50 flex items-center justify-center grayscale opacity-30">
                                        <Target className="h-4 w-4 text-slate-600" />
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-6 pt-6 border-t border-slate-800">
                                <div className="flex justify-between text-xs font-bold mb-2">
                                    <span className="text-slate-400 uppercase tracking-widest">Collection Progress</span>
                                    <span className="text-amber-500">{badges.length} / {totalPossible}</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-amber-500 transition-all duration-1000" 
                                        style={{ width: `${(badges.length / totalPossible) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="border-primary/20 bg-slate-900/50 backdrop-blur">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
                                <Target className="h-5 w-5 text-primary" />
                                Motivation
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-slate-400 space-y-4">
                            <p>"The world’s most powerful people aren't just readers—they are obsessive applied learners."</p>
                            <p className="border-l-2 border-primary/30 pl-3 italic text-xs">Remember: every book in the Canon is a shortcut to decades of wisdom.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
