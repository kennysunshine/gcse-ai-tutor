-- Teacher Dashboard Schema (Phase 25)

-- 1. Safeguarding Alerts Table
CREATE TABLE IF NOT EXISTS safeguarding_alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    chat_id TEXT NOT NULL,
    message_excerpt TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Unresolved', 'Logged')),
    type TEXT NOT NULL CHECK (type IN ('primary', 'secondary')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE safeguarding_alerts ENABLE ROW LEVEL SECURITY;

-- Teachers can view all alerts
CREATE POLICY "Teachers can view all safeguarding alerts" ON safeguarding_alerts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'teacher'
        )
    );

-- System/Authenticated users can insert alerts (when the AI detects a flag)
CREATE POLICY "Students can insert safeguarding alerts via AI" ON safeguarding_alerts
    FOR INSERT WITH CHECK (auth.uid() = student_id);
    
-- Teachers can update alert status
CREATE POLICY "Teachers can update safeguarding alerts" ON safeguarding_alerts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'teacher'
        )
    );


-- 2. Curriculum Mastery Table
CREATE TABLE IF NOT EXISTS curriculum_mastery (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    tier TEXT NOT NULL CHECK (tier IN ('primary', 'secondary')),
    mastery_score INTEGER NOT NULL DEFAULT 0,
    target_score INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id, topic_id)
);

-- Enable RLS
ALTER TABLE curriculum_mastery ENABLE ROW LEVEL SECURITY;

-- Students can view their own mastery
CREATE POLICY "Students can view own mastery" ON curriculum_mastery
    FOR SELECT USING (auth.uid() = student_id);

-- Teachers can view all mastery records
CREATE POLICY "Teachers can view all mastery records" ON curriculum_mastery
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'teacher'
        )
    );

-- System can update/insert mastery records
CREATE POLICY "Students can update own mastery via AI" ON curriculum_mastery
    FOR ALL USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_safeguarding_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_safeguarding_alerts_updated_at
BEFORE UPDATE ON safeguarding_alerts
FOR EACH ROW EXECUTE PROCEDURE update_safeguarding_updated_at();

CREATE TRIGGER update_curriculum_mastery_updated_at
BEFORE UPDATE ON curriculum_mastery
FOR EACH ROW EXECUTE PROCEDURE update_safeguarding_updated_at();
