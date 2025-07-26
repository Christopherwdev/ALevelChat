import { AiTeacher } from '@/lib/types/ai';
import NewChatClient from './new-chat-client';
import { fetchTeachersWithConversations } from '../../actions';

async function getTeacherData(teacherId?: string) {
  const teachers = await fetchTeachersWithConversations();
  
  if (teacherId) {
    const teacher = teachers.find((t: AiTeacher) => t.id === teacherId);
    if (teacher) {
      return { teacher, teachers };
    }
  }
  
  return { teacher: null, teachers };
}

export default async function NewChatPage({
  searchParams,
}: {
  searchParams: Promise<{ teacherId?: string }>;
}) {
  const { teacher, teachers } = await getTeacherData((await searchParams).teacherId);

  return (
    <NewChatClient 
      initialTeacher={teacher} 
      teachers={teachers} 
    />
  );
}
