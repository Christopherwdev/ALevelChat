'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTransition } from 'react';
import { signOut } from '@/app/auth/actions';
import { type UserProfile } from '@/lib/types/auth';

export default function ProfilePage({ 
  profile 
}: { 
  profile: UserProfile | null;
}) {
  const [isSigningOut, startSignOutTransition] = useTransition();

  async function handleSignOut() {
    startSignOutTransition(async () => {
      await signOut();
    });
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Cover Image - You can add this feature later */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        
        <div className="relative px-4 sm:px-6 lg:px-8 pb-8">
          {/* Profile Picture */}
          <div className="relative -mt-16 mb-4">
            <div className="w-32 h-32 mx-auto relative">
              {profile?.profile_picture_url ? (
                <Image
                  src={profile.profile_picture_url}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Profile Actions */}
          <div className="absolute top-4 right-4 flex space-x-3">
            <Link 
              href="/profile/edit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Profile
            </Link>
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed"
            >
              {isSigningOut ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing out...
                </div>
              ) : (
                <>
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </>
              )}
            </button>
          </div>

          {/* Profile Info */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {profile?.full_name || 'Anonymous User'}
            </h1>
            {profile?.username && (
              <p className="text-lg text-gray-500 mt-1">
                @{profile.username}
              </p>
            )}
            {profile?.school?.name && (
              <div className="mt-2 flex items-center justify-center text-gray-500">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                {profile.school.name}
              </div>
            )}
          </div>

          {/* Bio */}
          {profile?.bio && (
            <div className="mt-6 text-center">
              <p className="text-gray-600 max-w-2xl mx-auto whitespace-pre-line">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Additional Info */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile?.email}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{profile?.role || 'Student'}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
