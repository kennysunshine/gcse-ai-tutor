import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  BrainCircuit, 
  Zap, 
  Calculator, 
  Dna, 
  Book, 
  Code,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { SocraticCheckoutCard } from '@/components/SocraticCheckoutCard';
import guideData from '@/data/guideData.json';

// Mapping icons to string keys from the JSON
const ICON_MAP: Record<string, React.ReactNode> = {
  Calculator: <Calculator className="w-6 h-6 text-orange-500" />,
  Zap: <Zap className="w-6 h-6 text-blue-500" />,
  Dna: <Dna className="w-6 h-6 text-green-500" />,
  Book: <Book className="w-6 h-6 text-purple-500" />,
  Code: <Code className="w-6 h-6 text-zinc-500" />
};

interface pSEOParams {
  subject: string;
  level: string;
  location: string;
}

export async function generateStaticParams() {
  const params: pSEOParams[] = [];
  const subjects = Object.keys(guideData.subjects);
  const locations = Object.keys(guideData.locations);
  const levels = ['gcse', 'ks3', 'ks2'];

  subjects.forEach((subject) => {
    locations.forEach((location) => {
      levels.forEach((level) => {
        params.push({ subject, level, location });
      });
    });
  });

  return params;
}

export async function generateMetadata({ params }: { params: Promise<pSEOParams> }) {
  const resolvedParams = await params;
  const { subject, level: rawLevel, location } = resolvedParams;
  
  const subjectData = (guideData.subjects as any)[subject];
  const locationData = (guideData.locations as any)[location];
  const level = rawLevel.toUpperCase();

  if (!subjectData || !locationData) {
    return {
      title: "Page Not Found | LumenForge",
      description: "The requested Socratic guide could not be found."
    };
  }

  return {
    title: `Socratic ${subjectData.name} Tutor in ${locationData.name} | Elite ${level} Mastery`,
    description: `Unlock high-status ${subjectData.name} mentorship for ${level} in ${locationData.name}. Join the 2026 Socratic Pilot and build cognitive resilience with the UK's first AI mentor.`,
    openGraph: {
      title: `Socratic ${subjectData.name} Tutor in ${locationData.name}`,
      description: `Elite ${level} ${subjectData.name} mentorship in ${locationData.name} via the Socratic Method.`,
    }
  };
}

export default async function GuidePage({ params }: { params: Promise<pSEOParams> }) {
  const resolvedParams = await params;
  const { subject, level: rawLevel, location } = resolvedParams;
  
  const subjectData = (guideData.subjects as any)[subject];
  const locationData = (guideData.locations as any)[location];
  const pedagogyData = (guideData as any).globalPedagogy.productiveStruggle;
  const level = rawLevel.toUpperCase();

  if (!subjectData || !locationData) {
    notFound();
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": subjectData.faqs.map((faq: any) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-muted/10 font-sans pb-20">
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <main className="container max-w-6xl mx-auto px-4 pt-24 md:pt-32 relative">
        
        {/* Atmosphere Background Layer */}
        <div className="absolute top-0 right-0 w-full h-[600px] -z-10 opacity-10 pointer-events-none">
           <img 
             src={locationData.cityImage} 
             alt=""
             className="w-full h-full object-cover [mask-image:linear-gradient(to_bottom,black,transparent)]"
           />
        </div>

        {/* Sovereign Header - Elite Headteacher Persona */}
        <div className="flex flex-col items-start space-y-6 mb-16 relative">
          <Badge variant="outline" className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10 flex items-center gap-2 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            2026 Sovereign Socratic Standard
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground leading-[1.1] max-w-5xl">
            Socratic <span className="text-primary italic">{subjectData.name}</span> Mastery <br className="hidden md:block" />
            for <span className="underline decoration-primary/20">{level}</span> Scholars in <span className="text-foreground/80">{locationData.name}</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed font-medium">
            Join the 2026 Socratic Pilot. We do not offer remediation; we forge intellectual independence for the UK&apos;s most ambitious students in {locationData.name}.
          </p>
        </div>

        {/* 60/40 Knowledge Hub Grid */}
        <div className="grid lg:grid-cols-10 gap-16 items-start">
          
          {/* LEFT COLUMN (60%): The Sovereign Report */}
          <div className="lg:col-span-6 space-y-12">
            <section className="space-y-8">
              <div className="flex items-center gap-3 text-primary">
                 <TrendingUp className="w-5 h-5" />
                 <span className="text-xs font-black uppercase tracking-[0.3em]">Institutional Deep-Dive</span>
              </div>
              
              <div className="relative group overflow-hidden rounded-[2.5rem] border border-zinc-200 dark:border-white/10 shadow-2xl">
                 <img 
                   src={locationData.cityImage} 
                   alt={`${locationData.name} Scholastic Architecture`}
                   className="w-full aspect-[16/9] object-cover group-hover:scale-105 transition-transform duration-1000"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-end p-8">
                    <p className="text-white text-xs font-black uppercase tracking-[0.2em] mt-auto">Regional Signature: {locationData.name} Metropolitan Hub</p>
                 </div>
              </div>

              <h2 className="text-3xl font-black tracking-tight text-foreground">The {locationData.context} Report</h2>
              <div className="prose prose-zinc dark:prose-invert max-w-none space-y-6">
                 {locationData.deepDive.map((para: string, idx: number) => (
                   <p key={idx} className="text-lg leading-relaxed text-muted-foreground font-medium">
                      {para}
                   </p>
                 ))}
                 {locationData.industryConnections && locationData.industryConnections[subject] && (
                   <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-2xl my-8">
                     <div className="flex items-center gap-2 mb-2 text-primary">
                        <Zap className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">Local Industry Vector</span>
                     </div>
                     <p className="text-lg font-bold text-foreground">
                        {locationData.industryConnections[subject]}
                     </p>
                   </div>
                 )}
                 <p className="text-lg leading-relaxed text-muted-foreground font-medium italic border-l-4 border-primary/20 pl-6 my-8">
                    {locationData.tip}
                 </p>
              </div>
            </section>

            {/* NEW SECTION: The Productive Struggle - Readability Fix */}
            <section className="bg-primary/5 dark:bg-primary/10 rounded-[2.5rem] p-12 relative overflow-hidden group border border-primary/10">
               <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 pointer-events-none group-hover:rotate-0 transition-transform duration-1000">
                  <BrainCircuit className="w-48 h-48 text-primary" />
               </div>
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3 text-primary">
                     <Sparkles className="w-5 h-5" />
                     <span className="text-[10px] font-black uppercase tracking-[0.4em]">Pedagogical Pillar</span>
                  </div>
                  <h3 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
                    {rawLevel === 'ks2' ? "Metacognitive Independence" : pedagogyData.title}
                  </h3>
                  <p className="text-xl leading-relaxed font-medium text-zinc-700 dark:text-zinc-300">
                    {rawLevel === 'ks2' 
                      ? "For our Junior Scholars, we move beyond simple fact-recall. We teach them 'how to learn' by engaging with the Socratic process. This builds the foundational curiosity required to thrive in later Key Stages." 
                      : pedagogyData.description}
                  </p>
                  <p className="text-lg leading-relaxed font-bold text-primary italic">
                     {rawLevel === 'ks2' 
                       ? "A child who masters self-correction at KS2 will inevitably dominate the GCSE landscape in five years." 
                       : pedagogyData.benefit}
                  </p>
               </div>
            </section>

            <section className="space-y-6 pt-8">
              <div className="flex items-center gap-3 text-primary">
                 <Award className="w-5 h-5" />
                 <span className="text-xs font-black uppercase tracking-[0.3em]">Socratic Signature Method</span>
              </div>
              <h2 className="text-3xl font-black tracking-tight text-foreground">
                {rawLevel === 'ks2' ? `Foundational ${subjectData.name} First-Principles` : `Elite ${subjectData.name} Discovery Chains`}
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground font-medium">
                 {rawLevel === 'ks2' 
                   ? `Instead of teaching ${subjectData.name} as a set of rules, we treat it as a language of logic. We ask the questions that help Year 4-6 students deduce the laws of ${subjectData.name} themselves.` 
                   : subjectData.methodology}
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                {subjectData.hurdles.map((hurdle: string, idx: number) => (
                  <Card key={idx} className="p-6 border border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 rounded-2xl flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-black italic">
                      {idx + 1}
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {rawLevel === 'ks2' ? `Entry Logic: ${hurdle.split(' ')[0]} Foundations` : hurdle}
                    </span>
                  </Card>
                ))}
              </div>
            </section>

            {/* Institutional Comparison Refactor */}
            <section id="local-curriculum-comparison" className="space-y-8 pt-12 border-t border-zinc-100 dark:border-white/5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3 text-primary">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-[0.3em]">Formal Pedagogical Audit</span>
                  </div>
                  <h2 className="text-3xl font-black tracking-tight text-foreground">Tutoring Logic Comparison</h2>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-500/5 border border-green-500/20 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-600 dark:text-green-400">Institutional Standard 2026</span>
                </div>
              </div>

              <Card className="overflow-hidden border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm rounded-[2.5rem]">
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-100 dark:divide-white/5">
                  <div className="p-10 space-y-6 opacity-60">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Old-School Rote Tutoring</h4>
                      <p className="text-xl font-black text-foreground">Remedial Class Support</p>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3 text-sm font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 mt-1.5" />
                        Passive answer-feeding creates cognitive dependency
                      </li>
                      <li className="flex items-start gap-3 text-sm font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 mt-1.5" />
                        Reactive syllabus coverage (following the school)
                      </li>
                      <li className="flex items-start gap-3 text-sm font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 mt-1.5" />
                        Standardised drill-work for mass-market testing
                      </li>
                    </ul>
                  </div>

                  <div className="p-10 space-y-6 bg-primary/[0.02] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 pointer-events-none">
                       <Award className="w-24 h-24" />
                    </div>
                    <div className="space-y-1 relative z-10">
                      <h4 className="text-sm font-black text-primary uppercase tracking-widest">LumenForge Socratic Standard</h4>
                      <p className="text-xl font-black text-foreground">Active Scholar Foundation</p>
                    </div>
                    <ul className="space-y-4 relative z-10">
                      <li className="flex items-start gap-3 text-sm font-bold text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        The Productive Struggle builds neural independence
                      </li>
                      <li className="flex items-start gap-3 text-sm font-bold text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        {subjectData.curriculumContext.socraticDelta}
                      </li>
                      <li className="flex items-start gap-3 text-sm font-bold text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        Proactive {locationData.localFocus} Audit
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
              
              <p className="text-xs text-center text-muted-foreground font-medium italic">
                * As an Institutional Standard, LumenForge supports and enhances existing classroom teaching through high-status Socratic enquiry.
              </p>
            </section>
          </div>

          {/* RIGHT COLUMN (40%): Sidebar Dashboard */}
          <div className="lg:col-span-4 space-y-8 sticky top-32">
             <Card className="p-8 border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl rounded-[2.5rem] shadow-2xl space-y-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-3xl -z-10" />
                
                <div>
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-6">Foundry Signature</h4>
                   <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <span className="text-sm font-bold text-muted-foreground">Scholastic Band</span>
                         <Badge variant="outline" className="font-black italic">{level}+ Authority</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-sm font-bold text-muted-foreground">Regional Hub</span>
                         <span className="text-sm font-black underline decoration-primary/20">{locationData.name} Metropolitan</span>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-100 dark:border-white/5">
                         <span className="text-sm font-bold text-muted-foreground">Primary Exam Board</span>
                         <span className="text-sm font-black italic text-primary">{locationData.primaryExamBoard || subjectData.curriculumContext.dominantExamBoard}</span>
                      </div>
                   </div>
                </div>

                <hr className="border-zinc-100 dark:border-white/5" />
                
                <div className="bg-orange-50 dark:bg-orange-950/20 p-6 rounded-2xl border border-orange-100 dark:border-orange-500/10">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600 dark:text-orange-400 mb-3">Regional Cost Logic</h4>
                   <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-bold text-muted-foreground">Avg. Local Human Tutor</span>
                      <span className="text-sm font-black line-through text-muted-foreground/50">£{locationData.averageTutorRate || 40}/hr</span>
                   </div>
                   <div className="flex justify-between items-end">
                      <span className="text-xs font-black text-orange-700 dark:text-orange-300">Sovereign AI Access</span>
                      <span className="text-lg font-black text-orange-600 dark:text-orange-400">£20/mo</span>
                   </div>
                </div>

                <hr className="border-zinc-100 dark:border-white/5" />

                <div className="space-y-6">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Safety Audit</h4>
                   <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-green-500" />
                      <span className="text-xs font-black uppercase tracking-widest leading-none">DfE 2026 Compliant Engine</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-primary" />
                      <span className="text-xs font-black uppercase tracking-widest leading-none">Zero-Training Data Security</span>
                   </div>
                </div>

                <SocraticCheckoutCard subjectName={subjectData.name} />
             </Card>

             <Link href="/diagnostic">
                <div className="bg-primary p-10 rounded-[2.5rem] shadow-xl hover:shadow-primary/20 transition-all hover:-translate-y-1 group">
                   <h4 className="text-primary-foreground text-2xl font-black mb-4">Start Your Mastery Audit</h4>
                   <p className="text-primary-foreground/80 text-sm font-medium mb-8">Identify the cognitive gaps in your {subjectData.name} foundation today.</p>
                   <div className="flex items-center text-primary-foreground font-black text-xs uppercase tracking-widest">
                      Begin the Socratic Path <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                   </div>
                </div>
             </Link>
          </div>
        </div>

        {/* FOOTER SECTION: Socratic FAQ */}
        <section className="mt-40 pt-20 border-t border-zinc-100 dark:border-white/5 space-y-12">
           <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex items-center gap-2 text-primary">
                 <HelpCircle className="w-5 h-5" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em]">Scholastic Advisory</span>
              </div>
              <h2 className="text-4xl font-black tracking-tight">Parent Considerations</h2>
           </div>

           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {subjectData.faqs.map((faq: any, idx: number) => (
                <Card key={idx} className="p-8 rounded-[2rem] border-2 border-transparent hover:border-primary/20 transition-all bg-white dark:bg-zinc-900 shadow-sm relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                      <ShieldCheck className="w-12 h-12" />
                   </div>
                   <h4 className="text-lg font-black tracking-tight mb-4 pr-6">{faq.question}</h4>
                   <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                      {faq.answer}
                   </p>
                </Card>
              ))}
           </div>
        </section>

      </main>

      <footer className="mt-40 text-center pb-20 pt-12">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.4em]">© 2026 LumenForge AI. Built for Sovereign Thinkers in {locationData.name}.</p>
      </footer>
    </div>
  );
}
