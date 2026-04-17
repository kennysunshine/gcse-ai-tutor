import React from 'react';
import { 
  BrainCircuit, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Share2,
  Download,
  Award,
  BookOpen,
  MapPin
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrainCardData } from '@/lib/braincard-engine';

interface BrainCardProps {
    data: BrainCardData;
}

export const BrainCard: React.FC<BrainCardProps> = ({ data }) => {
  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* THE CARD FRONT */}
      <div id="brain-card-capture" className="relative w-[340px] md:w-[380px] aspect-[1/1.4] rounded-[2.5rem] bg-zinc-950 border border-white/10 overflow-hidden shadow-2xl group transition-all duration-500">
        
        {/* Holographic Background Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/15 opacity-40 group-hover:opacity-60 transition-opacity duration-1000" />
        
        {/* Neon Logic Circuitry */}
        <div className="absolute inset-0 p-12 opacity-30 group-hover:opacity-50 transition-all duration-1000">
           <svg className="w-full h-full" viewBox="0 0 1000 1400" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Dynamic Logic Lines based on Nodes */}
              {Array.from({ length: 12 }).map((_, i) => (
                <path 
                  key={i}
                  d={`M${50 * i} 0 Q ${500 + (i * 20)} 700 ${1000 - (50 * i)} 1400`} 
                  stroke="currentColor" 
                  strokeWidth="0.5" 
                  className={`text-primary/20 ${i % 2 === 0 ? 'animate-pulse' : ''}`} 
                />
              ))}
              <circle cx="500" cy="700" r="150" stroke="currentColor" strokeWidth="0.5" className="text-primary/10" />
           </svg>
        </div>

        {/* Content Overlay */}
        <div className="relative h-full flex flex-col p-8 z-10">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div className="space-y-1">
               <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.5em] text-primary/80">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Socratic Standard
               </div>
               <h3 className="text-2xl font-black text-white tracking-tighter italic">LumenForge</h3>
            </div>
            <div className="bg-white/5 border border-white/10 p-2.5 rounded-2xl backdrop-blur-md shadow-inner">
               <BrainCircuit className="w-6 h-6 text-primary" />
            </div>
          </div>

          {/* Main Topic Mastery */}
          <div className="mt-auto space-y-5">
             <div className="space-y-1.5 px-1">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
                    <BookOpen className="w-3 h-3" />
                    Subject Logic Mastery
                </span>
                <h4 className="text-3xl font-black text-white leading-tight tracking-tight">
                    {data.subject} <br /> 
                    <span className="text-primary/90">{data.spec_code}</span>
                </h4>
             </div>

             {/* The "Resilience" Metric */}
             <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                <div className="space-y-1 px-1">
                   <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Cognitive Resilience</span>
                   <div className="text-2xl font-black text-white flex items-center gap-2">
                       {data.resilience_score}%
                       <Zap className="w-4 h-4 text-primary fill-primary/20" />
                   </div>
                </div>
                <div className="space-y-1 px-1">
                   <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Regional Standing</span>
                   <div className="text-xl font-black text-primary tracking-tight">
                        {data.regional_rank}
                   </div>
                </div>
             </div>
          </div>

          {/* Footer Signature */}
          <div className="mt-10 flex items-center justify-between border-t border-white/5 pt-6">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Award className="w-4 h-4 text-primary" />
                </div>
                <div className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] leading-tight">
                   Status: {data.mastery_level} <br />
                   <span className="text-zinc-600">Sovereign Audit v2.7</span>
                </div>
             </div>
             <div className="text-[8px] font-black text-zinc-700 uppercase tracking-widest italic opacity-50">
                {new Date(data.timestamp).toLocaleDateString()}
             </div>
          </div>
        </div>

        {/* Glossy Reflection Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none opacity-50" />
      </div>

      {/* SHARE ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[380px]">
         <Button className="flex-1 h-14 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 gap-3">
            <Share2 className="w-4 h-4" />
            Share to TikTok
         </Button>
         <Button variant="outline" className="flex-1 h-14 bg-zinc-950 border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-900 transition-all gap-3 shadow-sm">
            <Download className="w-4 h-4" />
            Download HD
         </Button>
      </div>

      <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-[0.4em] text-center max-w-xs leading-relaxed">
        Join the Socratic Elite. Mastery is non-negotiable. <br className="hidden sm:block" /> lumenforge.ai
      </p>
    </div>
  );
};
