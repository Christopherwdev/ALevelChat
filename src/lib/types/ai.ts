export interface AiTeacher {
  id: string;
  name: string;
  subject: string;
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

