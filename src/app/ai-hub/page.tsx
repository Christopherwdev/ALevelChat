import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function AIHubPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">AI Hub</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 text-lg">
          This section will contain AI-powered tools like the paper grader and speaking practice.
          Coming soon!
        </p>
      </div>
    </div>
  );
}
