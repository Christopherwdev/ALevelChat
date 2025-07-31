import { notFound } from 'next/navigation';
import { getPracticeSession, getPracticeSubmission } from '@/lib/services/practice';
import { PracticeSessionView } from '../_components/PracticeSessionView';

interface PracticeSessionPageProps {
  params: {
    sessionId: string;
  };
}

export default async function PracticeSessionPage({ params }: PracticeSessionPageProps) {
  const { sessionId } = params;
  
  const session = await getPracticeSession(sessionId);
  
  if (!session) {
    notFound();
  }

  // Try to get submission if it exists
  const submission = await getPracticeSubmission(sessionId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <PracticeSessionView session={session} submission={submission} />
      </div>
    </div>
  );
}
