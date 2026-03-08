import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { applicantName, applicantEmail, applicantRole, isFsm, isPupilPremium, learningGap } = body;

        // Basic validation
        if (!applicantName || !applicantEmail || !applicantRole || !learningGap) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // DfE 2026 Validation: Teachers must use a verified school email
        if (applicantRole === 'teacher') {
            const schUkRegex = /\.sch\.uk$/i;
            if (!schUkRegex.test(applicantEmail)) {
                return NextResponse.json({ error: "Teachers must apply using a valid UK school email address ending in .sch.uk" }, { status: 400 });
            }
        }

        const supabase = await createClient();

        // Insert into the database
        const { error } = await supabase.from('scholarship_applications').insert({
            applicant_name: applicantName,
            applicant_email: applicantEmail,
            applicant_role: applicantRole,
            is_fsm: isFsm,
            is_pupil_premium: isPupilPremium,
            learning_gap: learningGap,
            status: 'Pending'
        });

        if (error) {
            console.error("Supabase Insertion Error:", error);
            throw error;
        }

        return NextResponse.json({ success: true, message: "Application received successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error in Scholars API:", error);
        return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
    }
}
