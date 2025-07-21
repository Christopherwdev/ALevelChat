import { createClient } from '@/utils/supabase/server';
import ProfilePage from './profile-page';

export default async function ProfilePageWrapper() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      *,
      school:schools(id, name, country, city)
    `)
    .eq('id', user?.id)
    .single();

  return <ProfilePage profile={profile} />;
}
