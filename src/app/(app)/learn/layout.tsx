import React from 'react';
import RevisionSidebar from './_components/RevisionSidebar';

const LearnLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-white">
      <RevisionSidebar />
      <div className="w-full pl-0 md:pl-18">
        {children}
      </div>
    </div>
  );
};

export default LearnLayout;
