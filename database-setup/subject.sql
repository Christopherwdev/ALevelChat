-- NOTE
-- These tables are not used currently, but kept for future reference.


CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,  -- small number of subjects, so SERIAL is sufficient
    name TEXT UNIQUE NOT NULL, -- e.g., "Mathematics", "Physics"
    curriculum TEXT NOT NULL, -- e.g., "GCSE", "A-Level", "IB"
    exam_board TEXT, -- e.g., "AQA", "Edexcel"
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (name, curriculum, exam_board)
);

-- Sub-categories within subjects, e.g., "Algebra" within "Mathematics".
CREATE TABLE IF NOT EXISTS topics (
    id SERIAL PRIMARY KEY,
    subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE, -- Foreign key to subjects
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (subject_id, name)
);

CREATE INDEX IF NOT EXISTS idx_topics_subject_id ON topics(subject_id); -- Index for quick lookups by subject

-- This table links users to the subjects they are actively studying or interested in.
CREATE TABLE IF NOT EXISTS user_selected_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, subject_id) -- Prevents a user from selecting the same subject multiple times
);

-- Create indexes for quick lookups in both directions.
CREATE INDEX IF NOT EXISTS idx_user_selected_subjects_user_id ON user_selected_subjects(user_id);
CREATE INDEX IF NOT EXISTS idx_user_selected_subjects_subject_id ON user_selected_subjects(subject_id);

-- Enable RLS on subjects (read-only for all, no insert/update/delete except by service role)
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS public_read_subjects ON subjects
  FOR SELECT USING (true);

-- Enable RLS on topics (read-only for all, no insert/update/delete except by service role)
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS public_read_topics ON topics
  FOR SELECT USING (true);

-- 2. Enable RLS on user_selected_subjects
ALTER TABLE user_selected_subjects ENABLE ROW LEVEL SECURITY;

-- Only allow users to select, insert, update, and delete their own subject selections
CREATE POLICY IF NOT EXISTS select_own_subjects ON user_selected_subjects
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS insert_own_subjects ON user_selected_subjects
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS update_own_subjects ON user_selected_subjects
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS delete_own_subjects ON user_selected_subjects
  FOR DELETE USING (auth.uid() = user_id);
