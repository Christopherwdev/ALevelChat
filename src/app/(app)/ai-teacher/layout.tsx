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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    // Close sidebar on mobile after selection
    setSidebarOpen(false);
  };

  const handleConversationSelect = (conversation: AiConversation) => {
    // Navigate to the specific conversation
    router.push(`/ai-teacher/chat/${conversation.id}`);
    // Close sidebar on mobile after selection
    setSidebarOpen(false);
  };

  const handleNewConversation = (teacherId?: string) => {
    // Navigate to new conversation page
    const url = teacherId ? `/ai-teacher/chat/new?teacherId=${teacherId}` : '/ai-teacher/chat/new';
    router.push(url);
    // Close sidebar on mobile after selection
    setSidebarOpen(false);
  };

  const handleExploreConversations = (teacherId: string) => {
    // Navigate to explore conversations page for the teacher
    router.push(`/ai-teacher/conversations/${teacherId}`);
    // Close sidebar on mobile after selection
    setSidebarOpen(false);
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
    <div className="flex h-[calc(100vh-50px)] pt-[50px] bg-gray-50">
      {/* Mobile hamburger menu */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-lg"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-[rgba(0,0,0,0.5)]"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 transform lg:transform-none transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <TeacherSidebar
          teachers={teachers}
          selectedTeacher={selectedTeacher}
          selectedConversation={selectedConversation}
          onTeacherSelect={handleTeacherSelect}
          onConversationSelect={handleConversationSelect}
          onNewConversation={handleNewConversation}
          onExploreConversations={handleExploreConversations}
          onClose={() => setSidebarOpen(false)}
        />
      </div>
      
      <div className="flex-1 flex flex-col lg:ml-0">
        {children}
      </div>
    </div>
  );
}
