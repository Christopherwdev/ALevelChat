'use client';

import { useEffect, useState, useTransition } from 'react';
import { type User } from '@supabase/supabase-js';
import { updateProfile } from './actions';
import { signOut } from '@/app/auth/actions';
import { type UserProfile, type School } from '@/lib/types/auth';

export default function AccountForm({ user, profile, schools }: { 
  user: User | null; 
  profile: UserProfile | null; 
  schools: School[];
}) {
  const [isPending, startTransition] = useTransition();
  const [isSigningOut, startSignOutTransition] = useTransition();
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [school, setSchool] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>('en-us');
  const [isSocialEnabled, setIsSocialEnabled] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    if (profile) {
      setFullname(profile.full_name || null);
      setUsername(profile.username || null);
      setSchool(profile.school_name || profile.school?.name || null);
      if (profile.settings) {
        setLanguage(profile.settings.language || 'en-us');
        setIsSocialEnabled(profile.settings.is_social_enabled === true);
      }
    }
  }, [profile]);

  async function handleSubmit(formData: FormData) {
    setError('');
    setSuccess('');
    
    startTransition(async () => {
      const result = await updateProfile(formData);
      
      if (result.success) {
        setSuccess(result.message || 'Profile updated successfully!');
      } else {
        setError(result.message || 'An error occurred');
      }
    });
  }

  async function handleSignOut() {
    startSignOutTransition(async () => {
      await signOut();
    });
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-600 text-sm">{success}</p>
        </div>
      )}
    
      <form action={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="text"
            value={user?.email}
            disabled
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-500"
          />
        </div>
        
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name *
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            value={fullname || ''}
            onChange={(e) => setFullname(e.target.value)}
            disabled={isPending}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>

      <div className="flex mt-8 items-center">
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed"
        >
          {isSigningOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </div>
  );
}