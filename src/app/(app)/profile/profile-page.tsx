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
    <div className="min-h-screen bg-gray-50 py-12 px-4 pt-20 sm:px-6 lg:px-8 ">
      <div className="max-w-7xl mx-auto ">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
          {/* Left Column - Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-2xl shadow-[#00000010] overflow-hidden transform transition-all duration-300 border-2 border-[#00000020]">
              {/* Cover Image - Using the specified blue color in a gradient */}
              <div
                className="h-25 relative"
                style={{
                  background: 'linear-gradient(to right, #007aff, #4a90e2)', // Gradient from #007aff to a slightly lighter blue
                }}
              >
                {/* Profile Actions - Positioned absolutely for flexibility */}
               
              </div>

              <div className="relative px-8 sm:px-10 lg:px-12 pb-10 -mt-20"> {/* Adjusted margin-top */}
                {/* Profile Picture Section */}
                <div className="mb-6 flex justify-start"> {/* Align profile picture to the left */}
                  <div className="w-30 h-30 relative border-4 border-white rounded-full"> {/* Larger, more prominent profile picture */}
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
                  {/* School Info */}
                  {profile?.school && (
                    <div className="mt-3 flex flex-col text-gray-500 text-lg">
                      <div className="flex items-center">
                        <svg className="h-6 w-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        <span className="font-semibold">{profile.school.name}</span>
                      </div>
                      {hasField(profile.school, 'country') && typeof profile.school.country === 'string' && profile.school.country.length > 0 && (
                        <span className="ml-8 text-sm">Country: {profile.school.country}</span>
                      )}
                      {hasField(profile.school, 'city') && typeof profile.school.city === 'string' && profile.school.city.length > 0 && (
                        <span className="ml-8 text-sm">City: {profile.school.city}</span>
                      )}
                    </div>
                  )}
                  {/* Add more fields here if needed */}
              
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
                      <dd className="mt-1 text-lg text-gray-900 font-semibold capitalize">{(profile as any)?.role || 'Student'}</dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                      <dd className="mt-1 text-lg text-gray-900 font-semibold">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                      <dd className="mt-1 text-lg text-gray-900 font-semibold">{profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</dd>
                    </div>
                  </dl>
                  {/* Edit Profile and Sign Out Buttons */}
                  <div className="w-full flex space-x-4 mt-8">
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
              </div>
            </div>
          </div>

          {/* Right Column - Settings */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-2xl shadow-[#00000010] p-6 border-2 border-[#00000020]">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
              
              {/* Subscription Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Subscription
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-900">Current Plan</span>
                    <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Free</span>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">Basic features included</p>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Upgrade Plan
                    <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Account Type Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Account Type
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Role</span>
                    <span className="text-sm text-gray-900 capitalize">Student</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Account Status</span>
                    <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Email Verified</span>
                    <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">Yes</span>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-gray-500 text-base">
                    <div>User ID: <span className="text-gray-700">{profile?.id}</span></div>
                    <div>Email: <span className="text-gray-700">{profile?.email}</span></div>
                    <div>Role: <span className="text-gray-700">{(profile as any)?.role || 'Student'}</span></div>
                    <div>Joined: <span className="text-gray-700">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}</span></div>
                    <div>Last Updated: <span className="text-gray-700">{profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'N/A'}</span></div>
                    {profile?.settings && (
                      <div className="mt-2">
                        <div>Language: <span className="text-gray-700">{profile.settings.language}</span></div>
                        <div>Social Features: <span className={`text-sm px-2 py-1 rounded-full ${profile.settings.is_social_enabled ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>{profile.settings.is_social_enabled ? 'Enabled' : 'Disabled'}</span></div>
                      </div>
                    )}
                  </div>
              {/* School Section */}
              {/* <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  School
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Current School</span>
                    <span className="text-sm text-gray-900">{profile?.school?.name || 'Not set'}</span>
                  </div>
                  <Link
                    href="/profile/edit"
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Update School
                    <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function hasField<T extends object, K extends string>(obj: T, key: K): obj is T & Record<K, unknown> {
  return obj && typeof obj === 'object' && key in obj;
}
