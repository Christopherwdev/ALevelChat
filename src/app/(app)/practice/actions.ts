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
import {
  createPracticeSession as createPracticeSessionService,
  submitPracticeAnswers as submitPracticeAnswersService
} from '@/lib/services/practice';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * Create and initialize a new practice session
 */
export async function initializePracticeSession(request: CreatePracticeSessionRequest): Promise<PracticeSessionResult> {
  const createSessionResult = await createPracticeSessionService(request);

  if (!createSessionResult.success) {
    return createSessionResult;
  }

  // If practice session creation is successful, it means the client is already authenticated
  const serviceRoleSupabase = createServiceRoleClient();
  const { data: updatedSession, error: updateError } = await serviceRoleSupabase
    .from('practice_sessions')
    .update({ status: 'ready' })
    .eq('id', createSessionResult.session.id)
    .select('*')
    .single();

  if (updateError) {
    console.error('Error updating session status:', updateError);
    return { success: false, error: 'Failed to update session status' };
  }

  revalidatePath("/practice");

  return { ...createSessionResult, session: updatedSession };
}

