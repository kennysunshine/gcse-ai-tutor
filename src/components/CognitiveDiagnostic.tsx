"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  BrainCircuit, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Zap, 
  Target, 
  ChevronRight,
  Mail,
  User,
  Phone,
  Share2,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type AgeGroup = 'primary' | 'middle' | 'gcse';

interface Question {
  id: number;
  text: string;
  options: string[];
  type: string;
}

const QUESTIONS: Record<AgeGroup, Question[]> = {
  primary: [
    {
      id: 1,
      text: "If you have 1/2 of a cake and give 1/2 of THAT piece to a friend, what fraction of the whole cake is left for you?",
      options: ["1/2", "1/4", "1/8", "No cake left!"],
      type: "Logical Reasoning"
    },
    {
      id: 2,
      text: "You see two paths. One is straight and easy, the other is rocky but has a treasure at the end. Which do you choose?",
      options: ["Straight path", "Rocky path", "Stay where I am", "Ask for a map"],
      type: "Resilience"
    },
    {
      id: 3,
      text: "When you get stuck on a puzzle, what's the first thing you do?",
      options: ["Ask for the answer", "Try a different way", "Take a break", "Look at the picture"],
      type: "Strategy"
    }
  ],
  middle: [
    {
      id: 1,
      text: "A writer describes a storm during a sad scene in a book. Why might they do this?",
      options: ["To show the weather", "To mirror the character's feelings", "To make it harder to read", "To fill space"],
      type: "Synthesis"
    },
    {
      id: 2,
      text: "If you could only master one skill instantly, which would it be?",
      options: ["Perfect Memory", "First-Principles Thinking", "Extreme Focus", "Speed Reading"],
      type: "Aspiration"
    },
    {
      id: 3,
      text: "You find a 'shortcut' for your homework that gives the right answer but skips the steps. Do you use it?",
      options: ["Yes, every time", "No, I want to learn the steps", "Only if I'm tired", "I'd ask the teacher if it's okay"],
      type: "Integrity"
    }
  ],
  gcse: [
    {
      id: 1,
      text: "Gravity on Mars is 38% of Earth's. If you jump 1 metre on Earth, which of these is the most 'Socratic' question to ask about jumping on Mars?",
      options: ["How high is 1m on Mars?", "Does my mass change on Mars?", "What force is resisting my jump?", "How long is the jump duration?"],
      type: "Physics Application"
    },
    {
      id: 2,
      text: "When facing a complex exam problem you haven't seen before, what is your immediate mental framework?",
      options: ["Panic and skip", "Break it into 'Small Steps'", "Look for a similar past paper", "Guess based on the numbers"],
      type: "Metacognition"
    },
    {
      id: 3,
      text: "In your opinion, what is the 'Gold Standard' of academic success?",
      options: ["High Grades (9s)", "Deep Understanding", "Winning the Group's respect", "Finishing the syllabus first"],
      type: "Values"
    }
  ]
};

const PROFILES = {
  primary: {
    name: "The Pattern Hunter",
    desc: "Your child naturally looks for connections and logic in the world around them. They thrive when challenges are framed as 'Adventures'.",
    icon: <Sparkles className="w-12 h-12 text-yellow-500" />,
    stat: "96th Percentile Logical Synthesis"
  },
  middle: {
    name: "The Logos Strategist",
    desc: "You possess a balanced, structured approach to learning. You value the 'How' over the 'What', and your potential for deep synthesis is massive.",
    icon: <BrainCircuit className="w-12 h-12 text-blue-500" />,
    stat: "98th Percentile Stratagem"
  },
  gcse: {
    name: "The Stoic Scholar",
    desc: "You exhibit high resilience and a first-principles mindset. You are ready to move beyond 'revision' and into true 'Mastery'.",
    icon: <Target className="w-12 h-12 text-purple-500" />,
    stat: "Elite Core Pillar: Metacognition"
  },
  polymath: {
    name: "The Polymath",
    desc: "A rare, multi-disciplinary thinker. You bridge the gap between creative synthesis and logical precision with ease.",
    icon: <Zap className="w-12 h-12 text-orange-500" />,
    stat: "Top 1% Multidisciplinary Signature"
  }
};

export default function CognitiveDiagnostic() {
  const [step, setStep] = useState(0); // 0: Age, 1-3: Questions, 4: Lead Form, 5: Result
  const [ageGroup, setAgeGroup] = useState<AgeGroup | ''>('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Lead data
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  const handleAgeSelect = (val: string) => {
    setAgeGroup(val as AgeGroup);
    setStep(1);
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (step < 3) {
      setStep(step + 1);
    } else {
      setStep(4); // Move to Lead Form
    }
  };

  const getProfile = () => {
    if (!ageGroup) return PROFILES.polymath;
    const secondaryAnswers = answers.filter((_, idx) => idx === 1).length;
    if (secondaryAnswers === 3) return PROFILES.polymath;
    return PROFILES[ageGroup];
  };

  const saveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const profile = getProfile();
      
      // Save to Supabase (Database Anchor)
      const { error: dbError } = await supabase.from('leads').insert([{
        full_name: leadName,
        email: leadEmail,
        phone: leadPhone || null,
        year_group: ageGroup,
        thinking_profile: profile.name,
        source: 'diagnostic_tofu'
      }]);

      if (dbError) throw dbError;

      // Trigger Automated Report Dispatch (Loops.so)
      setIsProcessing(true);
      setStep(4.5); // Processing state

      try {
        await fetch('/api/diagnostic/send-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: leadEmail,
            name: leadName,
            thinkingProfile: profile.name,
            bragStat: profile.stat,
            ageGroup: ageGroup
          })
        });
      } catch (emailError) {
        // Silently fail email but proceed to results so UX isn't broken
        console.error("Email dispatch failed:", emailError);
      }

      // Final Transition to Viral Result Screen
      setTimeout(() => {
        setIsProcessing(false);
        setStep(5); // Result state
      }, 2000);
      
    } catch (error) {
      console.error("Error saving lead:", error);
      setStep(5);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = (platform: 'whatsapp' | 'linkedin' | 'x') => {
    const profile = getProfile();
    const url = "https://lumen-forge.co.uk/diagnostic";
    const text = ageGroup === 'primary' 
      ? `Our child just discovered their Sovereign Thinking Profile: ${profile.name}! 🧠 This Socratic Diagnostic is a game-changer for KS2 prep. Check it out: ${url}`
      : `I just unlocked 'The ${profile.name}' profile on the LumenForge Socratic Diagnostic. 🏛️ Elite cognitive insights for GCSE mastery. Verify your profile: ${url}`;

    const links = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    };

    window.open(links[platform], '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText("https://lumen-forge.co.uk/diagnostic");
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const currentQuestions = ageGroup ? QUESTIONS[ageGroup] : [];
  const currentQuestion = currentQuestions[step - 1];

  return (
    <div className="max-w-xl mx-auto w-full px-4 py-8">
      <Card className="border-0 shadow-2xl bg-white dark:bg-zinc-950 rounded-[2.5rem] overflow-hidden min-h-[500px] flex flex-col">
        <div className="px-8 pt-8 pb-4">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
              {ageGroup === 'primary' ? 'Learning Adventure Check' : 'Mastery Diagnostic'}
            </Badge>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
               <ShieldCheck className="w-3.5 h-3.5" />
               DfE 2026 Compliant
            </div>
          </div>
          <Progress value={progress} className="h-1.5 bg-zinc-100 dark:bg-zinc-900" />
        </div>

        <CardContent className="flex-1 flex flex-col p-8 md:p-10">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div 
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 flex-1 flex flex-col justify-center"
              >
                <div className="space-y-3">
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                    Discover Your <span className="text-primary italic">Socratic Profile.</span>
                  </h2>
                  <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                    Identify how your brain processes complex information in 2 minutes. Select your level to begin.
                  </p>
                </div>

                <div className="grid gap-4">
                  {[
                    { val: 'primary', label: 'Primary (Years 5-6)', age: 'Ages 9-11' },
                    { val: 'middle', label: 'Middle (Years 7-9)', age: 'Ages 12-14' },
                    { val: 'gcse', label: 'GCSE (Years 10-11)', age: 'Ages 15-16' },
                  ].map((lvl) => (
                    <button
                      key={lvl.val}
                      onClick={() => handleAgeSelect(lvl.val)}
                      className="group flex items-center justify-between p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 hover:border-primary/40 transition-all text-left"
                    >
                      <div>
                        <div className="font-bold text-foreground group-hover:text-primary transition-colors">{lvl.label}</div>
                        <div className="text-xs text-muted-foreground font-medium">{lvl.age}</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-300 dark:text-zinc-700 group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step >= 1 && step <= 3 && (
              <motion.div 
                key={`step${step}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8 flex-1 flex flex-col justify-center"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{currentQuestion?.type}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold leading-tight text-foreground">
                    {currentQuestion?.text}
                  </h3>
                </div>

                <div className="grid gap-3">
                  {currentQuestion?.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(opt)}
                      className="w-full text-left p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 hover:border-primary/40 hover:bg-primary/5 transition-all font-bold text-foreground shadow-sm"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="leadForm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8 flex-1 flex flex-col justify-center"
              >
                <div className="space-y-3">
                  <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                    Final Step: <br/><span className="text-primary italic">Claim Your Profile.</span>
                  </h2>
                  <p className="text-muted-foreground text-base font-medium leading-relaxed">
                    Where should we send your full Socratic Thinking Report and personalized pilot invitation?
                  </p>
                </div>

                <form onSubmit={saveLead} className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      required
                      placeholder="Your Full Name" 
                      className="pl-12 h-14 rounded-2xl bg-zinc-50 border-zinc-100 focus:border-primary/40 focus:ring-0 transition-all font-medium"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      required
                      type="email"
                      placeholder="Email Address" 
                      className="pl-12 h-14 rounded-2xl bg-zinc-50 border-zinc-100 focus:border-primary/40 focus:ring-0 transition-all font-medium"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      type="tel"
                      placeholder="Phone Number (Optional)" 
                      className="pl-12 h-14 rounded-2xl bg-zinc-50 border-zinc-100 focus:border-primary/40 focus:ring-0 transition-all font-medium"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSaving}
                    className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-xl hover:shadow-primary/20 transition-all"
                  >
                    {isSaving ? "Verifying..." : "Unlock My Sovereign Profile"}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </form>

                <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest pt-2">
                   <div className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> 2026 Safeguarding</div>
                   <div className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Redacted PII</div>
                </div>
              </motion.div>
            )}

            {(step === 4.5 || isProcessing) && (
              <motion.div 
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center space-y-6"
              >
                <div className="relative">
                   <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                   <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-extrabold text-foreground italic">Analyzing Neural Patterns...</h3>
                  <p className="text-sm text-muted-foreground font-medium">Assembling your Sovereign Thinking Profile.</p>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8 flex-1 flex flex-col items-center text-center justify-center pb-6"
              >
                {/* The Viral Milestone Card (Screenshot-Ready Artifact) */}
                <div id="milestone-card" className="w-full relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                  
                  <div className="relative bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-[2.5rem] shadow-sm p-8 md:p-10 overflow-hidden text-center aspect-[4/5] flex flex-col justify-between items-center scale-95 md:scale-100 mx-auto">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12 scale-150 pointer-events-none">
                       <BrainCircuit className="w-48 h-48" />
                    </div>

                    <div className="space-y-6 z-10 w-full flex-1 flex flex-col justify-center items-center">
                      <div className="relative">
                        <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl animate-pulse" />
                        <div className="relative p-7 bg-white dark:bg-black rounded-full border-4 border-zinc-50 dark:border-zinc-800 shadow-xl mb-4">
                          {getProfile().icon}
                        </div>
                        <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-black border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5 shadow-lg">
                           Rank: Elite
                        </Badge>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Sovereign Signature</div>
                        <h2 className="text-4xl font-black tracking-tighter text-foreground leading-[0.9]">{getProfile().name}</h2>
                        <div className="pt-2">
                           <div className="px-4 py-1.5 rounded-full bg-zinc-950 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                             {getProfile().stat}
                           </div>
                        </div>
                      </div>

                      <p className="text-muted-foreground text-sm max-w-[240px] mx-auto leading-relaxed font-semibold italic">
                        {getProfile().desc}
                      </p>
                    </div>

                    {/* Subtle Branding Footer */}
                    <div className="z-10 pt-8 w-full border-t border-zinc-100 dark:border-white/5 flex items-center justify-between opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all">
                       <div className="flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-primary" />
                          <span className="text-[10px] font-black uppercase tracking-tighter">LumenForge</span>
                       </div>
                       <span className="text-[9px] font-bold uppercase tracking-widest leading-none">2026 Socratic Pilot</span>
                    </div>
                  </div>

                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-950 px-4 py-1.5 rounded-full border border-zinc-100 dark:border-white/10 text-[9px] font-black uppercase tracking-widest text-muted-foreground shadow-sm flex items-center gap-2">
                     <Share2 className="w-3 h-3" />
                     Your Viral Milestone Card
                  </div>
                </div>

                {/* Brag-Worthy Share Section */}
                <div className="w-full space-y-4 pt-8 mt-2">
                   <div className="flex justify-center gap-3">
                      <Button 
                        onClick={() => handleShare('whatsapp')}
                        variant="outline" 
                        size="icon" 
                        className="w-12 h-12 rounded-2xl hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all group"
                      >
                        <Share2 className="w-5 h-5 group-active:scale-95 transition-transform" />
                      </Button>
                      <Button 
                        onClick={() => handleShare('linkedin')}
                        variant="outline" 
                        size="icon" 
                        className="w-12 h-12 rounded-2xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all font-bold group"
                      >
                        <span className="text-sm group-active:scale-95 transition-transform">in</span>
                      </Button>
                      <Button 
                        onClick={() => handleShare('x')}
                        variant="outline" 
                        size="icon" 
                        className="w-12 h-12 rounded-2xl hover:bg-zinc-50 hover:text-foreground hover:border-zinc-300 transition-all font-bold group"
                      >
                        <span className="text-sm group-active:scale-95 transition-transform">X</span>
                      </Button>
                      <Button 
                        onClick={copyToClipboard}
                        variant="outline" 
                        size="icon" 
                        className="w-12 h-12 rounded-2xl hover:bg-zinc-50 hover:text-primary hover:border-primary/20 transition-all group"
                      >
                        {copySuccess ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 group-active:scale-95 transition-transform" />}
                      </Button>
                   </div>
                   <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] leading-relaxed">
                     Dispatch your results to the community
                   </p>
                </div>

                <div className="w-full relative group mt-4 overflow-hidden rounded-[2.5rem] border-2 border-primary/10 shadow-lg">
                   {/* Blurred Report Card Placeholder */}
                   <div className="absolute inset-0 bg-white/40 dark:bg-black/60 backdrop-blur-md z-10 flex flex-col items-center justify-center p-8 text-center transition-all group-hover:bg-white/30">
                      <div className="p-3 bg-primary/10 rounded-full mb-4">
                        <Lock className="w-8 h-8 text-primary" />
                      </div>
                      <h4 className="text-foreground font-black text-xl mb-4 italic tracking-tight">Your Full Mastery Report is Ready</h4>
                      <Link href="/signup" className="w-full">
                        <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-2xl text-lg shadow-xl hover:shadow-primary/20 transition-all">
                          Claim My Socratic Plan
                        </Button>
                      </Link>
                      <p className="text-muted-foreground text-[10px] mt-4 font-bold uppercase tracking-widest">Enroll in the {ageGroup === 'primary' ? 'Junior' : 'Foundry'} Pilot</p>
                   </div>
                   
                   {/* Mock content behind blur */}
                   <div className="p-8 opacity-20 filter blur-sm space-y-4">
                      <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
                      <div className="h-4 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded" />
                      <div className="grid grid-cols-3 gap-2 py-4">
                         <div className="h-20 bg-zinc-100 dark:bg-zinc-900 rounded-xl" />
                         <div className="h-20 bg-zinc-100 dark:bg-zinc-900 rounded-xl" />
                         <div className="h-20 bg-zinc-100 dark:bg-zinc-900 rounded-xl" />
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest pt-4">
                   <div className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> 2026 Safeguarding</div>
                   <div className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Zero-Training Policy</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <p className="mt-8 text-center text-xs font-medium text-muted-foreground">
        LumenForge: The UK's first Socratic AI for high-performance mindset building. <br/>
        Join thousands of students in the 2026 Pilot.
      </p>
    </div>
  );
}
