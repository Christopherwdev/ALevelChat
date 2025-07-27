import { notFound } from 'next/navigation';
import { ChatWrapper } from '../../components/chat-wrapper';
import { fetchTeachersWithConversations } from '../../actions';
import { AiConversation } from '@/lib/types/ai';

async function getConversationData(conversationId: string) {
  const teachers = await fetchTeachersWithConversations();
  
  for (const teacher of teachers) {
    if (teacher.conversations) {
      const conversation = teacher.conversations.find((c: AiConversation) => c.id === conversationId);
      if (conversation) {
        return { teacher, conversation };
      }
    }
  }
  
  return null;
}

export default async function ConversationPage({
  params,
}: {
  params: { conversationId: string };
}) {
  const data = await getConversationData(params.conversationId);
  
  if (!data) {
    notFound();
  }

  return (
    <ChatWrapper
      teacher={data.teacher}
      conversation={data.conversation}
    />
  );
}

