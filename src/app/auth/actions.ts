'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { 
  loginSchema, 
  signupSchema, 
  passwordResetRequestSchema,
  passwordResetSchema
} from '@/lib/validations/auth';
import { mapSupabaseError, getErrorMessage, getFieldErrors } from '@/lib/utils/auth-errors';
import { type AuthResult } from '@/lib/types/auth';
import { ZodError } from 'zod';

// Check if email already exists
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('check_email_exists', { 
      email_to_check: email.toLowerCase() 
    });
    
    if (error) {
      console.error('Error checking email existence:', error);
      return false;
    }
    
    return data === true;
  } catch (error) {
    console.error('Error checking email existence:', error);
    return false;
  }
}

export async function login(formData: FormData): Promise<AuthResult> {
  try {
    const supabase = await createClient();

    // Validate input
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const validatedData = loginSchema.parse(rawData);

    // Attempt login
    const { error } = await supabase.auth.signInWithPassword(validatedData);

    if (error) {
      const authError = mapSupabaseError(error);
      return {
        success: false,
        error: authError,
        message: getErrorMessage(authError),
      };
    }

    revalidatePath('/', 'layout');
    
    // Get redirect URL from formData or default to /learn
    const redirectTo = (formData.get('redirectTo') as string) || '/learn';
    
    return {
      success: true,
      redirectTo,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Please check your input and try again.',
        fieldErrors: getFieldErrors(error),
      };
    }
    
    return {
      success: false,
      error: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}

export async function signup(formData: FormData, redirectTo: string = '/profile'): Promise<AuthResult> {
  try {
    const supabase = await createClient();
    
    // Validate input
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    const validatedData = signupSchema.parse(rawData);

    // Check if email already exists
    const emailExists = await checkEmailExists(validatedData.email);
    if (emailExists) {
      return {
        success: false,
        error: 'EMAIL_ALREADY_EXISTS',
        message: 'An account with this email already exists. Please sign in instead.',
        fieldErrors: { email: 'An account with this email already exists.' },
      };
    }

    // Attempt signup
    const { error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        emailRedirectTo: redirectTo || '/profile',
      },
    });

    if (error) {
      const authError = mapSupabaseError(error);
      return {
        success: false,
        error: authError,
        message: getErrorMessage(authError),
      };
    }

    return {
      success: true,
      message: 'Please check your email to confirm your account.',
      redirectTo: '/signup/success',
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: 'WEAK_PASSWORD',
        message: 'Please check your input and try again.',
        fieldErrors: getFieldErrors(error),
      };
    }
    
    return {
      success: false,
      error: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}

export async function requestPasswordReset(formData: FormData, redirectTo: string = '/auth/reset-password'): Promise<AuthResult> {
  try {
    const supabase = await createClient();

    // Validate input
    const rawData = {
      email: formData.get('email') as string,
    };

    const validatedData = passwordResetRequestSchema.parse(rawData);

    // Request password reset
    const { error } = await supabase.auth.resetPasswordForEmail(validatedData.email, {
      redirectTo: redirectTo || '/auth/reset-password',
    });

    if (error) {
      const authError = mapSupabaseError(error);
      return {
        success: false,
        error: authError,
        message: getErrorMessage(authError),
      };
    }

    return {
      success: true,
      message: 'Password reset instructions have been sent to your email.',
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Please enter a valid email address.',
        fieldErrors: getFieldErrors(error),
      };
    }
    
    return {
      success: false,
      error: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}

export async function resetPassword(formData: FormData): Promise<AuthResult> {
  try {
    const supabase = await createClient();

    // Validate input
    const rawData = {
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    const validatedData = passwordResetSchema.parse(rawData);

    // Update password
    const { error } = await supabase.auth.updateUser({
      password: validatedData.password,
    });

    if (error) {
      const authError = mapSupabaseError(error);
      return {
        success: false,
        error: authError,
        message: getErrorMessage(authError),
      };
    }

    revalidatePath('/', 'layout');
    
    return {
      success: true,
      message: 'Your password has been updated successfully.',
      redirectTo: '/learn',
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: 'WEAK_PASSWORD',
        message: 'Please check your input and try again.',
        fieldErrors: getFieldErrors(error),
      };
    }
    
    return {
      success: false,
      error: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}
