'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AiTeacher, AiConversation } from '@/lib/types/ai';

export default function ExploreConversationsPage() {
  const [teacher, setTeacher] = useState<AiTeacher | null>(null);
  const [conversations, setConversations] = useState<AiConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const teacherId = params.teacherId as string;

  useEffect(() => {
    const fetchTeacherAndConversations = async () => {
      try {
        const response = await fetch('/api/ai/teachers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            includeConversations: true,
            limit: 50, // Get more conversations for this view
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const teachers = data.teachers;
          
          const foundTeacher = teachers.find((t: AiTeacher) => t.id === teacherId);
          
          if (foundTeacher) {
            setTeacher(foundTeacher);
            setConversations(foundTeacher.conversations || []);
          } else {
            setError('Teacher not found');
          }
        } else {
          setError('Failed to load teacher data');
        }
      } catch (error) {
        console.error('Error fetching teacher and conversations:', error);
        setError('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    if (teacherId) {
      fetchTeacherAndConversations();
    }
  }, [teacherId]);

  const handleConversationSelect = (conversation: AiConversation) => {
    router.push(`/ai-teacher/chat/${conversation.id}`);
  };

  const handleNewConversation = () => {
    router.push(`/ai-teacher/chat/new?teacherId=${teacherId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading conversations...</div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error || 'Teacher not found'}</div>
          <button
            onClick={() => router.push('/ai-teacher/chat/new')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium text-lg">
                  {teacher.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {teacher.name}
                </h1>
                <p className="text-gray-500">
                  {teacher.subject} • {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleNewConversation}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            New Conversation
          </button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-6">
        {conversations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">💬</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No conversations yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start your first conversation with {teacher.name}
            </p>
            <button
              onClick={handleNewConversation}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Start New Conversation
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => handleConversationSelect(conversation)}
                className="bg-white rounded-lg border border-gray-200 p-4 text-left hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate mb-1">
                      {conversation.title || 'Untitled Chat'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Updated {formatDate(conversation.updated_at)}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
