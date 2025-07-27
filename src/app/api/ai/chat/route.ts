import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/utils/supabase/server';
import { createClient as createServiceRoleClient } from '@/utils/supabase/service';
import { checkUsageLimit, recordUsage } from '@/lib/ai/rate-limiter';
import { createChatCompletion } from '@/lib/ai/openai-client';

/**
 * Send a message to an AI teacher and get a response.
 * This endpoint handles both creating a new conversation or continuing an existing one.
 * In the body:
 * {
 *   teacherId: string; // ID of the AI teacher
 *   message: string; // User message
 *   conversationId?: string; // conversation ID (leave null for new conversation)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const time1 = performance.now();
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const time2 = performance.now();
    console.log(`Auth check took ${time2 - time1} ms`);

    const body = await request.json();
    const { teacherId, message, conversationId } = body;

    if (!teacherId || !message) {
      return NextResponse.json(
        { error: 'Bad request' },
        { status: 400 }
      );
    }

    const time3 = performance.now();
    // Check rate limits
    const usageCheck = await checkUsageLimit(user.id, 'chat');
    if (!usageCheck.allowed) {
      return NextResponse.json(
        { 
          error: 'Usage limit exceeded',
          remaining: usageCheck.remaining,
          resetTime: usageCheck.resetTime 
        },
        { status: 429 }
      );
    }
    const time4 = performance.now();
    console.log(`Usage check took ${time4 - time3} ms`);

    const serviceRoleSupabase = createServiceRoleClient();

    // Get AI teacher information
    const { data: aiTeacher, error: teacherError } = await serviceRoleSupabase
      .from('ai_teachers')
      .select('*')
      .eq('id', teacherId)
      .eq('is_active', true)
      .single();

    if (teacherError || !aiTeacher) {
      return NextResponse.json(
        { error: 'AI teacher not found' },
        { status: 404 }
      );
    }
    const time5 = performance.now();
    console.log(`Teacher fetch took ${time5 - time4} ms`);

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
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        );
      }
      conversation = existingConversation;
      const time6 = performance.now();
      console.log(`Conversation fetch took ${time6 - time5} ms`);
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
        return NextResponse.json(
          { error: 'Failed to create conversation' },
          { status: 500 }
        );
      }
      conversation = newConversation;
      const time7 = performance.now();
      console.log(`Conversation creation took ${time7 - time5} ms`);

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
        // Don't return error here, continue with the conversation
      }
      const time8 = performance.now();
      console.log(`Welcome message took ${time8 - time7} ms`);
    }

    // Get conversation history
    const time9 = performance.now();
    const { data: messageHistory, error: historyError } = await supabase
      .from('ai_chat_messages')
      .select('role, content')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true })
      .limit(20); // Limit history to last 20 messages

    if (historyError) {
      console.error('Error fetching message history:', historyError);
    }
    const time10 = performance.now();
    console.log(`Message history fetch took ${time10 - time9} ms`);

    // NOTE: For better UX, we should only add user message to the history if AI response is generated successfully.

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

    if (!aiResponse.success) {
      return NextResponse.json(
        { error: 'Failed to get AI response' },
        { status: 500 }
      );
    }
    const time11 = performance.now();
    console.log(`AI response generation took ${time11 - time10} ms`);

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
      return NextResponse.json(
        { error: 'Failed to send user message' },
        { status: 500 }
      );
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
      return NextResponse.json(
        { error: 'Failed to get AI response' },
        { status: 500 }
      );
    }
    const time12 = performance.now();
    console.log(`user and AI message sent in ${time12 - time11} ms`);

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
    const time13 = performance.now();
    console.log(`Usage recorded in ${time13 - time12} ms`);

    return NextResponse.json({
      success: true,
      message: aiResponse.content,
      conversationId: conversation.id,
      usage: {
        tokensUsed: aiResponse.usage?.total_tokens || 0,
        remaining: usageCheck.remaining - 1,
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
