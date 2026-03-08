import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const { aha_moment, subject, passions, chat_history } = await req.json();

        if (!aha_moment) {
            return NextResponse.json({ error: "No Aha moment provided" }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify if user is Elite
        const isPremium = user.user_metadata?.isPremium === true;
        let brillianceBriefing = null;

        if (isPremium) {
            // Generate Brilliance Briefing
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const prompt = `
You are the LumenForge Lead Mentor analyzing an Elite student's session.
The student has just stated their "Aha!" moment or how they "broke the mould" in ${subject || 'their studies'}.

Student's input: "${aha_moment}"

Their stated passions: ${passions && passions.length > 0 ? passions.join(', ') : 'Excellence and growth'}

Task: Write a highly personalized "Brilliance Briefing" (max 2 sentences).
1. Validate their insight.
2. Formulate an analogy using ONE of their passions to explain WHY their logic was excellent or powerful.
3. Keep it punchy, high-status, and inspiring.
`;

            const result = await model.generateContent(prompt);
            brillianceBriefing = result.response.text();
        }

        // Insert into database
        const { error: insertError } = await supabase.from('exit_tickets').insert({
            user_id: user.id,
            subject: subject || 'General',
            aha_moment: aha_moment,
            brilliance_briefing: brillianceBriefing
        });

        if (insertError) {
            console.error("Exit Ticket Insert Error:", insertError);
            return NextResponse.json({ error: "Database error" }, { status: 500 });
        }

        // Implicitly update progress streak
        const today = new Date().toISOString().split('T')[0];
        const { data: existingProgress } = await supabase
            .from('progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('subject', subject || 'General')
            .single();

        if (existingProgress) {
            if (existingProgress.last_study_date !== today) {
                await supabase.from('progress').update({
                    streak_count: existingProgress.streak_count + 1,
                    last_study_date: today
                }).eq('id', existingProgress.id);
            }
        } else {
            await supabase.from('progress').insert({
                user_id: user.id,
                subject: subject || 'General',
                streak_count: 1,
                last_study_date: today
            });
        }

        return NextResponse.json({
            success: true,
            brillianceBriefing
        });

    } catch (error) {
        console.error("Error in exit ticket API:", error);
        return NextResponse.json({ error: "Failed to process exit ticket" }, { status: 500 });
    }
}
