"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { marked } from 'marked'; // Import marked library
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Import Lucide React chevron icons

import { CHINESE_UNIT_1_CONTENT } from './Unit1.js';
import { CHINESE_UNIT_2_CONTENT } from './Unit2.js';
import { CHINESE_UNIT_3_CONTENT } from './Unit3.js';
import { CHINESE_UNIT_4_CONTENT } from './Unit4.js';
import { CHINESE_UNIT_5_CONTENT } from './Unit5.js';
interface UnitContent {
  [key: number]: string;
}
import "../ChinesePage.css";





const TOTAL_UNITS = 5;
const UNIT_PREFIX = 'Unit'; // For units like "Unit 1", "Unit 2"

const UNIT_NOTES_CONTENT: UnitContent = {
  1: CHINESE_UNIT_1_CONTENT,
  2: CHINESE_UNIT_2_CONTENT,
  3: CHINESE_UNIT_3_CONTENT,
  4: CHINESE_UNIT_4_CONTENT,
  5: CHINESE_UNIT_5_CONTENT,
};

// Helper type guard for tokens with text
function isTextToken(token: unknown): token is { text: string, [key: string]: unknown } {
  return typeof (token as { text?: unknown })?.text === 'string';
}

const RevisionNotesContent = () => {
  const [activeUnitIndex, setActiveUnitIndex] = useState<number | null>(null); // null for home page
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [notesContent, setNotesContent] = useState<string>('');
  const [currentNotesTitle, setCurrentNotesTitle] = useState<string>('');
  const [currentNotesDuration, setCurrentNotesDuration] = useState<string>('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const markdownDisplayRef = useRef<HTMLDivElement>(null);

  // const calculateUnitProgress = useCallback((unitIndex: number) => {
  //   const markdown = UNIT_NOTES_CONTENT[unitIndex];
  //   if (!markdown) {
  //     return { completedSections: 0, totalSections: 0, percentage: 0, unitTitle: `${UNIT_PREFIX} ${unitIndex}` };
  //   }

  //   const tokens = marked.lexer(markdown);
  //   let totalSections = 0;
  //   let completedSections = 0;
  //   let unitTitle = `${UNIT_PREFIX} ${unitIndex}`;

  //   const h1Token = tokens.find(token => token.type === 'heading' && token.depth === 1 && isTextToken(token));
  //   if (h1Token && isTextToken(h1Token)) {
  //     unitTitle = h1Token.text;
  //     if (unitTitle.startsWith(`${UNIT_PREFIX} ${unitIndex}:`)) {
  //       unitTitle = unitTitle.substring(`${UNIT_PREFIX} ${unitIndex}:`.length).trim();
  //     }
  //   }

  //   let sectionCounter = 0;
  //   tokens.forEach(token => {
  //     if (token.type === 'heading' && token.depth === 2) {
  //       totalSections++;
  //       const sectionId = `unit-${unitIndex}-section-${++sectionCounter}`;
  //       // Remove all mark as complete/section completion state and logic
  //       // Remove sectionCompletionStatus, getLocalStorageKey, loadCompletionStatus, saveCompletionStatus, saveLastViewedLessonToLocalStorage, loadLastViewedLessonFromLocalStorage, and all related useEffects and UI
  //     }
  //   });

  //   const percentage = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;
  //   return { completedSections, totalSections, percentage, unitTitle };
  // }, []);

  const fetchAndDisplayNote = useCallback((unitIndex: number, sectionIdToScrollTo: string | null = null) => {
    setActiveUnitIndex(unitIndex);
    setActiveSectionId(sectionIdToScrollTo);
    const markdownText = UNIT_NOTES_CONTENT[unitIndex];
    let headingTitle = '';
    if (markdownText) {
      const tokens = marked.lexer(markdownText);
      const h1Token = tokens.find(token => token.type === 'heading' && token.depth === 1 && isTextToken(token));
      if (h1Token && isTextToken(h1Token)) {
        // Remove 'Unit x:' prefix if present
        headingTitle = h1Token.text.replace(/^Unit \d+:\s*/, '');
      } else {
        headingTitle = 'Chinese Notes';
      }
    } else {
      headingTitle = 'Chinese Notes';
    }
    setCurrentNotesTitle(headingTitle);
    setCurrentNotesDuration('');
    setNotesContent(`
            <div class="text-center py-12 text-gray-500 dark:text-gray-400">
                <i class="fas fa-spinner fa-spin text-4xl mb-4"></i>
                <div class="text-lg">Loading notes...</div>
            </div>
        `);
    if (!markdownText) {
      setCurrentNotesTitle('Error Loading Notes');
      setNotesContent(`
                <div class="text-center py-12 text-red-500 dark:text-red-400">
                    <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                    <div class="text-lg">Notes not found.</div>
                    <div class="text-sm">Please ensure content is defined for this unit.</div>
                </div>
            `);
      return;
    }
    try {
      const tokens = marked.lexer(markdownText);
      let renderedHtml = '';
      let sectionCounter = 0;
      tokens.forEach(token => {
        if (token.type === 'heading' && token.depth === 2) {
          sectionCounter++;
          const sectionId = `unit-${unitIndex}-section-${sectionCounter}`;
          renderedHtml += `<div class="section-header-container"><h2 id="${sectionId}">${token.text}</h2></div>`;
        } else if (token.type !== 'heading' || token.depth !== 1) {
          renderedHtml += marked.parse(token.raw);
        }
      });
      setNotesContent(renderedHtml);
      setCurrentNotesDuration(`Approx ${Math.ceil(markdownText.length / 1000)} min read`);
    } catch (error) {
      console.error('Error parsing markdown:', error);
      setCurrentNotesTitle('Error Displaying Notes');
      setCurrentNotesDuration('');
      setNotesContent(`
                <div class="text-center py-12 text-red-500 dark:text-red-400">
                    <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                    <div class="text-lg">An error occurred while displaying notes.</div>
                </div>
            `);
    }
  }, []);

  
  // Select Unit 1 by default when entering revision notes
  useEffect(() => {
    if (activeUnitIndex === null) {
      fetchAndDisplayNote(1);
    }
  }, [activeUnitIndex, fetchAndDisplayNote]);

  // Effect to scroll to section after content updates
  useEffect(() => {
    if (activeSectionId && markdownDisplayRef.current) {
      const targetElement = markdownDisplayRef.current.querySelector(`#${activeSectionId}`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      }
    }
  }, [notesContent, activeSectionId]); // Re-run when notesContent or activeSectionId changes
  
  return (
    <div className="flex  overflow-hidden relative" style={{height: 'calc(100vh - 50px)'}}>
      {/* Chevron button for collapsing sidebar on desktop (always visible, docked to left of content) */}
      <button
        className="hidden md:flex items-center justify-center text-gray-400 bg-[#00000000] hover:bg-[#ff3b3010] hover:text-[#ff3b30] z-40  rounded-full p-1 absolute top-6 transition-all duration-300 "
        style={{ width: 40, height: 40, marginLeft: sidebarCollapsed ? 0 : 235, left: sidebarCollapsed ? 8 : 0 }}
        onClick={() => setSidebarCollapsed((prev) => !prev)}
        aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-10 h-10 ml-[2px]" />
        ) : (
          <ChevronLeft className="w-10 h-10 mr-[2px]" />
        )}
      </button>
      {/* Sidebar overlay for mobile */}
      <div
        id="left-sidebar"
        className={`fixed top-0 left-0  z-30 bg-white overflow-x-visible dark:bg-white border-r-3 border-r-[#00000010] overflow-y-auto p-4 transition-transform duration-300 ease-in-out w-64 md:static md:translate-x-0 ${!sidebarCollapsed ? 'translate-x-0' : '-translate-x-full'} md:relative md:h-auto md:w-72 md:block ${sidebarCollapsed ? 'md:hidden' : ''} ${!sidebarCollapsed ? ' pt-[60px] md:pt-[16px]' : 'pt-[60px] md:pt-[16px]'} ${!sidebarCollapsed ? 'pt-[60px] md:pt-[16px]' : ''} md:sticky md:top-0 md:h-screen md:overflow-y-auto` }
        style={{height: 'calc(100vh - 50px)'}}
        // style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.08)' }}
      >
        {/* No Home button here, as it's in the main header */}
        {/* Learning Notes Section */}
        <div className="mb-4">
          {/* <h3 className='mb-4 font-bold'>Revision Notes</h3> */}

          <div className='ml-[0px] mb-[20px]'>
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Revision Notes</h1>
                                <span>5 Units / 60%</span>
                                {/* <span className='font-medium text-[#00000070] text-2xl'>All with AI grading.</span> */}
                            </div>
          <div id="unit-buttons-container" className="space-y-4">
            {Array.from({ length: TOTAL_UNITS }, (_, i) => i + 1).map(unitIndex => {
              const unitName = `${UNIT_PREFIX} ${unitIndex}`;
              const markdownContent = UNIT_NOTES_CONTENT[unitIndex];
              let unitTitleWithoutPrefix = unitName;

              if (markdownContent) {
                const tokens = marked.lexer(markdownContent);
                const h1Token = tokens.find(token => token.type === 'heading' && token.depth === 1 && isTextToken(token));
                if (h1Token && isTextToken(h1Token)) {
                  unitTitleWithoutPrefix = h1Token.text;
                  if (unitTitleWithoutPrefix.startsWith(`${unitName}:`)) {
                    unitTitleWithoutPrefix = unitTitleWithoutPrefix.substring(`${unitName}:`.length).trim();
                  }
                }
              }

              const sectionsInUnit: { id: string; text: string }[] = [];
              if (markdownContent) {
                let sectionCounter = 0;
                marked.lexer(markdownContent).forEach(token => {
                  if (token.type === 'heading' && token.depth === 2) {
                    sectionCounter++;
                    sectionsInUnit.push({ id: `unit-${unitIndex}-section-${sectionCounter}`, text: token.text });
                  }
                });
              }

              return (
                <div key={unitIndex}>
                  <button
                    className={`unit-button w-full text-left px-3 py-2 rounded-[15px] text-sm font-medium flex items-center justify-between ${activeUnitIndex === unitIndex ? 'active' : ''}`}
                    onClick={() => fetchAndDisplayNote(unitIndex)}
                  >
                    <span><span style={{ fontWeight: 'bold' }}>{unitName}:</span> {unitTitleWithoutPrefix}</span>
                  </button>
                  {activeUnitIndex === unitIndex && sectionsInUnit.length > 0 && (
                    <div className="unit-sections-container space-y-1 mt-2 mb-2 ml-4 border-l border-l-[2px] border-gray-200 dark:border-gray-600">
                      {sectionsInUnit.map(section => {
                        return (
                          <a
                            key={section.id}
                            href={`#${section.id}`}
                            className={`section-link ${activeSectionId === section.id ? 'active-section' : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              setActiveSectionId(section.id);                        
                              // Scroll handled by useEffect based on activeSectionId
                            }}
                          >
                            <span className="section-link-text">{section.text}</span>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-[#00000080] backdrop-blur z-20 md:hidden transition-all"
          onClick={() => setSidebarCollapsed(true)}
        ></div>
      )}

      {/* Right Content Area - Notes Display */}
      <div
        className={`flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-900 max-4xl transition-all duration-300`} style={{height: 'calc(100vh - 50px)'}}
      >
        <div className="max-w-4xl mx-auto markdown-content" style={{ fontSize: '14px', outline: 'none' }} ref={markdownDisplayRef}>
          {/* Mobile chevron above heading in revision notes */}
          <button
            className="md:hidden flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-lg mb-4 hover:border-gray-300"
            style={{ width: 40, height: 40 }}
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
                <ChevronRight className="w-8 h-8 text-gray-600 ml-[2px]" />
            ) : (
              <ChevronLeft className="w-8 h-8 text-gray-600 mr-[2px]" />
            )}
          </button>
          <div className="flex items-start flex-col justify-between h-auto gap-0 mb-2">
            {/* <h6 className='m-0  font-medium text-[20px] md:text-[30px] text-black pb-0'>Edexcel IGCSE Chinese</h6><br></br> */}
            <h1 id="notes-title" className="text-5xl font-bold text-black">

              <span className="text-black]">Unit {activeUnitIndex}: </span>

              <span>{currentNotesTitle}</span>
            </h1>
          </div>
          <p id="notes-info-text" className="text-gray-600 dark:text-gray-400 mb-6">
            Learning Notes | <span id="notes-duration">{currentNotesDuration}</span> | AI powered
          </p>
          <hr id="notes-divider" className="border-t-[4px] border-t-[#00000010] dark:border-gray-700 my-6" />
          <div id="markdown-display" className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: notesContent }}></div>
        </div>
      </div>
    </div>
  );
};

export default RevisionNotesContent;
