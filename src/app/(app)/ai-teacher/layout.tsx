'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AiTeacher, AiConversation } from '@/lib/types/ai';
import { TeacherSidebar } from './components/teacher-sidebar';

export default function AiTeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [teachers, setTeachers] = useState<AiTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetchTeachersWithConversations();
  }, []);

  const fetchTeachersWithConversations = async () => {
    try {
      const response = await fetch('/api/ai/teachers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          includeConversations: true,
          limit: 20, // Increased to show more conversations in sidebar
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

  const handleTeacherSelect = (teacher: AiTeacher) => {
    // Navigate to the teacher's new conversation page
    router.push(`/ai-teacher/chat/new?teacherId=${teacher.id}`);
  };

  const handleConversationSelect = (conversation: AiConversation) => {
    // Navigate to the specific conversation
    router.push(`/ai-teacher/chat/${conversation.id}`);
  };

  const handleNewConversation = (teacherId?: string) => {
    // Navigate to new conversation page
    const url = teacherId ? `/ai-teacher/chat/new?teacherId=${teacherId}` : '/ai-teacher/chat/new';
    router.push(url);
  };

  const handleExploreConversations = (teacherId: string) => {
    // Navigate to explore conversations page for the teacher
    router.push(`/ai-teacher/conversations/${teacherId}`);
  };

  // Extract current state from pathname and search params
  const getCurrentState = () => {
    const pathParts = pathname.split('/');
    const isChat = pathParts.includes('chat');
    const conversationId = pathParts[pathParts.length - 1];
    const isNewChat = conversationId === 'new';
    
    // For new chats, check if there's a teacherId in the URL
    let selectedTeacherId: string | null = null;
    if (isNewChat && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      selectedTeacherId = urlParams.get('teacherId');
    }
    
    return {
      isChat,
      conversationId: isNewChat ? null : conversationId,
      isNewChat,
      selectedTeacherId,
    };
  };

  const { isChat, conversationId, selectedTeacherId } = getCurrentState();

  // Find selected teacher and conversation based on current route
  const getSelectedTeacherAndConversation = () => {
    let selectedTeacher: AiTeacher | null = null;
    let selectedConversation: AiConversation | null = null;

    if (isChat && conversationId) {
      // Find teacher and conversation by conversation ID
      for (const teacher of teachers) {
        if (teacher.conversations) {
          const conversation = teacher.conversations.find((c: AiConversation) => c.id === conversationId);
          if (conversation) {
            selectedTeacher = teacher;
            selectedConversation = conversation;
            break;
          }
        }
      }
    } else if (selectedTeacherId) {
      // For new chats, find teacher by ID
      selectedTeacher = teachers.find(t => t.id === selectedTeacherId) || null;
    }

    return { selectedTeacher, selectedConversation };
  };

  const { selectedTeacher, selectedConversation } = getSelectedTeacherAndConversation();

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="flex items-center justify-center w-full">
          <div className="text-gray-500">Loading AI teachers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <TeacherSidebar
        teachers={teachers}
        selectedTeacher={selectedTeacher}
        selectedConversation={selectedConversation}
        onTeacherSelect={handleTeacherSelect}
        onConversationSelect={handleConversationSelect}
        onNewConversation={handleNewConversation}
        onExploreConversations={handleExploreConversations}
      />
      
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
