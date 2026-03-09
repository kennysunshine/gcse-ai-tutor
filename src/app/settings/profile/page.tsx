"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/lib/supabase'
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

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }
            setUser(user)

            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (profileData) {
                setProfile({
                    full_name: profileData.full_name || '',
                    email: user.email || '',
                    year_group: profileData.year_group || '',
                    exam_board: profileData.exam_board || '',
                    target_grade: profileData.target_grade || ''
                })
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

    return (
        <div className="container px-4 py-8 mx-auto max-w-2xl space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
                <p className="text-muted-foreground">Manage your educational identity and calibration data.</p>
            </div>

            <form onSubmit={handleSave}>
                <Card className="border-primary/20 bg-background/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            Academic Identity
                        </CardTitle>
                        <CardDescription>This information is used to calibrate your Socratic Mentor.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="full_name" className="flex items-center gap-2 text-sm font-medium">
                                    Full Name
                                </Label>
                                <Input
                                    id="full_name"
                                    value={profile.full_name}
                                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                                    <Mail className="h-3.5 w-3.5" /> Email Address
                                </Label>
                                <Input
                                    id="email"
                                    value={profile.email}
                                    disabled
                                    className="bg-muted"
                                />
                                <p className="text-[10px] text-muted-foreground italic">Email changes must be verified via security portal.</p>
                            </div>
                        </div>

                        <div className="h-px bg-border my-2"></div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="year_group" className="flex items-center gap-2 text-sm font-medium">
                                    <GraduationCap className="h-3.5 w-3.5" /> Year Group
                                </Label>
                                <Select
                                    value={profile.year_group}
                                    onValueChange={(val) => setProfile({ ...profile, year_group: val })}
                                >
                                    <SelectTrigger id="year_group">
                                        <SelectValue placeholder="Select year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Year 9">Year 9</SelectItem>
                                        <SelectItem value="Year 10">Year 10</SelectItem>
                                        <SelectItem value="Year 11">Year 11</SelectItem>
                                        <SelectItem value="KS2 (Year 6)">KS2 (Year 6)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="exam_board" className="flex items-center gap-2 text-sm font-medium">
                                    <Trophy className="h-3.5 w-3.5" /> Exam Board
                                </Label>
                                <Select
                                    value={profile.exam_board}
                                    onValueChange={(val) => setProfile({ ...profile, exam_board: val })}
                                >
                                    <SelectTrigger id="exam_board">
                                        <SelectValue placeholder="Select board" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="AQA">AQA</SelectItem>
                                        <SelectItem value="Edexcel">Edexcel</SelectItem>
                                        <SelectItem value="OCR">OCR</SelectItem>
                                        <SelectItem value="WJEC">WJEC</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="target_grade" className="flex items-center gap-2 text-sm font-medium">
                                    <Target className="h-3.5 w-3.5" /> Target Grade
                                </Label>
                                <Select
                                    value={profile.target_grade}
                                    onValueChange={(val) => setProfile({ ...profile, target_grade: val })}
                                >
                                    <SelectTrigger id="target_grade">
                                        <SelectValue placeholder="Select grade" />
                                    </SelectTrigger>
                                    <SelectContent>
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
                    <CardFooter className="flex justify-between border-t border-primary/10 pt-6">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => router.push('/dashboard')}
                        >
                            Return to Dashboard
                        </Button>
                        <Button
                            type="submit"
                            className="gap-2 px-8 font-bold"
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
    )
}
