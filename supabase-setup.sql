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
    profile_picture_url TEXT,
    bio TEXT CHECK (char_length(bio) <= 500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT valid_username CHECK (username IS NULL OR username ~ '^[a-z0-9_.]{1,30}$')
);

-- Create storage bucket for profile pictures if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
SELECT 'profile-pictures', 'profile-pictures', true
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'profile-pictures'
);

-- Set up storage policy for profile pictures
CREATE POLICY "Users can upload their own profile picture" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'profile-pictures' AND 
    auth.role() = 'authenticated' AND
    owner = auth.uid() AND
    (auth.uid())::text = SPLIT_PART(name, '/', 1)
);

CREATE POLICY "Profile pictures are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'profile-pictures');

CREATE POLICY "Users can update their own profile picture" 
ON storage.objects FOR UPDATE 
USING (
    bucket_id = 'profile-pictures' AND 
    auth.role() = 'authenticated' AND
    owner = auth.uid() AND
    (auth.uid())::text = SPLIT_PART(name, '/', 1)
);

CREATE POLICY "Users can delete their own profile picture" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'profile-pictures' AND 
    auth.role() = 'authenticated' AND
    owner = auth.uid() AND
    (auth.uid())::text = SPLIT_PART(name, '/', 1)
);

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public,auth,extensions
AS $$
BEGIN
    IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
        INSERT INTO public.profiles (id, email)
        VALUES (NEW.id, NEW.email);
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_email_verified
AFTER UPDATE ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_auth_user();

CREATE OR REPLACE FUNCTION public.check_email_exists(email_to_check TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM profiles 
        WHERE email = email_to_check
    );
END;
$$;

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

-- Enable Row Level Security (RLS) and add policies for all user-facing tables

-- 1. Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Only allow users to select, update, and delete their own profile
CREATE POLICY IF NOT EXISTS select_own_profile ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY IF NOT EXISTS update_own_profile ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY IF NOT EXISTS delete_own_profile ON profiles
  FOR DELETE USING (auth.uid() = id);

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

-- 3. Enable RLS on schools (read-only for all, no insert/update/delete except by service role)
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS public_read_schools ON schools
  FOR SELECT USING (true);

-- 4. Enable RLS on subjects (read-only for all, no insert/update/delete except by service role)
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS public_read_subjects ON subjects
  FOR SELECT USING (true);

-- 5. Enable RLS on topics (read-only for all, no insert/update/delete except by service role)
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS public_read_topics ON topics
  FOR SELECT USING (true);