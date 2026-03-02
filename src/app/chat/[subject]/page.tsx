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
import { Menu, Send, Sparkles, Mic, MicOff, AlertTriangle, Lock } from 'lucide-react'
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

    // Auth check
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
            } else {
                setUser(session.user)
                // Ideally load chat history from Supabase here
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
        <div className="flex h-[calc(100vh-4rem)] bg-background">
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
                    </div>
                </header>

                {/* Messages List */}
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
                <div className="p-4 border-t bg-background">
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
                        <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </div>
                    <p className="text-center text-xs text-muted-foreground mt-2">
                        GCSEmigo can make mistakes. Always check important info.
                    </p>
                </div>
            </div>
        </div>
    )
}
