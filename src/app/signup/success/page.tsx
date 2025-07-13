import Link from 'next/link';

export default function SignupSuccessPage() {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8 text-center">
      <div className="mb-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h2>
      
      <p className="text-gray-600 mb-6">
        We&apos;ve sent you a confirmation email. Please click the link in the email to verify your account and complete your registration.
      </p>
      
      <p className="text-sm text-gray-500 mb-6">
        Don&apos;t see the email? Check your spam folder or{' '}
        <Link href="/signup" className="text-indigo-600 hover:text-indigo-500">
          try signing up again
        </Link>
        .
      </p>
      
      <Link
        href="/login"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Back to Sign In
      </Link>
    </div>
  );
}
