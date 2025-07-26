'use client';

import { AiTeacher } from '@/lib/types/ai';

interface EmptyStateProps {
  teachers: AiTeacher[];
  onTeacherSelect: (teacher: AiTeacher) => void;
}

export function EmptyState({ teachers, onTeacherSelect }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to AI Teachers
        </h2>
        
        <p className="text-gray-600 mb-8">
          Get personalized help from AI teachers specializing in different subjects. 
          Select a teacher from the sidebar to start your learning journey.
        </p>

        {teachers.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Available Teachers:
            </h3>
            <div className="grid gap-3">
              {teachers.slice(0, 4).map((teacher) => (
                <button
                  key={teacher.id}
                  onClick={() => onTeacherSelect(teacher)}
                  className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {teacher.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{teacher.name}</p>
                      <p className="text-sm text-gray-500">{teacher.subject.name}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {teachers.length > 4 && (
              <p className="text-sm text-gray-500 mt-4">
                And {teachers.length - 4} more teachers available in the sidebar
              </p>
            )}
          </div>
        )}

        {teachers.length === 0 && (
          <div className="text-gray-500">
            <p>No AI teachers are currently available.</p>
            <p className="text-sm mt-2">Please contact support if this issue persists.</p>
          </div>
        )}
      </div>
    </div>
  );
}
