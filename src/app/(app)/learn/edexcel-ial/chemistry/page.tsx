"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Removed AppHeader import as we are creating a custom header within App
import { BookText, Settings, MessageCircle, FileText, Lightbulb, HelpCircle, FlaskConical } from 'lucide-react';
import { marked } from 'marked'; // Import marked library

// Import content from separate JS files
import { CHEMISTRY_UNIT_1_CONTENT } from './Unit1.js';
import { CHEMISTRY_UNIT_2_CONTENT } from './Unit2.js';
import { CHEMISTRY_UNIT_3_CONTENT } from './Unit3.js';
import { CHEMISTRY_UNIT_4_CONTENT } from './Unit4.js';
import { CHEMISTRY_UNIT_5_CONTENT } from './Unit5.js';
import { CHEMISTRY_UNIT_6_CONTENT } from './Unit6.js';


interface UnitContent {
    [key: number]: string;
}

const UNIT_NOTES_CONTENT: UnitContent = {
    1: CHEMISTRY_UNIT_1_CONTENT,
    2: CHEMISTRY_UNIT_2_CONTENT,
    3: CHEMISTRY_UNIT_3_CONTENT,
    4: CHEMISTRY_UNIT_4_CONTENT,
    5: CHEMISTRY_UNIT_5_CONTENT,
    6: CHEMISTRY_UNIT_6_CONTENT,
};


const revisionTools = [
    { id: 'past-papers', titleTop: 'Chemistry', titleBottom: 'Past Papers', icon: FileText },
    { id: 'ai-teacher', titleTop: 'AI Teacher', titleBottom: '& Grading', icon: Lightbulb },
    { id: 'ask-help', titleTop: 'Ask for', titleBottom: 'Our Help', icon: HelpCircle },
];


// --- CONFIGURATION FOR EASY ADAPTATION ---
const CURRENT_SUBJECT = 'Chemistry';
const SUBJECT_COLOR = '#FF6B6B'; // Corresponds to primary color in Tailwind config
const SUBJECT_ICON_CLASS = 'fas fa-flask'; // Font Awesome icon for Chemistry
const UNIT_PREFIX = 'Unit'; // For units like "Unit 1", "Unit 2"
const TOTAL_UNITS = 6; // Number of units for the subject
// Key prefix for local storage. Now includes unit and section.
const LOCAL_STORAGE_KEY_PREFIX = 'completed_notes_section_';
const LAST_VIEWED_LESSON_KEY = 'last_viewed_lesson';

// Helper to convert hex to RGB for CSS variables
const hexToRgb = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
};

// Helper type guard for tokens with text
function isTextToken(token: any): token is { text: string } {
    return typeof token.text === 'string';
}

const App: React.FC = () => {
    const [activeUnitIndex, setActiveUnitIndex] = useState<number | null>(null); // null for home page
    const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
    const [notesContent, setNotesContent] = useState<string>('');
    const [currentNotesTitle, setCurrentNotesTitle] = useState<string>('');
    const [currentNotesDuration, setCurrentNotesDuration] = useState<string>('');
    const [sectionCompletionStatus, setSectionCompletionStatus] = useState<{ [key: string]: boolean }>({});
    const [lastViewedLesson, setLastViewedLesson] = useState<{ unitIndex: number; sectionId: string } | null>(null);

    // New state for header navigation
    const [activeHeaderSection, setActiveHeaderSection] = useState<'home' | 'revision-notes' | 'past-papers' | 'battle-mode' | 'tutor'>('home');
    const [showMobileNav, setShowMobileNav] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const markdownDisplayRef = useRef<HTMLDivElement>(null);


    // Function to handle navigation (for breadcrumbs and other links) - now internal to the app
    const navigate = (path: string) => {
        // This function is now simplified as navigation is handled by activeHeaderSection
        if (path.includes('learn')) {
            setActiveHeaderSection('revision-notes');
        } else if (path.includes('past-paper')) {
            setActiveHeaderSection('past-papers');
        } else if (path.includes('ai-teacher')) {
            // Placeholder for AI Teacher, could be another section or external link
            console.log('Navigating to AI Teacher (placeholder)');
        } else if (path.includes('social')) {
            // Placeholder for Ask for Help, could be another section or external link
            console.log('Navigating to Social (placeholder)');
        }
    };

    // Set CSS variables for dynamic coloring
    useEffect(() => {
        document.documentElement.style.setProperty('--subject-primary-color', SUBJECT_COLOR);
        document.documentElement.style.setProperty('--subject-primary-color-rgb', hexToRgb(SUBJECT_COLOR));

        // Apply dark mode if preferred by the user's system settings
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        }
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (event: MediaQueryListEvent) => {
            if (event.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // --- Local Storage Functions ---
    const getLocalStorageKey = useCallback((unitIndex: number, sectionId: string): string => {
        return `${LOCAL_STORAGE_KEY_PREFIX}${CURRENT_SUBJECT}_${unitIndex}_${sectionId}`;
    }, []);

    const loadCompletionStatus = useCallback((unitIndex: number, sectionId: string): boolean => {
        const key = getLocalStorageKey(unitIndex, sectionId);
        return localStorage.getItem(key) === 'true';
    }, [getLocalStorageKey]);

    const saveCompletionStatus = useCallback((unitIndex: number, sectionId: string, status: boolean) => {
        const key = getLocalStorageKey(unitIndex, sectionId);
        localStorage.setItem(key, status ? 'true' : 'false');
        setSectionCompletionStatus(prev => ({ ...prev, [key]: status }));
    }, [getLocalStorageKey]);

    const saveLastViewedLessonToLocalStorage = useCallback((unitIndex: number, sectionId: string) => {
        const lesson = { unitIndex, sectionId };
        localStorage.setItem(LAST_VIEWED_LESSON_KEY, JSON.stringify(lesson));
        setLastViewedLesson(lesson);
    }, []);

    const loadLastViewedLessonFromLocalStorage = useCallback((): { unitIndex: number; sectionId: string } | null => {
        const data = localStorage.getItem(LAST_VIEWED_LESSON_KEY);
        return data ? JSON.parse(data) : null;
    }, []);

    // --- Progress Calculation ---
    const calculateUnitProgress = useCallback((unitIndex: number) => {
        const markdown = UNIT_NOTES_CONTENT[unitIndex];
        if (!markdown) {
            return { completedSections: 0, totalSections: 0, percentage: 0, unitTitle: `${UNIT_PREFIX} ${unitIndex}` };
        }

        const tokens = marked.lexer(markdown);
        let totalSections = 0;
        let completedSections = 0;
        let unitTitle = `${UNIT_PREFIX} ${unitIndex}`;

        const h1Token = tokens.find(token => token.type === 'heading' && token.depth === 1 && isTextToken(token));
        if (h1Token && isTextToken(h1Token)) {
            unitTitle = h1Token.text;
            if (unitTitle.startsWith(`${UNIT_PREFIX} ${unitIndex}:`)) {
                unitTitle = unitTitle.substring(`${UNIT_PREFIX} ${unitIndex}:`.length).trim();
            }
        }

        let sectionCounter = 0;
        tokens.forEach(token => {
            if (token.type === 'heading' && token.depth === 2) {
                totalSections++;
                const sectionId = `unit-${unitIndex}-section-${++sectionCounter}`;
                if (loadCompletionStatus(unitIndex, sectionId)) {
                    completedSections++;
                }
            }
        });

        const percentage = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;
        return { completedSections, totalSections, percentage, unitTitle };
    }, [loadCompletionStatus]);

    // --- Display Functions ---
    const fetchAndDisplayNote = useCallback((unitIndex: number, sectionIdToScrollTo: string | null = null) => {
        setActiveUnitIndex(unitIndex);
        setActiveSectionId(sectionIdToScrollTo);
        setActiveHeaderSection('revision-notes'); // Switch to revision notes section

        // Always extract and set the heading from the markdown
        const unitName = `${UNIT_PREFIX} ${unitIndex}`;
        let headingTitle = '';
        const markdownText = UNIT_NOTES_CONTENT[unitIndex];
        if (markdownText) {
            const tokens = marked.lexer(markdownText);
            const h1Token = tokens.find(token => token.type === 'heading' && token.depth === 1 && isTextToken(token));
            if (h1Token && isTextToken(h1Token)) {
                headingTitle = h1Token.text;
            } else {
                headingTitle = `${unitName}: Chemistry Notes`;
            }
        } else {
            headingTitle = `${unitName}: Chemistry Notes`;
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
            setCurrentNotesTitle(`${unitName}: Error Loading Notes`);
            setNotesContent(`
                <div class="text-center py-12 text-red-500 dark:text-red-400">
                    <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                    <div class="text-lg">Notes for ${unitName} not found.</div>
                    <div class="text-sm">Please ensure content is defined for this unit.</div>
                </div>
            `);
            return;
        }

        try {
            const tokens = marked.lexer(markdownText);
            let renderedHtml = '';
            const sectionsInUnit: { id: string; text: string }[] = [];

            let sectionCounter = 0;
            tokens.forEach(token => {
                if (token.type === 'heading' && token.depth === 2) {
                    sectionCounter++;
                    const sectionId = `unit-${unitIndex}-section-${sectionCounter}`;
                    sectionsInUnit.push({ id: sectionId, text: token.text });

                    const isCompleted = loadCompletionStatus(unitIndex, sectionId);
                    const completionClass = isCompleted ? 'completed' : 'incomplete';
                    const completionText = isCompleted ? 'Completed' : 'Complete';
                    const completionIcon = isCompleted ? 'fas fa-check-circle' : 'far fa-circle';

                    renderedHtml += `
                        <div class="section-header-container">
                            <h2 id="${sectionId}">${token.text}</h2>
                            <button class="section-completion-button ${completionClass}"
                                    data-unit-index="${unitIndex}"
                                    data-section-id="${sectionId}"
                                    contentEditable="false">
                                <i class="${completionIcon} mr-1"></i> ${completionText}
                            </button>
                        </div>
                    `;
                } else if (token.type !== 'heading' || token.depth !== 1) {
                    renderedHtml += marked.parse(token.raw);
                }
            });

            setNotesContent(renderedHtml);
            setCurrentNotesDuration(`Approx ${Math.ceil(markdownText.length / 1000)} min read`);

            const newSectionsData = sectionsInUnit.map(sec => ({
                ...sec,
                unitIndex: unitIndex,
                isCompleted: loadCompletionStatus(unitIndex, sec.id)
            }));
            // This will be handled by the `sectionsForSidebar` state.
            // setSectionsForSidebar(newSectionsData); // This state will be used to render sidebar sections

            // Save last viewed lesson
            if (sectionIdToScrollTo) {
                saveLastViewedLessonToLocalStorage(unitIndex, sectionIdToScrollTo);
            } else if (sectionsInUnit.length > 0) {
                // If no specific section, default to the first one
                saveLastViewedLessonToLocalStorage(unitIndex, sectionsInUnit[0].id);
            }


        } catch (error) {
            console.error('Error parsing markdown:', error);
            setCurrentNotesTitle(`${unitName}: Error Displaying Notes`);
            setCurrentNotesDuration('');
            setNotesContent(`
                <div class="text-center py-12 text-red-500 dark:text-red-400">
                    <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                    <div class="text-lg">An error occurred while displaying notes for ${unitName}.</div>
                </div>
            `);
        }
    }, [currentNotesTitle, loadCompletionStatus, saveLastViewedLessonToLocalStorage]);

    const displayHomePage = useCallback(() => {
        setActiveUnitIndex(null);
        setActiveSectionId(null);
        setCurrentNotesTitle('');
        setCurrentNotesDuration('');
        setNotesContent(''); // Clear markdown content for home page
        setActiveHeaderSection('home'); // Ensure header is set to home
    }, []);

    // --- Effects ---
    useEffect(() => {
        // Initial load of completion status and last viewed lesson
        const initialCompletionStatus: { [key: string]: boolean } = {};
        for (let i = 1; i <= TOTAL_UNITS; i++) {
            const markdown = UNIT_NOTES_CONTENT[i];
            if (markdown) {
                const tokens = marked.lexer(markdown);
                let sectionCounter = 0;
                tokens.forEach(token => {
                    if (token.type === 'heading' && token.depth === 2) {
                        sectionCounter++;
                        const sectionId = `unit-${i}-section-${sectionCounter}`;
                        const key = getLocalStorageKey(i, sectionId);
                        initialCompletionStatus[key] = localStorage.getItem(key) === 'true';
                    }
                });
            }
        }
        setSectionCompletionStatus(initialCompletionStatus);
        setLastViewedLesson(loadLastViewedLessonFromLocalStorage());

        // Show home page by default
        displayHomePage();
    }, [displayHomePage, getLocalStorageKey, loadLastViewedLessonFromLocalStorage]);

    // Select Unit 1 by default when entering revision notes
    useEffect(() => {
        if (activeHeaderSection === 'revision-notes' && activeUnitIndex === null) {
            fetchAndDisplayNote(1);
        }
    }, [activeHeaderSection, activeUnitIndex, fetchAndDisplayNote]);

    // Effect to scroll to section after content updates
    useEffect(() => {
        if (activeSectionId && markdownDisplayRef.current) {
            const targetElement = markdownDisplayRef.current.querySelector(`#${activeSectionId}`);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [notesContent, activeSectionId]); // Re-run when notesContent or activeSectionId changes

    // Effect to handle click on section completion buttons (delegation)
    useEffect(() => {
        const handleCompletionButtonClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const button = target.closest('.section-completion-button') as HTMLButtonElement;

            if (button) {
                const unitIndex = parseInt(button.dataset.unitIndex || '0');
                const sectionId = button.dataset.sectionId || '';

                if (unitIndex && sectionId) {
                    const isCompleted = loadCompletionStatus(unitIndex, sectionId);
                    saveCompletionStatus(unitIndex, sectionId, !isCompleted);
                }
            }
        };

        const currentRef = markdownDisplayRef.current;
        if (currentRef) {
            currentRef.addEventListener('click', handleCompletionButtonClick);
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener('click', handleCompletionButtonClick);
            }
        };
    }, [loadCompletionStatus, saveCompletionStatus]);


    // --- Editor Toolbar Functions ---
    const applyTextEffect = (command: string, value: string | null = null) => {
        if (markdownDisplayRef.current) {
            markdownDisplayRef.current.focus();
            document.execCommand(command, false, value ?? undefined);
        }
    };

    // --- Components for Home Page ---
    const ContinueLessonButton: React.FC = () => {
        return (
            <div id="continue-lesson-button" className="continue-lesson-card flex items-center justify-center w-[75px] h-[75px] md:w-[115px] md:h-[115px]">
                <FlaskConical size={90} color="#fff" />
            </div>
        );
    };

    const UnitCard: React.FC<{ unitIndex: number }> = ({ unitIndex }) => {
        const { percentage, unitTitle } = calculateUnitProgress(unitIndex);

        return (
            <div className="unit-card p-4 flex flex-col justify-between" onClick={() => fetchAndDisplayNote(unitIndex)}>
                <div className="flex flex-col items-left mb-2 justify-flex-start grow">
                    <span className="text-black" style={{ fontSize: '20px', fontWeight: 'bold' }}>{UNIT_PREFIX} {unitIndex}</span>

                </div>
                <div className="flex items-center mt-2 justify-center">
                    <i className="fas fa-play-circle text-black mr-4" style={{ width: '40px', height: '40px', fontSize: '40px' }}></i>
                    <div className="progress-bar-container flex-grow self-center">
                        <div className="progress-bar-fill bg-green-500" style={{ width: `${percentage}%` }}></div>
                    </div>
                </div>
            </div>
        );
    };

    const RevisionToolButton: React.FC<{ iconClass: string; mainText: string; subText: string }> = ({ iconClass, mainText, subText }) => (
        <button className="revision-tool-button">
            <div className="icon-circle"><i className={iconClass}></i></div>
            <div className="text-content">
                <span className="main-text">{mainText}</span>
                <span className="sub-text">{subText}</span>
            </div>
        </button>
    );

    const AiToolCard: React.FC<{ iconClass: string; title: string }> = ({ iconClass, title }) => (
        <div className="ai-tool-card">
            <div className="ai-tool-icon-circle">
                <i className={iconClass}></i>
            </div>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{title}</span>
        </div>
    );

    // --- New Section Components ---
    const HomePageContent: React.FC = () => (
        <div className="rounded-2xl p-6 items-center flex justify-center mt-6">
           <div className='max-w-4xl'>
           <nav className="inline-block self-start text-gray-500 text-sm mb-8 font-light border-[1px] bg-[#00000005] border-[#00000010] px-3 py-1 rounded-lg">
                        <a href="#" onClick={() => navigate('/learn')} className="transition duration-300 hover:underline hover:text-[#ff3b30]">Learn</a>
                        <span className="mx-2">/</span>
                        <a href="#" onClick={() => navigate('/learn/edexcel-ial')} className="transition duration-300 hover:underline hover:text-[#ff3b30]">Edexcel IAL</a>
                        <span className="mx-2">/</span>
                        <span className='font-semibold'>Chemistry</span>
                    </nav>
            <div className="flex flex-row items-stretch md:items-start gap-4 md:gap-6 mb-6">
                <ContinueLessonButton />
                <div className="flex flex-col flex-grow title-buttons-container">
                    
                    {/* Page Title */}
                    <div className="text-4xl md:text-5xl font-bold text-black md:mb-6">
                        Edexcel IAL <br className="block md:hidden" />
                        <span className="font-medium" style={{ color: 'var(--subject-primary-color)'}}>{CURRENT_SUBJECT}</span>
                    
                    </div>
                    <p className="text-gray-700 text-lg max-w-3xl hidden md:block">Welcome to the Chemistry Revision Zone!<br></br>You can use the extensive resources below to prepare for your exams.</p>
                </div>
                
            </div>
            <p className="text-gray-700 text-lg max-w-3xl block md:hidden">Welcome to the Chemistry Revision Zone!<br></br>You can use the extensive resources below to prepare for your exams.</p>
               
            <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
                {revisionTools.map((tool) => (
                    <div
                        key={tool.id}
                        className="bg-white p-4 mt-0 hover:cursor-pointer rounded-4xl flex items-center space-x-2 border-[5px] transition duration-200"
                        style={{
                            borderColor: "#00000010",
                        }}
                        onClick={() => {
                            if (tool.id === 'past-papers') setActiveHeaderSection('past-papers'); // Directly switch section
                            else if (tool.id === 'ai-teacher') console.log('AI Teacher clicked'); // Placeholder
                            else if (tool.id === 'ask-help') console.log('Ask for Help clicked'); // Placeholder
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = SUBJECT_COLOR;
                            e.currentTarget.style.boxShadow = `0 0 0 10px ${SUBJECT_COLOR}20`;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = "#00000010";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        <div className="border-2 p-3 rounded-full" style={{ borderColor: SUBJECT_COLOR }}>
                            <tool.icon className="w-6 h-6" style={{ color: SUBJECT_COLOR }} />
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-xl font-bold" style={{ color: SUBJECT_COLOR }}>{tool.titleTop}</span>
                            <span className="text-lg font-semibold text-gray-900">{tool.titleBottom}</span>
                        </div>
                    </div>
                ))}
            </div>

            </div>
        </div>
    );

    const RevisionNotesContent: React.FC = () => (
        <div className="flex flex-1 overflow-hidden relative">
            {/* Chevron button for desktop (always visible, docked to left of content) */}
            <button
                className="hidden md:flex items-center justify-center z-40 bg-white border border-gray-200 rounded-full shadow-xl p-1 absolute top-2 left-2 transition-all duration-300"
                style={{ width: 50, height: 50, marginLeft: sidebarCollapsed ? 0 : 270 }}
                onClick={() => setSidebarCollapsed((prev) => !prev)}
                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                <i className={`fas fa-chevron-${sidebarCollapsed ? 'right' : 'left'} text-gray-600 text-2xl`}></i>
            </button>
            {/* Sidebar overlay for mobile */}
            <div
                id="left-sidebar"
                className={`fixed top-0 left-0 h-full z-30 bg-white overflow-x-visible dark:bg-white dark:border-gray-700 overflow-y-auto p-4 transition-transform duration-300 ease-in-out w-64 md:static md:translate-x-0 ${activeHeaderSection === 'revision-notes' && !sidebarCollapsed ? 'translate-x-0' : '-translate-x-full'} md:relative md:h-auto md:w-72 md:block ${sidebarCollapsed ? 'md:-ml-72' : ''}`}
                // style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.08)' }}
            >
                {/* No Home button here, as it's in the main header */}
                {/* Learning Notes Section */}
                <div className="mb-4">
                    <h3 className='mb-4 font-bold'>Revision Notes</h3>
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
                                                const sectionKey = getLocalStorageKey(unitIndex, section.id);
                                                const isCompleted = sectionCompletionStatus[sectionKey] || false;
                                                return (
                                                    <a
                                                        key={section.id}
                                                        href={`#${section.id}`}
                                                        className={`section-link ${activeSectionId === section.id ? 'active-section' : ''}`}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setActiveSectionId(section.id);
                                                            saveLastViewedLessonToLocalStorage(unitIndex, section.id);
                                                            // Scroll handled by useEffect based on activeSectionId
                                                        }}
                                                    >
                                                        <span className="section-link-text">{section.text}</span>
                                                        {isCompleted && (
                                                            <i className="section-completion-icon fas fa-check-circle text-green-500 text-xs inline-block"></i>
                                                        )}
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
            {activeHeaderSection === 'revision-notes' && !sidebarCollapsed && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden"
                    onClick={() => setSidebarCollapsed(true)}
                ></div>
            )}

            {/* Right Content Area - Notes Display */}
            <div
                className={`flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-900 max-4xl transition-all duration-300`}
            >
                <div className="max-w-4xl mx-auto markdown-content" style={{ fontSize: '14px', outline: 'none' }} ref={markdownDisplayRef}>
                    {/* Mobile chevron above heading in revision notes */}
                    {activeHeaderSection === 'revision-notes' && sidebarCollapsed && (
                        <button
                            className="md:hidden flex items-center justify-center bg-white border border-gray-200 rounded-full shadow p-1 mb-4"
                            style={{ width: 50, height: 50 }}
                            onClick={() => setSidebarCollapsed(false)}
                            aria-label="Expand sidebar"
                        >
                            <i className="fas fa-chevron-right text-gray-600 text-2xl"></i>
                        </button>
                    )}
                    <div className="flex items-center justify-between mb-2">
                        <h1 id="notes-title" className="text-4xl font-bold text-black">{currentNotesTitle}</h1>
                    </div>
                    <p id="notes-info-text" className="text-gray-600 dark:text-gray-400 mb-6">
                        Learning Notes | <span id="notes-duration">{currentNotesDuration}</span> | AI powered
                    </p>
                    <hr id="notes-divider" className="border-t border-gray-300 dark:border-gray-700 my-6" />
                    <div id="markdown-display" className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: notesContent }}></div>
                </div>
            </div>
        </div>
    );

    const PastPapersContent: React.FC = () => (
        <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-900">
            <div className="max-w-4xl mx-auto text-center py-12">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">Past Papers Section</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    This section would display past exam papers and mark schemes for {CURRENT_SUBJECT}.
                </p>
                <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md" role="alert">
                    <p className="font-bold">Coming Soon!</p>
                    <p>Integration with the full past paper functionality from `/past-paper/page.tsx` will be available here.</p>
                </div>
                <div className="mt-8">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                        onClick={() => console.log('Simulate browsing past papers')}
                    >
                        Browse Sample Papers
                    </button>
                </div>
            </div>
        </div>
    );

    const BattleModeContent: React.FC = () => (
        <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-900">
            <div className="max-w-4xl mx-auto text-center py-12">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">Battle Mode</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    Challenge your friends or AI in a fun, interactive quiz battle!
                </p>
                <div className="bg-purple-100 border-l-4 border-purple-500 text-purple-700 p-4 rounded-md" role="alert">
                    <p className="font-bold">Get Ready to Compete!</p>
                    <p>This exciting feature is currently under development.</p>
                </div>
                <div className="mt-8">
                    <button
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                        onClick={() => console.log('Simulate Battle Mode')}
                    >
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    );

    const TutorContent: React.FC = () => (
        <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-900">
            <div className="max-w-4xl mx-auto text-center py-12">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">Find a Tutor</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    Connect with experienced tutors for personalized one-on-one support.
                </p>
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
                    <p className="font-bold">Expert Help at Your Fingertips!</p>
                    <p>Browse tutor profiles and book sessions tailored to your needs.</p>
                </div>
                <div className="mt-8">
                    <button
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                        onClick={() => console.log('Simulate finding a tutor')}
                    >
                        Browse Tutors
                    </button>
                </div>
            </div>
        </div>
    );


    // --- Main Render ---
    return (
        <React.Fragment>
            {/* Font Awesome for icons */}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
                crossOrigin="anonymous" referrerPolicy="no-referrer" />
            {/* Tailwind CSS for basic styling and responsiveness */}
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                {`
                /* Tailwind configuration for custom colors and dark mode */
                tailwind.config = {
                    darkMode: 'class',
                    theme: {
                        extend: {
                            colors: {
                                primary: '#FF6B6B', /* Custom primary color for Chemistry, matches #ff6b6b */
                                subjectColor: '#FF6B6B', /* Dynamic subject color */
                            },
                        },
                    },
                };

                /* Custom styles for the app */
                :root {
                    /* This variable will be dynamically updated by JavaScript based on the subject */
                    --subject-primary-color: #FF6B6B;
                    --subject-primary-color-trans: #FF6B6B70;
                    /* Default for Chemistry */
                    --subject-primary-color-rgb: 255, 107, 107;
                    /* RGB equivalent for rgba usage */
                }

                body {
                    font-family: 'Inter', sans-serif;
                    background-color: #f8f9fa;
                    color: #333;
                }

                .btn-primary {
                    background-color: var(--subject-primary-color);
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 0.375rem;
                    font-weight: 500;
                    transition: background-color 0.2s;
                }

                .btn-primary:hover {
                    background-color: color-mix(in srgb, var(--subject-primary-color) 80%, black);
                    /* Darken on hover */
                }

                /* Styles for the active unit button and active home/subject button */
                .unit-button.active,
                .header-nav-button.active { /* Changed from .home-subject-button.active */
                    background-color: var(--subject-primary-color);
                    color: white;
                    border: 2px solid black;
                    /* Highlight active button */
                }

                /* Styles for inactive unit button and inactive home/subject button */
                .unit-button:not(.active),
                .header-nav-button:not(.active) { /* Changed from .home-subject-button:not(.active) */
                    background-color: #00000005;
                    /* gray-100 */
                    color: #4b5563;
                    /* gray-700 */
                    border: 2px solid #00000010;
                    /* Light border for inactive */
                }

               

                .unit-button,
                .header-nav-button { /* Changed from .home-subject-button */
                    
                }

                /* Style for section links in sidebar */
                .section-link {
                    display: flex;
                    /* Use flex to align icon and text */
                    align-items: center;
                    justify-content: space-between; /* Push text and icon to edges */
                    padding: 0.5rem 1rem 0.5rem 1rem;
                    /* Indent slightly */
                    border-radius: 0 0.375rem 0.375rem 0;
                    font-size: 0.875rem;
                    /* text-sm */
                    color: #6b7280;
                    /* gray-500 */
                    transition: background-color 0.2s, color 0.2s;
                    text-decoration: none;
                    /* Removed overflow, text-overflow, white-space from here */
                }

                .section-link:hover {
                    background-color: #e5e7eb;
                    /* gray-200 */
                    color: #374151;
                    /* gray-700 */
                }

                .dark .section-link {
                    color: #9ca3af;
                    /* gray-400 */
                }

                .dark .section-link:hover {
                    background-color: #4a5568;
                    /* gray-700 */
                    color: #e2e8f0;
                    /* gray-200 */
                }

                .section-link.active-section {
                    background-color: rgba(var(--subject-primary-color-rgb), 0.1);
                    /* Lighter shade of primary color */
                    color: var(--subject-primary-color);
                    font-weight: 600;
                }

                /* NEW CSS: Styling for the text inside the section link */
                .section-link-text {
                    flex-grow: 1; /* Allow text to take available space */
                    min-width: 0; /* Essential for flex items with overflow: hidden */
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap; /* Keep text on a single line */
                }

                /* NEW CSS: Styling for the completion icon in the sidebar */
                .section-completion-icon {
                    flex-shrink: 0; /* Prevent the icon from shrinking */
                    margin-left: 0.5rem; /* Space between text and icon */
                    display: none; /* Keep hidden by default */
                }
                .markdown-content {
                    /* font-weight:lighter; */
                }
                /* Markdown rendering styles */
                .markdown-content h1 {
                    font-size: 2rem;
                    /* text-4xl */
                    font-weight: 700;
                    /* font-bold */
                    margin-bottom: 10px;
                    /* color: var(--subject-primary-color); */
                    color: black;
                    /* Apply subject color to H1 */
                }

                .markdown-content h2 {
                    font-size: 1.8rem;
                    /* text-3xl */
                    font-weight: 600;
                    /* font-semibold */
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                    color: var(--subject-primary-color);
                    /* Apply subject color to H2 */
                }

                .markdown-content h3 {
                    font-size: 1.4rem;
                    /* text-2xl */
                    font-weight: 600;
                    /* font-semibold */
                    margin-top: 1.25rem;
                    margin-bottom: 0.5rem;
                }

                .markdown-content p {
                    margin-bottom: 0px;
                    line-height: 1.5rem;
                    
                }

                .markdown-content ul,
                .markdown-content ol {
                    margin-bottom: 1rem;
                    padding-left: 1.4rem;
                }

                .markdown-content ul li {
                    list-style-type: disc;
                    margin-bottom: 0.1rem;
                }

                .markdown-content ol li {
                    list-style-type: decimal;
                    margin-bottom: 0.5rem;
                }

                .markdown-content pre {
                    background-color: #e2e8f0;
                    /* gray-200 */
                    padding: 1rem;
                    border-radius: 0.5rem;
                    overflow-x: auto;
                    margin-bottom: 1rem;
                }

                .markdown-content code {
                    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
                    background-color: #e2e8f0;
                    /* gray-200 */
                    padding: 0.2rem 0.4rem;
                    border-radius: 0.25rem;
                }

                .dark .markdown-content code,
                .dark .markdown-content pre {
                    background-color: #4a5568;
                    /* gray-700 */
                    color: #e2e8f0;
                    /* gray-200 */
                }

                .markdown-content blockquote {
                    border-left: 4px solid var(--subject-primary-color);
                    padding-left: 1rem;
                    margin-left: 0;
                    font-style: italic;
                    color: #6b7280;
                    /* gray-500 */
                }

                /* Custom scrollbar for left sidebar */
                #left-sidebar::-webkit-scrollbar {
                    display: none
                }

                #left-sidebar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }

                .dark #left-sidebar::-webkit-scrollbar-track {
                    background: #2d3748;
                    /* Darker track */
                }

                #left-sidebar::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 10px;
                }

                .dark #left-sidebar::-webkit-scrollbar-thumb {
                    background: #555;
                    /* Darker thumb */
                }

                #left-sidebar::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }

                .dark #left-sidebar::-webkit-scrollbar-thumb:hover {
                    background: #777;
                }

                /* Styling for per-section completion button (in main content) */
                .section-completion-button {
                    padding: 0.3rem 0.6rem;
                    font-size: 0.75rem;
                    border-radius: 9999px;
                    /* Full rounded corners */
                    margin-left: 1rem;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    white-space: nowrap;
                    transition: all 0.2s ease;
                
                }

                .section-completion-button.completed {
                    background-color: #10B981;
                    /* Green-500 */
                    color: white;
                    border: 1px solid #059669;
                    /* Green-600 */
                    /* width: 170px; */
                }

                .section-completion-button.incomplete {
                    background-color: #e5e7eb;
                    /* Gray-200 */
                    color: #4b5563;
                    /* Gray-700 */
                    border: 1px solid #d1d5db;
                    /* Gray-300 */
                    /* width: 170px; */
                }


                .section-completion-button:hover {
                    opacity: 0.9;
                }

                .section-header-container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 0.75rem;
                    margin-top: 30px;
                    /* Match H2 default margin */
                }

                .section-header-container h2 {
                    margin-top: 0px;
                    /* Reset default H2 margin-top */
                    margin-bottom: 0;
                    /* Reset default H2 margin-bottom */
                }
                /* Styles for the new editing toolbar buttons */
                .editor-button {
                    width: 32px;
                    height: 32px;
                    padding: 0.6rem;
                    border-radius: 8px;
                    background-color: #e2e8f0; /* Light gray */
                    color: #2d3748; /* Darker text */
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .editor-button:hover {
                    background-color: #cbd5e0; /* Slightly darker gray on hover */
                    box-shadow: 0 2px 5px rgba(0,0,0,0.15);
                }
                .dark .editor-button {
                    background-color: #4a5568; /* Dark mode gray */
                    color: #e2e8f0; /* Light text */
                }
                .dark .editor-button:hover {
                    background-color: #6b7280; /* Dark mode slightly darker gray on hover */
                }
                /* Specific color for highlight buttons */
                .highlight-button {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    border: 1px solid rgba(0,0,0,0.2);
                    cursor: pointer;
                    box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
                }
                .highlight-button:hover {
                    opacity: 0.8;
                    box-shadow: inset 0 1px 5px rgba(0,0,0,0.2);
                }
                .highlight-yellow { background-color: #FFEB3B50; }
                .highlight-red { background-color: #EF535050; }
                .highlight-blue { background-color: #42A5F550; }
                .highlight-green { background-color: #66BB6A50; }

                /* NEW HOME PAGE STYLES */
                .home-page-section-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 1.5rem;
                }

                .dark .home-page-section-title {
                    color: #e2e8f0;
                }

                .unit-card {
                    /* background-color: #ffffff; */

                 
                   border: 2px solid #00000020; 
                    border-radius: 1rem;
                    /* box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); */
                    transition: all 0.2s ease-in-out;
                    cursor: pointer;
                    width: 240px; /* Ensure uniform and wide cards */
                    flex-shrink: 0; /* Prevent shrinking in flex container */
                    height: auto; /* Allow content to dictate height */
                    
                }

                

                .unit-card:hover {
                    /* transform: translateY(-3px); */
                    /* box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); */
                    /* box-shadow: 0px 0px 0px 5px #00000010; */
                    /* outline: 2px solid var(--subject-primary-color) */
                }

                .progress-bar-container {
                    height: 10px;
                    background-color: #00000016;
                    border-radius: 10px;
                    overflow: hidden;
                    margin-right: 20px;
                    /* margin-left: 10px */
                }

                .dark .progress-bar-container {
                    background-color: #4a5568;
                }

                .progress-bar-fill {
                    height: 100%;
            
                    border-radius: 10px;
                    transition: width 0.5s ease-in-out;
                }

                .ai-tool-card {
                    background-color: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.75rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 1.5rem;
                    text-align: center;
                    transition: all 0.2s ease-in-out;
                    cursor: pointer;
                }

                .dark .ai-tool-card {
                    background-color: #2d3748;
                    border-color: #4a5568;
                }

                .ai-tool-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                }

                .ai-tool-icon-circle {
                    width: 80px;
                    height: 80px;
                    background-color: #3b82f6; /* Blue-500 */
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1rem;
                }
                .ai-tool-icon-circle i {
                    color: white;
                    font-size: 2.5rem;

                }
                /* Continue Lesson Element Style */
                .continue-lesson-card {
                   
                    background-color: rgba(var(--subject-primary-color-rgb),1); /* White background */
                    /* border: 1px solid #e2e8f0; */
                    /* border: 3px solid var(--subject-primary-color); */
                    border-radius: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                    flex-shrink: 0;
                    flex-grow: 0; /* Prevent it from growing, fix height */
                    
                    text-align: center;
                    padding: 1rem;
                    cursor: pointer;
                    border: 4px solid black;
                    transition: all 0.2s ease-in-out;
                }
              
                .continue-lesson-card i {
                    font-size: 4rem;
                    color: white;
                    align-self: center;
                    justify-self: center;
                
                

                }
                .continue-lesson-card .text-sm {
                    color: #6b7280; /* Gray-500 */
                }
                .dark .continue-lesson-card .text-sm {
                    color: #9ca3af; /* Gray-400 */
                }
                #lesson-pane {
                    padding: 10px 0px;
                }

                #lesson-pane::-webkit-scrollbar {
                    display: none
                }

                /* Styles for the new "Past Papers", "AI Teacher & Grading", "Ask For Our Help" buttons */
                .revision-tool-button {
                    background-color: white; /* White background */
                    border: 3px solid #e2e8f0; /* Light gray border */
                    border-radius: 2rem; /* Rounded corners */
                    padding: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start; /* Align content to start */
                    text-align: left;
                    transition: all 0.2s ease-in-out;
                    cursor: pointer;
                    box-shadow: 0 6px 20px rgba(0,0,0,0.1); /* Subtle shadow */
                }

                .revision-tool-button:hover {
                    /* transform: translateY(-2px); */
                    border-color: var(--subject-primary-color);
                    box-shadow: 0 6px 20px rgba(var(--subject-primary-color-rgb),0.2);
                }
                .revision-tool-button .icon-circle {
                    width: 40px;
                    height: 40px;
                    min-width: 40px; /* Ensure icon circle doesn't shrink */
                    border: 2px solid #ef4444; /* Red border for circle */
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 1rem;
                }
                .revision-tool-button .icon-circle i {
                    color: #ef4444; /* Red icon */
                    font-size: 1.25rem; /* Icon size */
                }
                .revision-tool-button .text-content {
                    display: flex;
                    flex-direction: column;
                }
                .revision-tool-button .text-content .main-text {
                    font-weight: bold;
                    color: #ef4444; /* Red text */
                    font-size: 1rem;
                }
                .revision-tool-button .text-content .sub-text {
                    font-weight: bold;
                    font-size: 0.875rem;
                    color: #6b7280; /* Gray-500 */
                    margin-top: 0.125rem;
                }
                .dark .revision-tool-button .text-content .main-text {
                    color: #f87171; /* Lighter red for dark mode */
                }
                .dark .revision-tool-button .text-content .sub-text {
                    color: #9ca3af; /* Lighter gray for dark mode */
                }

                /* Adjusting the height of the container holding title and buttons */
                .title-buttons-container {
                 
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between; 
                }

                /* Header Navigation Styles */
                .header-nav-button {
                    padding: 0.3rem 0.7rem;
                    border-radius: 0;
                    font-weight: 500;
                    font-size: 0.97rem;
                    background: none;
                    border: none;
                    color: #4b5563;
                    transition: color 0.15s, border-bottom 0.15s;
                    box-shadow: none;
                    margin: 0 0.1rem;
                     font-weight: 700;
                }
                .header-nav-button.active {
                    color: var(--subject-primary-color);
                    border-bottom: 2px solid var(--subject-primary-color);
                    background: none;
                    font-weight: 700;
                }
                .header-nav-button:not(.active):hover {
                    color: #222;
                    background: none;
                    border-bottom: 2px solid #e5e7eb;
                }
                .dark .header-nav-button {
                    color: #d1d5db;
                }
                .dark .header-nav-button.active {
                    color: var(--subject-primary-color);
                    border-bottom: 2px solid var(--subject-primary-color);
                }
                .dark .header-nav-button:not(.active):hover {
                    color: #fff;
                    border-bottom: 2px solid #374151;
                }
                `}
            </style>

            <div className="w-full h-screen flex flex-col">
                {/* Header */}
                <header className="fixed w-full bg-white border-b border-[#00000020] dark:bg-gray-800 dark:border-gray-700 px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2 relative">
                    <div className="flex flex-row items-center justify-between w-full md:w-auto">
                        <div className="flex flex-row items-center">
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
                                <span id="subject-title">{CURRENT_SUBJECT}</span>
                                {/* Mobile: show current page label between Chemistry and menu button */}
                                <div className="ml-2 md:hidden flex items-center px-3 py-1 rounded-full bg-gray-100 border border-gray-300 text-gray-700 text-sm font-semibold select-none">
                                    {(() => {
                                        switch (activeHeaderSection) {
                                            case 'home': return 'Home';
                                            case 'revision-notes': return 'Revision Notes';
                                            case 'past-papers': return 'Past Papers';
                                            case 'battle-mode': return 'Battle Mode';
                                            case 'tutor': return 'Tutor';
                                            default: return '';
                                        }
                                    })()}
                                </div>
                            </h1>
                            {/* If you have a dropdown menu button for unit changing, it would go here */}
                        </div>
                        {/* Hamburger menu for mobile */}
                        <button
                            className="md:hidden p-2 ml-2 text-gray-700 dark:text-gray-200 focus:outline-none"
                            aria-label="Open navigation menu"
                            onClick={() => setShowMobileNav(prev => !prev)}
                        >
                            <i className="fas fa-bars text-xl"></i>
                        </button>
                    </div>
                    {/* Navigation Buttons */}
                    <nav
                        className={`flex-col md:flex-row flex gap-2 md:gap-2 w-full md:w-auto ${showMobileNav ? 'flex' : 'hidden'} md:flex bg-white dark:bg-gray-800 md:bg-transparent  p-2 md:p-0 rounded-lg smd:rounded-none shadow md:shadow-none z-20 absolute md:static top-full left-0`}
                        style={{ minWidth: '180px' }}
                    >
                        <button
                            className={`header-nav-button w-full md:w-auto ${activeHeaderSection === 'home' ? 'active' : ''}`}
                            onClick={() => { setActiveHeaderSection('home'); setShowMobileNav(false); }}
                        >
                            Home
                        </button>
                        <button
                            className={`header-nav-button w-full md:w-auto ${activeHeaderSection === 'revision-notes' ? 'active' : ''}`}
                            onClick={() => { setActiveHeaderSection('revision-notes'); setShowMobileNav(false); }}
                        >
                            Revision Notes
                        </button>
                        <button
                            className={`header-nav-button w-full md:w-auto ${activeHeaderSection === 'past-papers' ? 'active' : ''}`}
                            onClick={() => { setActiveHeaderSection('past-papers'); setShowMobileNav(false); }}
                        >
                            Past Papers
                        </button>
                        <button
                            className={`header-nav-button w-full md:w-auto ${activeHeaderSection === 'battle-mode' ? 'active' : ''}`}
                            onClick={() => { setActiveHeaderSection('battle-mode'); setShowMobileNav(false); }}
                        >
                            Battle Mode
                        </button>
                        <button
                            className={`header-nav-button w-full md:w-auto ${activeHeaderSection === 'tutor' ? 'active' : ''}`}
                            onClick={() => { setActiveHeaderSection('tutor'); setShowMobileNav(false); }}
                        >
                            Tutor
                        </button>
                    </nav>
                    {/* Editor Toolbar - hidden on mobile */}
                    {/* <div className="hidden md:flex items-center space-x-2 mt-4 md:mt-0 invisible">
                        <button id="bold-button" className="editor-button" title="Bold" onClick={() => applyTextEffect('bold')}>
                            <i className="fas fa-bold"></i>
                        </button>
                        <button id="underline-button" className="editor-button" title="Underline" onClick={() => applyTextEffect('underline')}>
                            <i className="fas fa-underline"></i>
                        </button>
                        <div className="flex space-x-1">
                            <button id="highlight-yellow-button" className="highlight-button highlight-yellow" title="Highlight Yellow" onClick={() => applyTextEffect('backColor', '#FFEB3B')}></button>
                            <button id="highlight-red-button" className="highlight-button highlight-red" title="Highlight Red" onClick={() => applyTextEffect('backColor', '#EF535070')}></button>
                            <button id="highlight-blue-button" className="highlight-button highlight-blue" title="Highlight Blue" onClick={() => applyTextEffect('backColor', '#42A5F570')}></button>
                            <button id="highlight-green-button" className="highlight-button highlight-green" title="Highlight Green" onClick={() => applyTextEffect('backColor', '#22c45e70')}></button>
                        </div>
                        <button id="clear-effects-button" className="editor-button" title="Clear All Effects" onClick={() => applyTextEffect('removeFormat')}>
                            <i className="fas fa-eraser"></i>
                        </button>
                    </div> */}
                </header>

                {/* Main Content Area - Conditional Rendering */}
                {activeHeaderSection === 'home' && <HomePageContent />}
                {activeHeaderSection === 'revision-notes' && <RevisionNotesContent />}
                {activeHeaderSection === 'past-papers' && <PastPapersContent />}
                {activeHeaderSection === 'battle-mode' && <BattleModeContent />}
                {activeHeaderSection === 'tutor' && <TutorContent />}
            </div>
        </React.Fragment>
    );
};

export default App;
