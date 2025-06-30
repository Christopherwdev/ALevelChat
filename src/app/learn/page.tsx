import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function LearnPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Learn</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 text-lg">
          This section will contain personalized learning paths, study materials, and interactive lessons.
          Coming soon!
        </p>
      </div>
    </div>
  );
}
