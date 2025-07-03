"use client"

import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
// Assuming marked.js is loaded globally via CDN in index.html
// declare const marked: any;

// Assuming these are globally available from external JS files
// In a real React app, you might import them or fetch them.

import { CHEMISTRY_UNIT_1_CONTENT } from './ChemUnit1.js';

// declare const CHEMISTRY_UNIT_1_CONTENT: string;
declare const CHEMISTRY_UNIT_2_CONTENT: string;
declare const CHEMISTRY_UNIT_3_CONTENT: string;
declare const CHEMISTRY_UNIT_4_CONTENT: string;
declare const CHEMISTRY_UNIT_5_CONTENT: string;
declare const CHEMISTRY_UNIT_6_CONTENT: string;

interface UnitContentMap {
    [key: number]: string;
}

const UNIT_NOTES_CONTENT: UnitContentMap = {
    1: typeof CHEMISTRY_UNIT_1_CONTENT !== 'undefined' ? CHEMISTRY_UNIT_1_CONTENT : '',
    2: typeof CHEMISTRY_UNIT_2_CONTENT !== 'undefined' ? CHEMISTRY_UNIT_2_CONTENT : '',
    3: typeof CHEMISTRY_UNIT_3_CONTENT !== 'undefined' ? CHEMISTRY_UNIT_3_CONTENT : '',
    4: typeof CHEMISTRY_UNIT_4_CONTENT !== 'undefined' ? CHEMISTRY_UNIT_4_CONTENT : '',
    5: typeof CHEMISTRY_UNIT_5_CONTENT !== 'undefined' ? CHEMISTRY_UNIT_5_CONTENT : '',
    6: typeof CHEMISTRY_UNIT_6_CONTENT !== 'undefined' ? CHEMISTRY_UNIT_6_CONTENT : '',
};

interface LastViewedLesson {
    unitIndex: number;
    sectionId: string;
}

const CURRENT_SUBJECT = 'Chemistry';
const SUBJECT_COLOR = '#FF6B6B'; // Corresponds to primary color in Tailwind config
const SUBJECT_ICON_CLASS = 'fas fa-flask'; // Font Awesome icon for Chemistry
const UNIT_PREFIX = 'Unit'; // For units like "Unit 1", "Unit 2"
const TOTAL_UNITS = 6; // Number of units for the subject
const LOCAL_STORAGE_KEY_PREFIX = 'completed_notes_section_';
const LAST_VIEWED_LESSON_KEY = 'last_viewed_lesson';

// Helper to convert hex to RGB for CSS variables
const hexToRgb = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
};

// Set CSS variables for dynamic coloring
document.documentElement.style.setProperty('--subject-primary-color', SUBJECT_COLOR);
document.documentElement.style.setProperty('--subject-primary-color-rgb', hexToRgb(SUBJECT_COLOR));

// Set up dark mode based on system preference
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (event.matches) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
});


const App: React.FC = () => {
    const [currentActiveUnit, setCurrentActiveUnit] = useState<number | null>(null);
    const [notesTitle, setNotesTitle] = useState<string>('');
    const [notesDuration, setNotesDuration] = useState<string>('');
    const [markdownHtml, setMarkdownHtml] = useState<string>('');
    const [isHomePage, setIsHomePage] = useState<boolean>(true);
    const [lastViewedLesson, setLastViewedLesson] = useState<LastViewedLesson | null>(null);

    const markdownDisplayRef = useRef<HTMLDivElement>(null);

    // --- Local Storage Functions ---
    const getLocalStorageKey = (unitIndex: number, sectionId: string): string => {
        return `${LOCAL_STORAGE_KEY_PREFIX}${CURRENT_SUBJECT}_${unitIndex}_${sectionId}`;
    };

    const loadCompletionStatus = (unitIndex: number, sectionId: string): boolean => {
        const key = getLocalStorageKey(unitIndex, sectionId);
        return localStorage.getItem(key) === 'true';
    };

    const saveCompletionStatus = (unitIndex: number, sectionId: string, status: boolean): void => {
        const key = getLocalStorageKey(unitIndex, sectionId);
        localStorage.setItem(key, status ? 'true' : 'false');
        // Trigger re-render to update UI (sidebar icon, home page progress)
        // This is a bit of a hack, but forces React to re-evaluate components that depend on local storage
        // A more robust solution would be a global state management for completion status.
        setLastViewedLesson(prev => prev ? { ...prev } : null); // Trigger a state update to re-render
    };

    const saveLastViewedLessonToStorage = (unitIndex: number, sectionId: string): void => {
        const lessonData = { unitIndex, sectionId };
        localStorage.setItem(LAST_VIEWED_LESSON_KEY, JSON.stringify(lessonData));
        setLastViewedLesson(lessonData); // Update React state
    };

    const loadLastViewedLessonFromStorage = (): LastViewedLesson | null => {
        const data = localStorage.getItem(LAST_VIEWED_LESSON_KEY);
        return data ? JSON.parse(data) : null;
    };

    // --- UI Update Functions ---

    const updateContinueLessonButton = (): void => {
        const lastLesson = loadLastViewedLessonFromStorage();
        setLastViewedLesson(lastLesson); // Keep state in sync
    };

    const calculateUnitProgress = (unitIndex: number) => {
        const markdownContent = UNIT_NOTES_CONTENT[unitIndex];
        if (!markdownContent) {
            return { completedSections: 0, totalSections: 0, percentage: 0, unitTitle: `${UNIT_PREFIX} ${unitIndex}` };
        }

        const tokens = marked.lexer(markdownContent);
        let totalSections = 0;
        let completedSections = 0;
        let unitTitle = `${UNIT_PREFIX} ${unitIndex}`;

        const h1Token = tokens.find((token: any) => token.type === 'heading' && token.depth === 1);
        if (h1Token) {
            unitTitle = h1Token.text;
            if (unitTitle.startsWith(`${UNIT_PREFIX} ${unitIndex}:`)) {
                unitTitle = unitTitle.substring(`${UNIT_PREFIX} ${unitIndex}:`.length).trim();
            }
        }

        let sectionCounter = 0;
        tokens.forEach((token: any) => {
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
    };

    const fetchAndDisplayNote = (unitIndex: number, sectionIdToScrollTo: string | null = null): void => {
        setCurrentActiveUnit(unitIndex);
        setIsHomePage(false);

        setNotesTitle('');
        setNotesDuration('');
        setMarkdownHtml(`
            <div class="text-center py-12 text-gray-500 dark:text-gray-400">
                <i class="fas fa-spinner fa-spin text-4xl mb-4"></i>
                <div class="text-lg">Loading notes...</div>
            </div>
        `);

        const unitName = `${UNIT_PREFIX} ${unitIndex}`;
        const markdownText = UNIT_NOTES_CONTENT[unitIndex];

        if (!markdownText) {
            setMarkdownHtml(`
                <div class="text-center py-12 text-red-500 dark:text-red-400">
                    <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                    <div class="text-lg">Notes for ${unitName} not found.</div>
                    <div class="text-sm">Please ensure content is defined for this unit.</div>
                </div>
            `);
            setNotesTitle(`${unitName}: Error Loading Notes`);
            setNotesDuration('');
            return;
        }

        try {
            const tokens = marked.lexer(markdownText);
            let renderedHtml = '';
            const sectionsInUnit: { id: string; text: string }[] = [];

            let sectionCounter = 0;
            tokens.forEach((token: any) => {
                if (token.type === 'heading' && token.depth === 1) {
                    if (!notesTitle) { // Only set title once from the first H1
                        setNotesTitle(token.text);
                    }
                } else if (token.type === 'heading' && token.depth === 2) {
                    const sectionId = `unit-${unitIndex}-section-${++sectionCounter}`;
                    sectionsInUnit.push({ id: sectionId, text: token.text });

                    const isCompleted = loadCompletionStatus(unitIndex, sectionId);
                    const completionClass = isCompleted ? 'completed' : 'incomplete';
                    const completionText = isCompleted ? 'Completed' : 'Mark as Completed';
                    const completionIcon = isCompleted ? 'fas fa-check-circle' : 'far fa-circle';

                    renderedHtml += `
                        <div class="section-header-container">
                            <h2 id="${sectionId}">${token.text}</h2>
                            <button class="section-completion-button ${completionClass}"
                                    data-unit-index="${unitIndex}"
                                    data-section-id="${sectionId}"
                                    contentEditable = 'false'>
                                <i class="${completionIcon} mr-1"></i> ${completionText}
                            </button>
                        </div>
                    `;
                } else {
                    renderedHtml += marked.parse(token.raw);
                }
            });

            if (!notesTitle) {
                setNotesTitle(`${unitName}: ${CURRENT_SUBJECT} Notes`);
            }

            setMarkdownHtml(renderedHtml);
            setNotesDuration(`Approx ${Math.ceil(markdownText.length / 1000)} min read`);

            // Scroll to section after rendering
            if (sectionIdToScrollTo && markdownDisplayRef.current) {
                setTimeout(() => { // Timeout to ensure DOM is updated
                    const targetSectionElement = markdownDisplayRef.current?.querySelector(`#${sectionIdToScrollTo}`);
                    if (targetSectionElement) {
                        targetSectionElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 0);
            }

            // Attach event listeners to section completion buttons after content is rendered
            // This needs to be done imperatively as they are part of dangerouslySetInnerHTML
            setTimeout(() => {
                document.querySelectorAll('.section-completion-button').forEach(button => {
                    const btnUnitIndex = parseInt((button as HTMLElement).dataset.unitIndex || '0');
                    const btnSectionId = (button as HTMLElement).dataset.sectionId || '';
                    // Update initial state
                    const isCompleted = loadCompletionStatus(btnUnitIndex, btnSectionId);
                    (button as HTMLElement).innerHTML = `<i class="${isCompleted ? 'fas fa-check-circle' : 'far fa-circle'} mr-1"></i> ${isCompleted ? 'Completed' : 'Complete'}`;
                    button.classList.toggle('completed', isCompleted);
                    button.classList.toggle('incomplete', !isCompleted);


                    button.onclick = () => {
                        const currentStatus = loadCompletionStatus(btnUnitIndex, btnSectionId);
                        saveCompletionStatus(btnUnitIndex, btnSectionId, !currentStatus);
                        // Update the button's appearance immediately after saving
                        const newStatus = !currentStatus;
                        (button as HTMLElement).innerHTML = `<i class="${newStatus ? 'fas fa-check-circle' : 'far fa-circle'} mr-1"></i> ${newStatus ? 'Completed' : 'Complete'}`;
                        button.classList.toggle('completed', newStatus);
                        button.classList.toggle('incomplete', !newStatus);
                    };
                });
            }, 0); // Small timeout to ensure buttons are in DOM
        } catch (error) {
            console.error('Error parsing markdown:', error);
            setMarkdownHtml(`
                <div class="text-center py-12 text-red-500 dark:text-red-400">
                    <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                    <div class="text-lg">An error occurred while displaying notes for ${unitName}.</div>
                </div>
            `);
            setNotesTitle(`${unitName}: Error Displaying Notes`);
            setNotesDuration('');
        }
    };

    const displayHomePage = (): void => {
        setCurrentActiveUnit(null);
        setIsHomePage(true);
        setNotesTitle('');
        setNotesDuration('');
        setMarkdownHtml(''); // Cleared to be replaced by home page content
        updateContinueLessonButton(); // Ensure the continue button is always up-to-date
    };

    // --- Editor Toolbar Actions ---
    const applyEditorCommand = (command: string, value: string | null = null) => {
        if (markdownDisplayRef.current) {
            markdownDisplayRef.current.focus(); // Ensure the div is focused
            document.execCommand(command, false, value);
        }
    };

    // --- Effects ---
    useEffect(() => {
        // Initial load: display home page
        displayHomePage();
    }, []);

    // Effect to update sidebar section completion icons
    useEffect(() => {
        if (!isHomePage && currentActiveUnit !== null) {
            const unitContent = UNIT_NOTES_CONTENT[currentActiveUnit];
            if (unitContent) {
                const tokens = marked.lexer(unitContent);
                let sectionCounter = 0;
                tokens.forEach((token: any) => {
                    if (token.type === 'heading' && token.depth === 2) {
                        const sectionId = `unit-${currentActiveUnit}-section-${++sectionCounter}`;
                        const sectionLink = document.querySelector(`.unit-sections-container a[data-section-id="${sectionId}"]`);
                        if (sectionLink) {
                            const isCompleted = loadCompletionStatus(currentActiveUnit, sectionId);
                            let checkIcon = sectionLink.querySelector('.section-completion-icon');
                            if (!checkIcon) {
                                checkIcon = document.createElement('i');
                                checkIcon.className = 'section-completion-icon fas fa-check-circle text-green-500 text-xs';
                                sectionLink.appendChild(checkIcon);
                            }
                            (checkIcon as HTMLElement).style.display = isCompleted ? 'inline-block' : 'none';
                        }
                    }
                });
            }
        }
        // This effect also triggers when lastViewedLesson state changes, which updates home page progress
        updateContinueLessonButton();
    }, [currentActiveUnit, isHomePage, lastViewedLesson]); // Re-run when active unit or home page status changes, or a completion status updates

    // Render logic for sidebar unit buttons and their sections
    const renderUnitButtons = () => {
        const buttons = [];
        for (let i = 1; i <= TOTAL_UNITS; i++) {
            const unitName = `${UNIT_PREFIX} ${i}`;
            let unitTitleWithoutPrefix = unitName;

            const markdownContent = UNIT_NOTES_CONTENT[i];
            if (markdownContent) {
                const tokens = marked.lexer(markdownContent);
                const h1Token = tokens.find((token: any) => token.type === 'heading' && token.depth === 1);
                if (h1Token) {
                    unitTitleWithoutPrefix = h1Token.text;
                    if (unitTitleWithoutPrefix.startsWith(`${unitName}:`)) {
                        unitTitleWithoutPrefix = unitTitleWithoutPrefix.substring(`${unitName}:`.length).trim();
                    }
                }
            }

            const sectionsInUnit: { id: string; text: string }[] = [];
            if (markdownContent) {
                const tokens = marked.lexer(markdownContent);
                let sectionCounter = 0;
                tokens.forEach((token: any) => {
                    if (token.type === 'heading' && token.depth === 2) {
                        const sectionId = `unit-${i}-section-${++sectionCounter}`;
                        sectionsInUnit.push({ id: sectionId, text: token.text });
                    }
                });
            }

            buttons.push(
                <React.Fragment key={`unit-${i}`}>
                    <button
                        className={`unit-button w-full text-left px-3 py-2 rounded-[15px] text-md font-medium flex items-center justify-between shadow-sm ${currentActiveUnit === i ? 'active' : ''}`}
                        onClick={() => fetchAndDisplayNote(i)}
                    >
                        <span><span style={{ fontWeight: 900 }}>{unitName}:</span> {unitTitleWithoutPrefix}</span>
                    </button>
                    {currentActiveUnit === i && (
                        <div className="unit-sections-container space-y-1 mt-2 mb-2 ml-4 border-l border-l-[2px] border-gray-200 dark:border-gray-600">
                            {sectionsInUnit.map(section => {
                                const isCompleted = loadCompletionStatus(i, section.id);
                                return (
                                    <a
                                        key={section.id}
                                        href={`#${section.id}`}
                                        className={`section-link ${lastViewedLesson?.unitIndex === i && lastViewedLesson?.sectionId === section.id ? 'active-section' : ''}`}
                                        data-section-id={section.id}
                                        data-unit-index={i}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            saveLastViewedLessonToStorage(i, section.id);
                                            fetchAndDisplayNote(i, section.id); // Re-fetch to scroll and activate
                                        }}
                                    >
                                        <span className="section-link-text">{section.text}</span>
                                        <i className={`section-completion-icon fas fa-check-circle text-green-500 text-xs ${isCompleted ? 'inline-block' : 'hidden'}`}></i>
                                    </a>
                                );
                            })}
                        </div>
                    )}
                </React.Fragment>
            );
        }
        return buttons;
    };

    // Render logic for the Home Page content
    const renderHomePageContent = () => {
        const continueButtonContent = lastViewedLesson ? (
            <>
                <i className="fas fa-arrow-right text-blue-500 text-3xl mb-2"></i>
                <span className="font-semibold text-gray-800 dark:text-gray-200">Continue to Lesson</span>
                <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Unit {lastViewedLesson.unitIndex}: {
                        (() => {
                            const unitContent = UNIT_NOTES_CONTENT[lastViewedLesson.unitIndex];
                            if (unitContent) {
                                const tokens = marked.lexer(unitContent);
                                let sectionCounter = 0;
                                for (const token of tokens) {
                                    if (token.type === 'heading' && token.depth === 2) {
                                        sectionCounter++;
                                        const currentSectionId = `unit-${lastViewedLesson.unitIndex}-section-${sectionCounter}`;
                                        if (currentSectionId === lastViewedLesson.sectionId) {
                                            return token.text;
                                        }
                                    }
                                }
                            }
                            return `Section ${lastViewedLesson.sectionId.split('-').pop()}`;
                        })()
                    }
                </span>
            </>
        ) : (
            <>
                <i className="fas fa-play-circle text-blue-500 text-3xl mb-2"></i>
                <span className="font-semibold text-gray-800 dark:text-gray-200">Start Learning</span>
                <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">Begin your Chemistry journey</span>
            </>
        );

        return (
            <>
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-6 mb-8">
                    <div
                        id="continue-lesson-button"
                        className="continue-lesson-card"
                        onClick={() => {
                            if (lastViewedLesson) {
                                fetchAndDisplayNote(lastViewedLesson.unitIndex, lastViewedLesson.sectionId);
                            } else {
                                // Optionally navigate to first unit/section if no last lesson
                                // fetchAndDisplayNote(1, 'unit-1-section-1');
                            }
                        }}
                    >
                        {continueButtonContent}
                    </div>
                    <div className="flex flex-col flex-grow title-buttons-container">
                        <span className="text-4xl font-bold text-black">Edexcel IAL</span>
                        <div style={{ lineHeight: '1.3em', fontWeight: 'bold', marginTop: '10px', marginBottom: '10px', fontSize: '60px', color: 'var(--subject-primary-color)' }}>
                            {CURRENT_SUBJECT}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <button className="revision-tool-button">
                                <div className="icon-circle"><i className="fas fa-file-alt"></i></div>
                                <div className="text-content">
                                    <span className="main-text">2009-2023</span>
                                    <span className="sub-text">Past Papers</span>
                                </div>
                            </button>
                            <button className="revision-tool-button">
                                <div className="icon-circle"><i className="fas fa-chalkboard-teacher"></i></div>
                                <div className="text-content">
                                    <span className="main-text">AI Teacher</span>
                                    <span className="sub-text">& Grading</span>
                                </div>
                            </button>
                            <button className="revision-tool-button">
                                <div className="icon-circle"><i className="fas fa-bolt"></i></div>
                                <div className="text-content">
                                    <span className="main-text">Ask for</span>
                                    <span className="sub-text">Our Help</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <h2 className="home-page-section-title mb-4" style={{ color: 'black' }}>My Lessons</h2>
                <div id="lesson-pane" className="flex flex-row gap-6 mb-8 overflow-x-auto pb-4">
                    {Array.from({ length: TOTAL_UNITS }, (_, i) => i + 1).map(unitIndex => {
                        const { percentage, unitTitle } = calculateUnitProgress(unitIndex);
                        return (
                            <div
                                key={`unit-card-${unitIndex}`}
                                className="unit-card p-4 flex flex-col justify-between"
                                onClick={() => fetchAndDisplayNote(unitIndex)}
                            >
                                <div className="flex flex-col items-left mb-2 justify-flex-start grow">
                                    <span className="text-[var(--subject-primary-color)]" style={{ fontSize: '20px', fontWeight: 900 }}>{UNIT_PREFIX} {unitIndex}</span>
                                    <span className="text-black" style={{ fontSize: '15px' }}>{unitTitle}</span>
                                </div>
                                <div className="flex items-center mt-2 justify-center">
                                    <i className="fas fa-play-circle text-black mr-4" style={{ width: '40px', height: '40px', fontSize: '40px' }}></i>
                                    <div className="progress-bar-container flex-grow self-center">
                                        <div className="progress-bar-fill bg-green-500" style={{ width: `${percentage}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <h2 className="home-page-section-title mb-4 mt-8" style={{ color: 'black' }}>AI Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="ai-tool-card">
                        <div className="ai-tool-icon-circle">
                            <i className="fas fa-microphone"></i>
                        </div>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">AI Listening Practice</span>
                    </div>
                    <div className="ai-tool-card">
                        <div className="ai-tool-icon-circle">
                            <i className="fas fa-book-open"></i>
                        </div>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">AI Reading Generator</span>
                    </div>
                    <div className="ai-tool-card">
                        <div className="ai-tool-icon-circle">
                            <i className="fas fa-pencil-alt"></i>
                        </div>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">AI Writing Marker</span>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="w-full h-screen flex flex-col">
            {/* Header */}
            <header className="flex justify-between items-center p-4 bg-white border-b dark:bg-gray-800 dark:border-gray-700 h-[80px]">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        <a href="../../Revision.html" className="hover:underline">Revision Notes</a> / <span id="subject-title">{CURRENT_SUBJECT}</span>
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">Your comprehensive revision guide</p>
                </div>

                {/* Right side editing tools */}
                <div className="flex items-center space-x-2">
                    <button id="bold-button" className="editor-button" title="Bold" onClick={() => applyEditorCommand('bold')}>
                        <i className="fas fa-bold"></i>
                    </button>
                    <button id="underline-button" className="editor-button" title="Underline" onClick={() => applyEditorCommand('underline')}>
                        <i className="fas fa-underline"></i>
                    </button>
                    <div className="flex space-x-1">
                        <button id="highlight-yellow-button" className="highlight-button highlight-yellow" title="Highlight Yellow" onClick={() => applyEditorCommand('backColor', '#FFEB3B')}></button>
                        <button id="highlight-red-button" className="highlight-button highlight-red" title="Highlight Red" onClick={() => applyEditorCommand('backColor', '#EF535070')}></button>
                        <button id="highlight-blue-button" className="highlight-button highlight-blue" title="Highlight Blue" onClick={() => applyEditorCommand('backColor', '#42A5F570')}></button>
                        <button id="highlight-green-button" className="highlight-button highlight-green" title="Highlight Green" onClick={() => applyEditorCommand('backColor', '#22c45e70')}></button>
                    </div>
                    <button id="clear-effects-button" className="editor-button" title="Clear All Effects" onClick={() => applyEditorCommand('removeFormat')}>
                        <i className="fas fa-eraser"></i>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Navigation */}
                <div id="left-sidebar" className="w-80 bg-white border-r flex flex-col dark:bg-gray-800 dark:border-gray-700 overflow-y-auto p-4">
                    {/* Subject Home Button (combining Home and Subject) */}
                    <button
                        id="home-subject-button"
                        className={`home-subject-button w-full text-left px-4 py-3 rounded-[15px] text-lg font-semibold mb-4 flex items-center justify-center transition duration-200 ${isHomePage ? 'active' : ''}`}
                        onClick={displayHomePage}
                    >
                        <i id="sidebar-subject-icon" className={`${SUBJECT_ICON_CLASS} mr-3 text-xl`}></i>
                        <span id="sidebar-subject-name" style={{ fontWeight: 900 }}>Home</span>
                        <i className="fas fa-chevron-right ml-auto text-sm"></i>
                    </button>

                    {/* Learning Notes Section */}
                    <div className="mb-4">
                        <h3 className="text-md font-semibold text-gray-700 mb-2 dark:text-gray-300">Learning Notes</h3>
                        <div id="unit-buttons-container" className="space-y-4">
                            {renderUnitButtons()}
                        </div>
                    </div>
                </div>

                {/* Right Content Area - Notes Display */}
                <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-900 pl-[7.5%] pr-[15%]">
                    <div
                        className="max-w-4xl mx-auto markdown-content"
                        contentEditable={!isHomePage}
                        style={{ fontSize: '14px', outline: 'none' }}
                        ref={markdownDisplayRef}
                    >
                        {isHomePage ? (
                            renderHomePageContent()
                        ) : (
                            <>
                                {/* Title and Info */}
                                <div className="flex items-center justify-between mb-2">
                                    <h1 id="notes-title" className="text-4xl font-bold text-black">{notesTitle}</h1>
                                </div>
                                <p id="notes-info-text" className="text-gray-600 dark:text-gray-400 mb-6">
                                    Learning Notes | <span id="notes-duration">{notesDuration}</span> | AI powered
                                </p>
                                <hr id="notes-divider" className="border-t border-gray-300 dark:border-gray-700 my-6" />

                                {/* Markdown content will be rendered here */}
                                <div id="markdown-display" className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: markdownHtml }}>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
