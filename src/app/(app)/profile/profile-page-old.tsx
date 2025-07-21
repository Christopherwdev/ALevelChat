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
                    <dd className="mt-1 text-lg text-gray-900 font-semibold capitalize">Student</dd>
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

              {/* Billing Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Billing
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Payment Method</span>
                    <span className="text-sm text-gray-900">Not set</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Billing Address</span>
                    <span className="text-sm text-gray-900">Not set</span>
                  </div>
                  <Link
                    href="/billing"
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Manage Billing
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

              {/* School Section */}
              <div className="mb-8">
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
              </div>

              {/* Preferences Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Preferences
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Language</span>
                    <span className="text-sm text-gray-900">{profile?.settings?.language || 'English'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Social Features</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${profile?.settings?.is_social_enabled ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
                      {profile?.settings?.is_social_enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <Link
                    href="/profile/edit"
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Update Preferences
                    <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Security Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Security
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/auth/forgot-password"
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm text-gray-600">Change Password</span>
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href="/auth/confirm"
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm text-gray-600">Two-Factor Auth</span>
                    <span className="text-sm text-red-600 bg-red-100 px-2 py-1 rounded-full">Not set</span>
                  </Link>
                </div>
              </div>

              {/* Data & Privacy Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Data & Privacy
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/privacy"
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm text-gray-600">Privacy Policy</span>
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href="/terms"
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm text-gray-600">Terms of Service</span>
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <button className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
                    <span className="text-sm text-red-600">Delete Account</span>
                    <svg className="h-4 w-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
