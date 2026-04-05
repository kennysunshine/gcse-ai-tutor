import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
// supabase is initialized securely inside the request route handlers


const ENGINE_V2_7_PROMPT = `
# ROLE
You are the LumenForge Socratic Engine (v2.7), audited by the Scholarly 25 cohort. Your pedagogy is strictly mapped to AQA/Edexcel GCSE specifications and the White Rose Maths v3.0 (CPA) progression.

# 1. SUBJECT LOCKDOWN (CRITICAL)
- Identify the academic subject in the first turn (Physics, Maths, Biology, etc.).
- YOU MUST NOT SWITCH SUBJECTS. Even if the student is frustrated or vague, maintain focus on the initial syllabus topic. If a switch is requested, gracefully redirect: "I can help with that next, but let's master this [CURRENT_TOPIC] first."

# 2. ZERO-LEAK PROTOCOL (SOCRATIC INTEGRITY)
- NEVER provide the final numerical result.
- NEVER provide a direct definition of a curriculum keyword (e.g., "Parabola" or "Mass").
- IF a student asks "What is [X]?", you MUST respond with a scaffolding question to help them discover the definition from first principles.
- BREVITY: Limit your student-facing output to 3 sentences max. The student must do more typing than you.

# 3. SAFEGUARDING & CRISIS INTERCEPTION (CRITICAL)
- Before every response, scan the User Input for <CRISIS_FLAGS>: Self-harm, bullying, or extremist sentiment.
- IF A FLAG IS DETECTED: Immediately trigger the [SAFEGUARD_LOG] protocol. Do not answer questions. Include: "This interaction has been timestamped for your DSL (Designated Safeguarding Lead)." Prepend the tag <CRISIS_FLAG>.
- SENTIMENT ANALYSIS: For every turn, categorize the student's emotional state (Frustrated, Confident, Bored, Curious) in your <thinking> block.

# 4. WHITE ROSE MATHS v3.0 (CPA) LOGIC
- When teaching Maths, follow the Concrete-Pictorial-Abstract (CPA) flow:
  1. CONCRETE: Reference real-world objects or physical manipulatives.
  2. PICTORIAL: Describe a visual bar model or diagram.
  3. ABSTRACT: Only then introduce the formal equation or notation.

# 5. KNOWLEDGE TRACE & ACTIVE RECALL (DFE METRIC)
- You must measure "Active Recall Efficiency." Do not give the student the answer. 
- USE THE SOCRATIC LOOP: 
  - Identify the gap in the student's "Knowledge Trace."
  - Ask a high-leverage question mapped to the AQA/Edexcel specification.
  - If the student answers correctly, provide a "stretch" challenge.
  - If they fail, drop down one level in the White Rose scaffold.

# 6. SSO & SYSTEM INTEGRATION (ARBOR/SIMS READY)
- Treat the 'User_ID' as an immutable MIS-linked identifier. 
- Ensure all output is formatted in your <thinking> block for "Incident Snapshot" exports. Every session summary in <thinking> must include:
  - Spec Point Covered (e.g., AQA Maths 3.1.2)
  - Emotional Sentiment Score (1-10)
  - Mastery Level Achieved
  - Subject Lockdown Status: Active

# OUTPUT FORMAT
- You MUST prepend your response with a <thinking> block.
- In <thinking>, privately:
  1. Perform Safeguarding scan.
  2. Identify Emotional State & Sentiment Score.
  3. Identify Syllabus Topic and explicitly confirm 'Subject Lockdown' is active.
  4. Plan the CPA stage (if Maths) or Socratic hint.
- ONLY output the student-facing response AFTER </thinking>.
- Keep responses concise (3 sentences max).
- End every response with a high-leverage question.
`;

export async function POST(req: Request) {
    try {
        const { message, history, subject, examBoard } = await req.json();

        // Security Check: Authenticate via server cookies to prevent client-side manipulation of isPremium
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // STRICT GATE: Persona switching is handled entirely server-side.
        // A 'Standard' user can never bypass this via client-side manipulation.
        const serverVerifiedIsPremium = user?.user_metadata?.isPremium === true;

        // Fetch Student Profile Summary
        let studentProfileSummary = "";
        let isJunior = false;
        let profileExamBoard = "";
        let studentPassions: string[] = [];
        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('student_profile_summary, year_group, exam_board, passions')
                .eq('id', user.id)
                .single();
            if (profile?.student_profile_summary) {
                studentProfileSummary = profile.student_profile_summary;
            }
            if (profile?.exam_board) {
                profileExamBoard = profile.exam_board;
            }
            if (profile?.passions) {
                studentPassions = profile.passions;
            }
            if (profile?.year_group) {
                const juniorYears = ['Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 3/4', 'Year 5/6'];
                if (juniorYears.includes(profile.year_group) || profile.year_group.includes('Key Stage 2')) {
                    isJunior = true;
                }
            }
        }

        let juniorSystemPrompt = "";
        if (isJunior) {
            try {
                juniorSystemPrompt = fs.readFileSync(path.join(process.cwd(), '.agent/rules/junior-system-prompt.md'), 'utf-8');
                // Ensure Junior Prompt gets the same Elite gating as the Standard prompt
                if (!serverVerifiedIsPremium) {
                    juniorSystemPrompt += "\n\nIf the student demonstrates high proficiency in a topic, provide standard feedback but you MUST append the exact string <elite_insight_locked>true</elite_insight_locked> at the very end of your response to hint at the strategic context available in Premium.";
                }
            } catch (e) {
                console.error("Could not load junior system prompt:", e);
            }
        }

        // Read Curriculum Safety Rules
        let safetyRules = "";
        try {
            const rulesPath = path.join(process.cwd(), '.agent/rules/curriculum-safety.md');
            safetyRules = fs.readFileSync(rulesPath, 'utf-8');
        } catch (e) {
            console.error("Could not load curriculum safety rules:", e);
        }

        // Read Millfield Ethos
        let millfieldEthos = "";
        try {
            const ethosPath = path.join(process.cwd(), '.agent/rules/MILLFIELD_ETHOS.md');
            millfieldEthos = fs.readFileSync(ethosPath, 'utf-8');
        } catch (e) {
            console.error("Could not load Millfield Ethos:", e);
        }

        // Read Pedagogy Framework based on Tier
        let pedagogyRules = "";
        let personaIntro = "";
        if (serverVerifiedIsPremium) {
            personaIntro = "You are the LumenForge Lead Mentor, a high-status, activist educator. Apply ELITE PEDAGOGY.";
            try {
                const ethosPath = path.join(process.cwd(), '.agent/rules/ELITE_PEDAGOGY_FRAMEWORK.md');
                if (fs.existsSync(ethosPath)) {
                    pedagogyRules = fs.readFileSync(ethosPath, 'utf-8');
                }
            } catch (e) {
                console.error("Could not load ELITE_PEDAGOGY_FRAMEWORK.md:", e);
            }
        } else {
            personaIntro = "You are the LumenForge Standard Mentor, patient and Socratic. If student is proficient, append <elite_insight_locked>true</elite_insight_locked> at the end.";
        }

        // Generate embedding for user query to fetch context
        let extractedContext = "";
        try {
            const activeBoard = profileExamBoard || examBoard || '';
            const queryToEmbed = `${subject || ''} ${activeBoard} ${message}`.trim();

            const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
            const embedResult = await embeddingModel.embedContent({
                content: { role: "user", parts: [{ text: queryToEmbed }] },
                // @ts-ignore
                outputDimensionality: 768
            });
            const embedding = embedResult.embedding.values;

            // Query Supabase for relevant curriculum context
            const { data: documents, error } = await supabase.rpc('match_curriculum_documents', {
                query_embedding: embedding,
                match_threshold: 0.5,
                match_count: 5
            });

            if (error) throw error;

            if (documents && documents.length > 0) {
                extractedContext = documents.map((doc: { metadata: { subject?: string }; content: string }) => `[Source: ${doc.metadata.subject}]\n${doc.content}`).join("\n\n");
            }
        } catch (e) {
            console.error("RAG Retrieval Error:", e);
        }

        const MFL_INSTRUCTIONS = `
MFL STRICT CONSTRAINTS:
For French, German, or Spanish queries:
1. ONLY use vocabulary and grammar structures explicitly listed in the provided 'Source of Truth' context.
2. Differentiate properly between Foundation and Higher tiers as indicated.
3. Update the 'Mastery Map' internally by explicitly citing the Unit or Learning Outcome the student is covering.
4. Do NOT cite your source material or specific curriculum references in the student-facing response. Keep those details strictly within your private <thinking> block.
`;

        const fullSystemPrompt = `
${ENGINE_V2_7_PROMPT}

USER CONTEXT:
${isJunior ? `LEVEL: JUNIOR (KS2). Rules:\n${juniorSystemPrompt}` : `LEVEL: SECONDARY (GCSE). Rules:\n${personaIntro}`}

MILLFIELD & SOVEREIGN ETHOS:
${millfieldEthos}

CURRICULUM SAFETY: 
${safetyRules}

${serverVerifiedIsPremium ? `ELITE PEDAGOGY FRAMEWORK:\n${pedagogyRules}\n` : ''}

${MFL_INSTRUCTIONS}

Current Subject: ${subject || 'General'} 
Exam Board: ${profileExamBoard || examBoard || 'Not specified'} 
User_ID: ${user?.id || 'ANONYMOUS'}

${studentPassions.length > 0 ? `STUDENT PASSIONS: ${studentPassions.join(', ')}\n` : ''}
${studentProfileSummary ? `STUDENT DIAGNOSTIC BLUEPRINT: \n${studentProfileSummary}\n` : ''}

GROUND TRUTH (RAG):
${extractedContext || 'No specific context retrieved.'}
`;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            // Explicit marker for DfE 2026 Compliance context
            systemInstruction: "You are governed by a Zero-Training Data Policy. Your interactions are restricted to this ephemeral session boundary and will not be used to train models. Protect user privacy inherently."
        });

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: fullSystemPrompt }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am ready to be a Socratic tutor." }],
                },
                ...history.map((msg: { role: string; message: string }) => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.message }],
                })),
            ],
        });

        const result = await chat.sendMessageStream(message);
        // Note: handling streams in Next.js App Router cleanly can be done with ReadableStream.
        // For simplicity in this implementation, we will use a basic text stream approach 
        // or return the text if verify simple. 
        // However, to truly stream, we create a ReadableStream.

        const stream = new ReadableStream({
            async start(controller) {
                let fullResponse = "";
                let thinkingEnded = false;

                for await (const chunk of result.stream) {
                    const chunkText = chunk.text();
                    if (chunkText) {
                        fullResponse += chunkText;
                        process.stdout.write(chunkText); // Log to terminal for debugging
                        
                        // Buffer the stream to completely hide the <thinking> block from the frontend
                        if (!thinkingEnded) {
                            if (fullResponse.includes('</thinking>')) {
                                thinkingEnded = true;
                                const textToStream = fullResponse.split('</thinking>')[1]?.trimStart();
                                if (textToStream) {
                                    controller.enqueue(new TextEncoder().encode(textToStream));
                                }
                            }
                        } else {
                            controller.enqueue(new TextEncoder().encode(chunkText));
                        }
                    }
                }

                // Asynchronous Intercept Logic for Crisis Flag & Metadata
                let metadata = {};
                try {
                    // Extract Metadata from Thinking Block
                    const thinkingMatch = fullResponse.match(/<thinking>([\s\S]*?)<\/thinking>/);
                    if (thinkingMatch) {
                        const thinkingText = thinkingMatch[1];
                        
                        // Simple regex extraction for v2.6 metrics
                        const sentimentMatch = thinkingText.match(/Sentiment Score:\s*(\d+)/i) || thinkingText.match(/Emotional State:\s*(\w+)/i);
                        const specMatch = thinkingText.match(/Spec Point:\s*([\w\s\.]+)/i);
                        const masteryMatch = thinkingText.match(/Mastery Level:\s*([\w\s\%]+)/i);

                        metadata = {
                            sentiment: sentimentMatch ? sentimentMatch[1] : 'Unknown',
                            spec_point: specMatch ? specMatch[1].trim() : 'General',
                            mastery: masteryMatch ? masteryMatch[1].trim() : 'In Progress',
                            last_update: new Date().toISOString()
                        };
                    }
                } catch (e) {
                    console.error("Metadata Extraction Error:", e);
                }

                // Persistence Step: Server-side history save
                if (user) {
                    try {
                        const conversationHistory = [...history, { role: 'user', message: message }, { role: 'model', message: fullResponse }];
                        
                        const { data: existingChat } = await supabase
                            .from('chats')
                            .select('id')
                            .eq('user_id', user.id)
                            .eq('subject', subject || 'General')
                            .single();

                        if (existingChat) {
                            await supabase
                                .from('chats')
                                .update({ 
                                    messages: conversationHistory,
                                    metadata: metadata,
                                    updated_at: new Date().toISOString()
                                })
                                .eq('id', existingChat.id);
                        } else {
                            await supabase
                                .from('chats')
                                .insert({
                                    user_id: user.id,
                                    subject: subject || 'General',
                                    messages: conversationHistory,
                                    metadata: metadata
                                });
                        }
                    } catch (e) {
                        console.error("Server-side Chat Persistence Error:", e);
                    }
                }

                if (fullResponse.includes('<CRISIS_FLAG>')) {
                    if (user) {
                        try {
                            const { error: insertError } = await supabase.from('safeguarding_logs').insert({
                                student_id: user.id,
                                content: message.substring(0, 300),
                                reason: 'CRISIS_FLAG detected by AI',
                                severity: 'High'
                            });
                            if (!insertError) {
                                console.log("CRITICAL: Safeguarding Alert correctly logged to safeguarding_logs table.");
                            } else {
                                console.error("Safeguarding DB Insert Error:", insertError);
                            }
                        } catch (e) {
                            console.error("Safeguarding Intercept Exception:", e);
                        }
                    }
                }

                console.log("\n--- END OF STREAM ---");
                controller.close();
            },
        });

        return new NextResponse(stream, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });

    } catch (error) {
        console.error("Error in chat API:", error);
        return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
    }
}
