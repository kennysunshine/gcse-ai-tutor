import React from 'react';
import { 
  BookOpen, 
  Calculator, 
  Brain, 
  Search, 
  ShieldCheck,
  ExternalLink 
} from 'lucide-react';
import { Card } from '@/components/ui/card';

const NETWORK_LINKS = [
  {
    name: "Revision Wiki",
    description: "Deep-archive of Socratic study notes and syllabus-mapped logic.",
    url: "https://gcse-revision-wiki.vercel.app/",
    icon: <BookOpen className="w-5 h-5 text-purple-500" />,
    label: "The Archive"
  },
  {
    name: "Grade Calculator",
    description: "AQA/Edexcel-synced grade forecasting and performance auditing.",
    url: "https://gcse-grade-calculator.vercel.app/",
    icon: <Calculator className="w-5 h-5 text-orange-500" />,
    label: "Results Audit"
  },
  {
    name: "Cognitive Assessment",
    description: "Identify your critical thinking frontier and diagnostic gaps.",
    url: "https://gcse-cognitive-assessment.vercel.app/",
    icon: <Brain className="w-5 h-5 text-blue-500" />,
    label: "Neural Proxy"
  },
  {
    name: "Tutor Review Meta",
    description: "Head-to-head audits: Why Socratic methods dominate 2026 outcomes.",
    url: "https://gcse-revision-wiki-viu7.vercel.app/",
    icon: <Search className="w-5 h-5 text-zinc-500" />,
    label: "Independent Review"
  }
];

export const EcosystemNav = () => {
  return (
    <section className="py-20 border-t border-zinc-100 dark:border-white/5">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-12 space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">The LumenForge Network</span>
          </div>
          <h3 className="text-3xl font-black tracking-tight">Sovereign Ecosystem</h3>
          <p className="text-muted-foreground max-w-2xl font-medium">
            LumenForge is more than a mentor. It is a unified network of pedagogical tools designed for intellectual independence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {NETWORK_LINKS.map((link, idx) => (
            <a 
              key={idx} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group block"
            >
              <Card className="p-6 h-full rounded-[2rem] border-transparent hover:border-primary/20 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm transition-all hover:-translate-y-1 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                  <ExternalLink className="w-8 h-8 text-primary" />
                </div>
                
                <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center mb-6">
                  {link.icon}
                </div>
                
                <div className="space-y-2">
                   <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{link.label}</span>
                   <h4 className="text-lg font-black tracking-tight group-hover:text-primary transition-colors">{link.name}</h4>
                   <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                     {link.description}
                   </p>
                </div>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
