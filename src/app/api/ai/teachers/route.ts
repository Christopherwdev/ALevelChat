import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/utils/supabase/server';
import { createClient as createServiceRoleClient } from '@/utils/supabase/service';
import { AiTeacher } from '@/lib/types/ai';

/**
 * Get all active AI teachers.
 */
export async function GET() {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all active AI teachers with their subjects
    const serviceRoleSupabase = createServiceRoleClient();

    const { data: teachers, error } = await serviceRoleSupabase
      .from('ai_teachers')
      .select(`
        id,
        name,
        subject(
          id,
          name,
          curriculum,
          exam_board,
          description
        )
      `)
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching AI teachers:', error);
      return NextResponse.json(
        { error: 'Failed to fetch AI teachers' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      teachers: teachers || [],
    });

  } catch (error) {
    console.error('AI teachers API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Get user's recent conversations grouped by teacher.
 * In the body:
 * {
 *   includeConversations?: boolean; // Whether to include recent conversations
 *   limit?: number; // Number of conversations to return per teacher
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { includeConversations = false, limit = 10 } = body;

    const serviceRoleSupabase = createServiceRoleClient();

    // Get all active AI teachers
    let query = serviceRoleSupabase
      .from('ai_teachers')
      .select(`
        id,
        name,
        subject
      `)
      .eq('is_active', true)
      .order('name');

    if (includeConversations) {
      // Get teachers with recent conversations
      // @ts-expect-error Static analysis of the query isn't correct
      query = serviceRoleSupabase
        .from('ai_teachers')
        .select(`
          id,
          name,
          subject(
            id,
            name,
            curriculum,
            exam_board,
            description
          ),
          conversations:ai_chat_conversations(
            id,
            title,
            created_at,
            updated_at
          )
        `)
        .eq('is_active', true)
        .eq('conversations.user_id', user.id)
        //.order('conversations.updated_at', { ascending: false })
        .order('name');
    }

    const { data: teachers, error } = await query;

    if (error) {
      console.error('Error fetching AI teachers with conversations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch AI teachers' },
        { status: 500 }
      );
    }

    // If including conversations, limit and sort them
    if (includeConversations && teachers) {
      teachers.forEach(teacher => {
        if (teacher.conversations) {
          teacher.conversations = teacher.conversations
            .sort((a: { updated_at: string }, b: { updated_at: string }) => 
              new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
            )
            .slice(0, limit);
        }
      });
    }

    return NextResponse.json({
      success: true,
      teachers: teachers || [],
    });

  } catch (error) {
    console.error('AI teachers with conversations API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
