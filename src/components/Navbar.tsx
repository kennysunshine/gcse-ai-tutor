
"use client"

import Link from 'next/link'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Menu, X, User, Settings, CreditCard, LogOut, ChevronDown } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
                                <Link href="/faq" className="transition-colors hover:text-primary">FAQ</Link>
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
                                <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border border-orange-300 uppercase tracking-tighter">
                                    ELITE
                                </div>
                            )}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-primary/5">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                            <User className="h-4 w-4 text-primary" />
                                        </div>
                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <Link href="/settings/profile">
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Profile Settings</span>
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link href="/settings/billing">
                                        <DropdownMenuItem className="cursor-pointer">
                                            <CreditCard className="mr-2 h-4 w-4" />
                                            <span>Billing & Sovereignty</span>
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="cursor-pointer text-destructive focus:text-destructive"
                                        onClick={async () => { await supabase.auth.signOut(); window.location.href = '/' }}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Sign Out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
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
                                <Link href="/faq" className="text-lg font-medium p-2 hover:bg-muted rounded-md" onClick={() => setIsMobileMenuOpen(false)}>FAQ</Link>
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
                                <div className="grid grid-cols-2 gap-2">
                                    <Link href="/settings/profile" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full justify-start gap-2 h-12">
                                            <Settings className="h-4 w-4" /> Profile
                                        </Button>
                                    </Link>
                                    <Link href="/settings/billing" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full justify-start gap-2 h-12">
                                            <CreditCard className="h-4 w-4" /> Billing
                                        </Button>
                                    </Link>
                                </div>
                                <Button variant="ghost" className="w-full justify-center bg-muted/50 text-destructive hover:bg-destructive/10 hover:text-destructive h-12" onClick={async () => { await supabase.auth.signOut(); window.location.href = '/' }}>
                                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
