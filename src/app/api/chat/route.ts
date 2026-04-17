import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { CurriculumEngine } from "@/lib/curriculum-engine";
import { getSocraticHint } from "@/lib/socratic-core";
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
// supabase is initialized securely inside the request route handlers

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

        const curriculum = CurriculumEngine.getInstance();

        const TOOLS = [
            {
                function_declarations: [
                    {
                        name: "update_mastery",
                        description: "Update the student's mastery status for a specific curriculum specification code.",
                        parameters: {
                            type: "object",
                            properties: {
                                spec_code: { type: "string", description: "The specification code (e.g., AQA Maths 3.1.2)" },
                                status: { type: "string", enum: ["Mastered", "Revision Needed", "Introductory"], description: "The new mastery status." },
                                confidence_score: { type: "number", description: "Confidence score from 1-10." }
                            },
                            required: ["spec_code", "status"]
                        }
                    },
                    {
                        name: "list_subjects",
                        description: "List all available subjects, boards, and levels in the curriculum engine.",
                        parameters: {
                            type: "object",
                            properties: {
                                board: { type: "string", description: "Filter by board (AQA, Edexcel, OCR)" },
                                level: { type: "string", description: "Filter by level (GCSE, A-Level, KS3)" }
                            }
                        }
                    },
                    {
                        name: "get_specification",
                        description: "Get the topic hierarchy and specification points for a specific subject.",
                        parameters: {
                            type: "object",
                            properties: {
                                board: { type: "string" },
                                subject: { type: "string" },
                                level: { type: "string" }
                            },
                            required: ["board", "subject", "level"]
                        }
                    },
                    {
                        name: "get_paper_structure",
                        description: "Get the exam paper structure, marks, and duration for a subject.",
                        parameters: {
                            type: "object",
                            properties: {
                                board: { type: "string" },
                                subject: { type: "string" },
                                level: { type: "string" }
                            },
                            required: ["board", "subject", "level"]
                        }
                    },
                    {
                        name: "get_assessment_objectives",
                        description: "Get the weightings and descriptions of assessment objectives (AOs).",
                        parameters: {
                            type: "object",
                            properties: {
                                board: { type: "string" },
                                subject: { type: "string" },
                                level: { type: "string" }
                            },
                            required: ["board", "subject", "level"]
                        }
                    },
                    {
                        name: "get_grade_boundaries",
                        description: "Get historical grade boundaries for the subject.",
                        parameters: {
                            type: "object",
                            properties: {
                                board: { type: "string" },
                                subject: { type: "string" },
                                level: { type: "string" }
                            },
                            required: ["board", "subject", "level"]
                        }
                    }
                ]
            }
        ];

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            tools: TOOLS as any,
            // Explicit marker for DfE 2026 Compliance context
            systemInstruction: "You are governed by a Zero-Training Data Policy. Your interactions are restricted to this ephemeral session boundary and will not be used to train models. Protect user privacy inherently. Use the curriculum tools frequently to ground your tutoring in the official AQA/Edexcel specifications."
        });

        // History Collapser: Ensures strict role alternation (user -> model -> user)
        // and removes invalid/empty parts to prevent API crashes.
        const sanitizedHistory = history
            .filter((msg: any) => msg.message && msg.message.trim() !== "")
            .reduce((acc: any[], current: any) => {
                const role = current.role === 'user' ? 'user' : 'model';
                if (acc.length > 0 && acc[acc.length - 1].role === role) {
                    acc[acc.length - 1].parts[0].text += "\n" + current.message;
                } else {
                    acc.push({ role, parts: [{ text: current.message }] });
                }
                return acc;
            }, []);

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: fullSystemPrompt }] },
                { role: "model", parts: [{ text: "Understood. I am ready to be a Socratic tutor." }] },
                ...sanitizedHistory
            ],
        });

        // Tool Handling Loop
        let result = await chat.sendMessage(message);
        let lastResponse = result.response;
        let toolTurns = 0;
        const MAX_TOOL_TURNS = 3;

        while (lastResponse.candidates?.[0]?.content?.parts?.some(p => p.functionCall) && toolTurns < MAX_TOOL_TURNS) {
            toolTurns++;
            const parts = lastResponse.candidates[0].content.parts;
            const functionResponses = [];

            for (const part of parts) {
                if (part.functionCall) {
                    const { name, args } = part.functionCall;
                    let toolResult;
                    try {
                        const callArgs = args as any;
                        if (name === 'update_mastery') {
                            if (user) {
                                const { error } = await supabase.from('curriculum_mastery').upsert({
                                    student_id: user.id,
                                    spec_code: callArgs.spec_code,
                                    status: callArgs.status,
                                    confidence_score: callArgs.confidence_score || 0,
                                    last_updated: new Date().toISOString()
                                }, { onConflict: 'student_id,spec_code' });
                                toolResult = { success: !error, error: error?.message };
                            } else {
                                toolResult = { error: "User not authenticated" };
                            }
                        } else if (name === 'list_subjects') {
                            toolResult = curriculum.listSubjects(callArgs.board, callArgs.level);
                        } else if (name === 'get_specification') {
                            toolResult = curriculum.getSpecification(callArgs.board, callArgs.subject, callArgs.level);
                        } else if (name === 'get_paper_structure') {
                            toolResult = curriculum.getPaperStructure(callArgs.board, callArgs.subject, callArgs.level);
                        } else if (name === 'get_assessment_objectives') {
                            toolResult = curriculum.getAssessmentObjectives(callArgs.board, callArgs.subject, callArgs.level);
                        } else if (name === 'get_grade_boundaries') {
                            toolResult = curriculum.getGradeBoundaries(callArgs.board, callArgs.subject, callArgs.level);
                        }
                    } catch (e: any) {
                        console.error(`Tool Execution Error [${name}]:`, e.message);
                        toolResult = { error: e.message };
                    }
                    functionResponses.push({ functionResponse: { name, response: toolResult } });
                }
            }
            result = await chat.sendMessage(functionResponses as any);
            lastResponse = result.response;
        }

        const fullText = lastResponse.text();

        const stream = new ReadableStream({
            async start(controller) {
                let textToStream = fullText;

                // Blank Guard: Ensure we never return an empty square
                if (!textToStream || textToStream.trim() === "") {
                    textToStream = "I've processed your progress, let's keep going. What would you like to explore next?";
                }

                if (textToStream.includes('</thinking>')) {
                    const parts = textToStream.split('</thinking>');
                    textToStream = parts[1].trimStart();
                }

                // If still empty after stripping thinking, provide fallback
                if (!textToStream || textToStream.trim() === "") {
                    textToStream = "I've noted your progress! What's our next focus area in Maths?";
                }

                const encoder = new TextEncoder();
                controller.enqueue(encoder.encode(textToStream));

                // Persistence Step: Server-side history save in background
                if (user) {
                    (async () => {
                        try {
                            const conversationHistory = [...history, { role: 'user', message }, { role: 'model', message: fullText }];
                            await supabase.from('chats').upsert({
                                user_id: user.id,
                                subject: subject || 'General',
                                messages: conversationHistory,
                                updated_at: new Date().toISOString()
                            }, { onConflict: 'user_id,subject' });
                        } catch (e) {
                            console.error("Chat Persistence Error:", e);
                        }
                    })();
                }

                controller.close();
            },
        });

        return new NextResponse(stream, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });

    } catch (error: any) {
        console.error("Error in chat API:", error);
        return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
    }
}
