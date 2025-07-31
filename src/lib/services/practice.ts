"use server";

import { createClient } from '@/utils/supabase/server';
import { createClient as createServiceRoleClient } from '@/utils/supabase/service';
import { 
  CreatePracticeSessionRequest, 
  PracticeSessionResult, 
  SubmissionResult,
  PracticeSession,
  PracticeSubmission,
  SubmitPracticeAnswersRequest
} from '@/lib/types/practice';

/**
 * Create a new practice session
 * Credits: 10 per session
 */
export async function createPracticeSession(
  request: CreatePracticeSessionRequest
): Promise<PracticeSessionResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: 'You must be logged in to create a practice session.',
      };
    }

    // Validate the request
    if (!request.title || request.title.trim().length === 0) {
      return {
        success: false,
        error: 'Practice session title is required.',
      };
    }

    if (!request.time_limit_minutes || request.time_limit_minutes <= 0) {
      return {
        success: false,
        error: 'Time limit must be a positive number.',
      };
    }

    // Create the practice session
    const serviceRoleSupabase = createServiceRoleClient();
    const { data: session, error: sessionError } = await serviceRoleSupabase
      .from('practice_sessions')
      .insert({
        user_id: user.id,
        subject_id: request.subject_id || null,
        title: request.title.trim(),
        time_limit_minutes: request.time_limit_minutes,
        questions_type: request.questions_type,
        questions_file_url: request.questions_file_url || null,
        questions_json: request.questions_json || null,
        marking_scheme_type: request.marking_scheme_type || 'none',
        marking_scheme_file_url: request.marking_scheme_file_url || null,
        marking_scheme_json: request.marking_scheme_json || null,
        status: 'created',
      })
      .select(`
        *,
        subject:subjects(*)
      `)
      .single();

    if (sessionError) {
      console.error('Session creation error:', sessionError);
      return {
        success: false,
        error: 'Failed to create practice session.',
        details: sessionError.message,
      };
    }

    return {
      success: true,
      session: session as PracticeSession,
    };
  } catch (error) {
    console.error('Error creating practice session:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while creating the practice session.',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Start a practice session (records start time, sets status to in_progress)
 */
export async function startPracticeSession(sessionId: string): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: 'You must be logged in to start a practice session.',
      };
    }

    // Get the session and verify ownership
    const serviceRoleSupabase = createServiceRoleClient();
    const { data: session, error: fetchError } = await serviceRoleSupabase
      .from('practice_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !session) {
      return {
        success: false,
        error: 'Practice session not found or you do not have permission to access it.',
      };
    }

    if (session.status !== 'ready') {
      return {
        success: false,
        error: `Cannot start session. Current status: ${session.status}`,
      };
    }

    // Update session to in_progress with start time
    const { error: updateError } = await serviceRoleSupabase
      .from('practice_sessions')
      .update({
        status: 'in_progress',
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error starting practice session:', updateError);
      return {
        success: false,
        error: 'Failed to start practice session.',
      };
    }

    return { success: true };

  } catch (error) {
    console.error('Error starting practice session:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while starting the practice session.',
    };
  }
}

/**
 * Submit practice answers for grading
 */
export async function submitPracticeAnswers(
  request: SubmitPracticeAnswersRequest
): Promise<SubmissionResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: 'You must be logged in to submit practice answers.',
      };
    }

    // Get the session and verify ownership
    const serviceRoleSupabase = createServiceRoleClient();

    const { data: session, error: fetchError } = await serviceRoleSupabase
      .from('practice_sessions')
      .select(`
        *,
        subject:subjects(*)
      `)
      .eq('id', request.session_id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !session) {
      return {
        success: false,
        error: 'Practice session not found or you do not have permission to access it.',
      };
    }

    if (session.status !== 'in_progress') {
      return {
        success: false,
        error: `Cannot submit answers. Session status: ${session.status}`,
      };
    }

    // Check for practice expiry
    const isExpired = await checkSessionExpiry(request.session_id);
    if (isExpired) {
      return {
        success: false,
        error: 'This practice session is no longer accepting submissions.',
      };
    }

    // Validate submission data
    if (request.submission_type === 'file' && !request.submission_file_url) {
      return {
        success: false,
        error: 'Submission file is required when using file type.',
      };
    }

    if (request.submission_type === 'text' && (!request.submission_text || request.submission_text.trim().length === 0)) {
      return {
        success: false,
        error: 'Submission text is required when using text type.',
      };
    }

    // Create submission record first
    const { data: submission, error: submissionError } = await serviceRoleSupabase
      .from('practice_submissions')
      .insert({
        session_id: request.session_id,
        submission_type: request.submission_type,
        submission_file_url: request.submission_file_url || null,
        submission_text: request.submission_text || null,
      })
      .select(`
        *,
        session:practice_sessions(
          *,
          subject:subjects(*)
        )
      `)
      .single();

    if (submissionError) {
      console.error('Submission creation error:', submissionError);
      return {
        success: false,
        error: 'Failed to create submission record.',
        details: submissionError.message,
      };
    }

    // Update session status to submitted
    await serviceRoleSupabase
      .from('practice_sessions')
      .update({
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', request.session_id);
    
    submission.session.status = 'submitted';

    if (request.ai_grading_enabled) {
      // Start AI grading asynchronously (fire-and-forget)
      gradeSubmission(submission.id);
    }
    
    // Return submission without grading results initially
    return {
      success: true,
      submission: {
        ...submission,
        session: session as PracticeSession,
      } as PracticeSubmission,
    };

  } catch (error) {
    console.error('Error submitting practice answers:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while submitting practice answers.',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Grade a practice submission
 * Credits: 50 per submission
 */
export async function gradeSubmission(
  submissionId: string, 
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        success: false,
        error: 'You must be logged in to grade submissions.',
      };
    }

    const serviceRoleSupabase = createServiceRoleClient();

    // Fetch the submission details
    const { data: submission, error: fetchError } = await serviceRoleSupabase
      .from('practice_submissions')
      .select(`
        *,
        session:practice_sessions(*)
      `)
      .eq('id', submissionId)
      .eq('session.user_id', user.id)
      .single();

    if (fetchError || !submission) {
      return {
        success: false,
        error: 'Submission not found or you do not have permission to access it.',
      };
    }

    // Check and deduct credits for AI grading
    const { data: creditCheck, error: creditError } = await serviceRoleSupabase
      .rpc('check_and_deduct_credits', {
        user_id: user.id,
        cost_credits: 50,
        action_cause: 'practice'
      });

    if (creditError) {
      console.error('Credit check error:', creditError);
      return {
        success: false,
        error: 'Failed to process credit transaction.',
        details: creditError.message,
      };
    }

    if (!creditCheck) {
      return {
        success: false,
        error: 'Insufficient credits. You need 50 credits to submit and grade practice answers.',
      };
    }

    // Simulate some work
    await new Promise(resolve => setTimeout(resolve, 20000));

    const mockGrade = {
      mock: true, 
      feedback: 'Mock grading for demonstration purposes',
      questions: [],
      overall_score: 100,
      max_score: 100,
    };
    
    // Update submission with mock grading results
    const { data: updatedSubmission, error: updateError } = await serviceRoleSupabase
      .from('practice_submissions')
      .update({
        ai_grading_results: mockGrade,
        overall_score: mockGrade.overall_score,
        max_score: mockGrade.max_score,
        grading_completed_at: new Date().toISOString(),
      })
      .eq('id', submissionId)
      .select('*, session:practice_sessions(*)')
      .single();
    
    if (updateError || !updatedSubmission) {
      console.error('Error updating submission with grading results:', updateError);
      return {
        success: false,
        error: 'Failed to update submission with grading results.',
        details: updateError?.message,
      };
    }

    // Update session status to graded
    await serviceRoleSupabase
      .from('practice_sessions')
      .update({
        status: 'graded',
        updated_at: new Date().toISOString(),
      })
      .eq('id', submission.session.id);
    
    updatedSubmission.session.status = 'graded';

    console.log(`Successfully graded submission ${submissionId}`);

    return {
      success: true,
      submission: updatedSubmission,
    };
  } catch (error) {
    console.error(`Error grading submission ${submissionId}:`, error);
    return {
      success: false,
      error: 'An unexpected error occurred while grading the submission.',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get practice session details
 */
export async function getPracticeSession(sessionId: string): Promise<PracticeSession | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: session, error } = await supabase
      .from('practice_sessions')
      .select(`
        *,
        subject:subjects(*)
      `)
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (error || !session) {
      return null;
    }

    return session as PracticeSession;

  } catch (error) {
    console.error('Error fetching practice session:', error);
    return null;
  }
}

/**
 * Get user's practice sessions
 */
export async function getUserPracticeSessions(
  limit = 20,
  offset = 0
): Promise<PracticeSession[]> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data: sessions, error } = await supabase
      .from('practice_sessions')
      .select(`
        *,
        subject:subjects(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching practice sessions:', error);
      return [];
    }

    return sessions as PracticeSession[];

  } catch (error) {
    console.error('Error fetching practice sessions:', error);
    return [];
  }
}

/**
 * Get submission details with grading
 */
export async function getPracticeSubmission(sessionId: string): Promise<PracticeSubmission | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: submission, error } = await supabase
      .from('practice_submissions')
      .select(`
        *,
        session:practice_sessions!inner(
          *,
          subject:subjects(*)
        )
      `)
      .eq('session.id', sessionId)
      .eq('session.user_id', user.id)
      .single();

    if (error || !submission) {
      return null;
    }

    return submission as PracticeSubmission;

  } catch (error) {
    console.error('Error fetching practice submission:', error);
    return null;
  }
}

/**
 * Check if practice session is expired and update status if needed
 */
export async function checkSessionExpiry(sessionId: string): Promise<boolean> {
  const EXPIRY_BUFFER_MINUTES = 2; // Buffer time before actual expiry
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return true;
    }

    const { data: session, error } = await supabase
      .from('practice_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (error || !session) {
      return true;
    }

    if (session.status === 'in_progress' && session.started_at) {
      const startTime = new Date(session.started_at);
      const expiry = new Date(startTime.getTime() + session.time_limit_minutes * 60 * 1000 + EXPIRY_BUFFER_MINUTES * 60 * 1000);
      const now = new Date();

      if (now > expiry) {
        // Mark as expired
        const serviceRoleSupabase = createServiceRoleClient();
        await serviceRoleSupabase
          .from('practice_sessions')
          .update({
            status: 'expired',
            updated_at: new Date().toISOString(),
          })
          .eq('id', sessionId);

        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Error checking session expiry:', error);
    return true;
  }
}
