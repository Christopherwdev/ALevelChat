'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AiTeacher, AiConversation } from '@/lib/types/ai';
import { ChatArea } from '../../components/chat-area';
import { EmptyState } from '../../components/empty-state';

export default function NewChatPage() {
  const [teacher, setTeacher] = useState<AiTeacher | null>(null);
  const [teachers, setTeachers] = useState<AiTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const teacherId = searchParams.get('teacherId');

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (teachers.length > 0 && teacherId) {
      const selectedTeacher = teachers.find(t => t.id === teacherId);
      setTeacher(selectedTeacher || null);
    }
  }, [teachers, teacherId]);

  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/ai/teachers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          includeConversations: true,
          limit: 10,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTeachers(data.teachers);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationCreated = (conversation: AiConversation) => {
    // Navigate to the new conversation
    router.push(`/ai-teacher/chat/${conversation.id}`);
  };

  const handleNewConversation = () => {
    // Stay on the same page but clear any teacher selection
    router.push('/ai-teacher/chat/new');
  };

  const handleTeacherSelect = (selectedTeacher: AiTeacher) => {
    setTeacher(selectedTeacher);
    router.push(`/ai-teacher/chat/new?teacherId=${selectedTeacher.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <EmptyState 
        onTeacherSelect={handleTeacherSelect} 
        teachers={teachers} 
      />
    );
  }

  return (
    <ChatArea
      teacher={teacher}
      conversation={null}
      onConversationCreated={handleConversationCreated}
      onNewConversation={handleNewConversation}
    />
  );
}
