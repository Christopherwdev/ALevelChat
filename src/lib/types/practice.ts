import { Subject } from './ai';

// Practice session status types
export type PracticeSessionStatus = 
  | 'created' 
  | 'ready' 
  | 'in_progress' 
  | 'submitted' 
  | 'graded' 
  | 'expired';

// Practice data types
export type PracticeDataType = 'file' | 'json';
export type SubmissionType = 'file' | 'text';
export type MarkingSchemeType = 'file' | 'json' | 'none';

// Practice question structure
export interface PracticeQuestion {
  id: string;
  question_number: string; // e.g. "1", "2(a)", "3(b)(i)"
  question: string;
  points: number;
  sub_questions?: PracticeQuestion[]; // For questions with parts
}

// AI grading result for individual questions
export interface AIQuestionGrade {
  question_number: string; // e.g. "1", "2(a)"
  marks_awarded: number;
  marks_possible: number;
  feedback?: string;
  student_answer?: string;
}

// Overall AI grading result
export interface AIGradingResult {
  overall_score: number;
  max_score: number;
  feedback?: string;
  questions: AIQuestionGrade[];
  grading_metadata?: {
    graded_at: string;
    grading_model?: string;
    processing_time_ms?: number;
  };
}

// Practice session database record
export interface PracticeSession {
  id: string;
  user_id: string;
  subject_id?: number;
  subject?: Subject;
  
  // Session configuration
  title: string;
  time_limit_minutes: number;
  
  // Questions data
  questions_type: PracticeDataType;
  questions_file_url?: string;
  questions_json?: PracticeQuestion[];
  
  // Marking scheme (optional)
  marking_scheme_type?: MarkingSchemeType;
  marking_scheme_file_url?: string;
  marking_scheme_json?: Record<string, unknown>; // Can be flexible format
  
  // Session state
  status: PracticeSessionStatus;
  started_at?: string;
  submitted_at?: string;
  
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// Practice submission database record
export interface PracticeSubmission {
  id: string;
  session_id: string;
  session?: PracticeSession;
  
  // Submission data
  submission_type: SubmissionType;
  submission_file_url?: string;
  submission_text?: string;
  
  // AI grading results
  ai_grading_results?: AIGradingResult;
  grading_completed_at?: string;
  max_score: number;
  overall_score?: number;
  
  created_at: string;
}

// Request types for server actions
export interface CreatePracticeSessionRequest {
  title: string;
  time_limit_minutes: number;
  subject_id?: number;
  questions_type: PracticeDataType;
  questions_file_url?: string;
  questions_json?: PracticeQuestion[];
  marking_scheme_type?: MarkingSchemeType;
  marking_scheme_file_url?: string;
  marking_scheme_json?: Record<string, unknown>;
}

export interface SubmitPracticeAnswersRequest {
  session_id: string;
  submission_type: SubmissionType;
  submission_file_url?: string;
  submission_text?: string;
  ai_grading_enabled?: boolean; // Optional flag to enable AI grading
}

// Response types for server actions
export interface CreatePracticeSessionResponse {
  success: true;
  session: PracticeSession;
}

export interface SubmitPracticeAnswersResponse {
  success: true;
  submission: PracticeSubmission;
}

export interface PracticeActionError {
  success: false;
  error: string;
  details?: string;
}

// Union types for server action responses
export type PracticeSessionResult = CreatePracticeSessionResponse | PracticeActionError;
export type SubmissionResult = SubmitPracticeAnswersResponse | PracticeActionError;

// Frontend state types
export interface PracticeSessionState {
  session: PracticeSession | null;
  isLoading: boolean;
  error?: string;
  timeRemaining?: number; // in seconds
}

export interface PracticeSubmissionState {
  submission: PracticeSubmission | null;
  isLoading: boolean;
  isGrading: boolean;
  error?: string;
}

// Utility types
export interface PracticeSessionFilters {
  status?: PracticeSessionStatus;
  subject_id?: number;
  limit?: number;
  offset?: number;
}

export interface PracticeStats {
  total_sessions: number;
  completed_sessions: number;
  average_score?: number;
  total_time_spent_minutes: number;
}

// File upload related types
export interface FileUploadProgress {
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}
