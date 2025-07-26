'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AiTeacher, AiConversation } from '@/lib/types/ai';
import { TeacherSidebar } from './components/teacher-sidebar';

interface ClientLayoutProps {
  teachers: AiTeacher[];
  children: React.ReactNode;
}

export default function ClientLayout({ teachers, children }: ClientLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

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

  const handleTeacherSelect = (teacher: AiTeacher) => {
    router.push(`/ai-teacher/chat/new?teacherId=${teacher.id}`);
    setSidebarOpen(false);
  };

  const handleConversationSelect = (conversation: AiConversation) => {
    router.push(`/ai-teacher/chat/${conversation.id}`);
    setSidebarOpen(false);
  };

  const handleNewConversation = (teacherId?: string) => {
    const url = teacherId ? `/ai-teacher/chat/new?teacherId=${teacherId}` : '/ai-teacher/chat/new';
    router.push(url);
    setSidebarOpen(false);
  };

  const handleExploreConversations = (teacherId: string) => {
    router.push(`/ai-teacher/conversations/${teacherId}`);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
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
