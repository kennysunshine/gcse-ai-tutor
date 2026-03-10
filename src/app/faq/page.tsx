"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { ShieldCheck, Sparkles, User, Lightbulb } from 'lucide-react'

export default function FAQPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-3xl">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold mb-4">How LumenForge Works</h1>
                <p className="text-xl text-muted-foreground">Everything you need to know about the elite Socratic Mentor.</p>
            </div>

            <div className="space-y-12">
                <section>
                    <div className="flex items-center gap-2 mb-6 text-primary">
                        <Sparkles className="h-6 w-6" />
                        <h2 className="text-2xl font-bold">Foundations</h2>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-left font-semibold">What is LumenForge?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                LumenForge is an elite AI Socratic Mentor designed specifically for UK GCSE and KS2 students. Unlike standard AI tools that simply provide answers, we use pedagogical frameworks to guide students toward discovering the solution themselves, building long-term retention and high-status thinking.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="text-left font-semibold">Why are you called a Socratic Mentor?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                Our platform is built on the Socratic Method—a form of cooperative argumentative dialogue that stimulates critical thinking. We use the "Thermostat Rule" to ensure we never give the answer away, instead providing exactly enough heat (hints) to keep the learner moving forward.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-6 text-primary">
                        <User className="h-6 w-6" />
                        <h2 className="text-2xl font-bold">For Teachers & Schools</h2>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-3">
                            <AccordionTrigger className="text-left font-semibold">How do teachers sign up?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                                <p>Teachers should sign up using their official <strong>.sch.uk</strong> or trust email address. Currently, the system identifies school-based accounts for potential scholarship eligibility.</p>
                                <p>If you require <strong>Supervisor Access</strong> to monitor pupil progress and safeguarding alerts, please contact our implementation team at <code className="text-primary font-bold">foundry@lumenforge.co.uk</code> to have your account elevated to the 'Teacher' role manually after verification.</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger className="text-left font-semibold">What is the Supervisor Dashboard?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                Verified teachers gain access to a command center where they can view aggregated mastery data for their classes, track individual pupil streaks, and receive real-time safeguarding alerts if our AI detects distress or risk in Socratic interactions.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5">
                            <AccordionTrigger className="text-left font-semibold">How do I nominate a "Foundry Scholar"?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                We provide free Elite access to disadvantaged students through school tokens. Registered teachers can request a block of tokens to distribute to pupils who meet the Pupil Premium or similar criteria.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-6 text-primary">
                        <Lightbulb className="h-6 w-6" />
                        <h2 className="text-2xl font-bold">For Students</h2>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-6">
                            <AccordionTrigger className="text-left font-semibold">How do I start?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                Simply create an account and complete your "Elite Diagnostic" onboarding. This allows LumenForge to calibrate to your exact year group (KS2 to GCSE), exam board (AQA, Edexcel, etc.), and target grades.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-7">
                            <AccordionTrigger className="text-left font-semibold">Can I use this for KS2 SATs and GCSEs?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                Yes. LumenForge adapts its language and curriculum depth based on your profile. For younger scholars, it uses simple, encouraging language. For GCSE students, it pushes into strategic leadership context and advanced syllabus mastery.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-6 text-primary">
                        <ShieldCheck className="h-6 w-6" />
                        <h2 className="text-2xl font-bold">Data & Safety</h2>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-8">
                            <AccordionTrigger className="text-left font-semibold">How do you protect my data?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                We are strictly DfE 2026 Compliant and adhere to UK GDPR. We use a Zero-Training Data Policy, meaning your personal work is never used to train future AI models. Interactions are restricted to your session boundary.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-9">
                            <AccordionTrigger className="text-left font-semibold">What is the "Disruptor" mindset?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                It's about taking ownership of your education. A Disruptor doesn't wait to be told what to do; they use the Socratic Mentor to hunt for gaps in their knowledge and aggressively master their destiny.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </section>
            </div>
        </div>
    )
}
