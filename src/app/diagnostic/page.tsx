"use client";

import React from 'react';
import CognitiveDiagnostic from '@/components/CognitiveDiagnostic';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';

export default function DiagnosticPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-muted/10 font-sans pb-20">
      
      <main className="container max-w-6xl mx-auto px-4 pt-24 md:pt-32">
        <div className="flex flex-col items-center text-center space-y-6 mb-12">
          <Link href="/" className="group flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] hover:text-primary transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
          
          <div className="space-y-4 max-w-2xl">
            <div className="flex justify-center">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full">
                <Sparkles className="w-4 h-4" />
                2026 UK Socratic Pilot
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
              What is your child&apos;s <span className="text-primary italic">Sovereign Thinking Profile?</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed font-medium">
              A 2-minute diagnostic based on the Socratic method and DfE 2026 cognitive frameworks. No PII required.
            </p>
          </div>
        </div>

        <CognitiveDiagnostic />

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto border-t border-zinc-100 dark:border-zinc-800 pt-12">
           <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center border border-green-100 dark:border-green-800">
                 <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-bold text-foreground">Safeguarding 2026</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Built for the safest AI interactions in UK education.</p>
           </div>
           <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center border border-blue-100 dark:border-blue-800">
                 <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-bold text-foreground">Zero-Training Data</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">We never use your responses to train AI models.</p>
           </div>
           <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center border border-purple-100 dark:border-purple-800">
                 <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-bold text-foreground">Socratic Framework</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Powered by LumenForge&apos;s proprietary cognitive engine.</p>
           </div>
        </div>
      </main>

      <footer className="mt-20 text-center pb-12">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">© 2026 Avatar Alchemy AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Inline Sparkles to avoid missing import from last file (was imported from lucide-react there)
function Sparkles({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/><path d="M20 3v4"/><path d="M22 5h-4"/>
    </svg>
  );
}

function GraduationCap({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  );
}
