import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/utils/supabase/server';

/**
 * Get messages for a specific conversation.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { conversationId } = params;

    // Verify the conversation belongs to the user
    const { data: conversation, error: convError } = await supabase
      .from('ai_chat_conversations')
      .select('id')
      .eq('id', conversationId)
      .eq('user_id', user.id)
      .single();

    if (convError || !conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Get messages for the conversation
    const { data: messages, error: messagesError } = await supabase
      .from('ai_chat_messages')
      .select('id, role, content, created_at')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    // TODO: handle case with very long message history
    // For now, we will return all messages, but in production, we might want to
    // implement pagination and return a limited number of messages.

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messages: messages || [],
    });

  } catch (error) {
    console.error('Conversation messages API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
