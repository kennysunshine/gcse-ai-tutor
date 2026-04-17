import { supabase } from './supabase';

export interface BrainCardData {
    subject: string;
    spec_code: string;
    resilience_score: number;
    regional_rank: string;
    location: string;
    mastery_level: string;
    logic_path_nodes: number;
    timestamp: string;
}

export class BrainCardEngine {
    /**
     * Generates BrainCard metrics based on the student's most recent activity.
     */
    public static async generateForLatestSession(userId: string, subject: string): Promise<BrainCardData | null> {
        try {
            // 1. Fetch Latest Chat for Resilience Analysis
            const { data: chats } = await supabase
                .from('chats')
                .select('messages, updated_at')
                .eq('user_id', userId)
                .eq('subject', subject)
                .order('updated_at', { ascending: false })
                .limit(1)
                .single();

            // 2. Fetch Profile for Location/Rank Injection
            const { data: profile } = await supabase
                .from('profiles')
                .select('location, year_group')
                .eq('id', userId)
                .single();

            // 3. Fetch Mastery Level
            const { data: mastery } = await supabase
                .from('curriculum_mastery')
                .select('mastery_score, spec_code, status')
                .eq('student_id', userId)
                .eq('subject', subject)
                .order('last_updated', { ascending: false })
                .limit(1)
                .single();

            if (!chats) return null;

            const messages = (chats.messages as any[]) || [];
            const userTurns = messages.filter(m => m.role === 'user').length;
            const modelTurns = messages.filter(m => m.role === 'model').length;

            // Strategy: Resilience is higher when the "Struggle" (turns) is longer
            // Score = Base (Mastery) + Bonus (Turns depth)
            const baseMastery = mastery?.mastery_score || 50;
            const turnBonus = Math.min(userTurns * 5, 30); // Max 30% bonus for depth
            const resilience = Math.min(baseMastery + turnBonus, 99);

            // Pseudo-Regional Ranking Logic
            // In a production app, this would query a global leaderboard.
            // For now, we seed it based on the user's city and mastery level.
            const city = profile?.location || 'London';
            const baseRank = 100 - baseMastery; // Better mastery = lower number rank
            const rank = Math.max(Math.floor(baseRank / 2) + Math.floor(Math.random() * 5), 1);

            return {
                subject: subject,
                spec_code: mastery?.spec_code || 'General',
                resilience_score: resilience,
                regional_rank: `#${rank} ${city}`,
                location: city,
                mastery_level: mastery?.status || 'Mastered',
                logic_path_nodes: modelTurns, // Each model turn represents a logic node
                timestamp: new Date().toISOString()
            };

        } catch (e) {
            console.error("Error generating BrainCard data:", e);
            return null;
        }
    }
}
