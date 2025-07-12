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
    // Main container with a subtle background and padding
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-start justify-center">
      {/* Profile Card Container */}
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-2xl shadow-[#00000010] overflow-hidden transform transition-all duration-300">
        {/* Cover Image - Using the specified blue color in a gradient */}
        <div
          className="h-48 relative"
          style={{
            background: 'linear-gradient(to right, #007aff, #4a90e2)', // Gradient from #007aff to a slightly lighter blue
          }}
        >
          {/* Profile Actions - Positioned absolutely for flexibility */}
         
        </div>

        <div className="relative px-8 sm:px-10 lg:px-12 pb-10 -mt-24"> {/* Adjusted margin-top */}
          {/* Profile Picture Section */}
          <div className="mb-6 flex justify-start"> {/* Align profile picture to the left */}
            <div className="w-36 h-36 relative border-4 border-white rounded-full"> {/* Larger, more prominent profile picture */}
              {profile?.profile_picture_url ? (
                <Image
                  src={profile.profile_picture_url}
                  alt="Profile"
                  layout="fill" // Use layout="fill" for responsive images
                  objectFit="cover"
                  className="rounded-full"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                  <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="text-left mt-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {profile?.full_name || 'Anonymous User'}
            </h1>
            {profile?.username && (
              <p className="text-xl text-gray-600 font-normal">
                @{profile.username}
              </p>
            )}
            {profile?.school?.name && (
              <div className="mt-3 flex items-center text-gray-500 text-lg">
                <svg className="h-6 w-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span className="font-semibold">{profile.school.name}</span>
              </div>
            )}


<div className="w-full flex space-x-4 mt-5">
            {/* Edit Profile Button - Styled with the specified blue color */}
            <Link
              href="/profile/edit"
              className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-full text-white transition-all duration-200 ease-in-out transform"
              style={{ backgroundColor: 'black' }}
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Profile
            </Link>
            {/* Sign Out Button - Styled with the specified red color */}
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-full text-white transition-all duration-200 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#ff3b30' }}
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
          </div>

          {/* Bio Section */}
          {profile?.bio && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">About Me</h2>
              <p className="text-gray-700 leading-relaxed max-w-2xl whitespace-pre-line text-lg">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Additional Info Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Contact Information</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="flex flex-col">
                <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                <dd className="mt-1 text-lg text-gray-900 font-semibold">{profile?.email}</dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-sm font-medium text-gray-500">User Role</dt>
                <dd className="mt-1 text-lg text-gray-900 font-semibold capitalize">{profile?.role || 'Student'}</dd>
              </div>
              {/* You can add more fields here, e.g., location, website, etc. */}
              <div className="flex flex-col">
                <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                <dd className="mt-1 text-lg text-gray-900 font-semibold">January 2023</dd> {/* Placeholder data */}
              </div>
              <div className="flex flex-col">
                <dt className="text-sm font-medium text-gray-500">Last Active</dt>
                <dd className="mt-1 text-lg text-gray-900 font-semibold">Today</dd> {/* Placeholder data */}
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
