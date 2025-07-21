'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AiTeacher, AiConversation } from '@/lib/types/ai';
import { ChatArea } from '../../components/chat-area';

export default function ConversationPage() {
  const [teacher, setTeacher] = useState<AiTeacher | null>(null);
  const [conversation, setConversation] = useState<AiConversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const conversationId = params.conversationId as string;

  useEffect(() => {
    const fetchConversationData = async () => {
      try {
        // First, get all teachers with their conversations to find the one that has this conversation
        const response = await fetch('/api/ai/teachers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            includeConversations: true,
            limit: 50, // Increase limit to ensure we get all conversations
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const teachers = data.teachers;
          
          // Find the teacher and conversation
          let foundTeacher: AiTeacher | null = null;
          let foundConversation: AiConversation | null = null;

          for (const teacher of teachers) {
            if (teacher.conversations) {
              const conv = teacher.conversations.find((c: AiConversation) => c.id === conversationId);
              if (conv) {
                foundTeacher = teacher;
                foundConversation = conv;
                break;
              }
            }
          }

          if (foundTeacher && foundConversation) {
            setTeacher(foundTeacher);
            setConversation(foundConversation);
          } else {
            setError('Conversation not found');
          }
        } else {
          setError('Failed to load conversation');
        }
      } catch (error) {
        console.error('Error fetching conversation:', error);
        setError('Failed to load conversation');
      } finally {
        setLoading(false);
      }
    };

    if (conversationId) {
      fetchConversationData();
    }
  }, [conversationId]);

  const handleConversationCreated = (newConversation: AiConversation) => {
    // Navigate to the new conversation
    router.push(`/ai-teacher/chat/${newConversation.id}`);
  };

  const handleNewConversation = () => {
    // Navigate to new conversation page with the current teacher
    if (teacher) {
      router.push(`/ai-teacher/chat/new?teacherId=${teacher.id}`);
    } else {
      router.push('/ai-teacher/chat/new');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading conversation...</div>
      </div>
    );
  }

  if (error || !teacher || !conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error || 'Conversation not found'}</div>
          <button
            onClick={() => router.push('/ai-teacher/chat/new')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Start New Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <ChatArea
      teacher={teacher}
      conversation={conversation}
      onConversationCreated={handleConversationCreated}
      onNewConversation={handleNewConversation}
    />
  );
}
