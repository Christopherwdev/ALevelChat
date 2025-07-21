'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EmptyState } from './components/empty-state';

export default function AiTeacherPage() {
  const router = useRouter();

  // Redirect to chat/new if no specific route is accessed
  useEffect(() => {
    router.push('/ai-teacher/chat/new');
  }, [router]);

  return (
    <EmptyState 
      onTeacherSelect={() => router.push('/ai-teacher/chat/new')} 
      teachers={[]} 
    />
  );
}
