'use server';

import { createChatCompletion } from '@/lib/ai/openai-client';
import { AIGradingResult, PracticeQuestion } from '@/lib/types/practice';

export interface GradingRequest {
  questions: PracticeQuestion[] | string; // Array of questions or file content
  student_answers: string; // Student's answers (text or file content)
  marking_scheme?: string | Record<string, unknown>; // Optional marking scheme
  max_score: number; // Maximum possible score
  subject?: string; // Subject context for better grading
}

/**
 * Grade a student's practice submission using AI
 */
export async function gradeSubmission(request: GradingRequest): Promise<AIGradingResult> {
  const startTime = Date.now();

  try {
    // Construct the grading prompt
    const systemPrompt = createGradingSystemPrompt();
    const userPrompt = createGradingUserPrompt(request);

    // Call OpenAI API
    const response = await createChatCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'gemini-2.0-flash',
      maxTokens: 4000,
      temperature: 0.1, // Lower temperature for consistent grading
    });

    if (!response.success) {
      throw new Error(`AI grading failed: ${response.error}`);
    }

    // Parse the AI response
    const gradingResult = parseGradingResponse(response.content, request.max_score);
    
    // Add metadata
    gradingResult.grading_metadata = {
      graded_at: new Date().toISOString(),
      grading_model: 'gemini-2.0-flash',
      processing_time_ms: Date.now() - startTime,
    };

    return gradingResult;

  } catch (error) {
    console.error('Error grading submission:', error);
    throw new Error(
      error instanceof Error 
        ? `Grading failed: ${error.message}` 
        : 'Unknown error occurred during grading'
    );
  }
}

/**
 * Create the system prompt for AI grading
 */
function createGradingSystemPrompt(): string {
  return `You are an expert educational assessor tasked with grading student practice exam submissions.

Your responsibilities:
1. Carefully evaluate each answer against the questions and marking scheme
2. Provide fair, consistent, and constructive grading
3. Give specific feedback on what was done well and what could be improved
4. Award partial credit where appropriate
5. Be objective and focus on the accuracy and quality of the answers

Grading Guidelines:
- Award full marks for complete, accurate answers
- Give partial credit for partially correct answers
- Provide specific feedback explaining the grade
- Be encouraging while being accurate about performance
- Focus on understanding rather than just correctness

Response Format:
You must respond with a valid JSON object containing:
{
  "overall_score": number,
  "max_score": number,
  "feedback": "string - overall feedback for the student",
  "questions": [
    {
      "question_number": "string - e.g., '1', '2(a)'",
      "marks_awarded": number,
      "marks_possible": number,
      "feedback": "string - specific feedback for this question",
      "student_answer": "string - the student's answer for reference"
    }
  ]
}

Ensure the JSON is valid and the total marks awarded across all questions equals the overall_score.`;
}

/**
 * Create the user prompt with the specific grading task
 */
function createGradingUserPrompt(request: GradingRequest): string {
  let prompt = '';

  // Add subject context if provided
  if (request.subject) {
    prompt += `Subject: ${request.subject}\n\n`;
  }

  // Add questions
  prompt += 'QUESTIONS:\n';
  if (typeof request.questions === 'string') {
    prompt += request.questions;
  } else {
    request.questions.forEach((q) => {
      prompt += `${q.question_number}. ${q.question} (${q.points} marks)\n`;
    });
  }

  prompt += '\n\nSTUDENT ANSWERS:\n';
  prompt += request.student_answers;

  // Add marking scheme if provided
  if (request.marking_scheme) {
    prompt += '\n\nMARKING SCHEME:\n';
    if (typeof request.marking_scheme === 'string') {
      prompt += request.marking_scheme;
    } else {
      prompt += JSON.stringify(request.marking_scheme, null, 2);
    }
  }

  prompt += `\n\nMaximum possible score: ${request.max_score} marks`;
  prompt += '\n\nPlease grade this submission and provide detailed feedback.';

  return prompt;
}

/**
 * Parse the AI grading response into structured format
 */
function parseGradingResponse(aiResponse: string, maxScore: number): AIGradingResult {
  try {
    // Try to extract JSON from the response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }

    const parsed = JSON.parse(jsonMatch[0]) as AIGradingResult;

    // Validate the response structure
    if (!parsed.overall_score && parsed.overall_score !== 0) {
      throw new Error('Missing overall_score in AI response');
    }

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('Missing or invalid questions array in AI response');
    }

    // Ensure overall score doesn't exceed max score
    if (parsed.overall_score > maxScore) {
      console.warn(`AI awarded ${parsed.overall_score} but max is ${maxScore}, capping score`);
      parsed.overall_score = maxScore;
    }

    // Set max_score if not provided
    if (!parsed.max_score) {
      parsed.max_score = maxScore;
    }

    return parsed;

  } catch (error) {
    console.error('Error parsing AI grading response:', error);
    console.error('AI Response:', aiResponse);
    
    // Fallback: create a basic response indicating parsing error
    return {
      overall_score: 0,
      max_score: maxScore,
      feedback: 'Error processing grading response. Please try again or contact support.',
      questions: [],
      grading_metadata: {
        graded_at: new Date().toISOString(),
        grading_model: 'gemini-2.0-flash',
        processing_time_ms: 0,
      }
    };
  }
}

/**
 * Extract text content from a file buffer (simplified implementation)
 * In a real implementation, you might want to use specific parsers for PDF, DOCX, etc.
 */
export function extractTextFromFile(fileBuffer: Buffer, mimeType: string): string {
  // For now, assume text files. In production, you'd want proper file parsing
  if (mimeType.startsWith('text/') || mimeType === 'application/json') {
    return fileBuffer.toString('utf-8');
  }
  
  // For other file types, you'd integrate with libraries like:
  // - pdf-parse for PDFs
  // - mammoth for DOCX files
  // - etc.
  
  throw new Error(`Unsupported file type: ${mimeType}. Please use text files or convert your file to text.`);
}

/**
 * Validate grading request before processing
 */
export function validateGradingRequest(request: GradingRequest): { valid: boolean; error?: string } {
  if (!request.questions || (Array.isArray(request.questions) && request.questions.length === 0)) {
    return { valid: false, error: 'Questions are required' };
  }

  if (!request.student_answers || request.student_answers.trim().length === 0) {
    return { valid: false, error: 'Student answers are required' };
  }

  if (!request.max_score || request.max_score <= 0) {
    return { valid: false, error: 'Max score must be a positive number' };
  }

  return { valid: true };
}
