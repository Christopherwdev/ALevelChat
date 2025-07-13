'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { resetPassword } from '@/app/auth/actions';

export default function ResetPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const router = useRouter();

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    
    const formDataObj = new FormData();
    formDataObj.append('password', formData.password);
    formDataObj.append('confirmPassword', formData.confirmPassword);
    
    startTransition(async () => {
      const result = await resetPassword(formDataObj);
      
      if (result.success) {
        // Clear form only on success
        setFormData({ password: '', confirmPassword: '' });
        router.push(result.redirectTo || '/learn');
      } else {
        setError(result.message || 'An error occurred');
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
      }
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">Set New Password</h2>
          
          <p className="text-gray-600 text-center mb-6 text-sm">
            Enter your new password below.
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                disabled={isPending}
                onFocus={() => setShowPasswordRequirements(true)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
              )}
              
              {showPasswordRequirements && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm font-medium text-blue-800 mb-1">Password requirements:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• One lowercase letter (a-z)</li>
                    <li>• One uppercase letter (A-Z)</li>
                    <li>• One number (0-9)</li>
                    <li>• One special character (!@#$%^&*)</li>
                  </ul>
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isPending}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating password...
                </div>
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
