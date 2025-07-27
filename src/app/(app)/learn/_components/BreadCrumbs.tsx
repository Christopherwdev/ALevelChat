"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const BreadCrumbs = () => {
  const currentPath = usePathname();
  const [pathParts, setPathParts] = useState<string[]>([]);
  const [pathPartNames, setPathPartNames] = useState<string[]>([]);
  
  useEffect(() => {
    const rawPathParts = currentPath.split('/').filter(part => part); // Filter out empty parts
    setPathParts(rawPathParts);
    setPathPartNames(rawPathParts.map(part => part.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')));
  }, [currentPath]);

  if (pathParts.length <= 1) {
    return null; // No breadcrumbs to display if there's only the root path
  }
  
  return (
    <div className="rounded-2xl flex items-start justify-start w-full pl-14">
      <nav className="inline-block text-gray-500 text-sm mb-6 font-light border-[1px] bg-[#00000010] border-[#00000020] px-3 py-1 rounded-lg" aria-label="Breadcrumbs">
        {pathPartNames.slice(0, -1).map((name, index) => (
          <React.Fragment key={index}>
            <Link href={`/${pathParts.slice(0, index + 1).join('/')}`} className="transition duration-300 hover:underline hover:text-[#ff3b30]">
              {name}
            </Link>
            <span className="mx-2">/</span>
          </React.Fragment>
        ))}
        <span>
          {pathPartNames[pathPartNames.length - 1]}
        </span>
      </nav>
    </div>
  );
};

export default BreadCrumbs;
