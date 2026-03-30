"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, TrendingUp, Compass, Anchor, AlertCircle, ChevronDown } from 'lucide-react'
import booksDataRaw from '@/data/books.json'

type Book = {
  id: string;
  title: string;
  author: string;
  affiliateUrl: string;
  imageUrl: string;
  summary: string;
  foundersNote: string;
}

const allBooks: Book[] = booksDataRaw;

function BookCard({ book }: { book: Book }) {
  return (
    <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group bg-white dark:bg-slate-900 flex flex-col h-full ring-1 ring-slate-100 dark:ring-slate-800">
      <div className="relative aspect-[3/4] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center p-8 border-b">
        <img
          src={book.imageUrl}
          alt={book.title}
          className="object-contain h-full w-full drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
          crossOrigin="anonymous"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            // Fallback: hide broken image and show title placeholder
            img.style.display = 'none';
            const parent = img.parentElement;
            if (parent && !parent.querySelector('.img-fallback')) {
              const fallback = document.createElement('div');
              fallback.className = 'img-fallback flex flex-col items-center justify-center gap-3 text-center';
              fallback.innerHTML = '<span style="font-size:3rem">📚</span><p style="font-size:0.85rem;font-weight:700;color:#64748b;line-height:1.3">' + book.title + '</p>';
              parent.appendChild(fallback);
            }
          }}
        />
      </div>
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <p className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-2">{book.author}</p>
          <h3 className="text-xl font-bold leading-tight text-slate-900 dark:text-white mb-3 line-clamp-2">{book.title}</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-4">
            {book.summary}
          </p>
        </div>

        {book.foundersNote && (
          <div className="mt-4 mb-6 bg-slate-50 dark:bg-slate-950 p-4 border-l-4 border-primary rounded-r-lg">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Founder's Note
            </p>
            <p className="text-sm italic font-medium text-slate-700 dark:text-slate-300">"{book.foundersNote}"</p>
          </div>
        )}

        <div className="mt-auto pt-4">
          <Link href={book.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored" className="w-full block">
            <Button size="lg" className="w-full font-bold uppercase tracking-wider shadow-lg bg-orange-500 hover:bg-orange-600 text-white rounded-xl">
              <BookOpen className="w-4 h-4 mr-2" />
              Access on Amazon
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LibraryPage() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([])
  const [rotationNum, setRotationNum] = useState(0)

  useEffect(() => {
    const currentWeek = Math.floor(Date.now() / 604800000);
    const totalPages = Math.ceil(allBooks.length / 3);
    const offset = (currentWeek % totalPages) * 3;
    const end = Math.min(offset + 3, allBooks.length);
    setFeaturedBooks(allBooks.slice(offset, end));
    setRotationNum(currentWeek % 99);
  }, []);

  const scrollToIndex = () => {
    document.getElementById('full-index')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">

      {/* Hero Header + Full Article */}
      <section className="bg-slate-900 text-white pt-24 pb-20 px-4 md:px-8 border-b-4 border-amber-500">
        <div className="max-w-3xl mx-auto">

          {/* Badge + Headline */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm font-bold mb-6 tracking-widest uppercase">
              <Anchor className="w-4 h-4" /> Sovereign Library
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
              The Billionaire's Cheat Code
            </h1>
            <p className="text-xl md:text-2xl text-amber-400 font-semibold italic">
              Why the World's Most Powerful People Are "Obsessive" Readers
            </p>
          </div>

          {/* Article Body */}
          <div className="prose prose-invert prose-lg max-w-none text-slate-300 space-y-6 leading-relaxed">
            <p>
              If you want to know the secret to the success of people like Elon Musk, Warren Buffett, or even the mentors who changed my life in the USA, it isn't <em>"luck."</em> It's a habit.
            </p>
            <p>
              Warren Buffett famously spends <strong className="text-white">80% of his day reading</strong>. When asked how he learned to build rockets, Elon Musk's answer was simple: <em>"I read books."</em>
            </p>

            <h2 className="text-2xl font-extrabold text-white pt-4 border-t border-slate-700">The Knowledge Compound Effect</h2>
            <p>
              Think of reading like an investment. Most people stop learning the day they leave school. If you keep reading, you aren't just getting "smarter" — you are <strong className="text-amber-400">compounding your value</strong>. A book allows you to "download" 30 years of someone else's failures and successes in just 5 hours. You are literally skipping the mistakes they spent decades making.
            </p>

            <h2 className="text-2xl font-extrabold text-white pt-4 border-t border-slate-700">How to Become a Sovereign Reader</h2>
            <p>You don't need to read 100 pages a day to start. Being a <strong className="text-white">"Sovereign Reader"</strong> means you choose what you learn.</p>

            <ul className="space-y-4 list-none pl-0">
              <li className="flex gap-3 items-start">
                <span className="text-amber-400 font-black text-xl mt-0.5">→</span>
                <span><strong className="text-white">Read what you love until you love to read:</strong> Don't start with dry textbooks. Start with a book that solves a problem you have right now — like how to make money or how to build a habit.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-amber-400 font-black text-xl mt-0.5">→</span>
                <span><strong className="text-white">The 10-Minute Rule:</strong> Commit to just 10 minutes every morning. That is 60 hours of high-level mentorship a year.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-amber-400 font-black text-xl mt-0.5">→</span>
                <span><strong className="text-white">Read with a Question:</strong> Don't just scan the pages. Ask, <em>"How can I use this in my life today?"</em></span>
              </li>
            </ul>

            <div className="mt-10 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
              <p className="text-lg font-bold text-amber-300 italic leading-relaxed">
                "In the Foundry, we don't just read for grades. We read for power, for freedom, and to forge a future that others think is impossible."
              </p>
            </div>

            <p className="text-slate-400 text-base">
              This is not a list of casual reading; this is the <strong className="text-white">Foundry Canon</strong>. Treat these texts as software updates for your biological hard drive.
            </p>
          </div>

          {/* Scroll CTA */}
          <div className="text-center mt-14">
            <button
              onClick={scrollToIndex}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider"
            >
              Browse all {allBooks.length} books <ChevronDown className="w-4 h-4 animate-bounce" />
            </button>
          </div>

        </div>
      </section>

      {/* Featured This Week */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-10 border-b border-slate-200 dark:border-slate-800 pb-4">
          <Compass className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Featured This Week</h2>
          <span className="ml-auto text-sm text-slate-500 hidden sm:block uppercase tracking-wider font-bold">
            Rotation {String(rotationNum).padStart(2, '0')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Full Index */}
      <section id="full-index" className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-10 border-b border-slate-200 dark:border-slate-800 pb-4">
          <BookOpen className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Full Foundry Index</h2>
          <span className="ml-auto text-sm text-slate-500 hidden sm:block uppercase tracking-wider font-bold">
            {allBooks.length} Operating Systems
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allBooks.map((book) => (
            <BookCard key={book.id + '-full'} book={book} />
          ))}
        </div>
      </section>

      {/* Affiliate Disclosure */}
      <footer className="max-w-5xl mx-auto px-4 mt-8 pb-8 text-center pt-8 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-2 max-w-xl mx-auto leading-relaxed">
          <AlertCircle className="w-4 h-4 shrink-0" />
          LumenForge is a participant in the Amazon Services LLC Associates Program. If you purchase through our links, we may earn a small qualifying affiliate commission at absolutely no extra cost to you. This helps fund the continued development of the AI Tutor platform.
        </p>
      </footer>
    </div>
  )
}
