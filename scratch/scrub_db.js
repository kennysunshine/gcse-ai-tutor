const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function scrubSessions() {
    console.log("Scrubbing toxic chat sessions from database...");
    
    // Clear the chats table to remove poisoned history
    const { error } = await supabase
        .from('chats')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete everything
    
    if (error) {
        console.error("Scrub Error:", error);
    } else {
        console.log("Successfully cleared chat sessions. The system is now clean.");
    }
}

scrubSessions();
