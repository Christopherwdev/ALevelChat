import { Suspense } from 'react';
import { fetchTeachersWithConversations } from './actions';
import ClientLayout from './client-layout';

export const dynamic = 'force-dynamic';

export default async function AiTeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const teachers = await fetchTeachersWithConversations();

  return (
    <Suspense fallback={
      <div className="flex h-screen">
        <div className="flex items-center justify-center w-full">
          <div className="text-gray-500">Loading AI teachers...</div>
        </div>
      </div>
    }>
      <ClientLayout teachers={teachers}>
        {children}
      </ClientLayout>
    </Suspense>
  );
}
