'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/login');
  }

  const schoolName = formData.get('school') as string;
  let schoolId = null;

  if (schoolName) {
    const { data: school } = await supabase
      .from('schools')
      .select('id')
      .eq('name', schoolName)
      .single();

    if (school) {
      schoolId = school.id;
    }
  }

  const profileData = {
    id: user.id,
    full_name: formData.get('fullName') as string,
    username: formData.get('username') as string,
    school_id: schoolId,
    settings: {
      is_social_enabled: formData.get('is_social_enabled') === 'on',
      language: formData.get('language') as string,
    },
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('profiles').upsert(profileData);

  if (error) {
    console.error('Error updating profile:', error);
    return redirect('/profile?error=Could not update profile');
  }

  revalidatePath('/profile');
  return redirect('/profile?message=Profile updated successfully');
}
