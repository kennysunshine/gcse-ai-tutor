/* eslint-disable react/no-unescaped-entities */

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react'
import { CheckoutButton } from '@/components/CheckoutButton'
import { Badge } from '@/components/ui/badge'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/5 to-secondary/20 dark:from-primary/10 dark:to-secondary/5">
        <div className="container px-4 mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30 px-3 py-1 text-sm font-medium">
              <ShieldCheck className="w-4 h-4 mr-2 inline-block" />
              DfE 2026 Compliant: Zero-Training Data Policy
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-primary dark:text-foreground">
            LumenForge: Your <span className="text-primary/80">Elite AI Mentor</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Never get the answer — learn to find it. Master your KS2 SATs and GCSEs with an AI companion that guides you step-by-step.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all">
                Start Learning For Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full">
                I have an account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-background border-b">
        <div className="container px-4 mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The LumenForge Philosophy</h2>
            <div className="h-1 w-20 bg-primary mx-auto rounded"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-lg text-muted-foreground">
              <p className="text-2xl font-semibold text-foreground leading-snug">
                Beyond the answer. Beyond the bot.
              </p>
              <p>
                Rooted in the science of high performance, <strong className="text-foreground">LumenForge</strong> is a Socratic Mentor that builds thinkers, not just test-takers. We bridge the gap between 'I can't' and 'I understand' using official 2026 National Curriculum scaffolding.
              </p>
              <p>
                We believe in the <strong>Thermostat Rule</strong>: if a student sets their belief to mediocre, they achieve mediocre results. LumenForge automatically pushes students to think one level bigger than their current goal.
              </p>
            </div>
            <Card className="border-primary/20 bg-primary/5 shadow-inner">
              <CardContent className="p-8 space-y-4">
                <h3 className="text-xl font-bold text-primary mb-2">Our Social Enterprise Mission</h3>
                <p className="text-sm">
                  Excellence should not be gated by zip code. LumenForge operates on a B2B Equity Model.
                </p>
                <p className="text-sm">
                  Every private <strong className="text-foreground">LumenForge Elite</strong> subscription directly subsidizes two <strong className="text-foreground">Foundry Scholarships</strong>, granting completely free, unfiltered access to our most advanced AI tutoring tiers for disadvantaged state school students.
                </p>
                <div className="pt-4 border-t border-primary/10">
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold">
                    Knowledge is Potential. Thinking is Power.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features / Value Prop */}
      <section className="py-20 bg-muted/20">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold">Why LumenForge?</h2>
              <div className="space-y-4">
                {[
                  "Strictly Socratic method — we ask, you answer.",
                  "Covers KS2 Primary and all major UK Exam Boards (AQA, Edexcel, OCR).",
                  "Patient, encouraging, and always available.",
                  "Tracks your progress and streaks."
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-green-600 h-6 w-6 flex-shrink-0" />
                    <span className="text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Fake Demo Chat UI */}
            <Card className="border-2 border-primary/10 shadow-2xl skew-y-1 hover:skew-y-0 transition-transform duration-500">
              <CardHeader className="bg-primary/5 border-b">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <span>🧬</span> Biology Tutor
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4 font-mono text-sm">
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-2xl rounded-tr-none max-w-[80%]">
                    What is osmosis?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-muted px-4 py-2 rounded-2xl rounded-tl-none max-w-[80%]">
                    I won't just give you the definition! Think about water molecules moving. Where do they move from and to?
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-2xl rounded-tr-none max-w-[80%]">
                    High concentration to low?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-muted px-4 py-2 rounded-2xl rounded-tl-none max-w-[80%]">
                    Spot on! And what specifically does the water move across?
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-background border-t">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Invest in Excellence. Subsidize the Future.</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Choose your tier. Every Elite subscription funds two Foundry Scholarships for disadvantaged students.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">

            {/* Open Tier */}
            <Card className="flex flex-col relative border-2 border-primary/20">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">LumenForge Open</CardTitle>
                <div className="text-4xl font-bold mt-4">£4.99<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
                <p className="text-sm text-primary font-medium mt-2">Free 30-Day Trial</p>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow text-center pt-4">
                <p className="text-muted-foreground mb-6">For casual users looking for high-quality KS2 & GCSE curriculum access.</p>
                <ul className="space-y-3 mb-8 text-sm text-left mx-auto">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Standard Socratic Mentoring</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Full Curriculum Access</li>
                </ul>
                <div className="mt-auto">
                  <Button className="w-full" variant="outline">Start Free Trial</Button>
                </div>
              </CardContent>
            </Card>

            {/* Elite Tier */}
            <Card className="flex flex-col relative border-2 border-primary shadow-xl scale-105 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                B2C Premium
              </div>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">LumenForge Elite</CardTitle>
                <div className="text-4xl font-bold mt-4">£24.99<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
                <p className="text-sm text-muted-foreground mt-2">Private / High-performers</p>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow text-center pt-4">
                <p className="text-muted-foreground mb-6">Fully unlocks the Elite Pedagogical Framework and Institutional Power Structures.</p>
                <ul className="space-y-3 mb-8 text-sm text-left mx-auto">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Active Literacy Briefings</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Projected Grade Outcomes</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> <strong>Funds 2 Foundry Scholars</strong></li>
                </ul>
                <div className="mt-auto">
                  <CheckoutButton tier="elite" priceAmount={2499} className="w-full">Upgrade to Elite</CheckoutButton>
                </div>
              </CardContent>
            </Card>

            {/* Scholar Tier */}
            <Card className="flex flex-col relative border-2 border-primary/20 bg-muted/30">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">Foundry Scholar</CardTitle>
                <div className="text-4xl font-bold mt-4">£0<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
                <p className="text-sm text-muted-foreground mt-2">Disadvantaged Students</p>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow text-center pt-4">
                <p className="text-muted-foreground mb-6">Full Elite access subsidized by our premium members and government tender.</p>
                <ul className="space-y-3 mb-8 text-sm text-left mx-auto">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Full Elite Mentorship</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Granted via School Token</li>
                </ul>
                <div className="mt-auto">
                  <Link href="/scholars">
                    <Button className="w-full" variant="secondary">Apply / Redeem Token</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Subjects Grid Preview */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Supported Subjects</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: "➗", name: "Maths" },
              { icon: "📖", name: "English Lit" },
              { icon: "📝", name: "English Lang" },
              { icon: "🧬", name: "Biology" },
              { icon: "🧪", name: "Chemistry" },
              { icon: "⚡", name: "Physics" },
              { icon: "🌍", name: "Geography" },
              { icon: "📜", name: "History" },
              { icon: "💻", name: "Comp Sci" },
              { icon: "🥐", name: "French" },
            ].map((subject) => (
              <Card key={subject.name} className="hover:border-primary/50 transition-colors cursor-default">
                <CardContent className="p-6 flex flex-col items-center gap-2">
                  <span className="text-4xl">{subject.icon}</span>
                  <span className="font-medium">{subject.name}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} LumenForge. Built for UK Students.</p>
      </footer>
    </div>
  )
}
