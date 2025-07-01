-- A master list of schools that users can be associated with.
-- This prevents data duplication and spelling errors from free-text fields.
CREATE TABLE IF NOT EXISTS schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    country TEXT,
    city TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (name, country, city) -- Ensures each school is unique
);

CREATE INDEX IF NOT EXISTS idx_schools_name ON schools(name); -- speed up school searches

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, -- Foreign key to Supabase auth users table
    username TEXT UNIQUE, -- Unique username for each profile, nullable
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher')), -- Role-based access control
    school_id UUID REFERENCES schools(id) ON DELETE SET NULL, -- Foreign key to schools, can be NULL if not associated with a school
    -- NOTE: consider switching back to multiple columns in the future
    settings JSONB DEFAULT '{"is_social_enabled": true, "language": "en-us"}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT valid_username CHECK (username ~ '^[a-z0-9_.]{1,30}$')
);

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