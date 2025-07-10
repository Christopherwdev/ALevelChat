import AccountForm from './account-form';
import { createClient } from '@/utils/supabase/server';

export default async function ProfileEditPage() {
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

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <AccountForm user={user} profile={profile} schools={schools || []} />
      </div>
    </div>
  );
}
