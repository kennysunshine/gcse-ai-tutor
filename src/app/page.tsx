/* eslint-disable react/no-unescaped-entities */

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Sparkles,
  ShieldCheck,
  Lock,
  Handshake,
  ArrowRight,
  CheckCircle2,
  Target,
  Users,
  BrainCircuit,
  GraduationCap,
  Calculator,
  Zap,
  PenTool,
  BookOpen
} from 'lucide-react'
import { InteractiveDemo } from '@/components/InteractiveDemo'
import { CheckoutButton } from '@/components/CheckoutButton'
import { Badge } from '@/components/ui/badge'
import { FounderVideo } from '@/components/FounderVideo'
import { PricingSection } from '@/components/PricingSection'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-[#F8F9FA] dark:bg-muted/10 relative overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200/50 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/50 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-200/50 dark:bg-pink-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

        <div className="container px-4 mx-auto text-center relative z-10">
          <div className="mb-6 flex justify-center">
            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800 px-4 py-1.5 text-sm font-semibold rounded-full shadow-sm">
              <ShieldCheck className="w-4 h-4 mr-2 inline-block" />
              DfE 2026 Compliant: Zero-Training Data Policy
            </Badge>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-foreground">
            LumenForge is your always-on <br className="hidden md:block" />
            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">study buddy.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            Never get the answer — learn to find it. Master your KS2 SATs and GCSEs with an AI companion that guides you step-by-step.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/diagnostic">
              <Button size="lg" className="text-xl px-10 py-8 rounded-full shadow-2xl hover:shadow-primary/20 transition-all hover:-translate-y-1 bg-primary text-primary-foreground font-extrabold border-none">
                Take the Free Diagnostic
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="text-lg px-8 py-7 rounded-full shadow-sm hover:shadow-md transition-all font-bold border-2">
                Get LumenForge
              </Button>
            </Link>
          </div>

          {/* Hero Promotional Video Player */}
          <div className="mt-16 sm:mt-24 max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 relative group">
            <video 
              controls
              playsInline 
              className="w-full aspect-video object-cover"
            >
              <source src="/hero section video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Learners Section */}
      <section id="learners" className="py-24 bg-white dark:bg-background">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <div className="text-sm font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2" aria-hidden="true"><Sparkles className="w-4 h-4" /> Learners: Your Always-On Study Buddy</div>
                <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-foreground">
                  Master Your Subjects, Don’t Just Finish Them.
                </h2>
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Fed up with AI that just gives you the answer? LumenForge is a Socratic Mentor that helps you find the <strong className="text-foreground">'Aha!'</strong> moment yourself.
              </p>
              <div className="space-y-6 mt-8">
                <div className="flex gap-5">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-3.5 rounded-2xl h-fit border border-orange-200 dark:border-orange-800">
                    <Calculator className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">Maths Mastery</h3>
                    <p className="text-muted-foreground leading-relaxed">Stuck on a Year 6 Reasoning paper? We use White Rose Maths v3.0 'Small Steps' logic to give you the perfect hint.</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3.5 rounded-2xl h-fit border border-blue-200 dark:border-blue-800">
                    <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">GCSE Power-Up</h3>
                    <p className="text-muted-foreground leading-relaxed">From Quadratic Equations to Shakespeare, we help you bag those tricky AO2/AO3 exam problem-solving marks.</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3.5 rounded-2xl h-fit border border-green-200 dark:border-green-800">
                    <PenTool className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">Writing Coach</h3>
                    <p className="text-muted-foreground leading-relaxed">Level up your spelling, punctuation, and grammar with a mentor that builds your confidence, one sentence at a time.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <InteractiveDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Parents Section */}
      <section id="parents" className="py-24 bg-[#FFF8F3] dark:bg-[#2A1B14]">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="absolute inset-0 bg-gradient-to-bl from-orange-200 to-yellow-100 dark:from-orange-900/40 dark:to-yellow-900/20 rounded-[3rem] transform -rotate-3 scale-105 z-0"></div>
              <Card className="relative border-0 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white dark:bg-card p-2 z-10">
                <div className="bg-slate-50 dark:bg-muted/20 rounded-[2rem] p-8 md:p-10 flex flex-col justify-center gap-8 h-full">
                  <div className="flex items-center gap-5 border-b border-slate-200 dark:border-slate-800 pb-6">
                    <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-2xl font-bold shadow-sm shrink-0">
                      8
                    </div>
                    <div>
                      <div className="font-extrabold text-xl text-foreground">Maths Efficacy</div>
                      <div className="text-sm text-muted-foreground font-medium mt-1">Target Grade: 8</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-base font-bold text-foreground">
                      <span>Syllabus Mastery</span>
                      <span className="text-primary text-xl">72%</span>
                    </div>
                    <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full w-[72%]"></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> Active Framework: Elite GCSE Mentor
                    </p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900 p-5 rounded-2xl flex items-start gap-4 mt-4 shadow-sm">
                    <ShieldCheck className="w-6 h-6 text-orange-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-orange-800 dark:text-orange-200 font-semibold leading-relaxed">
                      2026 Safeguarding Protocol Active. Your child’s data is never used for AI training (Zero-Training Data Policy).
                    </p>
                  </div>
                </div>
              </Card>
            </div>
            <div className="order-1 md:order-2 space-y-8">
              <div>
                <div className="text-sm font-bold text-orange-500 uppercase tracking-wider mb-3 flex items-center gap-2" aria-hidden="true"><BrainCircuit className="w-4 h-4" /> Parents: High-Fives, Not Homework Hassle</div>
                <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-foreground">
                  High-Fives, Not Homework Hassle.
                </h2>
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Rooted in the science of <strong className="text-foreground">The Magic of Thinking Big</strong>, we help your child build the resilience needed for 11+ and GCSE success.
              </p>
              <div className="space-y-6 mt-8">
                <div className="flex gap-5 items-start">
                  <div className="bg-white dark:bg-card shadow-sm p-3 rounded-full h-fit border border-slate-100 dark:border-slate-800 shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">Sovereign Safety</h3>
                    <p className="text-muted-foreground leading-relaxed">Your child’s data is never used for AI training, and our 2026 Safeguarding Protocol keeps them protected 24/7.</p>
                  </div>
                </div>
                <div className="flex gap-5 items-start">
                  <div className="bg-white dark:bg-card shadow-sm p-3 rounded-full h-fit border border-slate-100 dark:border-slate-800 shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">Progress at a Glance</h3>
                    <p className="text-muted-foreground leading-relaxed">See exactly which 'Small Steps' your child has mastered and where they need a little more push.</p>
                  </div>
                </div>
                <div className="flex gap-5 items-start">
                  <div className="bg-white dark:bg-card shadow-sm p-3 rounded-full h-fit border border-slate-100 dark:border-slate-800 shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">The "Foundry" Advantage</h3>
                    <p className="text-muted-foreground leading-relaxed">Give them an elite edge with a tool that values the process over the result.</p>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Link href="/signup" className="inline-block">
                  <Button size="lg" className="rounded-full px-8 py-7 text-lg bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 border-none">Get LumenForge for your child</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section id="teachers" className="py-24 bg-[#F0FDF4] dark:bg-[#0F291E]">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <div className="text-sm font-bold text-green-600 uppercase tracking-wider mb-3 flex items-center gap-2" aria-hidden="true"><GraduationCap className="w-4 h-4" /> Teachers: The Ultimate Classroom Co-Pilot</div>
                <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-foreground">
                  Save Hours on Admin. Focus on Inspiration.
                </h2>
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Built for the <strong className="text-foreground">DfE 2026 Framework</strong>, LumenForge handles the heavy lifting of differentiation and feedback so you can focus on teaching.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mt-10">
                <Card className="border-0 shadow-lg bg-white dark:bg-card rounded-[2rem] hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-[1rem] flex items-center justify-center mb-5 shrink-0 border border-green-200 dark:border-green-800">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </div>
                    <h3 className="font-extrabold text-[17px] text-foreground mb-2">Instant Exit Tickets</h3>
                    <p className="text-[15px] text-muted-foreground leading-relaxed">Generate end-of-lesson assessments that actually check for deep understanding.</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg bg-white dark:bg-card rounded-[2rem] hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-[1rem] flex items-center justify-center mb-5 shrink-0 border border-red-200 dark:border-red-800">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-[17px] text-foreground mb-2">Safeguarding Dash</h3>
                    <p className="text-[15px] text-muted-foreground leading-relaxed">Get instant alerts if the AI detects a student in distress, ensuring no one falls through the cracks.</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg bg-white dark:bg-card rounded-[2rem] sm:col-span-2 hover:shadow-xl transition-shadow">
                  <CardContent className="p-8 flex items-start gap-6">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-[1rem] flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[17px] text-foreground mb-2">Lesson Scaffolding</h3>
                      <p className="text-[15px] text-muted-foreground leading-relaxed">Align your entire class to the National Curriculum with AI that understands the 'Small Steps' methodology implicitly.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>

            <div className="relative h-full min-h-[500px] mt-10 md:mt-0">
              <div className="absolute inset-0 bg-green-200/50 dark:bg-green-900/20 rounded-[3rem] transform rotate-3 scale-105 z-0"></div>
              <Card className="relative border-0 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white dark:bg-card h-full p-10 flex flex-col items-center justify-center text-center z-10">
                <div className="bg-green-50 dark:bg-green-900/10 p-5 rounded-full mb-8 border border-green-100 dark:border-green-800">
                  <div className="w-28 h-28 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center shadow-inner">
                    <GraduationCap className="w-14 h-14 text-green-600 dark:text-green-300" />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold mb-5 text-foreground">Experience the best AI for teachers.</h3>
                <p className="text-lg text-muted-foreground max-w-[280px] mx-auto mb-10 leading-relaxed font-medium">LumenForge simplifies your workflow while keeping your work and student data private.</p>
                <Link href="/signup">
                  <Button size="lg" className="rounded-full px-10 py-7 text-lg bg-green-600 hover:bg-green-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 border-none">Sign up for free</Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Founder's Story Section */}
      <section id="story" className="py-24 bg-white dark:bg-background">
        <div className="container px-4 mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="text-sm font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2" aria-hidden="true"><Sparkles className="w-4 h-4" /> The Human Architect</div>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-foreground">
              A Message from the Founder.
            </h2>
          </div>

          <div className="max-w-4xl mx-auto relative">

            {/* Vertical Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>

            <div className="space-y-24 relative">

              {/* Point 1: Aristotle Intro */}
              <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-0">
                <div className="md:w-1/2 md:pr-12 md:text-right flex flex-col items-center md:items-end">
                  <h3 className="text-2xl font-extrabold text-foreground mb-3 font-serif">The 2,300-Year-Old Gold Standard</h3>
                  <p className="text-[17px] text-muted-foreground leading-relaxed">
                    History tells us that Aristotle tutored the young Alexander the Great, tailoring every lesson to a future king&apos;s curiosity. For centuries, this 1-on-1 mentorship was the &quot;Gold Standard,&quot; but it was a privilege reserved only for princes. Mass education changed the world for the better, but it forced a compromise: we began teaching to the &quot;middle,&quot; leaving some children to fall behind and others to sit in silence, unchallenged.
                  </p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-white dark:border-background z-10 hidden md:block shadow-sm"></div>
                <div className="md:w-1/2 md:pl-12"></div>
              </div>

              {/* Point 2: Birmingham Origins (User Point 1) */}
              <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-0">
                <div className="md:w-1/2 md:pr-12"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-white dark:border-background z-10 hidden md:block shadow-sm"></div>
                <div className="md:w-1/2 md:pl-12">
                  <h3 className="text-2xl font-extrabold text-foreground mb-3 font-serif">The Stacked Odds</h3>
                  <p className="text-[17px] text-muted-foreground leading-relaxed">
                    I grew up in Birmingham in a socio-economic environment where the odds were stacked against us from day one. When the first-ever GCSEs were introduced, I didn&apos;t just struggle with the coursework—I stopped showing up entirely. I left school with no qualifications and a belief that &quot;academic success&quot; simply wasn&apos;t for people like me.
                  </p>
                </div>
              </div>

              {/* Video Breakout */}
              <FounderVideo />

              {/* Point 3: Real World Classroom (User Point 2) */}
              <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-0">
                <div className="md:w-1/2 md:pr-12 md:text-right flex flex-col items-center md:items-end">
                  <h3 className="text-2xl font-extrabold text-foreground mb-3 font-serif">The Real-World Classroom</h3>
                  <p className="text-[17px] text-muted-foreground leading-relaxed">
                    At 16, I went straight into the high-pressure world of sales, followed by years as a DJ, travelling the world and eventually living in the USA. It was there that my real education began. I was fortunate to be mentored by individuals who had achieved extraordinary success. They introduced me to the world of personal development and the &quot;high-performance&quot; literature that changed my life—starting with <span className="italic">Rich Dad Poor Dad</span>, <span className="italic">The Magic of Thinking Big</span>, and many other classics.
                  </p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-white dark:border-background z-10 hidden md:block shadow-sm"></div>
                <div className="md:w-1/2 md:pl-12"></div>
              </div>

              {/* Point 4: The Lucky Problem (User Point 3) */}
              <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-0">
                <div className="md:w-1/2 md:pr-12"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-white dark:border-background z-10 hidden md:block shadow-sm"></div>
                <div className="md:w-1/2 md:pl-12">
                  <h3 className="text-2xl font-extrabold text-foreground mb-3 font-serif">The &quot;Lucky&quot; Problem</h3>
                  <p className="text-[17px] text-muted-foreground leading-relaxed">
                    I realised that I could self-educate and bridge any gap through books and mentorship. But I also realised something uncomfortable: I was lucky. I had found mentors by chance, and that kind of guidance isn&apos;t available to every kid in Birmingham, London, or beyond. Success shouldn&apos;t depend on &quot;getting lucky&quot; with who you meet.
                  </p>
                </div>
              </div>

              {/* Point 5: Sovereign Mentor (User Point 4) */}
              <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-0">
                <div className="md:w-1/2 md:pr-12 md:text-right flex flex-col items-center md:items-end">
                  <h3 className="text-2xl font-extrabold text-foreground mb-3 font-serif">The Sovereign Mentor</h3>
                  <p className="text-[17px] text-muted-foreground leading-relaxed">
                    I built LumenForge to automate the mentor I never had. We&apos;ve combined the Socratic method with the best of UK curriculum standards to ensure that every child—regardless of their background or their history with exams—has access to a Sovereign Mentor that pushes for a resilient, high-performance mindset.
                  </p>
                  <p className="mt-4 font-extrabold text-primary italic text-lg">
                    &quot;We aren&apos;t just building an app; we are building a Foundry where the next generation of thinkers is forged.&quot;
                  </p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-primary flex items-center justify-center border-4 border-white dark:border-background z-10 hidden md:block shadow-md">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div className="md:w-1/2 md:pl-12">
                  {/* Social Model integrated */}
                  <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      <h4 className="font-bold text-foreground">The Foundry Scholars Promise</h4>
                    </div>
                    <p className="text-[15px] text-muted-foreground leading-snug">
                      To ensure access is truly sovereign, we operate a strict <strong className="text-foreground">1-for-2 social impact model</strong>: For every 1 Premium Subscription purchased, we fund 2 full Elite seats for disadvantaged pupils in UK state schools.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Foundry Scholars Section */}
      <section id="scholars-info" className="py-24 bg-[#F8FAFC] dark:bg-[#0F172A] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/40 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 border-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/40 dark:bg-indigo-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 border-none"></div>

        <div className="container px-4 mx-auto max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-200/50 dark:bg-blue-900/40 rounded-[3rem] transform -rotate-3 scale-105 z-0"></div>
              <Card className="relative border-0 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white dark:bg-card p-10 z-10 transition-transform">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-[1.5rem] flex items-center justify-center mb-6 border border-blue-200 dark:border-blue-800 shadow-sm">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-foreground mb-4">How to Apply</h3>
                <ul className="space-y-4 mb-6">
                  <li className="flex gap-4 items-center">
                    <div className="bg-slate-100 dark:bg-slate-800 text-foreground font-bold rounded-full w-8 h-8 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">1</div>
                    <span className="text-foreground font-medium text-[15px]">Schools register with our <strong className="text-primary">Foundry Network</strong>.</span>
                  </li>
                  <li className="flex gap-4 items-center">
                    <div className="bg-slate-100 dark:bg-slate-800 text-foreground font-bold rounded-full w-8 h-8 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">2</div>
                    <span className="text-foreground font-medium text-[15px]">Teachers nominate disadvantaged students.</span>
                  </li>
                  <li className="flex gap-4 items-center">
                    <div className="bg-slate-100 dark:bg-slate-800 text-foreground font-bold rounded-full w-8 h-8 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">3</div>
                    <span className="text-foreground font-medium text-[15px]">Parents receive a 100% subsidised access token.</span>
                  </li>
                </ul>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 p-4 rounded-xl text-blue-800 dark:text-blue-200 text-sm font-semibold flex items-center gap-3 shadow-inner">
                  <Handshake className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" />
                  1 Elite Subscription = 2 Scholar Seats for disadvantaged students.
                </div>
              </Card>
            </div>

            <div className="space-y-8">
              <div>
                <div className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2" aria-hidden="true"><GraduationCap className="w-4 h-4" /> The Foundry Scholars Program</div>
                <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-foreground">
                  Equalising the High-Performance Advantage.
                </h2>
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed">
                We believe that elite mindset coaching shouldn't be reserved for those who can afford expensive private tutors.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6 font-medium">
                That's why our built-in social impact tier ensures that the most powerful educational technology reaches the kids who need it most.
                Our platform delivers the same premium, Socratic-driven 'brain-training' exactly where it can break the cycle of educational disadvantage.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Link href="/scholars">
                  <Button size="lg" className="rounded-full px-8 py-7 text-[17px] bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 border-none">
                    Redeem School Token
                  </Button>
                </Link>
                <Link href="/#teachers">
                  <Button size="lg" variant="outline" className="rounded-full px-8 py-7 text-[17px] font-bold shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    Register Your School
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section >

      <PricingSection />
    </div>
  )
}
