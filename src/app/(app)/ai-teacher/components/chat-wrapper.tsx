'use client';

import { useRouter } from 'next/navigation';
import { AiTeacher, AiConversation } from '@/lib/types/ai';
import { ChatArea } from './chat-area';

interface ChatWrapperProps {
  teacher: AiTeacher;
  conversation: AiConversation | null;
}

export function ChatWrapper({ teacher, conversation }: ChatWrapperProps) {
  const router = useRouter();

  const handleConversationCreated = (newConversation: AiConversation) => {
    router.push(`/ai-teacher/chat/${newConversation.id}`);
  };

  const handleNewConversation = () => {
    router.push(`/ai-teacher/chat/new?teacherId=${teacher.id}`);
  };

  return (
    <ChatArea
      teacher={teacher}
      conversation={conversation}
      onConversationCreated={handleConversationCreated}
      onNewConversation={handleNewConversation}
    />
  );
}
