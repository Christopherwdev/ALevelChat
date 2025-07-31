'use client';

import { useState } from 'react';
import { initializePracticeSession } from '../actions';
import { CreatePracticeSessionRequest } from '@/lib/types/practice';
import { useRouter } from 'next/navigation';

export function CreatePracticeForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    const request: CreatePracticeSessionRequest = {
      title: formData.get('title') as string,
      time_limit_minutes: parseInt(formData.get('timeLimit') as string),
      questions_type: 'json', // Simplified for now
      questions_json: [
        {
          id: '1',
          question_number: '1',
          question: 'Sample question for demonstration purposes',
          points: 10,
        }
      ],
      marking_scheme_type: 'none',
    };

    try {
      const result = await initializePracticeSession(request);
      
      if (result.success) {
        router.push(`/practice/${result.session.id}`);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Practice Session Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Math Practice Exam"
        />
      </div>

      <div>
        <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700 mb-1">
          Time Limit (minutes)
        </label>
        <input
          type="number"
          id="timeLimit"
          name="timeLimit"
          required
          min="1"
          max="300"
          defaultValue="60"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> This is a simplified form for demonstration. 
          In the full implementation, you would be able to upload question files 
          and marking schemes.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating...' : 'Create Practice Session (10 credits)'}
      </button>
    </form>
  );
}
