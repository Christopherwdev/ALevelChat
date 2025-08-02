"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookText, FileText, Lightbulb, Pen, Languages, ChevronLeft, ChevronRight } from 'lucide-react';

const RevisionSidebar = () => {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  
  // Extract information from pathname
  // Expected format: /learn/edexcel-igcse/chinese/...
  const pathParts = pathname.split('/').filter(part => part);
  
  if (pathParts.length < 3) {
    return null; // Not a valid subject page
  }
  
  const examBoardLevel = pathParts[1]; // e.g., "edexcel-igcse"
  const subject = pathParts[2]; // e.g., "chinese"
  
  // Only show sidebar for IGCSE subjects that have revision tools
  if (!examBoardLevel.includes('igcse')) {
    return null;
  }
  
  // Parse exam board and level
  const [examBoard, examLevel] = examBoardLevel.split('-');
  
  // Define tools based on subject
  const isChinese = subject.toLowerCase() === 'chinese';
  
  const tools = [
    {
      id: 'home',
      name: 'Home Page',
      href: `/learn/${examBoardLevel}/${subject}`,
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 'revision-notes',
      name: 'Revision Notes',
      href: `/learn/${examBoardLevel}/${subject}/revision-notes`,
      icon: <BookText className="w-5 h-5" />
    },
    {
      id: 'past-papers',
      name: 'Past Papers',
      href: `/learn/${examBoardLevel}/${subject}/past-papers`,
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'ai-teacher',
      name: 'AI Teacher',
      href: `/learn/${examBoardLevel}/${subject}/ai-teacher`,
      icon: <Lightbulb className="w-5 h-5" />
    }
  ];

  // Add Mock Tests only for Chinese
  if (isChinese) {
    tools.push({
      id: 'mock-test',
      name: 'Mock Tests',
      href: `/learn/${examBoardLevel}/${subject}/mock-test`,
      icon: <Pen className="w-5 h-5" />
    });
  }

  const isActive = (href: string) => {
    if (href === `/learn/${examBoardLevel}/${subject}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Format display names
  const formatExamBoard = (board: string) => {
    return board.charAt(0).toUpperCase() + board.slice(1);
  };

  const formatExamLevel = (level: string) => {
    return level.toUpperCase();
  };

  const formatSubject = (subj: string) => {
    return subj.charAt(0).toUpperCase() + subj.slice(1);
  };

  return (
    <div 
      className={`
        fixed top-0 left-0 h-auto  mt-20 z-10000
        bg-white/80 backdrop-blur-[20px] border-r border-black/10
        shadow-[0_0_20px_rgba(0,0,0,0.1)] rounded-r-[20px]
        overflow-y-auto overflow-x-hidden
        transition-all duration-300 ease-in-out
        ${isHovered ? 'w-64 shadow-[0_0_30px_rgba(0,0,0,0.15)]' : 'w-18'}
        md:block hidden
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-3 h-full w-[400px] overflow-visible">
        {/* Subject Logo */}
        <div className={`flex justify-start overflow-hidden gap-3 transition-all duration-300 ${!isHovered ? 'justify-center' : ''}`}>
          <div className="
            flex items-center justify-center w-12 h-12 rounded-full
            bg-gradient-to-br from-[#ff3b30] to-[#ff6b6b]
            border-2 border-white/20 shadow-[0_4px_12px_rgba(255,59,48,0.3)]
            transition-all duration-200 hover:scale-105 hover:shadow-[0_6px_16px_rgba(255,59,48,0.4)]
          ">
            <Languages size={24} className="text-white" />
          </div>

          <div className={`sidebar-header transition-all duration-300 overflow-hidden w-auto ${!isHovered ? 'block opacity-0' : 'block opacity-100'}`}>
            <h2 className="text-lg font-semibold text-gray-900 mb-[-2px]">
              {formatExamBoard(examBoard)} {formatExamLevel(examLevel)}
            </h2>
            <h3 className="text-2xl font-bold text-[#ff3b30]">
              {formatSubject(subject)}
            </h3>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2.5 pt-4">
          {tools.map((tool) => {
            const active = isActive(tool.href);
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className={`
                  flex items-center gap-3 px-[14px] py-[10px] rounded-xl font-medium
                  transition-all duration-200 ease-in-out no-underline relative overflow-hidden
                  ${active 
                    ? 'bg-[#ff3b30] text-white' 
                    : 'text-gray-500 hover:bg-[rgba(255,59,48,0.1)] hover:text-[#ff3b30]'
                  }
                  ${!isHovered ? ' px-2 w-12' : 'px-2 w-58'}
                `}
                title={!isHovered ? tool.name : undefined}
              >
                <div className={`
                  flex items-center justify-center relative z-10
                  ${!isHovered ? 'w-5 h-6' : 'w-5 h-6'}
                `}>
                  {tool.icon}
                </div>
          
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                    {tool.name}
                  </span>
          
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default RevisionSidebar; 