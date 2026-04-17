import React from 'react';
import { 
  BrainCircuit, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Map, 
  Share2,
  Download,
  Award
} from 'lucide-react';

export const BrainCardPrototype = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-black min-h-[600px]">
      {/* THE CARD FRONT */}
      <div className="relative w-[380px] aspect-[1/1.4] rounded-[2.5rem] bg-zinc-950 border border-white/10 overflow-hidden shadow-2xl group cursor-pointer">
        
        {/* Holographic Background Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/20 opacity-30 group-hover:opacity-50 transition-opacity duration-1000" />
        
        {/* Neon Logic Circuitry (Abstract Representation) */}
        <div className="absolute inset-0 p-12 opacity-20 group-hover:opacity-40 transition-all duration-1000">
           <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 50 Q 30 10 50 50 T 90 50" stroke="currentColor" strokeWidth="0.5" className="text-primary animate-pulse" />
              <path d="M10 20 Q 50 50 90 20" stroke="currentColor" strokeWidth="0.5" className="text-purple-500" />
              <circle cx="50" cy="50" r="2" fill="currentColor" className="text-primary" />
              <circle cx="10" cy="50" r="1" fill="white" />
              <circle cx="90" cy="50" r="1" fill="white" />
           </svg>
        </div>

        {/* Content Overlay */}
        <div className="relative h-full flex flex-col p-8 z-10">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div className="space-y-1">
               <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.4em] text-primary">
                  <ShieldCheck className="w-3 h-3" />
                  Socratic Standard
               </div>
               <h3 className="text-2xl font-black text-white tracking-tighter italic">LumenForge</h3>
            </div>
            <div className="bg-white/5 border border-white/10 p-2 rounded-xl backdrop-blur-md">
               <BrainCircuit className="w-6 h-6 text-primary" />
            </div>
          </div>

          {/* Main Topic Mastery */}
          <div className="mt-auto space-y-4">
             <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Subject Logic</span>
                <h4 className="text-3xl font-black text-white leading-none">AQA Maths <br /> <span className="text-primary">Algebra 3.1.2</span></h4>
             </div>

             {/* The "Resilience" Metric */}
             <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                <div className="space-y-1">
                   <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Cognitive Resilience</span>
                   <div className="text-xl font-black text-white">92%</div>
                </div>
                <div className="space-y-1">
                   <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Regional Rank</span>
                   <div className="text-xl font-black text-primary">#4 London</div>
                </div>
             </div>
          </div>

          {/* Footer Signature */}
          <div className="mt-8 flex items-center justify-between">
             <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center">
                     <Zap className="w-3 h-3 text-primary" />
                  </div>
                ))}
                <div className="pl-4 text-[8px] font-bold text-zinc-500 uppercase tracking-widest flex items-center">
                   +1,204 Scholars Locally
                </div>
             </div>
          </div>
        </div>

        {/* Glossy Reflection Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
      </div>

      {/* SHARE ACTIONS */}
      <div className="mt-12 flex gap-4">
         <button className="flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20">
            <Share2 className="w-4 h-4" />
            Share to TikTok
         </button>
         <button className="flex items-center gap-3 bg-zinc-900 border border-white/10 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all">
            <Download className="w-4 h-4" />
            Download HD
         </button>
      </div>

      <p className="mt-8 text-zinc-500 text-[10px] font-medium uppercase tracking-[0.3em]">
        LumenForge Socratic Engine | Sovereignty Audit v2.7
      </p>
    </div>
  );
};
