
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
// supabase is initialized securely inside the request route handlers


const BASE_RULES = `
Rules:
- You MUST prepend your response with a <thinking> block. Inside this block, privately explain your reasoning, identify the exact syllabus topic you are testing, and cite the document data provided.
- ONLY output the student-facing response AFTER the closing </thinking> tag.
- Ask one thoughtful question or give a small hint at a time in the student-facing response.
- Always reference the appropriate UK curriculum level based on the student's context (e.g., "In KS2 Maths...", "In GCSE Science...").
- Keep responses concise (2–4 sentences max) so the conversation flows.
- End every response with a question to keep them engaged.
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
        let persona = "";
        if (serverVerifiedIsPremium) {
            persona = "You are the LumenForge Lead Mentor, a high-status, activist educator. You must apply the ELITE PEDAGOGY FRAMEWORK.";
            try {
                const ethosPath = path.join(process.cwd(), '.agent/rules/ELITE_PEDAGOGY_FRAMEWORK.md');
                if (fs.existsSync(ethosPath)) {
                    pedagogyRules = fs.readFileSync(ethosPath, 'utf-8');
                }
            } catch (e) {
                console.error("Could not load ELITE_PEDAGOGY_FRAMEWORK.md:", e);
            }
        } else {
            persona = "You are the LumenForge Standard Mentor, a patient, encouraging, and helpful Socratic tutor for UK KS2 and GCSE students. You must use clear, accessible language suitable for a wide range of reading ages, breaking down complex concepts simply without unnecessary jargon.\nIf the student demonstrates high proficiency in a topic, provide standard feedback but you MUST append the exact string <elite_insight_locked>true</elite_insight_locked> at the very end of your response to hint at the strategic context available in Premium.";
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
4. You MUST cite the specific Markdown file and section header in your <thinking> block and student-facing response.
`;

        const fullSystemPrompt = `
${isJunior ? juniorSystemPrompt : persona}

${BASE_RULES}

MILLFIELD & SOVEREIGN ETHOS (Strict Operational Guidelines):
${millfieldEthos}

Additional Safety & Curriculum Rules: 
${safetyRules}

${serverVerifiedIsPremium ? `ELITE STATUS: ACTIVE. You must apply the Disruptive Leadership rules from the Ethos.\nELITE PEDAGOGY FRAMEWORK:\n${pedagogyRules}\n` : 'ELITE STATUS: INACTIVE. Provide standard Socratic tutoring.'}

${MFL_INSTRUCTIONS}

Current Subject: ${subject || 'General'} 
Exam Board: ${profileExamBoard || examBoard || 'Not specified'} 

${studentPassions.length > 0 ? `STUDENT PASSIONS (Use for 'Engage' Hook): ${studentPassions.join(', ')}\n` : ''}
${studentProfileSummary ? `STUDENT DIAGNOSTIC BLUEPRINT: \n${studentProfileSummary}\n` : ''}

RAG Mastery Map Context (Ground Truth retrieved from curriculum):
${extractedContext ? extractedContext : 'No specific context retrieved.'}
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
                for await (const chunk of result.stream) {
                    const chunkText = chunk.text();
                    if (chunkText) {
                        fullResponse += chunkText;
                        process.stdout.write(chunkText); // Log to terminal for debugging
                        controller.enqueue(new TextEncoder().encode(chunkText));
                    }
                }

                // Asynchronous Intercept Logic for Crisis Flag
                if (fullResponse.includes('<CRISIS_FLAG>')) {
                    if (user) {
                        try {
                            const { error: insertError } = await supabase.from('safeguarding_alerts').insert({
                                student_id: user.id,
                                subject: subject || 'General',
                                chat_id: 'chat-' + Date.now(),
                                message_excerpt: message.substring(0, 300), // Original trigger message
                                status: 'Unresolved',
                                type: isJunior ? 'primary' : 'secondary'
                            });
                            if (insertError) {
                                console.error("Safeguarding DB Insert Error:", insertError);
                            } else {
                                console.log("CRITICAL: Safeguarding Alert logged to DB successfully.");

                                // DfE 2026: Immediate Escaltion to DSL via Email
                                const dslEmail = process.env.DSL_EMAIL || "dsl@school.sch.uk";
                                console.log(`[EMAIL DISPATCH SIMULATION] Triggering High-Priority Email to: ${dslEmail}`);
                                console.log(`[EMAIL BODY]
Urgent Safeguarding Alert - LumenForge Tutor
Student ID: ${user.id}
Subject: ${subject}
Message Excerpt: "${message.substring(0, 300)}"

Please log into the Supervisor Command Centre immediately to review this interaction and take necessary action.
                                `);
                                // Note: In production, import { Resend } from 'resend'; resend.emails.send(...)
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
