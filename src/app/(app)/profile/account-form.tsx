'use client';

import { useEffect, useState, useTransition, useRef } from 'react';
import { type User } from '@supabase/supabase-js';
import Image from 'next/image';
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
  const [bio, setBio] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [school, setSchool] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>('en-us');
  const [isSocialEnabled, setIsSocialEnabled] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setFullname(profile.full_name || null);
      setUsername(profile.username || null);
      setBio(profile.bio || null);
      setProfilePicture(profile.profile_picture_url || null);
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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Profile picture must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('File must be an image');
      return;
    }
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
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-32 mb-4">
            {profilePicture ? (
              <Image
                src={profilePicture}
                alt="Profile"
                width={128}
                height={128}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <p className="text-sm text-gray-500">
            Maximum file size: 5MB. Supported formats: JPEG, PNG
          </p>
        </div>

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
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              @
            </span>
            <input
              id="username"
              name="username"
              type="text"
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isPending}
              className="flex-1 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed sm:text-sm"
              placeholder="johndoe"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            URL-friendly username. Only letters, numbers, and underscores allowed.
          </p>
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={bio || ''}
            onChange={(e) => setBio(e.target.value)}
            disabled={isPending}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            maxLength={500}
            placeholder="Tell us about yourself..."
          />
          <p className="mt-1 text-sm text-gray-500">
            {bio ? `${500 - bio.length} characters remaining` : '500 characters maximum'}
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
            list="schools"
            value={school || ''}
            onChange={(e) => setSchool(e.target.value)}
            disabled={isPending}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <datalist id="schools">
            {schools.map((school) => (
              <option key={school.id} value={school.name} />
            ))}
          </datalist>
        </div>

        <div className="flex items-center justify-between">
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
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="en-us">English (US)</option>
              <option value="en-gb">English (UK)</option>
              <option value="es-es">Español</option>
            </select>
          </div>

          <div className="flex items-center">
            <label htmlFor="isSocialEnabled" className="text-sm font-medium text-gray-700 mr-3">
              Enable Social Features
            </label>
            <input
              type="checkbox"
              id="isSocialEnabled"
              name="is_social_enabled"
              checked={isSocialEnabled}
              onChange={(e) => setIsSocialEnabled(e.target.checked)}
              disabled={isPending}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
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