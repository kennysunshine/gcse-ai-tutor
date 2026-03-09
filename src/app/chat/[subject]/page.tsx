/* eslint-disable @typescript-eslint/no-explicit-any, react/no-unescaped-entities */
"use client"

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Send, Sparkles, Mic, MicOff, AlertTriangle, Lock, Lightbulb, Target, ArrowUpRight, Flame } from 'lucide-react'
import { SUBJECTS } from '@/lib/subjects'
import { supabase } from '@/lib/supabase'

type Message = {
    role: 'user' | 'model'
    message: string
}

export default function ChatPage() {
    const params = useParams()
    const router = useRouter()
    const subjectSlug = params.subject as string
    const currentSubject = SUBJECTS.find(s => s.slug === subjectSlug)

    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [isListening, setIsListening] = useState(false)
    const [hasSetIntention, setHasSetIntention] = useState(false)
    const [intentionInput, setIntentionInput] = useState('')
    const [isPremium, setIsPremium] = useState(false)
    const [passions, setPassions] = useState<string[]>([])

    // Exit Ticket State
    const [isSessionEnded, setIsSessionEnded] = useState(false)
    const [ahaMoment, setAhaMoment] = useState('')
    const [isSubmittingExit, setIsSubmittingExit] = useState(false)
    const [brillianceBriefing, setBrillianceBriefing] = useState<string | null>(null)
    const [showMilestone, setShowMilestone] = useState(false)

    const recognitionRef = useRef<any>(null)
    const initialInputRef = useRef('')

    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Speech Recognition Setup
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition()
                recognition.continuous = false
                recognition.interimResults = false
                recognition.lang = 'en-GB'

                recognition.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript
                    setInput(initialInputRef.current + (initialInputRef.current ? ' ' : '') + transcript)
                }

                recognition.onerror = (event: any) => {
                    console.error('Speech recognition error:', event.error)
                    setIsListening(false)
                    // Added alert so user can see if it's a permission issue ('not-allowed')
                    alert("Microphone error: " + event.error + ". Please ensure permissions are granted.")
                }

                recognition.onend = () => {
                    setIsListening(false)
                }

                recognitionRef.current = recognition
            }
        }
    }, [])

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert('Speech recognition is not supported in your browser. Please try Chrome or Safari.')
            return
        }

        if (isListening) {
            recognitionRef.current.stop()
            setIsListening(false)
        } else {
            try {
                initialInputRef.current = input
                recognitionRef.current.start()
                setIsListening(true)
            } catch (e) {
                console.error('Error starting speech recognition:', e)
            }
        }
    }

    // Auth check & Profile Fetch
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
            } else {
                setUser(session.user)
                setIsPremium(session.user.user_metadata?.isPremium === true)
                // Fetch Passions for the active session
                const { data } = await supabase.from('profiles').select('passions').eq('id', session.user.id).single()
                if (data?.passions) {
                    setPassions(data.passions)
                }
            }
        }
        checkUser()
    }, [router])

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMessage: Message = { role: 'user', message: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage.message,
                    history: messages,
                    subject: currentSubject?.name,
                    isPremium: false // Secured validation in the API route protects this flag
                }),
            })

            if (!response.ok) throw new Error('Failed to send message')
            if (!response.body) throw new Error('No response body')

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let done = false
            let fullResponse = ''

            // Add placeholder for AI response
            setMessages(prev => [...prev, { role: 'model', message: '' }])

            while (!done) {
                const { value, done: doneReading } = await reader.read()
                done = doneReading
                const chunkValue = decoder.decode(value, { stream: !done })
                fullResponse += chunkValue

                // Update the last message with the chunk
                setMessages(prev => {
                    const newMessages = [...prev]
                    newMessages[newMessages.length - 1].message = fullResponse
                    return newMessages
                })
            }
        } catch (error) {
            console.error(error)
            // Optionally remove the user message or show error
        } finally {
            setIsLoading(false)
        }
    }

    const handleEndSession = async () => {
        if (!ahaMoment.trim() || isSubmittingExit) return;
        setIsSubmittingExit(true);

        try {
            const response = await fetch('/api/exit-ticket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    aha_moment: ahaMoment,
                    subject: currentSubject?.name,
                    passions: passions,
                    chat_history: messages // Pass for potential context, though unused right now
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.brillianceBriefing) {
                    setBrillianceBriefing(data.brillianceBriefing);
                }
                setShowMilestone(true);
            } else {
                console.error("Failed to submit exit ticket");
            }
        } catch (error) {
            console.error("Exit ticket Error:", error);
        } finally {
            setIsSubmittingExit(false);
        }
    }

    if (!currentSubject) return <div className="p-8">Subject not found</div>

    const SidebarContent = () => (
        <div className="py-4">
            <h2 className="mb-4 px-4 text-lg font-semibold tracking-tight">Subjects</h2>
            <div className="space-y-1 p-2">
                {SUBJECTS.map((subject) => (
                    <Link key={subject.slug} href={`/chat/${subject.slug}`}>
                        <Button
                            variant={subjectSlug === subject.slug ? "secondary" : "ghost"}
                            className={`w-full justify-start ${subjectSlug === subject.slug ? 'font-bold' : ''}`}
                        >
                            <span className="mr-2 text-xl">{subject.icon}</span>
                            {subject.name}
                        </Button>
                    </Link>
                ))}
            </div>
            <div className="absolute bottom-4 left-4 right-4">
                <Link href="/dashboard">
                    <Button variant="outline" className="w-full">
                        Back to Dashboard
                    </Button>
                </Link>
            </div>
        </div>
    )

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-background overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 border-r bg-muted/20">
                <ScrollArea className="h-full">
                    <SidebarContent />
                </ScrollArea>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Header (Mobile Sidebar Trigger + Subject Info) */}
                <header className="flex items-center h-14 border-b px-6 bg-background/95 backdrop-blur z-10">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden mr-2">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-64">
                            <SidebarContent />
                        </SheetContent>
                    </Sheet>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{currentSubject.icon}</span>
                        <h1 className="text-lg font-bold">{currentSubject.name} Tutor</h1>
                    </div>
                    <div className="ml-auto flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                            <Sparkles className="h-4 w-4 mr-1 text-yellow-500" />
                            <span className="hidden sm:inline">AI Tutor Active</span>
                        </div>
                        {hasSetIntention && !isSessionEnded && (
                            <Button variant="outline" size="sm" onClick={() => setIsSessionEnded(true)} className="ml-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold dark:border-red-900/50 dark:hover:bg-red-900/20">
                                End Session
                            </Button>
                        )}
                    </div>
                </header>

                {/* Main Content Area */}
                {isSessionEnded ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-muted/10 relative overflow-hidden">
                        {/* Interactive Exit Space */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/50 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0"></div>
                        <div className="max-w-2xl w-full bg-white dark:bg-card p-8 md:p-12 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-500 z-10 relative">
                            {showMilestone ? (
                                <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-green-200 dark:border-green-800">
                                        <Target className="w-10 h-10" />
                                    </div>
                                    <h2 className="text-3xl font-extrabold mb-4">Syllabus Mastery Updated!</h2>

                                    <div className="bg-slate-50 dark:bg-muted/50 p-6 rounded-2xl mb-8 border border-slate-100 dark:border-slate-800">
                                        <div className="flex justify-between text-sm font-bold text-foreground mb-3">
                                            <span>Current Trajectory</span>
                                            <span className="text-primary flex items-center gap-1"><ArrowUpRight className="w-4 h-4" /> 72%</span>
                                        </div>
                                        <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner flex">
                                            <div className="h-full bg-primary rounded-full w-[70%]"></div>
                                            <div className="h-full bg-green-400 rounded-r-full w-[2%] animate-pulse"></div>
                                        </div>
                                    </div>

                                    {brillianceBriefing && (
                                        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-8 rounded-2xl mb-8 relative overflow-hidden text-left shadow-lg">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full filter blur-2xl -translate-y-1/2 translate-x-1/3"></div>
                                            <div className="flex items-center gap-2 text-amber-300 font-bold mb-3 text-sm tracking-wider uppercase">
                                                <Flame className="w-4 h-4" /> Elite Brilliance Briefing
                                            </div>
                                            <p className="text-[17px] font-medium leading-relaxed italic relative z-10 text-indigo-50">
                                                "{brillianceBriefing}"
                                            </p>
                                        </div>
                                    )}

                                    <Button size="lg" className="rounded-full px-10 py-6 text-lg font-bold shadow-xl" onClick={() => router.push('/dashboard')}>
                                        Return to Dashboard
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Lightbulb className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-3xl font-extrabold mb-3">Discovery Exit Ticket</h2>
                                    <p className="text-muted-foreground mb-8 text-[17px] leading-relaxed max-w-lg mx-auto">
                                        Genius isn't just about finishing the work; it's about realizing how you got there. What was your <strong>'Aha!'</strong> moment today? How did you break the mould?
                                    </p>
                                    <div className="space-y-6">
                                        <textarea
                                            placeholder="Example: 'I finally understood how to factorise quadratics by spotting the number pattern before relying on the formula...' "
                                            className="w-full min-h-[120px] p-6 text-lg rounded-2xl bg-slate-50 dark:bg-muted border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                                            value={ahaMoment}
                                            onChange={(e) => setAhaMoment(e.target.value)}
                                            autoFocus
                                        />
                                        <div className="flex gap-4">
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                className="flex-1 rounded-xl py-6 font-bold text-md"
                                                onClick={() => setIsSessionEnded(false)}
                                                disabled={isSubmittingExit}
                                            >
                                                Back to Chat
                                            </Button>
                                            <Button
                                                size="lg"
                                                className="flex-1 rounded-xl py-6 font-bold text-md shadow-md hover:shadow-lg transition-all"
                                                onClick={handleEndSession}
                                                disabled={!ahaMoment.trim() || isSubmittingExit}
                                            >
                                                {isSubmittingExit ? "Logging Discovery..." : "Lock in Discovery"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : !hasSetIntention ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-muted/10">
                        <div className="max-w-md w-full bg-white dark:bg-card p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 text-center animate-in zoom-in-95 duration-500">
                            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                <Sparkles className="h-8 w-8" />
                            </div>
                            <h2 className="text-2xl font-extrabold mb-3">Active Intention</h2>
                            <p className="text-muted-foreground mb-8 text-[15px] leading-relaxed">
                                Before we begin, set your focus for this session. Type a positive mantra (e.g., "I am being a Disruptor today", "I will embrace mistakes").
                            </p>
                            <form onSubmit={(e) => { e.preventDefault(); if (intentionInput.trim()) setHasSetIntention(true); }} className="space-y-4">
                                <Input
                                    placeholder="Enter your mantra..."
                                    className="text-center py-6 text-lg rounded-xl bg-slate-50 dark:bg-muted border-slate-200 dark:border-slate-700"
                                    value={intentionInput}
                                    onChange={(e) => setIntentionInput(e.target.value)}
                                    autoFocus
                                />
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full rounded-xl py-6 font-bold text-md shadow-md hover:shadow-lg transition-all"
                                    disabled={!intentionInput.trim()}
                                >
                                    Forge My Mindset
                                </Button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 p-4">
                            <div className="max-w-3xl mx-auto space-y-4 pb-4">
                                {/* Welcome Message */}
                                <div className="flex gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                                    </Avatar>
                                    <div className="bg-muted p-3 rounded-lg rounded-tl-none max-w-[85%] text-sm leading-relaxed">
                                        <p>Hello! I'm your Socratic tutor for {currentSubject.name}. I'm here to guide you, not just give you answers. What topic are you working on today?</p>
                                    </div>
                                </div>

                                {messages.map((msg, i) => {
                                    let thinking = null;
                                    let displayMessage = msg.message;

                                    let isCrisis = false;
                                    let isEliteLocked = false;

                                    if (msg.role === 'model' && msg.message.includes('<thinking>')) {
                                        const startIdx = msg.message.indexOf('<thinking>') + 10;
                                        const endIdx = msg.message.indexOf('</thinking>');
                                        if (endIdx !== -1) {
                                            thinking = msg.message.substring(startIdx, endIdx).trim();
                                            displayMessage = msg.message.substring(endIdx + 11).trim();
                                        } else {
                                            thinking = msg.message.substring(startIdx).trim();
                                            displayMessage = ''; // Still streaming the thinking block
                                        }
                                    }

                                    if (displayMessage.includes('<CRISIS_FLAG>')) {
                                        isCrisis = true;
                                        displayMessage = displayMessage.replace(/<CRISIS_FLAG>/g, '').trim();
                                    }

                                    if (displayMessage.includes('<elite_insight_locked>true</elite_insight_locked>')) {
                                        isEliteLocked = true;
                                        displayMessage = displayMessage.replace(/<elite_insight_locked>true<\/elite_insight_locked>/g, '').trim();
                                    }

                                    return (
                                        <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                            <Avatar className="h-8 w-8">
                                                {msg.role === 'user' ? (
                                                    <>
                                                        <AvatarImage src={user?.user_metadata?.avatar_url} />
                                                        <AvatarFallback>U</AvatarFallback>
                                                    </>
                                                ) : (
                                                    <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                                                )}
                                            </Avatar>
                                            <div className={`
                                        p-4 rounded-lg max-w-[85%] text-sm leading-relaxed shadow-sm flex flex-col gap-2
                                        ${msg.role === 'user'
                                                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                    : 'bg-muted rounded-tl-none border border-border'}
                                        ${isCrisis ? 'border-2 border-destructive bg-destructive/10' : ''}
                                    `}>
                                                {isCrisis && (
                                                    <div className="flex bg-destructive/20 fill-destructive/50 border border-destructive/50 text-destructive p-3 rounded items-start gap-2 mb-2 font-medium">
                                                        <AlertTriangle className="h-5 w-5 shrink-0" />
                                                        <div className="flex-1">
                                                            <p className="font-bold text-sm">Automated Safeguarding Flag</p>
                                                            <p className="text-xs mt-1">This interaction has been logged securely and an alert has been routed to your designated safeguarding lead.</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {isEliteLocked && (
                                                    <div className="flex bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 p-3 rounded items-start gap-2 mt-2 font-medium border border-amber-200 dark:border-amber-800">
                                                        <Lock className="h-5 w-5 shrink-0" />
                                                        <div className="flex-1">
                                                            <p className="font-bold text-sm">LumenForge Elite Insight Locked</p>
                                                            <p className="text-xs mt-1">You've demonstrated high proficiency! <Link href="/sandbox" className="underline hover:text-amber-700">Upgrade to Premium</Link> to unlock strategic leadership context for this topic.</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {thinking && (
                                                    <details className="mb-2 text-xs bg-background/50 rounded p-2 border border-border/50">
                                                        <summary className="cursor-pointer font-semibold text-muted-foreground hover:text-foreground transition-colors outline-none">
                                                            🧠 View Tutor's Thinking Process
                                                        </summary>
                                                        <div className="mt-2 text-muted-foreground whitespace-pre-wrap font-mono">
                                                            {thinking}
                                                        </div>
                                                    </details>
                                                )}
                                                {displayMessage && <span className="whitespace-pre-wrap">{displayMessage}</span>}
                                                {!displayMessage && thinking && (
                                                    <div className="animate-pulse flex items-center h-4 mt-2">
                                                        <span className="w-1 h-1 bg-primary/50 rounded-full mx-0.5 animate-bounce"></span>
                                                        <span className="w-1 h-1 bg-primary/50 rounded-full mx-0.5 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                                        <span className="w-1 h-1 bg-primary/50 rounded-full mx-0.5 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                {isLoading && messages[messages.length - 1]?.role !== 'model' && (
                                    <div className="flex gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                                        </Avatar>
                                        <div className="bg-muted p-3 rounded-lg rounded-tl-none">
                                            <span className="animate-pulse">Thinking...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>

                        {/* Input Area */}
                        <div className="p-4 border-t bg-background relative z-20">
                            <div className="max-w-3xl mx-auto flex gap-2">
                                <Button
                                    variant={isListening ? "destructive" : "secondary"}
                                    size="icon"
                                    onClick={toggleListening}
                                    className={`shrink-0 ${isListening ? "animate-pulse" : ""}`}
                                    title="Voice input"
                                >
                                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                                </Button>
                                <Input
                                    placeholder={`Ask about ${currentSubject.name}...`}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                    disabled={isLoading}
                                    className="flex-1"
                                />
                                <Button onClick={handleSend} disabled={isLoading || !input.trim() || !hasSetIntention}>
                                    <Send className="h-4 w-4" />
                                    <span className="sr-only">Send</span>
                                </Button>
                            </div>
                            <p className="text-center text-xs text-muted-foreground mt-2">
                                LumenForge can make mistakes. Always check important info.
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
