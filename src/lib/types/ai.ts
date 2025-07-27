export interface Subject {
  id: number;
  name: string;
  curriculum: string;
  exam_board: string | null;
  description: string | null;
}

export interface AiTeacher {
  id: string;
  name: string;
  subject: Subject;
  welcome_message?: string;
  conversations?: AiConversation[];
}

export interface AiConversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}
