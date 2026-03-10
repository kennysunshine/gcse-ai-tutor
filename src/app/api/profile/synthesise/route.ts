import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch the raw diagnostic data from profiles
        const { data: profile, error: dbError } = await supabase
            .from('profiles')
            .select('year_group, target_grade, enemy_question, study_context, student_profile_summary')
            .eq('id', user.id)
            .single()

        if (dbError || !profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
        }

        // If a summary already exists and we just want to update it, that's fine.
        // But if there's no diagnostic data, abort.
        if (!profile.year_group || !profile.target_grade) {
            return NextResponse.json({ error: 'Incomplete Phase A Diagnostics' }, { status: 400 })
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

        const prompt = `
You are the Chief Academic Strategist for LumenForge, an elite AI tutoring engine.
I am providing you with the raw data captured from a new student during their onboarding and post-session triage.
Your job is to synthesize this into a single, highly dense, actionable paragraph (max 60 words).
This paragraph will be injected invisibly into every single chat session the student has with our AI tutors.
It must tell the AI exactly WHO they are talking to and HOW to handle them based on their specific anxieties, learning styles, and targets.

RAW DATA:
Year Group: ${profile.year_group}
Target Grade: ${profile.target_grade}
Biggest Fear / "Enemy" Question: ${profile.enemy_question || "Not specified."}
Study Context Preferences: ${profile.study_context ? JSON.stringify(profile.study_context) : "Phase B triage not completed yet."}

OUTPUT REQUIREMENT:
Write a 3rd person summary. Do not use filler. Focus on strategic academic intervention.
Example format: "This is a Year 11 student targeting Grade 7, studying in short 25m bursts. They struggle with going blank under timed conditions. Push retrieval practice over explanation to build resilience, and hold them strictly to Higher Tier vocabulary."
`

        const result = await model.generateContent(prompt)
        const summary = result.response.text().trim()

        if (!summary) {
            throw new Error('AI failed to generate summary')
        }

        // Save the summary back to the Supabase profile
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ student_profile_summary: summary })
            .eq('id', user.id)

        if (updateError) {
            throw updateError
        }

        return NextResponse.json({ success: true, summary })

    } catch (error) {
        console.error("Profile synthesis error:", error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
