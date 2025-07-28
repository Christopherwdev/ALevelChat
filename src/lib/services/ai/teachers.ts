'use server';

import { createClient as createServerClient } from '@/utils/supabase/server';
import { createClient as createServiceRoleClient } from '@/utils/supabase/service';
import { AiTeacher } from '@/lib/types/ai';

/**
 * Get all active AI teachers.
 * Optionally get user's recent conversations grouped by teacher.
 * @param options - Options to include conversations and limit results.
 * @returns Array of AI teachers with optional conversations.
 */
export async function getTeachers(options: {
  includeConversations?: boolean,
  limit?: number,
} = {}): Promise<AiTeacher[]> {
  const { includeConversations = false, limit = 20 } = options;
  
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }

  const serviceRoleSupabase = createServiceRoleClient();

  if (includeConversations) {
    // Get teachers with recent conversations
    const { data: teachers, error } = await serviceRoleSupabase
      .from('ai_teachers')
      .select(`
        id,
        name,
        welcome_message,
        subject:subjects(
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
      .order('name');

    if (error) {
      console.error('Error fetching AI teachers with conversations:', error);
      throw new Error('Failed to fetch AI teachers');
    }

    // Limit and sort conversations
    const formattedTeachers = (teachers || []).map(teacher => ({
      ...teacher,
      conversations: teacher.conversations
        ?.sort((a: { updated_at: string }, b: { updated_at: string }) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )
        .slice(0, limit)
    }));

    return formattedTeachers as unknown as AiTeacher[];
  } else {
    // Get teachers without conversations
    const { data: teachers, error } = await serviceRoleSupabase
      .from('ai_teachers')
      .select(`
        id,
        name,
        subject:subjects(
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
      throw new Error('Failed to fetch AI teachers');
    }

    return (teachers || []) as unknown as AiTeacher[];
  }
}

/**
 * Get a specific AI teacher by ID, optionally including their conversations.
 * @param teacherId - The ID of the AI teacher to fetch.
 * @param options - Options to include conversations.
 * @returns The AI teacher object or null if not found.
 */
export async function getTeacherById(
  teacherId: string,
  options: { includeConversations?: boolean } = {}
): Promise<AiTeacher | null> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { includeConversations = false } = options;

  const serviceRoleSupabase = createServiceRoleClient();

  if (includeConversations) {
    // Get teacher with conversations
    const { data: teacher, error } = await serviceRoleSupabase
      .from('ai_teachers')
      .select(`
        id,
        name,
        welcome_message,
        subject:subjects(
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
      .eq('id', teacherId)
      .eq('is_active', true)
      .order('conversations.updated_at', { ascending: false })
      .single();

    if (error) {
      console.error('Error fetching AI teacher with conversations:', error);
      throw new Error('Failed to fetch AI teacher');
    }

    return teacher as unknown as AiTeacher;
  } else {
    // Get teacher without conversations
    const { data: teacher, error } = await serviceRoleSupabase
      .from('ai_teachers')
      .select(`
        id,
        name,
        subject:subjects(
          id,
          name,
          curriculum,
          exam_board,
          description
        )
      `)
      .eq('id', teacherId)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching AI teacher:', error);
      throw new Error('Failed to fetch AI teacher');
    }

    return teacher as unknown as AiTeacher;
  }
}