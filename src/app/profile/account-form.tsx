'use client';
import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';
import { updateProfile } from './actions';

export default function AccountForm({ user, profile, schools }: { user: User | null, profile: any, schools: any[] }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [school, setSchool] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>('en-us');
  const [isSocialEnabled, setIsSocialEnabled] = useState<boolean>(true);

  useEffect(() => {
    if (profile) {
      setFullname(profile.full_name);
      setUsername(profile.username);
      setSchool(profile.school_name);
      if (profile.settings) {
        setLanguage(profile.settings.language || 'en-us');
        setIsSocialEnabled(profile.settings.is_social_enabled === true);
      }
    }
    setLoading(false);
  }, [profile]);

  return (
    <form action={updateProfile} className="space-y-6">
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
          Full Name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          value={fullname || ''}
          onChange={(e) => setFullname(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
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
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="is_social_enabled" className="ml-2 block text-sm text-gray-900">
          Enable Social Features
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>

        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign Out
          </button>
        </form>
      </div>
    </form>
  );
}