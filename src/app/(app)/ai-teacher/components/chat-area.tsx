'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AiTeacher, AiConversation, AiMessage } from '@/lib/types/ai';
import { ChatMessage } from './chat-message';
import { MessageInput } from './message-input';
import { sendMessage as sendMessageAction } from '../chat/actions';
import { getConversationMessages } from '@/lib/services/ai';

interface ChatAreaProps {
  teacher: AiTeacher;
  conversation: AiConversation | null;
  onConversationCreated: (conversation: AiConversation) => void;
  onNewConversation: () => void;
}

export function ChatArea({
  teacher,
  conversation,
  onConversationCreated,
  onNewConversation,
}: ChatAreaProps) {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    if (!conversation) return;

    setLoading(true);
    try {
      const messages = await getConversationMessages(conversation.id);
      setMessages(messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, [conversation]);

  useEffect(() => {
    if (conversation) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [conversation, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMessageSend = async (content: string) => {
    if (!content.trim()) return;

    setSendingMessage(true);

    // Optimistic update: add user message immediately to UI
    const userMessage: AiMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const result = await sendMessageAction(teacher.id, content, conversation?.id);

      // If this was a new conversation, notify parent
      if (!conversation && result.newConversation) {
        onConversationCreated(result.newConversation);
      }

      // Add AI response
      const aiMessage: AiMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: result.message,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev.slice(0, -1), {
        ...userMessage,
        id: `user-${Date.now()}`,
      }, aiMessage]);
    } catch (error) {
      // Remove the temporary user message on error
      setMessages(prev => prev.slice(0, -1));
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-medium text-sm">
              {teacher.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {teacher.name}
            </h2>
            <p className="text-sm text-gray-500">
              {conversation ? conversation.title : 'New Conversation'} • {teacher.subject.name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onNewConversation}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            New Chat
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-500">Loading conversation...</div>
          </div>
        ) : (
          <>
            {!conversation && (
              <>
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 font-medium text-lg">
                      {teacher.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Chat with {teacher.name}
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Start a conversation with your {teacher.subject.name} teacher. Ask questions, 
                    get explanations, or discuss any topic related to {teacher.subject.name}.
                  </p>
                </div>

                {teacher.welcome_message && (
                  <div className="flex justify-start">
                    <div className="flex max-w-xs lg:max-w-md xl:max-w-lg flex-row items-start space-x-2">
                      <div className="flex-shrink-0 mr-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium text-sm">
                            {teacher.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
                        <div className="prose prose-sm">
                          {teacher.welcome_message}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                teacher={teacher}
              />
            ))}

            {sendingMessage && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-xs">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <MessageInput
        onSend={handleMessageSend}
        disabled={sendingMessage}
        placeholder={`Ask ${teacher.name} anything about ${teacher.subject.name}...`}
      />
    </div>
  );
}
