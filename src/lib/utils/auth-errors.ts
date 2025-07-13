import { AuthError } from '@/lib/types/auth';
import { ZodError, ZodIssue } from 'zod';

// Define error interface
interface SupabaseError {
  message?: string;
}

// Map Supabase error messages to our custom error types
export function mapSupabaseError(error: SupabaseError): AuthError {
  if (!error?.message) return 'UNKNOWN_ERROR';
  
  const message = error.message.toLowerCase();
  
  if (message.includes('invalid login credentials') || message.includes('email not confirmed')) {
    return 'INVALID_CREDENTIALS';
  }
  
  if (message.includes('user not found')) {
    return 'USER_NOT_FOUND';
  }
  
  if (message.includes('user already registered') || message.includes('email already exists')) {
    return 'EMAIL_ALREADY_EXISTS';
  }
  
  if (message.includes('password should be at least')) {
    return 'WEAK_PASSWORD';
  }
  
  if (message.includes('email not confirmed')) {
    return 'EMAIL_NOT_CONFIRMED';
  }
  
  if (message.includes('too many requests') || message.includes('rate limit')) {
    return 'TOO_MANY_ATTEMPTS';
  }
  
  if (message.includes('invalid token') || message.includes('token')) {
    return 'INVALID_TOKEN';
  }
  
  if (message.includes('expired')) {
    return 'TOKEN_EXPIRED';
  }
  
  if (message.includes('network') || message.includes('fetch')) {
    return 'NETWORK_ERROR';
  }
  
  return 'UNKNOWN_ERROR';
}

// Get user-friendly error messages
export function getErrorMessage(error: AuthError): string {
  const errorMessages: Record<AuthError, string> = {
    INVALID_CREDENTIALS: 'Invalid email or password. Please check your credentials and try again.',
    USER_NOT_FOUND: 'No account found with this email address.',
    EMAIL_ALREADY_EXISTS: 'An account with this email already exists. Please sign in instead.',
    WEAK_PASSWORD: 'Password is too weak. Please choose a stronger password.',
    EMAIL_NOT_CONFIRMED: 'Please check your email and confirm your account before signing in.',
    TOO_MANY_ATTEMPTS: 'Too many failed attempts. Please wait a few minutes before trying again.',
    INVALID_TOKEN: 'Invalid or malformed verification token.',
    TOKEN_EXPIRED: 'Verification token has expired. Please request a new one.',
    NETWORK_ERROR: 'Network error. Please check your connection and try again.',
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try again later.',
  };
  
  return errorMessages[error];
}

// Validation error helpers
export function getFieldErrors(error: ZodError): Record<string, string> {
  return error.issues.reduce((acc: Record<string, string>, issue: ZodIssue) => {
    const path = issue.path.join('.');
    acc[path] = issue.message;
    return acc;
  }, {});
}
