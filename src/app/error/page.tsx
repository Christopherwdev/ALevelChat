import Link from 'next/link';
import { Suspense } from 'react';

interface ErrorPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function ErrorContent({ searchParams }: ErrorPageProps) {
  const params = await searchParams;
  const error = params?.error as string;
  const message = params?.message as string;

  // Default error messages
  let title = 'Something went wrong';
  let description = 'An unexpected error occurred. Please try again.';
  let actionText = 'Go Home';
  let actionHref = '/';

  // Customize based on error type
  if (error === 'auth') {
    title = 'Authentication Error';
    description = message || 'There was a problem with your authentication. Please sign in again.';
    actionText = 'Sign In';
    actionHref = '/login';
  } else if (error === 'access') {
    title = 'Access Denied';
    description = message || 'You don&apos;t have permission to access this resource.';
    actionText = 'Go Back';
    actionHref = '/';
  } else if (error === 'not_found') {
    title = 'Page Not Found';
    description = message || 'The page you&apos;re looking for doesn&apos;t exist.';
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600 mb-8">{description}</p>
        
        <div className="space-y-4">
          <Link
            href={actionHref}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {actionText}
          </Link>
          
          {actionHref !== '/' && (
            <div>
              <Link
                href="/"
                className="text-indigo-600 hover:text-indigo-500 text-sm"
              >
                Or go to homepage
              </Link>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>
            If this problem persists, please{' '}
            <Link href="/contact" className="text-indigo-600 hover:text-indigo-500">
              contact support
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage(props: ErrorPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    }>
      <ErrorContent {...props} />
    </Suspense>
  );
}