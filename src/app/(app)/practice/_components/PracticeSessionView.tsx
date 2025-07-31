'use client';

import { useState, useEffect } from 'react';
import { PracticeSession, PracticeSubmission } from '@/lib/types/practice';
import { startPracticeSession, submitPracticeAnswers, checkSessionExpiry } from '@/lib/services/practice';

interface PracticeSessionViewProps {
  session: PracticeSession;
  submission: PracticeSubmission | null;
}

export function PracticeSessionView({ session, submission }: PracticeSessionViewProps) {
  const [currentSession, setCurrentSession] = useState(session);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Timer effect
  useEffect(() => {
    if (currentSession.status === 'in_progress' && currentSession.started_at) {
      const startTime = new Date(currentSession.started_at).getTime();
      const duration = currentSession.time_limit_minutes * 60 * 1000;
      
      const timer = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTime;
        const remaining = Math.max(0, duration - elapsed);
        
        setTimeRemaining(Math.floor(remaining / 1000));
        
        if (remaining <= 0) {
          // Time's up - check if session expired
          checkSessionExpiry(currentSession.id).then((expired) => {
            if (expired) {
              setCurrentSession(prev => ({ ...prev, status: 'expired' }));
            }
          });
          clearInterval(timer);
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [currentSession.status, currentSession.started_at, currentSession.time_limit_minutes, currentSession.id]);

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await startPracticeSession(currentSession.id);
      if (result.success) {
        setCurrentSession(prev => ({ 
          ...prev, 
          status: 'in_progress', 
          started_at: new Date().toISOString() 
        }));
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to start practice session');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!submissionText.trim()) {
      setError('Please enter your answers before submitting');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await submitPracticeAnswers({
        session_id: currentSession.id,
        submission_type: 'text',
        submission_text: submissionText,
        ai_grading_enabled: true, // Enable AI grading by default
      });
      
      if (result.success) {
        setCurrentSession(prev => ({ ...prev, status: 'submitted' }));
        // Refresh the page to show submission results
        window.location.reload();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to submit answers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{currentSession.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span>Time Limit: {currentSession.time_limit_minutes} minutes</span>
              <span>Status: <StatusBadge status={currentSession.status} /></span>
              {currentSession.subject && (
                <span>Subject: {currentSession.subject.name}</span>
              )}
            </div>
          </div>
          
          {timeRemaining !== null && currentSession.status === 'in_progress' && (
            <div className="text-right">
              <div className="text-sm text-gray-600">Time Remaining</div>
              <div className="text-2xl font-mono font-bold text-red-600">
                {formatTime(timeRemaining)}
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Content based on session status */}
      {currentSession.status === 'ready' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Ready to Start</h2>
          <p className="text-gray-600 mb-6">
            Your practice session is ready. Once you start, you&apos;ll have {currentSession.time_limit_minutes} minutes to complete the exam.
          </p>
          <button
            onClick={handleStart}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Starting...' : 'Start Practice Session'}
          </button>
        </div>
      )}

      {currentSession.status === 'in_progress' && (
        <div className="space-y-6">
          {/* Questions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Practice Questions</h2>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Demo Question:</strong> This is a simplified practice session for demonstration.
              </p>
              <p className="font-medium">
                1. Explain the concept of photosynthesis and its importance in the ecosystem. (10 marks)
              </p>
            </div>
          </div>

          {/* Answer Input */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Your Answers</h2>
            <textarea
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              placeholder="Type your answers here..."
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-4">
              <button
                onClick={handleSubmit}
                disabled={loading || !submissionText.trim()}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Answers (50 credits)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {(currentSession.status === 'submitted' || currentSession.status === 'graded') && submission && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Submission Results</h2>
            
            {currentSession.status === 'submitted' && !submission.ai_grading_results && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Your submission is being graded by AI...</p>
                <p className="text-sm text-gray-500 mt-1">This usually takes 1-2 minutes</p>
              </div>
            )}

            {submission.ai_grading_results && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {submission.ai_grading_results.overall_score} / {submission.ai_grading_results.max_score}
                    </div>
                    <div className="text-sm text-gray-600">
                      {Math.round((submission.ai_grading_results.overall_score / submission.ai_grading_results.max_score) * 100)}%
                    </div>
                  </div>
                </div>

                {submission.ai_grading_results.feedback && (
                  <div>
                    <h3 className="font-semibold mb-2">Overall Feedback</h3>
                    <p className="text-gray-700">{submission.ai_grading_results.feedback}</p>
                  </div>
                )}

                {submission.ai_grading_results.questions.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Question-by-Question Breakdown</h3>
                    <div className="space-y-3">
                      {submission.ai_grading_results.questions.map((q, index) => (
                        <div key={index} className="border border-gray-200 rounded p-3">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium">Question {q.question_number}</span>
                            <span className="text-sm">
                              {q.marks_awarded} / {q.marks_possible} marks
                            </span>
                          </div>
                          {q.feedback && (
                            <p className="text-sm text-gray-600">{q.feedback}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {currentSession.status === 'expired' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Session Expired</h2>
          <p className="text-red-700">
            This practice session has expired. The time limit was reached before submission.
          </p>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    created: 'bg-gray-100 text-gray-800',
    ready: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    submitted: 'bg-orange-100 text-orange-800',
    graded: 'bg-green-100 text-green-800',
    expired: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colors[status as keyof typeof colors] || colors.created}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
