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

    // Handle profile picture upload first
    let profilePictureUrl = null;
    const profilePicture = formData.get('profilePicture') as File;
    if (profilePicture && profilePicture.size > 0) {
      // Validate file size (5MB)
      if (profilePicture.size > 5 * 1024 * 1024) {
        return {
          success: false,
          error: 'INVALID_FILE',
          message: 'Profile picture must be less than 5MB',
        };
      }

      // Validate file type
      if (!profilePicture.type.startsWith('image/')) {
        return {
          success: false,
          error: 'INVALID_FILE',
          message: 'File must be an image',
        };
      }

      // Generate a unique file name using user ID and timestamp
      const fileExt = profilePicture.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload the file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, profilePicture, {
          upsert: true,
          contentType: profilePicture.type,
        });

      if (uploadError) {
        console.error('Error uploading profile picture:', uploadError);
        return {
          success: false,
          error: 'UPLOAD_ERROR',
          message: 'Could not upload profile picture. Please try again.',
        };
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      profilePictureUrl = publicUrl;

      // Delete the old profile picture if it exists
      const { data: listData, error: listError } = await supabase.storage
        .from('profile-pictures')
        .list(`${user.id}`)
      if (listError) {
        console.error('Error listing profile pictures:', listError);
        return {
          success: false,
          error: 'UPLOAD_ERROR',
          message: 'Could not remove old profile pictures. Please try again.',
        };
      }

      const filesToRemove = listData === null ? [] : listData.map((x: { name: string }) => `${user.id}/${x.name}`)
        .filter((name: string) => name !== fileName);
      
      if (filesToRemove.length > 0) {
        const { error: removalError } = await supabase.storage
          .from('profile-pictures')
          .remove(filesToRemove);
        if (removalError) {
          console.error('Error removing old profile picture:', removalError);
          return {
            success: false,
            error: 'UPLOAD_ERROR',
            message: 'Could not remove old profile picture. Please try again.',
          };
        }
      }
    }

    // Validate input
    const rawData = {
      fullName: formData.get('fullName') as string,
      username: formData.get('username') as string,
      bio: formData.get('bio') as string,
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
      bio: validatedData.bio || null,
      profile_picture_url: profilePictureUrl || undefined, // Only update if new picture was uploaded
      school_id: schoolId,
      settings: {
        is_social_enabled: validatedData.isSocialEnabled,
        language: validatedData.language,
      },
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('profiles').update(profileData).eq('id', user.id);

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
