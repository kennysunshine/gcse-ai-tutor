import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

const BOOK_MASTERY_PROMPT = (bookTitle: string, bookAuthor: string, summary: string, coreThemes: string[]) => `
# ROLE
You are the LumenForge Foundry Mentor running a Book Mastery Session for the Sovereign Library.

# YOUR MISSION
The student has read "${bookTitle}" by ${bookAuthor}. Your job is to assess their genuine understanding through a two-phase Socratic session.

## BOOK CONTEXT
Summary: ${summary}
Core Themes to probe: ${coreThemes.join(', ')}

## PHASE 1 — SOCRATIC PROBE (first 2-3 exchanges)
Open with application-based questions that reveal whether the student actually absorbed the book.
- Do NOT ask for definitions or summaries. Ask them to APPLY concepts to their own life.
- Example: "Goggins talks about the 40% rule. Describe a moment this week where your mind told you to stop. What did you do?"
- Be warm but demanding. This is the Foundry — average answers don't pass.
- If answers are shallow, probe deeper with a follow-up before moving on.

## PHASE 2 — TEACH IT BACK (after 2-3 exchanges)
Once the student shows genuine engagement, switch into "confused student" mode.
- Introduce yourself as a confused peer: "Okay, I've got a mate who keeps quitting revision after 20 minutes..."
- Ask them to explain a concept from the book to help this fictional person.
- Evaluate: can they synthesise and communicate the idea, not just recall it?

## COMPLETION SIGNAL
When the student has demonstrated genuine understanding across both phases (typically 4-6 exchanges total), close with:
1. A warm, specific acknowledgement of what they demonstrated well
2. One final Foundry challenge question ("How will you use [concept] this week?")
3. The exact string: <MASTERY_CONFIRMED> on its own line

## RULES
- Keep each response to 3-5 sentences max. This is a dialogue, not a lecture.
- Never reveal the phase names to the student.
- Never accept vague or generic answers — always probe for specificity.
- Match the Foundry tone: high-status, warm, demanding, belief-instilling.
- Do NOT mention GCSE, curriculum specs, or anything academic. This is about life application.
`;

export async function POST(req: Request) {
    try {
        const { message, history, bookId, bookTitle, bookAuthor, summary, coreThemes, imageUrl } = await req.json();

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }

        const systemPrompt = BOOK_MASTERY_PROMPT(
            bookTitle || 'this book',
            bookAuthor || 'the author',
            summary || '',
            coreThemes || []
        );

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: "You are governed by a Zero-Training Data Policy. Your interactions are restricted to this ephemeral session boundary and will not be used to train models."
        });

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am ready to run the Book Mastery Session." }],
                },
                ...history.map((msg: { role: string; message: string }) => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.message }],
                })),
            ],
        });

        const result = await chat.sendMessageStream(message);

        const stream = new ReadableStream({
            async start(controller) {
                let fullResponse = "";
                let masteryConfirmed = false;

                for await (const chunk of result.stream) {
                    const chunkText = chunk.text();
                    if (chunkText) {
                        fullResponse += chunkText;
                        // Stream everything directly (no thinking block to hide here)
                        controller.enqueue(new TextEncoder().encode(chunkText));

                        if (fullResponse.includes('<MASTERY_CONFIRMED>')) {
                            masteryConfirmed = true;
                        }
                    }
                }

                // If mastery confirmed, award Lumens and create badge
                if (masteryConfirmed && user && bookId && bookTitle) {
                    try {
                        // 1. Insert book_mastery record
                        await supabase.from('book_mastery').insert({
                            student_id: user.id,
                            book_id: bookId,
                            book_title: bookTitle,
                            lumens_awarded: 50
                        });

                        // 2. Upsert student_lumens (add 50, update streak)
                        const today = new Date().toISOString().split('T')[0];
                        const { data: existing } = await supabase
                            .from('student_lumens')
                            .select('lumens, streak_days, last_active_date')
                            .eq('student_id', user.id)
                            .maybeSingle();

                        if (existing) {
                            const isConsecutive = existing.last_active_date === 
                                new Date(Date.now() - 86400000).toISOString().split('T')[0];
                            const newStreak = (existing.last_active_date === today) 
                                ? existing.streak_days 
                                : (isConsecutive ? (existing.streak_days || 0) + 1 : 1);
                            
                            await supabase
                                .from('student_lumens')
                                .update({
                                    lumens: (existing.lumens || 0) + 50,
                                    streak_days: newStreak,
                                    last_active_date: today,
                                    updated_at: new Date().toISOString()
                                })
                                .eq('student_id', user.id);
                        } else {
                            await supabase.from('student_lumens').insert({
                                student_id: user.id,
                                lumens: 50,
                                streak_days: 1,
                                last_active_date: today
                            });
                        }

                        // 3. Insert badge (ignore duplicate)
                        await supabase.from('student_badges').upsert({
                            student_id: user.id,
                            badge_id: bookId,
                            badge_name: bookTitle,
                            badge_image_url: imageUrl || null
                        }, { onConflict: 'student_id,badge_id', ignoreDuplicates: true });

                        // 4. Award +10 streak lumens if streak > 1
                        console.log(`MASTERY CONFIRMED: ${user.id} completed "${bookTitle}" — 50 Lumens awarded.`);

                    } catch (e) {
                        console.error("Gamification award error:", e);
                    }
                }

                controller.close();
            }
        });

        return new NextResponse(stream, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });

    } catch (error) {
        console.error("Book Review API Error:", error);
        return NextResponse.json({ error: "Failed to process book mastery session" }, { status: 500 });
    }
}
