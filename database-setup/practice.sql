-- Practice feature database schema
-- This file contains all tables and policies for the practice exam feature

-- Practice sessions table
CREATE TABLE practice_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subject_id INT REFERENCES subjects(id) ON DELETE SET NULL,
    
    -- Session configuration
    title TEXT NOT NULL,
    /** Time limit in minutes
     * NULL means no time limit
     * 0 is a reserved value for future use (also applies to negative values I guess)
     * Must be > 0 if specified
     */
    time_limit_minutes INTEGER CHECK (time_limit_minutes > 0 OR time_limit_minutes IS NULL),
    
    -- Questions data
    -- NOTE: insertion of questions and marking scheme data may be deferred, so they may be NULL initially
    questions_type TEXT NOT NULL CHECK (questions_type IN ('file', 'json')),
    questions_file_url TEXT, -- URL to file in storage
    questions_json JSONB, -- Direct JSON questions
    
    -- Marking scheme (optional)
    marking_scheme_type TEXT CHECK (marking_scheme_type IN ('file', 'json', 'none')),
    marking_scheme_file_url TEXT,
    marking_scheme_json JSONB,
    
    -- Session state
    status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'ready', 'in_progress', 'submitted', 'graded', 'expired')),
    started_at TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ,

    metadata JSONB, -- Additional metadata if needed
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Practice submissions table
CREATE TABLE practice_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES practice_sessions(id) ON DELETE CASCADE,
    
    -- Submission data
    submission_type TEXT NOT NULL CHECK (submission_type IN ('file', 'text')),
    submission_file_url TEXT, -- URL to file in storage
    submission_text TEXT,
    
    -- AI grading results
    ai_grading_results JSONB, -- Structured AI response
    grading_completed_at TIMESTAMPTZ,
    max_score DECIMAL(5, 2), -- Maximum score for this submission
    overall_score DECIMAL(5, 2), -- Score awarded
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Constraints to ensure valid submission types
    CHECK (
        CASE
            WHEN submission_type = 'file' THEN submission_file_url IS NOT NULL AND submission_text IS NULL
            WHEN submission_type = 'text' THEN submission_text IS NOT NULL AND submission_file_url IS NULL
        END
    ),
    -- Constraint to ensure overall score does not exceed max score
    CHECK (overall_score IS NULL OR overall_score <= max_score)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_practice_sessions_user_id ON practice_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_sessions_status ON practice_sessions(status);
CREATE INDEX IF NOT EXISTS idx_practice_sessions_subject_id ON practice_sessions(subject_id);
CREATE INDEX IF NOT EXISTS idx_practice_submissions_session_id ON practice_submissions(session_id);

-- Create storage buckets for practice files
INSERT INTO storage.buckets (id, name, public) 
SELECT 'practice-questions', 'practice-questions', false
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'practice-questions'
);

INSERT INTO storage.buckets (id, name, public) 
SELECT 'practice-submissions', 'practice-submissions', false
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'practice-submissions'
);

INSERT INTO storage.buckets (id, name, public) 
SELECT 'practice-marking-schemes', 'practice-marking-schemes', false
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'practice-marking-schemes'
);

-- Storage policies for practice-questions bucket
CREATE POLICY "Users can upload their own practice questions" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'practice-questions' AND 
    auth.role() = 'authenticated' AND
    owner = auth.uid() AND
    (auth.uid())::text = SPLIT_PART(name, '/', 1)
);

CREATE POLICY "Users can view their own practice questions" 
ON storage.objects FOR SELECT 
USING (
    bucket_id = 'practice-questions' AND 
    auth.role() = 'authenticated' AND
    owner = auth.uid() AND
    (auth.uid())::text = SPLIT_PART(name, '/', 1)
);

-- Users do not have permisssion to update or delete their own practice questions directly

-- Storage policies for practice-submissions bucket
CREATE POLICY "Users can upload their own practice submissions" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'practice-submissions' AND 
    auth.role() = 'authenticated' AND
    owner = auth.uid() AND
    (auth.uid())::text = SPLIT_PART(name, '/', 1)
);

CREATE POLICY "Users can view their own practice submissions" 
ON storage.objects FOR SELECT 
USING (
    bucket_id = 'practice-submissions' AND 
    auth.role() = 'authenticated' AND
    owner = auth.uid() AND
    (auth.uid())::text = SPLIT_PART(name, '/', 1)
);

CREATE POLICY "Users can update their own practice submissions if session is in progress" 
ON storage.objects FOR UPDATE 
USING (
    bucket_id = 'practice-submissions' AND 
    auth.role() = 'authenticated' AND
    owner = auth.uid() AND
    (auth.uid())::text = SPLIT_PART(name, '/', 1) AND
    (SELECT status FROM practice_sessions WHERE id::text = SPLIT_PART(name, '/', 2)) = 'in_progress'
);

CREATE POLICY "Users can delete their own practice submissions if session is in progress" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'practice-submissions' AND 
    auth.role() = 'authenticated' AND
    owner = auth.uid() AND
    (auth.uid())::text = SPLIT_PART(name, '/', 1) AND
    (SELECT status FROM practice_sessions WHERE id::text = SPLIT_PART(name, '/', 2)) = 'in_progress'
);

-- Storage policies for practice-marking-schemes bucket
CREATE POLICY "Users can upload their own practice marking schemes" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'practice-marking-schemes' AND 
    auth.role() = 'authenticated' AND
    owner = auth.uid() AND
    (auth.uid())::text = SPLIT_PART(name, '/', 1)
);

CREATE POLICY "Users can view their own practice marking schemes" 
ON storage.objects FOR SELECT 
USING (
    bucket_id = 'practice-marking-schemes' AND 
    auth.role() = 'authenticated' AND
    owner = auth.uid() AND
    (auth.uid())::text = SPLIT_PART(name, '/', 1)
);

-- Enable RLS on practice tables
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for practice_sessions
CREATE POLICY "Users can view their own practice sessions"
ON practice_sessions
FOR SELECT
USING (auth.uid() = user_id);

-- RLS policies for practice_submissions
CREATE POLICY "Users can view their own practice submissions"
ON practice_submissions
FOR SELECT
USING (auth.uid() = (SELECT user_id FROM practice_sessions WHERE id = session_id));

-- NOTE: insert/update/delete operations are handled by the server logic, users should not have the privilege to modify these records directly.
