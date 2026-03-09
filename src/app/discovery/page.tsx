"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Flame, Target, Rocket, Lock } from 'lucide-react'

export default function DiscoveryDashboard() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [passions, setPassions] = useState<string[]>([])
    const [newPassion, setNewPassion] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        const verifyEliteAccess = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
                return
            }

            // Check if user is Elite
            if (session.user.user_metadata?.isPremium !== true) {
                router.push('/dashboard')
                return
            }

            setUser(session.user)

            // Fetch passions
            const { data } = await supabase
                .from('profiles')
                .select('passions')
                .eq('id', session.user.id)
                .single()

            if (data?.passions) {
                setPassions(data.passions)
            }
            setIsLoading(false)
        }

        verifyEliteAccess()
    }, [router])

    const handleAddPassion = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newPassion.trim()) return

        const updatedPassions = [...passions, newPassion.trim()]
        setPassions(updatedPassions)
        setNewPassion('')
        await savePassions(updatedPassions)
    }

    const handleRemovePassion = async (index: number) => {
        const updatedPassions = passions.filter((_, i) => i !== index)
        setPassions(updatedPassions)
        await savePassions(updatedPassions)
    }

    const savePassions = async (updatedPassions: string[]) => {
        setIsSaving(true)
        try {
            if (user) {
                const { error } = await supabase
                    .from('profiles')
                    .upsert({
                        id: user.id,
                        passions: updatedPassions,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'id' })

                if (error) {
                    console.error("Discovery Engine: Failed to save passions to library controller:", error)
                }
            }
        } catch (err) {
            console.error("Discovery Engine: Critical submission error:", err)
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center pt-20">Loading Elite Workspace...</div>
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-background">
            <div className="container mx-auto px-4 py-12 max-w-5xl">
                <div className="mb-10 animate-in fade-in slide-in-from-bottom-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-bold mb-4 border border-amber-200 dark:border-amber-800">
                        <Flame className="w-4 h-4" />
                        LumenForge Elite
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Discovery Engine</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl font-medium">
                        Configure your 'Disruptor' parameters. Map your real-world interests to your academic goals to unlock profound lateral thinking.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Passions Engine */}
                    <Card className="border-0 shadow-xl bg-white dark:bg-card rounded-[2rem] overflow-hidden">
                        <CardHeader className="bg-slate-50 dark:bg-muted/20 border-b border-slate-100 dark:border-slate-800 pb-6 pt-8">
                            <CardTitle className="flex items-center gap-3 text-2xl">
                                <Target className="w-6 h-6 text-primary" />
                                Growth Hooks (Passions)
                            </CardTitle>
                            <CardDescription className="text-sm pt-2">
                                What do you care about outside of school? We use these anchors to make abstract GCSE concepts intuitively click.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <form onSubmit={handleAddPassion} className="flex gap-2 mb-6">
                                <Input
                                    placeholder="e.g. Formula 1, Chess, Fashion Design..."
                                    value={newPassion}
                                    onChange={(e) => setNewPassion(e.target.value)}
                                    className="rounded-xl border-slate-200 dark:border-slate-700"
                                />
                                <Button type="submit" disabled={isSaving || !newPassion.trim()} className="rounded-xl">Add</Button>
                            </form>

                            <div className="flex flex-wrap gap-2">
                                {passions.length === 0 ? (
                                    <p className="text-sm text-muted-foreground italic w-full text-center py-4">No passions mapped yet. Add your first interest above!</p>
                                ) : (
                                    passions.map((passion, idx) => (
                                        <div key={idx} className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold border border-primary/20">
                                            <span>{passion}</span>
                                            <button
                                                onClick={() => handleRemovePassion(idx)}
                                                className="hover:text-destructive transition-colors focus:outline-none"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Disruptor Mode Intel */}
                    <Card className="border-0 shadow-2xl bg-gradient-to-br from-indigo-900 to-purple-900 text-white rounded-[2rem] overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                        <CardHeader className="pb-4 pt-8 relative z-10">
                            <CardTitle className="flex items-center gap-3 text-2xl text-white">
                                <Rocket className="w-6 h-6 text-amber-400" />
                                Disruptor Mode Active
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 relative z-10 flex flex-col h-[calc(100%-5rem)]">
                            <div className="space-y-6 flex-grow">
                                <div>
                                    <h3 className="font-bold text-amber-300 mb-2">Engage-Enquire-Excel</h3>
                                    <p className="text-sm text-indigo-100/80 leading-relaxed">
                                        Because you are an Elite member, your Socratic Mentor is running the Millfield conceptual framework. It will push you harder, demand alternative methods, and intentionally challenge your assumptions.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-amber-300 mb-2">Intellectual Sovereignty</h3>
                                    <p className="text-sm text-indigo-100/80 leading-relaxed">
                                        You are no longer just memorizing the curriculum. You are learning how to learn.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3 text-sm font-bold text-amber-400">
                                <Lock className="w-4 h-4" />
                                Secure Elite Workspace
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
