import OpenAI from 'openai';

// Initialize OpenAI client (gemini)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL,
});

const DEFAULT_MODEL = "gemini-2.0-flash";

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  attachments?: string[];
}

export interface StreamingChatOptions {
  messages: ChatMessage[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface ChatCompletionOptions {
  messages: ChatMessage[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export async function createChatCompletion(options: ChatCompletionOptions) {
  try {
    const response = await openai.chat.completions.create({
      model: options.model || DEFAULT_MODEL,
      messages: options.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      max_tokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.7,
    });

    return {
      success: true,
      content: response.choices[0]?.message?.content || '',
      usage: response.usage,
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function createStreamingChatCompletion(options: StreamingChatOptions) {
  try {
    const stream = await openai.chat.completions.create({
      model: options.model || 'gpt-4o-mini',
      messages: options.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      max_tokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.7,
      stream: true,
    });

    return {
      success: true,
      stream,
    };
  } catch (error) {
    console.error('OpenAI streaming error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function analyzeImage(imageUrl: string, prompt: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        },
      ],
      max_tokens: 1000,
    });

    return {
      success: true,
      content: response.choices[0]?.message?.content || '',
      usage: response.usage,
    };
  } catch (error) {
    console.error('OpenAI image analysis error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function generateQuiz(subject: string, topic: string, difficulty: string, questionCount: number) {
  const prompt = `Generate a ${difficulty} level quiz for ${subject} on the topic of ${topic}. Create ${questionCount} questions with a mix of multiple choice, fill-in-the-blank, and short answer questions. Return the quiz in JSON format with the following structure:
  {
    "title": "Quiz title",
    "description": "Brief description",
    "questions": [
      {
        "id": 1,
        "type": "multiple_choice",
        "question": "Question text",
        "options": ["A", "B", "C", "D"],
        "correct_answer": "A",
        "explanation": "Why this is correct"
      }
    ]
  }`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert educator creating high-quality educational quizzes.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || '';
    
    // Try to parse JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const quizData = JSON.parse(jsonMatch[0]);
      return {
        success: true,
        quizData,
        usage: response.usage,
      };
    }

    return {
      success: false,
      error: 'Failed to parse quiz data',
    };
  } catch (error) {
    console.error('Quiz generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export { openai };
