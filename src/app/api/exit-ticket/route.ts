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

        // Update progress streak
        const today = new Date().toISOString().split('T')[0];
        const { data: existingProgress } = await supabase
            .from('progress')
            .select('*')
            .eq('user_id', user?.id)
            .eq('subject', subject || 'General')
            .maybeSingle();

        if (existingProgress) {
            if (existingProgress.last_study_date !== today) {
                await supabase.from('progress').update({
                    streak_count: (existingProgress.streak_count || 0) + 1,
                    last_study_date: today
                }).eq('id', existingProgress.id);
            }
        } else {
            await supabase.from('progress').insert({
                user_id: user?.id,
                subject: subject || 'General',
                streak_count: 1,
                last_study_date: today
            });
        }

        // Award 5 Lumens for Exit Ticket
        try {
            const { data: existingLumens } = await supabase
                .from('student_lumens')
                .select('*')
                .eq('student_id', user?.id)
                .maybeSingle();

            if (existingLumens) {
                const isConsecutive = existingLumens.last_active_date === 
                    new Date(Date.now() - 86400000).toISOString().split('T')[0];
                const newStreak = (existingLumens.last_active_date === today) 
                    ? existingLumens.streak_days 
                    : (isConsecutive ? (existingLumens.streak_days || 0) + 1 : 1);
                
                await supabase
                    .from('student_lumens')
                    .update({
                        lumens: (existingLumens.lumens || 0) + 5,
                        streak_days: newStreak,
                        last_active_date: today,
                        updated_at: new Date().toISOString()
                    })
                    .eq('student_id', user?.id);
            } else {
                await supabase.from('student_lumens').insert({
                    student_id: user?.id,
                    lumens: 5,
                    streak_days: 1,
                    last_active_date: today
                });
            }
        } catch (e) {
            console.error("Lumen award error in exit ticket:", e);
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
