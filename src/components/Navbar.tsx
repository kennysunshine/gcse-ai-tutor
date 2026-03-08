
"use client"

import Link from 'next/link'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Menu, X } from 'lucide-react'

export function Navbar() {
    const [userRole, setUserRole] = useState<string>('student')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isPremium, setIsPremium] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
            } else {
                setIsLoggedIn(false)
                setUserRole('student')
                setIsPremium(false)
            }
        }

        checkRole()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                    checkRole()
                }
            }
        )

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container flex h-16 items-center justify-between mx-auto px-4 relative">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                        <span className="text-2xl" aria-hidden="true">🎓</span>
                        <span>LumenForge</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                        {!isLoggedIn ? (
                            <>
                                <Link href="/#learners" className="transition-colors hover:text-primary">Learners</Link>
                                <Link href="/#parents" className="transition-colors hover:text-primary">Parents</Link>
                                <Link href="/#teachers" className="transition-colors hover:text-primary">Teachers</Link>
                                <Link href="/scholars" className="transition-colors hover:text-primary">Foundry Scholars</Link>
                            </>
                        ) : (
                            <>
                                <Link href="/" className="transition-colors hover:text-primary">Home</Link>
                                {userRole === 'teacher' ? (
                                    <Link href="/teacher" className="transition-colors hover:text-primary font-bold text-destructive">Supervisor Dashboard</Link>
                                ) : (
                                    <Link href="/dashboard" className="transition-colors hover:text-primary">Subjects Dashboard</Link>
                                )}
                                {isPremium && (
                                    <Link href="/discovery" className="transition-colors hover:text-amber-600 dark:hover:text-amber-500 font-bold flex items-center gap-1 group">
                                        <span className="text-amber-500">🔥</span> Discovery
                                    </Link>
                                )}
                            </>
                        )}
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

                    {/* Mobile Hamburger Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-expanded={isMobileMenuOpen}
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t bg-background/95 backdrop-blur absolute top-16 left-0 w-full shadow-lg z-40 animate-in slide-in-from-top-2 duration-200">
                    <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
                        {!isLoggedIn ? (
                            <>
                                <Link href="/#learners" className="text-lg font-medium p-2 hover:bg-muted rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Learners</Link>
                                <Link href="/#parents" className="text-lg font-medium p-2 hover:bg-muted rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Parents</Link>
                                <Link href="/#teachers" className="text-lg font-medium p-2 hover:bg-muted rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Teachers</Link>
                                <Link href="/scholars" className="text-lg font-medium p-2 hover:bg-muted rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Foundry Scholars</Link>
                                <div className="h-px bg-border my-2"></div>
                                <div className="flex flex-col gap-3">
                                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full justify-center">Log In</Button>
                                    </Link>
                                    <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button className="w-full justify-center">Get Started</Button>
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/" className="text-lg font-medium p-2 hover:bg-muted rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                                {userRole === 'teacher' ? (
                                    <Link href="/teacher" className="text-lg font-medium p-2 hover:bg-muted rounded-md text-destructive" onClick={() => setIsMobileMenuOpen(false)}>Supervisor Dashboard</Link>
                                ) : (
                                    <Link href="/dashboard" className="text-lg font-medium p-2 hover:bg-muted rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Subjects Dashboard</Link>
                                )}
                                {isPremium && (
                                    <Link href="/discovery" className="text-lg font-bold p-2 hover:bg-muted rounded-md text-amber-600 dark:text-amber-500 flex items-center gap-2 group" onClick={() => setIsMobileMenuOpen(false)}>
                                        <span className="text-amber-500" aria-hidden="true">🔥</span> Discovery
                                    </Link>
                                )}
                                <div className="h-px bg-border my-2"></div>
                                <div className="flex flex-col gap-3">
                                    {isPremium && (
                                        <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-md shadow-md flex items-center justify-center gap-2 border border-orange-300">
                                            <span aria-hidden="true">⚡</span> ELITE ACCOUNT
                                        </div>
                                    )}
                                    <Button variant="ghost" className="w-full justify-center bg-muted/50 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={async () => { await supabase.auth.signOut(); window.location.href = '/' }}>
                                        Sign Out
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
