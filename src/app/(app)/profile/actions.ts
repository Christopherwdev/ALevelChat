'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { profileUpdateSchema } from '@/lib/validations/auth';
import { type AuthResult } from '@/lib/types/auth';

export async function updateProfile(formData: FormData): Promise<AuthResult> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'You must be logged in to update your profile.',
        redirectTo: '/login',
      };
    }

    // Validate input
    const rawData = {
      fullName: formData.get('fullName') as string,
      username: formData.get('username') as string,
      school: formData.get('school') as string,
      language: formData.get('language') as string,
      isSocialEnabled: formData.get('is_social_enabled') === 'on',
    };

    const validatedData = profileUpdateSchema.parse(rawData);

    // Handle school lookup
    let schoolId = null;
    if (validatedData.school) {
      const { data: school } = await supabase
        .from('schools')
        .select('id')
        .eq('name', validatedData.school)
        .single();

      if (school) {
        schoolId = school.id;
      } else {
        // Create new school if it doesn't exist
        const { data: newSchool } = await supabase
          .from('schools')
          .insert({ name: validatedData.school })
          .select('id')
          .single();
        
        if (newSchool) {
          schoolId = newSchool.id;
        }
      }
    }

    // Check if username is already taken (if provided and different from current)
    if (validatedData.username) {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', validatedData.username)
        .neq('id', user.id)
        .single();

      if (existingProfile) {
        return {
          success: false,
          error: 'EMAIL_ALREADY_EXISTS',
          message: 'This username is already taken. Please choose a different one.',
        };
      }
    }

    const profileData = {
      id: user.id,
      full_name: validatedData.fullName,
      username: validatedData.username || null,
      school_id: schoolId,
      settings: {
        is_social_enabled: validatedData.isSocialEnabled,
        language: validatedData.language,
      },
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('profiles').upsert(profileData);

    if (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        error: 'UNKNOWN_ERROR',
        message: 'Could not update profile. Please try again.',
      };
    }

    revalidatePath('/profile');
    
    return {
      success: true,
      message: 'Profile updated successfully!',
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return {
        success: false,
        error: 'UNKNOWN_ERROR',
        message: 'Please check your input and try again.',
      };
    }
    
    console.error('Profile update error:', error);
    return {
      success: false,
      error: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}
