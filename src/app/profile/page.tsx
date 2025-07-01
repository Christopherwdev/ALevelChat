import AccountForm from './account-form';
import { createClient } from '@/utils/supabase/server';

export default async function Account() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      *, 
      school:schools(name)
    `)
    .eq('id', user?.id)
    .single();

  const { data: schools } = await supabase
    .from('schools')
    .select('id, name')
    .order('name', { ascending: true });

  // Mock stats data
  const stats = {
    hoursStudied: 24,
    tasksCompleted: 15,
    averageScore: 85,
    strengths: ['Mathematics', 'Physics'],
    areasToImprove: ['Chemistry', 'Biology'],
  };

  if (!user) {
    return <div>Not logged in</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Study Statistics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Hours Studied</span>
              <span className="font-semibold">{stats.hoursStudied}h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tasks Completed</span>
              <span className="font-semibold">{stats.tasksCompleted}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Score</span>
              <span className="font-semibold">{stats.averageScore}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Performance Analysis</h2>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Strengths</h3>
            <div className="flex gap-2 mb-4">
              {stats.strengths.map((subject) => (
                <span
                  key={subject}
                  className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {subject}
                </span>
              ))}
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Areas to Improve</h3>
            <div className="flex gap-2">
              {stats.areasToImprove.map((subject) => (
                <span
                  key={subject}
                  className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-6">Account Information</h2>
        <AccountForm user={user} profile={profile} schools={schools || []} />
      </div>
    </div>
  );
}