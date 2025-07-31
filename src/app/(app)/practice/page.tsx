import { getUserPracticeSessions } from '@/lib/services/practice';
import { CreatePracticeForm } from './_components/CreatePracticeForm';
import { PracticeSessionList } from './_components/PracticeSessionList';

export default async function PracticePage() {
  const sessions = await getUserPracticeSessions(10, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Practice
          </h1>
          <p className="text-gray-600">
            Create and take practice tests or exams with AI-powered grading and feedback.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Create new practice session */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Create New Practice Session</h2>
            <CreatePracticeForm />
          </div>

          {/* Recent practice sessions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Sessions</h2>
            <PracticeSessionList sessions={sessions} />
          </div>
        </div>
      </div>
    </div>
  );
}
