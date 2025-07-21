'use client';

import { AiTeacher, AiConversation } from '@/lib/types/ai';

interface TeacherSidebarProps {
  teachers: AiTeacher[];
  selectedTeacher: AiTeacher | null;
  selectedConversation: AiConversation | null;
  onTeacherSelect: (teacher: AiTeacher) => void;
  onConversationSelect: (conversation: AiConversation) => void;
  onNewConversation: (teacherId?: string) => void;
  onExploreConversations: (teacherId: string) => void;
  onClose?: () => void;
}

export function TeacherSidebar({
  teachers,
  selectedTeacher,
  selectedConversation,
  onTeacherSelect,
  onConversationSelect,
  onNewConversation,
  onExploreConversations,
  onClose,
}: TeacherSidebarProps) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">AI Teachers</h1>
            <p className="text-sm text-gray-500">Choose a teacher to start chatting</p>
          </div>
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Teachers List */}
      <div className="flex-1 overflow-y-auto">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="border-b border-gray-100">
            {/* Teacher Header */}
            <button
              onClick={() => onTeacherSelect(teacher)}
              className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                selectedTeacher?.id === teacher.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-sm">
                    {teacher.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {teacher.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {teacher.subject}
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  {teacher.conversations?.length || 0} chats
                </div>
              </div>
            </button>

            {/* Always show recent conversations for each teacher */}
            <div className="bg-gray-50">
              {/* New Conversation Button */}
              <button
                onClick={() => onNewConversation(teacher.id)}
                className={`w-full p-3 text-left text-sm hover:bg-gray-100 transition-colors border-l-4 ${
                  selectedTeacher?.id === teacher.id && !selectedConversation 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                    <span className="text-green-600 text-xs">+</span>
                  </div>
                  <span className={
                    selectedTeacher?.id === teacher.id && !selectedConversation 
                      ? 'text-blue-600 font-medium' 
                      : 'text-gray-600'
                  }>
                    New Conversation
                  </span>
                </div>
              </button>

              {/* Recent Conversations */}
              {teacher.conversations && teacher.conversations.length > 0 && (
                <div>
                  <div className="px-3 py-2 flex items-center justify-between">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Recent Conversations
                    </h3>
                    {teacher.conversations.length > 3 && (
                      <button
                        onClick={() => onExploreConversations(teacher.id)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        View All
                      </button>
                    )}
                  </div>
                  {/* Show up to 3 recent conversations */}
                  {teacher.conversations.slice(0, 3).map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => onConversationSelect(conversation)}
                      className={`w-full p-3 text-left text-sm hover:bg-gray-100 transition-colors border-l-4 ${
                        selectedConversation?.id === conversation.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-600 text-xs">💬</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`truncate ${
                            selectedConversation?.id === conversation.id
                              ? 'text-blue-700 font-medium'
                              : 'text-gray-700'
                          }`}>
                            {conversation.title || 'Untitled Chat'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {new Date(conversation.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                  
                  {/* Explore all conversations button if there are more than 3 */}
                  {teacher.conversations.length > 3 && (
                    <button
                      onClick={() => onExploreConversations(teacher.id)}
                      className="w-full p-3 text-left text-sm hover:bg-gray-100 transition-colors border-l-4 border-transparent"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                          <span className="text-blue-600 text-xs">📚</span>
                        </div>
                        <span className="text-blue-600 font-medium">
                          Explore All Conversations ({teacher.conversations.length})
                        </span>
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {teachers.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            <p>No AI teachers available</p>
          </div>
        )}
      </div>
    </div>
  );
}
