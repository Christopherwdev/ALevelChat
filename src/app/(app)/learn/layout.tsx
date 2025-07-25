import React from 'react';
import BreadCrumbs from './_components/BreadCrumbs';

const ChineseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="pt-20">
      <BreadCrumbs />
      {children}
    </div>
  );
};

export default ChineseLayout;
