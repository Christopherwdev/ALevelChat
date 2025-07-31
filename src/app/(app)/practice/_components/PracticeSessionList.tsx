import { PracticeSession } from '@/lib/types/practice';
import Link from 'next/link';

interface PracticeSessionListProps {
  sessions: PracticeSession[];
}

export function PracticeSessionList({ sessions }: PracticeSessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No practice sessions yet.</p>
        <p className="text-sm mt-1">Create your first practice session to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <Link
          key={session.id}
          href={`/practice/${session.id}`}
          className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{session.title}</h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span>
                  Status: <StatusBadge status={session.status} />
                </span>
                <span>{session.time_limit_minutes} mins</span>
                {session.subject && (
                  <span>{session.subject.name}</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Created {new Date(session.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Link>
      ))}
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
