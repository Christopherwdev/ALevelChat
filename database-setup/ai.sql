CREATE TABLE user_credits (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    credits_remaining INTEGER NOT NULL DEFAULT 1000,
    last_reset TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Track AI feature usage
CREATE TABLE credit_usage_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    action_cause TEXT NOT NULL, -- CHECK (action_cause IN ('chat', 'practice', 'revision_plan', 'grading'))
    cost_credits INTEGER CHECK (cost_credits > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_usage_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can view their own credit balance"
ON user_credits
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "users can view their own credit history"
ON credit_usage_history
FOR SELECT
USING (auth.uid() = user_id);

-- Users can't update/insert/delete their credits directly, handled by service role

CREATE OR REPLACE FUNCTION public.check_and_deduct_credits(
    user_id UUID,
    action_cause TEXT,
    cost_credits INTEGER CHECK (cost_credits > 0)
) RETURNS BOOLEAN
AS $$
DECLARE
    current_credits INTEGER;
BEGIN
    IF auth.uid() != user_id THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;
    
    -- Get the current credit balance
    SELECT credits_remaining INTO current_credits
    FROM user_credits
    WHERE user_credits.user_id = check_and_deduct_credits.user_id
    FOR UPDATE;

    -- Check if the user has enough credits
    IF current_credits >= cost_credits THEN
        -- Deduct the credits
        UPDATE user_credits
        SET credits_remaining = credits_remaining - cost_credits
        WHERE user_credits.user_id = check_and_deduct_credits.user_id;

        -- Log the credit usage
        INSERT INTO credit_usage_history (user_id, action_cause, cost_credits)
        VALUES (user_id, action_cause, cost_credits);

        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- AI teachers for different subjects (private)
CREATE TABLE ai_teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    subject TEXT,
    system_prompt TEXT NOT NULL,
    welcome_message TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE ai_teachers ENABLE ROW LEVEL SECURITY;
-- Table is not publically accessible, only through service role

-- Chat conversations with AI teachers
CREATE TABLE ai_chat_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    ai_teacher_id UUID NOT NULL REFERENCES ai_teachers(id) ON DELETE CASCADE,
    title TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Individual chat messages
CREATE TABLE ai_chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES ai_chat_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE ai_chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can view their own conversations"
ON ai_chat_conversations
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "users can view their own messages"
ON ai_chat_messages
FOR SELECT
USING (auth.uid() = (SELECT user_id FROM ai_chat_conversations WHERE id = conversation_id));
