"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import booksData from '../../data/books.json';
import { supabase } from '@/lib/supabase';

interface Book {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  isPremium: boolean;
  affiliateUrl?: string;
  summary?: string;
  foundersNote?: string;
}

const BookCard = ({ book }: { book: Book }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-[#0B1221] border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/20">
      
      {/* Cover Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#0a101d]">
        {!imgError ? (
          <img 
            src={book.imageUrl} 
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#0a101d] to-[#111827]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-[#B8860B] mb-4 opacity-80"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            <h3 className="text-sm font-bold tracking-widest text-slate-300 uppercase leading-snug">
              {book.title}
            </h3>
          </div>
        )}
        
        {/* Subtle indicator if this book was originally flagged as an advanced topic */}
        {book.isPremium && (
          <div className="absolute top-3 right-3 bg-[#111827]/80 backdrop-blur-md px-3 py-1 rounded-full border border-orange-500/30">
            <span className="text-[10px] font-black tracking-widest uppercase text-orange-400">Advanced Concept</span>
          </div>
        )}
      </div>

      {/* Book Details */}
      <div className="flex flex-col flex-grow p-5">
        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-[#B8860B] transition-colors">
          {book.title}
        </h3>
        <p className="text-sm text-slate-500 font-medium mb-3">
          {book.author}
        </p>

        <div className="text-sm flex-grow leading-relaxed mb-4 text-slate-400 line-clamp-3">
          {book.summary}
        </div>

        {/* CTA Buttons */}
        <div className="mt-auto flex flex-col gap-3">
           <a
             href={book.affiliateUrl || "#"}
             target="_blank"
             rel="noopener noreferrer"
             className="w-full py-2 rounded-lg bg-[#111827] text-slate-400 border border-slate-700 text-xs font-bold tracking-wide transition-colors hover:bg-[#1A2235] hover:text-white flex items-center justify-center shrink-0"
           >
             Access Physical Volume
           </a>
           <Link 
             href={`/book-review/${book.id}`}
             className="w-full py-2.5 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/50 text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:bg-orange-500/20 hover:shadow-[0_0_15px_rgba(249,115,22,0.15)] flex items-center justify-center gap-2"
           >
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
             START MASTERY SESSION
           </Link>
        </div>
      </div>
    </div>
  );
};

export default function LibraryPage() {
  const [isElite, setIsElite] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.user_metadata?.isPremium) {
          setIsElite(true);
        }
      } catch (error) {
        console.error("Auth check failed", error);
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  const books = booksData as Book[];

  // Smooth scroll handler
  const scrollToBooks = () => {
    document.getElementById('foundation-access')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#050811] text-white selection:bg-[#B8860B]/30 selection:text-white pb-32">
      
      {/* Manifesto Header Section */}
      <div className="relative pt-24 pb-20 px-6 sm:px-12 lg:px-24 mx-auto max-w-5xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[600px] bg-blue-900/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight">
              Sovereign <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#AA7C11]">Library</span>
            </h1>
            <p className="text-lg md:text-xl text-[#D4AF37] font-bold tracking-[0.2em] uppercase">
              The little known or used Cheat Code.
            </p>
          </div>

          <div className="bg-[#0B1221]/80 backdrop-blur-md border border-white/5 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Subtle gold line at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#B8860B]/0 via-[#B8860B] to-[#B8860B]/0 opacity-50" />
            
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6 leading-tight max-w-3xl">
              Why Matilda Wormwood & the World's Most Powerful People Are "Obsessive" Readers
            </h2>
            
            <p className="text-slate-300 text-lg leading-relaxed mb-10">
              If you want to know the secret to the success of people like Elon Musk, Warren Buffett, or even the mentors who changed my life in the USA, it isn't "luck." It's a habit. Warren Buffett famously spends 80% of his day reading. When asked how he learned to build rockets, Elon Musk's answer was simple: "I read books."
            </p>

            <div className="space-y-10">
              <section>
                <h3 className="text-xl font-bold text-[#D4AF37] mb-3">The Knowledge Compound Effect</h3>
                <p className="text-slate-300 leading-relaxed">
                  Think of reading like an investment. Most people stop learning the day they leave school. If you keep reading, you aren't just getting "smarter" — you are compounding your value. A book allows you to "download" 30 years of someone else's failures and successes in just 5 hours. You are literally skipping the mistakes they spent decades making.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-[#D4AF37] mb-4">How to Become a Sovereign Reader</h3>
                <p className="text-slate-300 leading-relaxed mb-6">
                  You don't need to read 100 pages a day to start. Being a "Sovereign Reader" means you choose what you learn.
                </p>
                <ul className="space-y-6 text-slate-300">
                  <li className="flex gap-4">
                    <span className="text-[#D4AF37] text-lg font-black mt-1">→</span>
                    <span><strong className="text-white text-lg">Read what you love until you love to read:</strong><br/>Don't start with dry textbooks. Start with a book that solves a problem you have right now — like how to make money or how to build a habit.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-[#D4AF37] text-lg font-black mt-1">→</span>
                    <span><strong className="text-white text-lg">The 10-Minute Rule:</strong><br/>Commit to just 10 minutes every morning. That is 60 hours of high-level mentorship a year.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-[#D4AF37] text-lg font-black mt-1">→</span>
                    <span><strong className="text-white text-lg">Read with a Question:</strong><br/>Don't just scan the pages. Ask, "How can I use this in my life today?"</span>
                  </li>
                </ul>
              </section>
              
              <blockquote className="border-l-[4px] border-[#B8860B] pl-6 py-3 my-10 italic text-slate-200 text-xl font-medium bg-[#111827]/80 rounded-r-xl shadow-inner">
                "In the Foundry, we don't just read for grades. We read for power, for freedom, and to forge a future that others think is impossible."
              </blockquote>

              <p className="text-slate-300 leading-relaxed font-bold text-lg">
                This is not a list of casual reading; this is the Foundry Canon. Treat these texts as software updates for your biological hard drive.
              </p>
            </div>
          </div>

          {/* Upsell CTA Block */}
          {!isElite && !authLoading && (
            <div className="flex flex-col items-center justify-center mt-12 w-full p-8 bg-gradient-to-br from-[#111827] to-[#0a101d] rounded-2xl border border-orange-500/20 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 text-center">Unlock the Sovereign AI Tutor</h3>
              <p className="text-slate-400 text-center max-w-xl mb-6">
                All texts in the library are open to you. But upgrading to the Elite Tier unlocks the <strong>Sovereign Adaptive AI</strong>—a bespoke tutor that rebuilds the concepts of every book to perfectly match your age, maturity, and personal interests.
              </p>
              <Link 
                href="/settings/billing"
                className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white text-lg font-black tracking-[0.1em] uppercase rounded-xl border border-orange-400/30 shadow-[0_0_40px_rgba(249,115,22,0.25)] transition-all duration-300 shadow-orange-500/20 ring-2 ring-orange-500/50"
              >
                Upgrade to Foundry Vault
              </Link>
            </div>
          )}

        </div>
      </div>

      <div id="foundation-access" className="scroll-mt-24"></div>

      {/* The Complete Archive */}
      <section className="px-6 sm:px-12 lg:px-24 mx-auto max-w-7xl pb-20 mt-4">
        <div className="mb-10 flex items-center gap-4">
          <div className="w-2 h-8 bg-[#D4AF37] rounded-sm" />
          <h2 className="text-2xl font-bold tracking-wide text-white uppercase flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#D4AF37]"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            The Foundry Archive
          </h2>
          <div className="h-px bg-gradient-to-r from-white/20 to-transparent flex-grow ml-4" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {books.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

    </div>
  );
}
