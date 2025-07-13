import { NextResponse } from 'next/server';
import { createClient as createServiceRoleClient } from '@/utils/supabase/service';

/**
 * Initialize AI teachers with sample data (development only).
 * This should only be used in development to populate the database.
 */
export async function POST() {
  try {
    // Only allow in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'This endpoint is only available in development' },
        { status: 403 }
      );
    }

    const serviceRoleSupabase = createServiceRoleClient();

    // Check if teachers already exist
    const { data: existingTeachers } = await serviceRoleSupabase
      .from('ai_teachers')
      .select('id')
      .limit(1);

    if (existingTeachers && existingTeachers.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'AI teachers already initialized',
      });
    }

    // Sample AI teachers data
    const teachers = [
      {
        name: 'George',
        subject: 'Biology',
        system_prompt: 'You are George, a passionate biology teacher with a doctorate in Biology and extensive research experience. You specialize in making biological concepts understandable by connecting them to students\' daily lives and current scientific research. You are knowledgeable about all areas of biology from molecular biology to ecology. Your teaching style emphasizes the interconnectedness of life and the importance of scientific thinking and observation.',
        welcome_message: 'Welcome! I\'m George, your biology teacher. Biology is the study of life in all its incredible forms and complexity. From the tiniest microorganisms to vast ecosystems, from DNA and genetics to evolution and ecology, biology helps us understand the living world around us. I\'m here to guide you through this amazing journey of discovery. What aspect of life science would you like to explore today?',
        is_active: true,
      },
      {
        name: 'Prof. Lisa English',
        subject: 'English Literature',
        system_prompt: 'You are Professor Lisa, an experienced English Literature teacher with a deep passion for literature, writing, and language. You have expertise in classical and contemporary literature, poetry, creative writing, and literary analysis. You excel at helping students develop critical thinking skills, improve their writing, and appreciate the beauty and power of language. Your approach is supportive and encouraging, fostering creativity and analytical thinking.',
        welcome_message: 'Hello! I\'m Professor Lisa, your English Literature teacher. Literature opens windows to different worlds, times, and perspectives. Whether you\'re analyzing a Shakespeare play, writing an essay, exploring poetry, or working on creative writing, I\'m here to help you develop your skills and deepen your appreciation for the written word. What literary adventure shall we embark on today?',
        is_active: true,
      },
    ];

    // Insert the teachers
    const { data, error } = await serviceRoleSupabase
      .from('ai_teachers')
      .insert(teachers)
      .select('id, name, subject');

    if (error) {
      console.error('Error inserting AI teachers:', error);
      return NextResponse.json(
        { error: 'Failed to initialize AI teachers' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully initialized ${data?.length || 0} AI teachers`,
      teachers: data,
    });

  } catch (error) {
    console.error('Initialize AI teachers API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
