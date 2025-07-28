'use server';

import { createClient as createServerClient } from '@/utils/supabase/server';
import { createClient as createServiceRoleClient } from '@/utils/supabase/service';
import { checkUsageLimit, recordUsage } from '@/lib/ai/rate-limiter';
import { createChatCompletion } from '@/lib/ai/openai-client';
import { AiMessage, AiConversation } from '@/lib/types/ai';

/**
 * Send a message to an AI teacher and get a response.
 * This handles both creating a new conversation or continuing an existing one.
 */
export async function sendMessage(
  teacherId: string, 
  message: string, 
  conversationId?: string
): Promise<{
  message: string;
  conversationId: string;
  newConversation?: AiConversation;
  usage?: {
    tokensUsed: number;
    remaining: number;
  };
}> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  if (!teacherId || !message) {
    throw new Error('Teacher ID and message are required');
  }

  // Check rate limits
  const usageCheck = await checkUsageLimit(user.id, 'chat');
  if (!usageCheck.allowed) {
    throw new Error(`Usage limit exceeded. Remaining: ${usageCheck.remaining}. Reset time: ${usageCheck.resetTime}`);
  }

  const serviceRoleSupabase = createServiceRoleClient();

  // Get AI teacher information
  const { data: aiTeacher, error: teacherError } = await serviceRoleSupabase
    .from('ai_teachers')
    .select('*')
    .eq('id', teacherId)
    .eq('is_active', true)
    .single();

  if (teacherError || !aiTeacher) {
    throw new Error('AI teacher not found');
  }

  // Get or create conversation
  let conversation;
  if (conversationId) {
    const { data: existingConversation, error: convError } = await supabase
      .from('ai_chat_conversations')
      .select('*')
      .eq('id', conversationId)
      .eq('user_id', user.id)
      .single();

    if (convError || !existingConversation) {
      throw new Error('Conversation not found');
    }
    conversation = existingConversation;
  } else {
    // Create new conversation
    const { data: newConversation, error: newConvError } = await serviceRoleSupabase
      .from('ai_chat_conversations')
      .insert({
        user_id: user.id,
        ai_teacher_id: teacherId,
        title: message.substring(0, 20) + (message.length > 20 ? '...' : ''),
      })
      .select()
      .single();

    if (newConvError || !newConversation) {
      console.log(JSON.stringify(newConvError));
      throw new Error('Failed to create conversation');
    }
    conversation = newConversation;

    // Add welcome message for new conversations
    const { error: welcomeMessageError } = await serviceRoleSupabase
      .from('ai_chat_messages')
      .insert({
        conversation_id: conversation.id,
        role: 'assistant',
        content: aiTeacher.welcome_message,
      });

    if (welcomeMessageError) {
      console.error('Error sending welcome message:', welcomeMessageError);
      // Don't throw error here, continue with the conversation
    }
  }

  // Get conversation history
  const { data: messageHistory, error: historyError } = await supabase
    .from('ai_chat_messages')
    .select('role, content')
    .eq('conversation_id', conversation.id)
    .order('created_at', { ascending: true })
    .limit(20); // Limit history to last 20 messages

  if (historyError) {
    console.error('Error fetching message history:', historyError);
  }

  // Prepare messages for AI
  const messages = [
    {
      role: 'system' as const,
      content: aiTeacher.system_prompt,
    },
    ...(messageHistory || []).map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
    {
      role: 'user' as const,
      content: message,
    },
  ];

  // Get AI response
  const aiResponse = await createChatCompletion({
    messages,
    temperature: 0.7,
    maxTokens: 800,
  });

  if (!aiResponse.success || !aiResponse.content) {
    throw new Error('Failed to get AI response');
  }

  // Send user message
  const { error: userMessageError } = await serviceRoleSupabase
    .from('ai_chat_messages')
    .insert({
      conversation_id: conversation.id,
      role: 'user',
      content: message,
    });

  if (userMessageError) {
    console.error('Error sending user message:', userMessageError);
    throw new Error('Failed to send user message');
  }

  // Send AI response
  const { error: aiMessageError } = await serviceRoleSupabase
    .from('ai_chat_messages')
    .insert({
      conversation_id: conversation.id,
      role: 'assistant',
      content: aiResponse.content,
      metadata: {
        tokens_used: aiResponse.usage?.total_tokens,
        model: 'gemini-2.0-flash',
      },
    });

  if (aiMessageError) {
    console.error('Error sending AI message:', aiMessageError);
    throw new Error('Failed to get AI response');
  }

  // Record usage
  await recordUsage(
    user.id,
    'chat',
    aiResponse.usage?.total_tokens || 0,
    {
      teacher_id: teacherId,
      conversation_id: conversation.id,
    }
  );

  const result: {
    message: string;
    conversationId: string;
    newConversation?: AiConversation;
    usage?: {
      tokensUsed: number;
      remaining: number;
    };
  } = {
    message: aiResponse.content,
    conversationId: conversation.id,
    usage: {
      tokensUsed: aiResponse.usage?.total_tokens || 0,
      remaining: usageCheck.remaining - 1,
    },
  };

  // If this was a new conversation, include it in the response
  if (!conversationId) {
    result.newConversation = {
      id: conversation.id,
      title: conversation.title,
      created_at: conversation.created_at,
      updated_at: conversation.updated_at,
    };
  }

  return result;
}

/**
 * Get messages for a specific conversation.
 */
export async function getConversationMessages(conversationId: string): Promise<AiMessage[]> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Verify the conversation belongs to the user
  const { data: conversation, error: convError } = await supabase
    .from('ai_chat_conversations')
    .select('id')
    .eq('id', conversationId)
    .eq('user_id', user.id)
    .single();

  if (convError || !conversation) {
    throw new Error('Conversation not found');
  }

  // Get messages for the conversation
  const { data: messages, error: messagesError } = await supabase
    .from('ai_chat_messages')
    .select('id, role, content, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (messagesError) {
    console.error('Error fetching messages:', messagesError);
    throw new Error('Failed to fetch messages');
  }

  return (messages || []) as AiMessage[];
}
