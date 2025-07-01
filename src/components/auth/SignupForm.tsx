'use client';

import { useState, useTransition, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signup, checkEmailExists } from '@/app/auth/actions';

export default function SignupForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const router = useRouter();
  const emailCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedEmailCheck = useCallback(async (email: string) => {
    if (email && email.includes('@')) {
      setIsCheckingEmail(true);
      try {
        const exists = await checkEmailExists(email);
        if (exists) {
          setFieldErrors(prev => ({
            ...prev,
            email: 'An account with this email already exists.'
          }));
        } else {
          setFieldErrors(prev => ({
            ...prev,
            email: ''
          }));
        }
      } catch (error) {
        console.error('Error checking email:', error);
      } finally {
        setIsCheckingEmail(false);
      }
    }
  }, []);

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

    // Debounced email existence check
    if (name === 'email') {
      if (emailCheckTimeoutRef.current) {
        clearTimeout(emailCheckTimeoutRef.current);
      }
      emailCheckTimeoutRef.current = setTimeout(() => {
        debouncedEmailCheck(value);
      }, 1000); // Wait 1 second after user stops typing
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    
    const formDataObj = new FormData();
    formDataObj.append('email', formData.email);
    formDataObj.append('password', formData.password);
    formDataObj.append('confirmPassword', formData.confirmPassword);
    
    startTransition(async () => {
      const result = await signup(formDataObj, '/profile');
      
      if (result.success) {
        // Clear form only on success
        setFormData({ email: '', password: '', confirmPassword: '' });
        router.push(result.redirectTo || '/signup/success');
      } else {
        setError(result.message || 'An error occurred');
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
      }
    });
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">Create an Account</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              disabled={isPending}
              className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            {isCheckingEmail && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
              </div>
            )}
          </div>
          {fieldErrors.email && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
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
            Confirm Password
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
              Creating account...
            </div>
          ) : (
            'Create Account'
          )}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
