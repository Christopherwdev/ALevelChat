import { AiTeacher } from '@/lib/types/ai';
import NewChatClient from './new-chat-client';
import { fetchTeachersWithConversations } from '../../actions';

async function getTeacherData(teacherId?: string) {
  const teachers = await fetchTeachersWithConversations();
  
  if (teacherId) {
    const teacher = teachers.find(t => t.id === teacherId);
    if (teacher) {
      return { teacher, teachers };
    }
  }
  
  return { teacher: null, teachers };
}

export default async function NewChatPage({
  searchParams,
}: {
  searchParams: { teacherId?: string };
}) {
  const { teacher, teachers } = await getTeacherData(searchParams.teacherId);

  return (
    <NewChatClient 
      initialTeacher={teacher} 
      teachers={teachers} 
    />
  );
}
