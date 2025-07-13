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
    details JSONB DEFAULT '{}'::jsonb,
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

        INSERT INTO public.user_credits (user_id)
        VALUES (NEW.id);
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

-- 1. Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Only allow users to select, update, and delete their own profile
CREATE POLICY IF NOT EXISTS select_own_profile ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY IF NOT EXISTS update_own_profile ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY IF NOT EXISTS delete_own_profile ON profiles
  FOR DELETE USING (auth.uid() = id);


-- 3. Enable RLS on schools (read-only for all, no insert/update/delete except by service role)
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS public_read_schools ON schools
  FOR SELECT USING (true);
