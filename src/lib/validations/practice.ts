import { z } from 'zod';

// Base practice question schema (without sub_questions for recursion)
const basePracticeQuestionSchema = z.object({
  id: z.string().min(1, 'Question ID is required'),
  question_number: z.string().min(1, 'Question number is required'),
  question: z.string().min(1, 'Question text is required').max(5000, 'Question is too long'),
  points: z.number().min(0, 'Points must be non-negative').max(100, 'Points cannot exceed 100'),
});

// Recursive practice question schema with sub_questions
export const practiceQuestionSchema: z.ZodType<{
  id: string;
  question_number: string;
  question: string;
  points: number;
  sub_questions?: Array<{
    id: string;
    question_number: string;
    question: string;
    points: number;
    sub_questions?: unknown[];
  }>;
}> = basePracticeQuestionSchema.extend({
  sub_questions: z.array(z.lazy(() => practiceQuestionSchema)).optional(),
});

// Create practice session validation
export const createPracticeSessionSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title is too long')
    .trim(),
  time_limit_minutes: z.number()
    .min(1, 'Time limit must be at least 1 minute')
    .max(300, 'Time limit cannot exceed 5 hours'),
  subject_id: z.number().int().positive().optional(),
  questions_type: z.enum(['file', 'json'], {
    required_error: 'Questions type is required',
  }),
  questions_file_url: z.string().url().optional(),
  questions_json: z.array(practiceQuestionSchema).optional(),
  marking_scheme_type: z.enum(['file', 'json', 'none']).optional(),
  marking_scheme_file_url: z.string().url().optional(),
  marking_scheme_json: z.record(z.unknown()).optional(),
}).refine((data) => {
  // Validate questions data based on type
  if (data.questions_type === 'file') {
    return data.questions_file_url && !data.questions_json;
  } else if (data.questions_type === 'json') {
    return data.questions_json && data.questions_json.length > 0 && !data.questions_file_url;
  }
  return false;
}, {
  message: 'Questions data must match the selected type',
  path: ['questions_type'],
}).refine((data) => {
  // Validate marking scheme data based on type
  if (data.marking_scheme_type === 'file') {
    return data.marking_scheme_file_url && !data.marking_scheme_json;
  } else if (data.marking_scheme_type === 'json') {
    return data.marking_scheme_json && !data.marking_scheme_file_url;
  } else if (data.marking_scheme_type === 'none' || !data.marking_scheme_type) {
    return !data.marking_scheme_file_url && !data.marking_scheme_json;
  }
  return true;
}, {
  message: 'Marking scheme data must match the selected type',
  path: ['marking_scheme_type'],
});

// Submit practice answers validation
export const submitPracticeAnswersSchema = z.object({
  session_id: z.string().uuid('Invalid session ID'),
  submission_type: z.enum(['file', 'text'], {
    required_error: 'Submission type is required',
  }),
  submission_text: z.string().optional(),
  submission_file: z.instanceof(File).optional(),
}).refine((data) => {
  // Validate submission data based on type
  if (data.submission_type === 'file') {
    return data.submission_file && !data.submission_text;
  } else if (data.submission_type === 'text') {
    return data.submission_text && data.submission_text.trim().length > 0 && !data.submission_file;
  }
  return false;
}, {
  message: 'Submission data must match the selected type',
  path: ['submission_type'],
});

// File upload validation
export const practiceFileSchema = z.object({
  file: z.instanceof(File, { message: 'File is required' }),
  maxSize: z.number().default(10 * 1024 * 1024), // 10MB default
  allowedTypes: z.array(z.string()).default([
    'text/plain',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
  ]),
}).refine((data) => {
  return data.file.size <= data.maxSize;
}, {
  message: 'File size exceeds maximum allowed size',
  path: ['file'],
}).refine((data) => {
  return data.allowedTypes.includes(data.file.type);
}, {
  message: 'File type is not supported',
  path: ['file'],
});

// Practice session filters validation
export const practiceSessionFiltersSchema = z.object({
  status: z.enum(['created', 'ready', 'in_progress', 'submitted', 'graded', 'expired']).optional(),
  subject_id: z.number().int().positive().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

// AI grading result validation
export const aiGradingResultSchema = z.object({
  overall_score: z.number().min(0, 'Score must be non-negative'),
  max_score: z.number().min(0, 'Max score must be non-negative'),
  feedback: z.string().optional(),
  questions: z.array(z.object({
    question_number: z.string(),
    marks_awarded: z.number().min(0),
    marks_possible: z.number().min(0),
    feedback: z.string().optional(),
    student_answer: z.string().optional(),
  })),
  grading_metadata: z.object({
    graded_at: z.string(),
    grading_model: z.string().optional(),
    processing_time_ms: z.number().optional(),
  }).optional(),
}).refine((data) => {
  return data.overall_score <= data.max_score;
}, {
  message: 'Overall score cannot exceed maximum score',
  path: ['overall_score'],
});

// Practice session ID validation
export const sessionIdSchema = z.string().uuid('Invalid session ID format');

// Export types derived from schemas
export type CreatePracticeSessionData = z.infer<typeof createPracticeSessionSchema>;
export type SubmitPracticeAnswersData = z.infer<typeof submitPracticeAnswersSchema>;
export type PracticeQuestionData = z.infer<typeof practiceQuestionSchema>;
export type PracticeFileData = z.infer<typeof practiceFileSchema>;
export type PracticeSessionFiltersData = z.infer<typeof practiceSessionFiltersSchema>;
export type AIGradingResultData = z.infer<typeof aiGradingResultSchema>;
