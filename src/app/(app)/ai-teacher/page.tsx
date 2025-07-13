'use client';

import { useState, useEffect } from 'react';
import { AiTeacher, AiConversation } from '@/lib/types/ai';
import { TeacherSidebar } from './components/teacher-sidebar';
import { ChatArea } from './components/chat-area';
import { EmptyState } from './components/empty-state';

export default function AiTeacherPage() {
  const [teachers, setTeachers] = useState<AiTeacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<AiTeacher | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<AiConversation | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleTeacherSelect = (teacher: AiTeacher) => {
    setSelectedTeacher(teacher);
    // Select the most recent conversation or null for new conversation
    if (teacher.conversations && teacher.conversations.length > 0) {
      setSelectedConversation(teacher.conversations[0]);
    } else {
      setSelectedConversation(null);
    }
  };

  const handleConversationSelect = (conversation: AiConversation) => {
    setSelectedConversation(conversation);
  };

  const handleNewConversation = () => {
    setSelectedConversation(null);
  };

  const handleConversationCreated = (conversation: AiConversation) => {
    setSelectedConversation(conversation);
    // Refresh teachers to get updated conversation list
    fetchTeachersWithConversations();
  };

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
      />
      
      <div className="flex-1 flex flex-col">
        {selectedTeacher ? (
          <ChatArea
            teacher={selectedTeacher}
            conversation={selectedConversation}
            onConversationCreated={handleConversationCreated}
            onNewConversation={handleNewConversation}
          />
        ) : (
          <EmptyState onTeacherSelect={handleTeacherSelect} teachers={teachers} />
        )}
      </div>
    </div>
  );
}
