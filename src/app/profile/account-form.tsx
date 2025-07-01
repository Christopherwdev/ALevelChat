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

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isPending}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <p className="mt-1 text-sm text-gray-500">
            Optional. Use only lowercase letters, numbers, dots, and underscores.
          </p>
        </div>

        <div>
          <label htmlFor="school" className="block text-sm font-medium text-gray-700">
            School
          </label>
          <input
            id="school"
            name="school"
            type="text"
            list="schools-list"
            value={school || ''}
            onChange={(e) => setSchool(e.target.value)}
            disabled={isPending}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <datalist id="schools-list">
            {schools?.map((s) => <option key={s.id} value={s.name} />)}
          </datalist>
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700">
            Language
          </label>
          <select
            id="language"
            name="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isPending}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="en-us">English (US)</option>
            <option value="en-gb">English (UK)</option>
            <option value="es-es">Spanish</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            id="is_social_enabled"
            name="is_social_enabled"
            type="checkbox"
            checked={isSocialEnabled}
            onChange={(e) => setIsSocialEnabled(e.target.checked)}
            disabled={isPending}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:cursor-not-allowed"
          />
          <label htmlFor="is_social_enabled" className="ml-2 block text-sm text-gray-900">
            Enable Social Features
          </label>
        </div>

        <div className="flex gap-4">
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

          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {isSigningOut ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </form>
    </div>
  );
}