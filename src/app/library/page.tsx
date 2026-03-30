"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, TrendingUp, Compass, Anchor, AlertCircle, ExternalLink } from 'lucide-react'
import booksDataRaw from '@/data/books.json'

// Ensure predictable type
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

export default function LibraryPage() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([])

  useEffect(() => {
    // 1. Calculate current week of the epoch to rotate deterministically
    const currentWeekInfo = Math.floor(Date.now() / 604800000); 
    // 2. We show 3 books at a time, so total "pages" is length / 3
    const totalPages = Math.ceil(allBooks.length / 3);
    const offset = (currentWeekInfo % totalPages) * 3;
    
    // Fallback logic incase offset exceeds bounds
    const end = Math.min(offset + 3, allBooks.length);
    setFeaturedBooks(allBooks.slice(offset, end));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      
      {/* Hero Header */}
      <section className="bg-slate-900 text-white pt-24 pb-16 px-4 md:px-8 border-b-4 border-amber-500">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm font-bold mb-6 tracking-widest uppercase">
             <Anchor className="w-4 h-4" /> Sovereign Library
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            The Billionaire's Cheat Code
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
            You are operating in an age of infinite leverage. The fastest way to compress time and bypass decades of trial-and-error is to download the operating systems of those who have already dominated the battlefield.
            <br/><br/>
            This is not a list of casual reading; this is the <strong>Foundry Canon</strong>. Treat these texts as software updates for your biological hard drive.
          </p>
        </div>
      </section>

      {/* Rotation Engine UI */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-10 border-b border-slate-200 dark:border-slate-800 pb-4">
            <Compass className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Featured This Week</h2>
            <span className="ml-auto text-sm text-slate-500 hidden sm:block uppercase tracking-wider font-bold">Rotation 0{Math.floor(Date.now() / 604800000) % 15}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBooks.map((book) => (
            <Card key={book.id} className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group bg-white dark:bg-slate-900 flex flex-col h-full ring-1 ring-slate-100 dark:ring-slate-800">
              <div className="relative aspect-[3/4] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center p-8 border-b">
                 {/* 
                   Using standard img tag to safely load from external Amazon source without throwing Next.js Image optimization unconfigured host errors.
                   Fallback to an icon layout if the image fails.
                 */}
                <img 
                    src={book.imageUrl} 
                    alt={book.title}
                    className="object-contain h-full w-full drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/library/fallback.jpg'; // Simple fallback
                      (e.target as HTMLImageElement).style.opacity = '0.5';
                    }}
                />
              </div>
              <CardContent className="p-8 flex-1 flex flex-col">
                <div className="mb-4">
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-2">{book.author}</p>
                    <h3 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white mb-4 line-clamp-2">{book.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-[15px] leading-relaxed line-clamp-4">
                        {book.summary}
                    </p>
                </div>

                {book.foundersNote && (
                    <div className="mt-4 mb-8 bg-slate-50 dark:bg-slate-950 p-4 border-l-4 border-primary rounded-r-lg">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> Founder's Note
                        </p>
                        <p className="text-sm italic font-medium text-slate-700 dark:text-slate-300">"{book.foundersNote}"</p>
                    </div>
                )}
                
                {/* CTA - Preserves strict affiliate link format */}
                <div className="mt-auto pt-4">
                   <Link href={book.affiliateUrl} target="_blank" rel="noopener noreferrer" className="w-full block">
                       <Button size="lg" className="w-full font-bold uppercase tracking-wider shadow-lg bg-orange-500 hover:bg-orange-600 text-white rounded-xl">
                           <BookOpen className="w-4 h-4 mr-2" />
                           Access on Amazon
                       </Button>
                   </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Complete Index */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-slate-100 dark:bg-slate-900 rounded-3xl p-8 md:p-12 text-center border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold mb-4">Looking for something specific?</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
                The Sovereign Library continually expands. If you've already conquered this week's featured operating systems, explore the complete Foundry index.
            </p>
            <Button variant="outline" size="lg" className="rounded-full shadow-sm font-bold border-2">
                Browse Full Index
            </Button>
        </div>
      </section>

      {/* Mandatory Affiliate Disclosure */}
      <footer className="max-w-5xl mx-auto px-4 mt-8 pb-8 text-center pt-8 border-t border-slate-200 dark:border-slate-800">
         <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-2 max-w-xl mx-auto leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0" />
            LumenForge is a participant in the Amazon Services LLC Associates Program. If you purchase through our links, we may earn a small qualifying affiliate commission at absolutely no extra cost to you. This helps fund the continued development of the AI Tutor platform.
         </p>
      </footer>
    </div>
  )
}
