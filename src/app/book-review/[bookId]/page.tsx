"use client"

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Send, Flame, CheckCircle, BookOpen, Loader2 } from 'lucide-react'
import Link from 'next/link'
import booksData from '@/data/books.json'
import { supabase } from '@/lib/supabase'

type Message = { role: 'user' | 'model'; message: string }

type Book = {
  id: string;
  title: string;
  author: string;
  affiliateUrl: string;
  imageUrl: string;
  summary: string;
  foundersNote: string;
  coreThemes: string[];
}

const FOUNDRY_RANKS = [
  { name: 'Initiate',    min: 0 },
  { name: 'Scholar',     min: 100 },
  { name: 'Apprentice',  min: 300 },
  { name: 'Journeyman',  min: 700 },
  { name: 'Artisan',     min: 1500 },
  { name: 'Sovereign',   min: 3000 },
  { name: 'Luminary',    min: 6000 },
]

function getRank(lumens: number) {
  return [...FOUNDRY_RANKS].reverse().find(r => lumens >= r.min) || FOUNDRY_RANKS[0];
}

function getNextRank(lumens: number) {
  return FOUNDRY_RANKS.find(r => r.min > lumens) || null;
}

export default function BookReviewPage() {
  const { bookId } = useParams<{ bookId: string }>()
  const router = useRouter()
  const book = (booksData as Book[]).find(b => b.id === bookId)

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [masteryConfirmed, setMasteryConfirmed] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [lumensEarned] = useState(50)
  const [currentLumens, setCurrentLumens] = useState(0)
  const [hasAlreadyCompleted, setHasAlreadyCompleted] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Check if already completed & load lumen balance
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return; }

      const [masteryRes, lumensRes] = await Promise.all([
        supabase.from('book_mastery').select('id').eq('student_id', session.user.id).eq('book_id', bookId).single(),
        supabase.from('student_lumens').select('lumens').eq('student_id', session.user.id).single()
      ])

      if (masteryRes.data) setHasAlreadyCompleted(true)
      if (lumensRes.data) setCurrentLumens(lumensRes.data.lumens)
    }
    init()
  }, [bookId, router])

  // Kick off the session with the AI's opening question
  useEffect(() => {
    if (!book || messages.length > 0) return
    sendToAI("START_SESSION", [])
  }, [book])

  useEffect(() => {
    // Prevent violent scroll on initial load so the AI's first prompt stays at the top
    if (messages.length > 1) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [messages])

  async function sendToAI(userMessage: string, currentHistory: Message[]) {
    setStreaming(true)

    const aiResponsePlaceholder: Message = { role: 'model', message: '' }
    setMessages(prev => {
      const withUser: Message[] = userMessage === 'START_SESSION'
        ? [...prev]
        : [...prev, { role: 'user' as const, message: userMessage }]
      return [...withUser, aiResponsePlaceholder]
    })

    try {
      const historyToSend = userMessage === 'START_SESSION'
        ? currentHistory
        : [...currentHistory, { role: 'user', message: userMessage }]

      const res = await fetch('/api/book-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage === 'START_SESSION'
            ? `Begin the Book Mastery Session. Start with your first Socratic question. Be direct — open with a question, not an introduction.`
            : userMessage,
          history: historyToSend,
          bookId: book!.id,
          bookTitle: book!.title,
          bookAuthor: book!.author,
          summary: book!.summary,
          coreThemes: book!.coreThemes,
          imageUrl: book!.imageUrl,
        })
      })

      if (!res.body) throw new Error('No stream')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        fullText += chunk

        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'model', message: fullText }
          return updated
        })
      }

      // Check for mastery signal
      if (fullText.includes('<MASTERY_CONFIRMED>') && !masteryConfirmed) {
        setMasteryConfirmed(true)
        setTimeout(() => setShowCelebration(true), 800)
        setCurrentLumens(prev => prev + 50)
      }

      setMessages(prev => {
        const updated = [...prev]
        // Clean the signal from displayed text
        updated[updated.length - 1] = {
          role: 'model',
          message: fullText.replace('<MASTERY_CONFIRMED>', '').trim()
        }
        return updated
      })

    } catch (e) {
      console.error('Book review stream error:', e)
    } finally {
      setStreaming(false)
      inputRef.current?.focus()
    }
  }

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed || streaming || masteryConfirmed) return
    setInput('')
    sendToAI(trimmed, messages)
  }

  if (!book) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">Book not found. <Link href="/library" className="text-primary underline">Return to Library</Link></p>
    </div>
  )

  const rank = getRank(currentLumens)
  const nextRank = getNextRank(currentLumens)
  const progress = nextRank
    ? ((currentLumens - rank.min) / (nextRank.min - rank.min)) * 100
    : 100

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/library">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <img src={book.imageUrl} alt={book.title} className="h-10 w-8 object-cover rounded shadow" />
            <div>
              <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">Book Mastery Session</p>
              <p className="text-sm font-bold text-white leading-tight">{book.title}</p>
            </div>
          </div>
          {/* Lumen display */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-white">{currentLumens.toLocaleString()}</span>
            <span className="text-xs text-slate-400">Lumens · {rank.name}</span>
          </div>
        </div>
      </header>

      {/* Already completed banner */}
      {hasAlreadyCompleted && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-400 text-sm text-center py-2 font-medium">
          ✓ You've already earned the Foundry Badge for this book. Revisit any time.
        </div>
      )}

      {/* Chat */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 flex flex-col gap-4 overflow-y-auto pb-32">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mr-3 mt-1">
                <BookOpen className="w-4 h-4 text-amber-400" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-br-sm'
                : 'bg-slate-800 text-slate-100 rounded-bl-sm'
            }`}>
              {msg.message || (streaming && i === messages.length - 1
                ? <span className="flex gap-1"><span className="animate-bounce">•</span><span className="animate-bounce [animation-delay:0.1s]">•</span><span className="animate-bounce [animation-delay:0.2s]">•</span></span>
                : null
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-900/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {masteryConfirmed ? (
            <div className="flex items-center justify-center gap-3 py-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-green-400 font-bold">Mastery Confirmed — Badge Earned!</p>
              <Link href="/library">
                <Button size="sm" variant="outline" className="ml-4">Return to Library</Button>
              </Link>
            </div>
          ) : (
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Share your thoughts..."
                disabled={streaming}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || streaming}
                className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-5"
              >
                {streaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          )}
          {/* Progress bar */}
          {nextRank && (
            <div className="mt-3 flex items-center gap-3">
              <span className="text-xs text-slate-500 w-20">{rank.name}</span>
              <div className="flex-1 bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-slate-500 w-20 text-right">{nextRank.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Mastery Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border-2 border-amber-500 rounded-3xl p-10 text-center max-w-md mx-4 shadow-2xl animate-in zoom-in duration-300">
            <div className="text-6xl mb-4">🏛️</div>
            <h2 className="text-3xl font-extrabold text-white mb-2">Mastery Confirmed</h2>
            <p className="text-amber-400 font-bold text-lg mb-6">{book.title}</p>

            {/* Book Badge */}
            <div className="mx-auto w-24 h-32 mb-6 relative">
              <img
                src={book.imageUrl}
                alt={book.title}
                className="w-full h-full object-cover rounded-xl shadow-xl ring-2 ring-amber-500"
              />
              <div className="absolute -bottom-2 -right-2 bg-amber-500 rounded-full w-8 h-8 flex items-center justify-center shadow">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-6">
              <p className="text-amber-300 text-sm font-bold uppercase tracking-wider mb-1">Lumens Awarded</p>
              <p className="text-4xl font-extrabold text-white">+{lumensEarned}</p>
              <p className="text-slate-400 text-sm mt-1">New total: {currentLumens.toLocaleString()} · {getRank(currentLumens).name}</p>
            </div>

            {/* Animated rank progress */}
            {nextRank && (
              <div className="mb-6">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>{rank.name}</span><span>{nextRank.name}</span>
                </div>
                <div className="bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <Button
              onClick={() => { setShowCelebration(false); router.push('/library') }}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl py-6 text-lg"
            >
              Return to Foundry
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
