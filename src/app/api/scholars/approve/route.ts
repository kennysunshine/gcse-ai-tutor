import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
    try {
        const { applicationId } = await req.json();

        if (!applicationId) {
            return NextResponse.json({ error: "Application ID is required" }, { status: 400 });
        }

        const supabase = await createClient();

        // Check auth to ensure only authenticated users (Teachers) can approve
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Generate a pseudo-random activation token
        const activationToken = crypto.randomUUID();

        // Update the application status to Approved and store the token
        const { data, error } = await supabase
            .from('scholarship_applications')
            .update({
                status: 'Approved',
            })
            .eq('id', applicationId)
            .select()
            .single();

        if (error) {
            console.error("Supabase Update Error:", error);
            throw error;
        }

        // Ideally, here you would dispatch an email to `data.applicant_email`
        // containing the `activationToken` for them to use.

        return NextResponse.json({
            success: true,
            message: "Scholarship approved and token generated",
            token: activationToken // Returning for demo purposes
        }, { status: 200 });

    } catch (error) {
        console.error("Error in Scholars Approve API:", error);
        return NextResponse.json({ error: "Failed to approve application" }, { status: 500 });
    }
}
