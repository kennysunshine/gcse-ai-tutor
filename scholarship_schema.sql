-- Foundry Scholars Schema (Phase 26)

-- 1. Scholarship Applications Table
CREATE TABLE IF NOT EXISTS scholarship_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    applicant_name TEXT NOT NULL,
    applicant_email TEXT NOT NULL,
    applicant_role TEXT NOT NULL,
    is_fsm BOOLEAN NOT NULL DEFAULT false,
    is_pupil_premium BOOLEAN NOT NULL DEFAULT false,
    learning_gap TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE scholarship_applications ENABLE ROW LEVEL SECURITY;

-- Anyone can insert an application (public form)
CREATE POLICY "Anyone can submit a scholarship application" ON scholarship_applications
    FOR INSERT WITH CHECK (true);

-- Only teachers/admins can view applications
CREATE POLICY "Teachers can view scholarship applications" ON scholarship_applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'teacher'
        )
    );

-- Only teachers/admins can update application status
CREATE POLICY "Teachers can update scholarship applications" ON scholarship_applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'teacher'
        )
    );

-- Trigger for updated_at
CREATE TRIGGER update_scholarship_applications_updated_at
BEFORE UPDATE ON scholarship_applications
FOR EACH ROW EXECUTE PROCEDURE update_safeguarding_updated_at();
