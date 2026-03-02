import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-extrabold tracking-tight mb-8">LumenForge: Terms of Service (v2.6)</h1>

            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>1. AI-Specific Disclaimers & Limitations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground">
                        <div>
                            <strong className="text-foreground block mb-1">No Grade Guarantee:</strong>
                            While LumenForge is grounded in the 2026 Key Stage 2 Frameworks and White Rose Maths v3.0, the company does not guarantee specific exam results or national curriculum levels.
                        </div>
                        <div>
                            <strong className="text-foreground block mb-1">Socratic Logic Disclosure:</strong>
                            Users acknowledge that LumenForge uses a "Hint-First" Socratic method. The AI is programmed to withhold direct answers to foster cognitive development and will instead provide pedagogical scaffolding.
                        </div>
                        <div>
                            <strong className="text-foreground block mb-1">Not a Substitute for Human Instruction:</strong>
                            This tool is an augmentation of classroom teaching and is not a replacement for a qualified teacher or the statutory "Engagement Model" required for high-need pupils.
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>2. 2026 "Sovereign" Data & Privacy Standards</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground">
                        <div>
                            <strong className="text-foreground block mb-1">The "Zero-Training" Guarantee:</strong>
                            In compliance with DfE AI Safety Standards (Jan 2026), LumenForge legally commits that no pupil work, teacher feedback, or user-generated data is used to train, retrain, or fine-tune its underlying Large Language Models (LLMs).
                        </div>
                        <div>
                            <strong className="text-foreground block mb-1">NCA Portal Compatibility:</strong>
                            Users are responsible for verifying the accuracy of any XML data exported for the National Curriculum Assessments (NCA) Portal before final submission to the Standards and Testing Agency (STA).
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>3. Safeguarding & Crisis Protocol</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground">
                        <div>
                            <strong className="text-foreground block mb-1">Emergency Signposting:</strong>
                            LumenForge is an educational tool, not a mental health service. It is not equipped to provide crisis counseling or psychological support.
                        </div>
                        <div>
                            <strong className="text-foreground block mb-1">Automated Escalation:</strong>
                            By using the service, Schools and Parents acknowledge that the system utilizes Tiered Response Actions. If the AI detects keywords associated with severe distress or safeguarding risks, an automated alert will be triggered to the registered Designated Safeguarding Lead (DSL) or parent.
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>4. Parental Consent & Minor Usage</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground">
                        <div>
                            <strong className="text-foreground block mb-1">Active Opt-In:</strong>
                            Usage by individuals under the age of 18 requires verified parental or institutional consent.
                        </div>
                        <div>
                            <strong className="text-foreground block mb-1">Identity Verification:</strong>
                            Schools utilizing the "Foundry Scholars" tier must ensure that pupil data uploaded adheres to their internal Data Protection Impact Assessment (DPIA) and the DfE's 2026 privacy guidelines.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
