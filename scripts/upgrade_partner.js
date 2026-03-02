require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function upgradeUser() {
    console.log("Searching for partnertrust user...");
    // Find the user first
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
        console.error("Error fetching users:", error);
        return;
    }

    const partnerUser = users.find(u => u.email && u.email.includes('partnertrust'));

    if (!partnerUser) {
        console.log("partnertrust user not found.");
        return;
    }

    console.log(`Found user: ${partnerUser.email} (${partnerUser.id})`);

    // Update user_metadata to isPremium: true
    const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
        partnerUser.id,
        { user_metadata: { ...partnerUser.user_metadata, isPremium: true } }
    );

    if (updateError) {
        console.error("Error updating user:", updateError);
    } else {
        console.log("Successfully upgraded user to Premium tier!");
        console.log("New metadata:", updatedUser.user.user_metadata);
    }
}

upgradeUser();
