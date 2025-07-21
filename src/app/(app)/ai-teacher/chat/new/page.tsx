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

  // Show recent conversations and new chat option when teacher is selected
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium text-lg">
                  {teacher.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  New Chat with {teacher.name}
                </h1>
                <p className="text-gray-500">
                  {teacher.subject} Teacher
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => router.push('/ai-teacher/chat/new')}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Change Teacher
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* New Chat Area */}
        <div className="flex-1">
          <ChatArea
            teacher={teacher}
            conversation={null}
            onConversationCreated={handleConversationCreated}
            onNewConversation={handleNewConversation}
          />
        </div>

        {/* Recent Conversations Sidebar */}
        {teacher.conversations && teacher.conversations.length > 0 && (
          <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Chats</h2>
                {teacher.conversations.length > 5 && (
                  <button
                    onClick={() => router.push(`/ai-teacher/conversations/${teacher.id}`)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View All
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-500">Continue previous conversations</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {teacher.conversations.slice(0, 5).map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => router.push(`/ai-teacher/chat/${conversation.id}`)}
                  className="w-full bg-white rounded-lg border border-gray-200 p-3 text-left hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <h3 className="text-sm font-medium text-gray-900 truncate mb-1">
                    {conversation.title || 'Untitled Chat'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {new Date(conversation.updated_at).toLocaleDateString()}
                  </p>
                </button>
              ))}
              
              {teacher.conversations.length > 5 && (
                <button
                  onClick={() => router.push(`/ai-teacher/conversations/${teacher.id}`)}
                  className="w-full bg-blue-50 rounded-lg border border-blue-200 p-3 text-center hover:bg-blue-100 transition-colors"
                >
                  <div className="text-blue-600 font-medium text-sm">
                    View All {teacher.conversations.length} Conversations
                  </div>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
