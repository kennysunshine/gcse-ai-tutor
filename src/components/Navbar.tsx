
"use client"

import Link from 'next/link'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function Navbar() {
    const [userRole, setUserRole] = useState<string>('student')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isPremium, setIsPremium] = useState(false)

    useEffect(() => {
        const checkRole = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                setIsLoggedIn(true)
                setIsPremium(session.user.user_metadata?.isPremium === true)
                const { data } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single()

                if (data) {
                    setUserRole(data.role)
                }
            }
        }
        checkRole()
    }, [])

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container flex h-16 items-center justify-between mx-auto px-4">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                        <span className="text-2xl">🎓</span>
                        <span>LumenForge</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link href="/" className="transition-colors hover:text-primary">Home</Link>
                        {userRole === 'teacher' ? (
                            <Link href="/teacher" className="transition-colors hover:text-primary font-bold text-destructive">Supervisor Dashboard</Link>
                        ) : (
                            <Link href="/dashboard" className="transition-colors hover:text-primary">Subjects Dashboard</Link>
                        )}
                        <Link href="/sandbox" className="transition-colors hover:text-primary flex items-center gap-1 group">
                            <span className="text-yellow-500">💡</span> Idea Sandbox
                            <span className="ml-1 rounded bg-gradient-to-r from-amber-500 to-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm transition-all group-hover:shadow-md">PRO</span>
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <ModeToggle />
                    {isLoggedIn ? (
                        <div className="hidden md:flex items-center gap-3">
                            {isPremium && (
                                <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1 border border-orange-300">
                                    <span>⚡</span> ELITE
                                </div>
                            )}
                            <Button variant="ghost" onClick={async () => { await supabase.auth.signOut(); window.location.href = '/' }}>
                                Sign Out
                            </Button>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="ghost">Log In</Button>
                            </Link>
                            <Link href="/signup">
                                <Button>Get Started</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
