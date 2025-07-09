"use client"; // This directive marks the component as a client component, allowing React hooks to be used.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Define the type for paper data, matching the structure from URL parameters
interface PaperData {
    subject: string;
    paper: string;
    series: string;
    year: string;
    examBoard: string;
    examLevel: string;
    type?: string;
}

// Define the type for the timer state
interface TimerState {
    totalSeconds: number;
    initialTotalSeconds: number;
    isRunning: boolean;
}

const EXAM_MONTH_MAP: { [key: string]: string } = {
    'Jan': 'January',
    'Jun': 'June',
    'Oct': 'October',
    'Nov': 'November'
};

const IAL_SUBJECT_PREFIXES: { [key: string]: string } = {
    'Physics': 'WPH',
    'Chemistry': 'WCH',
    'Biology': 'WBI'
};

const DEFAULT_DURATIONS_SECONDS = {
    'Math': (1 * 3600) + (30 * 60), // 1 hour 30 minutes
    'OtherSubjects': {
        'Unit 1-2': (1 * 3600) + (30 * 60), // 1 hour 30 minutes
        'Unit 3/6': (1 * 3600) + (20 * 60), // 1 hour 20 minutes
        'Unit 4-5': (1 * 3600) + (45 * 60),  // 1 hour 45 minutes
        'Chi Paper 1': (0 * 3600) + (30 * 60),
        'Chi Paper 2': (1 * 3600) + (45 * 60)
    }
};

const BASE_PDF_URL = 'https://www.aiaiblock.com/AIToLearn/PastPaperNew';

const App: React.FC = () => {
    // State variables
    const [paperTitle, setPaperTitle] = useState<string>('Loading Paper...');
    const [qpPdfUrl, setQpPdfUrl] = useState<string>('');
    const [msPdfUrl, setMsPdfUrl] = useState<string>('');
    const [currentMode, setCurrentMode] = useState<'doPaper' | 'reviewPaper'>('doPaper');
    const [currentLayout, setCurrentLayout] = useState<'fullScreen' | 'splitScreen'>('splitScreen');
    const [timer, setTimer] = useState<TimerState>({ totalSeconds: 0, initialTotalSeconds: 0, isRunning: false });
    const [showTimerSettingsModal, setShowTimerSettingsModal] = useState<boolean>(false);
    const [modalTime, setModalTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [paperData, setPaperData] = useState<PaperData>({
        subject: '', paper: '', series: '', year: '', examBoard: '', examLevel: ''
    });
    const [showAudioPlayerButton, setShowAudioPlayerButton] = useState<boolean>(false);
    const [showCompactAudioPlayer, setShowCompactAudioPlayer] = useState<boolean>(false);
    const [audioLanguage, setAudioLanguage] = useState<string>('Mandarin');
    const audioPlayerRef = useRef<HTMLAudioElement>(null);

    // Helper Functions (converted to useCallback for memoization)

    /**
     * Parses URL query parameters into a plain JavaScript object.
     * @returns {Object} An object containing all URL parameters as key-value pairs.
     */
    const getUrlParams = useCallback((): PaperData => {
        const params = new URLSearchParams(window.location.search);
        const data: Partial<PaperData> = {};
        for (const [key, value] of params.entries()) {
            (data as any)[key] = value;
        }
        return data as PaperData;
    }, []);

    /**
     * Returns the full month name from its abbreviation.
     * @param {string} abbr - The abbreviated month name (e.g., 'Jan', 'Jun', 'Oct').
     * @returns {string} The full month name (e.g., 'January', 'June', 'October').
     */
    const getFullMonthName = useCallback((abbr: string): string => {
        return EXAM_MONTH_MAP[abbr] || abbr;
    }, []);

    /**
     * Determines the specific paper code (e.g., WPH14, WMA11) based on subject and paper name.
     * @param {string} subject - The subject of the paper (e.g., 'Physics', 'Math').
     * @param {string} paper - The paper identifier (e.g., 'Unit 4', 'P1', 'M1').
     * @returns {string} The formatted paper code, or an empty string if no match.
     */
    const getSpecificPaperCode = useCallback((subject: string, paper: string): string => {
        if (subject === 'Math') {
            const paperPrefixMatch = paper.match(/^(P|M|FP|S|D)/i);
            const paperNumberMatch = paper.match(/\d+$/);

            if (!paperPrefixMatch || !paperNumberMatch) return '';

            const prefixChar = paperPrefixMatch[1].toUpperCase();
            const number = paperNumberMatch[0];

            switch (prefixChar) {
                case 'P': return `WMA1${number}`;
                case 'M': return `WME0${number}`;
                case 'S': return `WST0${number}`;
                case 'D': return `WDM1${number}`;
                case 'FP': return `WFM0${number}`;
                default: return '';
            }
        } else {
            const prefix = IAL_SUBJECT_PREFIXES[subject as string];
            const unitNumberMatch = paper.match(/Unit\s*(\d+)/i);
            if (prefix && unitNumberMatch && unitNumberMatch[1]) {
                return `${prefix}1${unitNumberMatch[1]}`;
            }
        }
        return '';
    }, []);

    /**
     * Constructs the full URL for either the Question Paper (QP) or Mark Scheme (MS) PDF.
     * @param {string} type - 'qp' for Question Paper, 'ms' for Mark Scheme.
     * @returns {string} The complete URL to the PDF file.
     */
    const getPdfUrl = useCallback((type: 'qp' | 'ms', currentPaperData: PaperData): string => {
        const abbreviatedMonth = currentPaperData.series;
        const fullMonth = getFullMonthName(currentPaperData.series);
        const year = currentPaperData.year;
        const subject = currentPaperData.subject;
        const paper = currentPaperData.paper;
        const examLevel = currentPaperData.examLevel;

        const folder = type === 'qp' ? 'Question-paper' : 'Mark-scheme';
        const filenamePrefix = type === 'qp' ? 'Questionpaper' : 'Markscheme';

        let filenameIdentifier = '';

        if (examLevel === 'IGCSE') {
            const paperNumberMatch = paper.match(/\d+$/);
            if (paper.toLowerCase().startsWith('paper') && paperNumberMatch) {
                filenameIdentifier = `Paper${paperNumberMatch[0]}`;
            } else {
                filenameIdentifier = paper.replace(/\s+/g, '');
            }
        } else { // IAL
            if (subject === 'Math') {
                const mathPaperNumberMatch = paper.match(/\d+$/);
                if (mathPaperNumberMatch) {
                    filenameIdentifier = `Unit${mathPaperNumberMatch[0]}`;
                } else {
                    filenameIdentifier = paper.replace(/\s+/g, '');
                }
            } else {
                const unitMatch = paper.match(/Unit\s*(\d+)/i);
                if (unitMatch) {
                    filenameIdentifier = `Unit${unitMatch[1]}`;
                } else {
                    filenameIdentifier = paper.replace(/\s+/g, '');
                }
            }
        }

        const specificPaperCode = getSpecificPaperCode(subject, paper);
        let filenameBase = `${filenamePrefix}-${filenameIdentifier}`;
        const codePart = specificPaperCode ? `(${specificPaperCode})` : '';

        const url = `${BASE_PDF_URL}/${subject}/${year} ${abbreviatedMonth}/${folder}/${filenameBase}${codePart}-${fullMonth}${year}.pdf`;
        console.log(`Generated PDF URL for ${type}: ${url}`);
        return url;
    }, [getFullMonthName, getSpecificPaperCode]);

    /**
     * Constructs the full URL for the listening audio MP3 for Chinese papers.
     * @param {string} series - The abbreviated month series (e.g., 'Nov').
     * @param {string} year - The year (e.g., '2023').
     * @param {string} language - The language of the recording (e.g., 'Mandarin', 'Cantonese').
     * @returns {string} The complete URL to the MP3 file.
     */
    const getAudioUrl = useCallback((series: string, year: string, language: string): string => {
        const abbreviatedMonth = series;
        const fullMonth = getFullMonthName(series);
        const paperNumber = paperData.paper.replace(/\s/g, '');

        const url = `${BASE_PDF_URL}/Chinese/${year} ${abbreviatedMonth}/Listening-Examinations-MP3/Recording-${paperNumber}(${language})-${fullMonth}${year}.mp3`;
        console.log(`Generated Audio URL: ${url}`);
        return url;
    }, [getFullMonthName, paperData.paper]);

    /**
     * Sets the default timer duration based on the paper's subject and unit.
     * Updates `initialTotalSeconds` and `totalSeconds`.
     */
    const setDefaultTimerDuration = useCallback((currentPaperData: PaperData) => {
        const subject = currentPaperData.subject;
        const paper = currentPaperData.paper;
        let durationInSeconds = 0;

        if (subject === 'Math') {
            durationInSeconds = DEFAULT_DURATIONS_SECONDS.Math;
        } else if (subject === 'Chinese') {
            const unitMatch = paper.match(/Paper\s*(\d+)/i);
            if (unitMatch && unitMatch[1]) {
                const unitNumber = parseInt(unitMatch[1]);
                if (unitNumber === 1) {
                    durationInSeconds = DEFAULT_DURATIONS_SECONDS.OtherSubjects['Chi Paper 1'];
                } else if (unitNumber === 2) {
                    durationInSeconds = DEFAULT_DURATIONS_SECONDS.OtherSubjects['Chi Paper 2'];
                }
            } else {
                durationInSeconds = DEFAULT_DURATIONS_SECONDS.OtherSubjects['Unit 1-2'];
            }
        } else {
            const unitMatch = paper.match(/Unit\s*(\d+)/i);
            if (unitMatch && unitMatch[1]) {
                const unitNumber = parseInt(unitMatch[1]);
                if (unitNumber >= 1 && unitNumber <= 2) {
                    durationInSeconds = DEFAULT_DURATIONS_SECONDS.OtherSubjects['Unit 1-2'];
                } else if (unitNumber === 3 || unitNumber === 6) {
                    durationInSeconds = DEFAULT_DURATIONS_SECONDS.OtherSubjects['Unit 3/6'];
                } else if (unitNumber >= 4 && unitNumber <= 5) {
                    durationInSeconds = DEFAULT_DURATIONS_SECONDS.OtherSubjects['Unit 4-5'];
                } else {
                    durationInSeconds = DEFAULT_DURATIONS_SECONDS.OtherSubjects['Unit 1-2'];
                }
            } else {
                durationInSeconds = DEFAULT_DURATIONS_SECONDS.OtherSubjects['Unit 1-2'];
            }
        }
        setTimer(prev => ({ ...prev, totalSeconds: durationInSeconds, initialTotalSeconds: durationInSeconds }));
    }, []);

    /**
     * Formats a total number of seconds into an HH:MM:SS string.
     * @param {number} seconds - The total number of seconds to format.
     * @returns {string} The formatted time string (e.g., "01:05:30").
     */
    const formatTime = useCallback((seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return [hours, minutes, remainingSeconds]
            .map(unit => String(unit).padStart(2, '0'))
            .join(':');
    }, []);

    /**
     * Toggles the timer between running and paused states.
     */
    const toggleTimer = useCallback(() => {
        setTimer(prev => ({ ...prev, isRunning: !prev.isRunning }));
    }, []);

    /**
     * Resets the timer to its initial/last manually set duration, stops it, and updates the display.
     */
    const resetTimer = useCallback(() => {
        setTimer(prev => ({ ...prev, totalSeconds: prev.initialTotalSeconds, isRunning: false }));
    }, []);

    /**
     * Opens the timer settings modal, pre-filling the input fields
     * with the current timer's hours, minutes, and seconds.
     */
    const openTimerSettings = useCallback(() => {
        const hours = Math.floor(timer.totalSeconds / 3600);
        const minutes = Math.floor((timer.totalSeconds % 3600) / 60);
        const seconds = timer.totalSeconds % 60;
        setModalTime({ hours, minutes, seconds });
        setShowTimerSettingsModal(true);
    }, [timer.totalSeconds]);

    /**
     * Closes the timer settings modal.
     */
    const closeTimerSettings = useCallback(() => {
        setShowTimerSettingsModal(false);
    }, []);

    /**
     * Sets the timer's total seconds based on the values entered in the modal inputs.
     * Updates `initialTotalSeconds` for future resets.
     * Resets and restarts the timer if it was running.
     */
    const setTimerFromInput = useCallback(() => {
        const newDuration = (modalTime.hours * 3600) + (modalTime.minutes * 60) + modalTime.seconds;
        setTimer(prev => ({
            ...prev,
            totalSeconds: newDuration,
            initialTotalSeconds: newDuration,
            isRunning: prev.isRunning // Keep running state as is, or restart if desired
        }));
        setShowTimerSettingsModal(false);
    }, [modalTime.hours, modalTime.minutes, modalTime.seconds]);

    /**
     * Toggles the visibility of the compact audio player.
     */
    const toggleCompactAudioPlayer = useCallback(() => {
        setShowCompactAudioPlayer(prev => !prev);
    }, []);

    /**
     * Closes the compact audio player.
     */
    const closeCompactAudioPlayer = useCallback(() => {
        setShowCompactAudioPlayer(false);
    }, []);

    /**
     * Updates the audio player's source based on the selected language.
     */
    const updateAudioLanguage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedLanguage = event.target.value;
        setAudioLanguage(selectedLanguage);
        if (audioPlayerRef.current) {
            const newAudioUrl = getAudioUrl(paperData.series, paperData.year, selectedLanguage);
            const wasPlaying = !audioPlayerRef.current.paused;
            audioPlayerRef.current.src = newAudioUrl;
            audioPlayerRef.current.load();
            if (wasPlaying) {
                audioPlayerRef.current.play().catch(e => console.error("Audio playback failed:", e));
            }
        }
    }, [getAudioUrl, paperData.series, paperData.year]);

    // Effects

    // Initial load effect for parsing URL and setting up paper data
    useEffect(() => {
        const params = getUrlParams();
        setPaperData(params);

        if (!params.subject || !params.paper || !params.series || !params.year) {
            setPaperTitle("Error: Paper details missing in URL. Please go back to the previous page and select a paper.");
            return;
        }

        setPaperTitle(`${params.subject} ${params.paper} (${params.series} ${params.year})`);
        setQpPdfUrl(getPdfUrl('qp', params));
        setMsPdfUrl(getPdfUrl('ms', params));

        const initialPdfType = params.type || 'qp';
        if (initialPdfType === 'ms') {
            setCurrentMode('reviewPaper');
        } else {
            setCurrentMode('doPaper');
        }
        setCurrentLayout('fullScreen'); // Always start in split screen

        setDefaultTimerDuration(params);

        if (params.subject === 'Chinese' && params.examLevel === 'IGCSE' && params.paper.toLowerCase().includes('paper 1')) {
            setShowAudioPlayerButton(true);
            // Set initial audio source to Mandarin (default selected radio)
            if (audioPlayerRef.current) {
                audioPlayerRef.current.src = getAudioUrl(params.series, params.year, 'Mandarin');
            }
        } else {
            setShowAudioPlayerButton(false);
        }

        // Dark mode preference
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (event: MediaQueryListEvent) => {
            if (event.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };
        document.documentElement.classList.toggle('dark', mediaQuery.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [getUrlParams, getPdfUrl, getAudioUrl, setDefaultTimerDuration]);

    // Timer interval effect
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (timer.isRunning && timer.totalSeconds > 0) {
            interval = setInterval(() => {
                setTimer(prev => ({ ...prev, totalSeconds: prev.totalSeconds - 1 }));
            }, 1000);
        } else if (timer.totalSeconds === 0 && timer.isRunning) {
            setTimer(prev => ({ ...prev, isRunning: false }));
            // Optional: Play a sound or show a "Time's up!" message
            console.log("Time's up!");
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timer.isRunning, timer.totalSeconds]);

    // Render logic for panel visibility
    const renderPanelLayout = () => {
        let qpPanelClasses = 'flex-grow';
        let rightPanelClasses = 'flex-grow';
        let showAnswerTextarea = false;
        let showMsIframe = false;

        if (currentMode === 'doPaper') {
            if (currentLayout === 'fullScreen') {
                qpPanelClasses += ' w-full';
                rightPanelClasses += ' hidden';
            } else { // splitScreen
                qpPanelClasses += ' w-1/2';
                rightPanelClasses += ' w-1/2';
                showAnswerTextarea = true;
            }
        } else { // currentMode === 'reviewPaper'
            if (currentLayout === 'fullScreen') {
                qpPanelClasses += ' hidden';
                rightPanelClasses += ' w-full';
                showMsIframe = true;
            } else { // splitScreen
                qpPanelClasses += ' w-1/2';
                rightPanelClasses += ' w-1/2';
                showMsIframe = true;
            }
        }

        return (
            <div id="content-area" className="flex-grow flex overflow-hidden">
                <div id="qp-panel" className={qpPanelClasses}>
                    <iframe id="qp-iframe" className="pdf-frame" src={qpPdfUrl}></iframe>
                </div>

                <div id="right-panel" className={`${rightPanelClasses} ${rightPanelClasses.includes('hidden') ? 'hidden' : ''}`}>
                    {showAnswerTextarea && (
                        <textarea id="answer-textarea" className="w-full h-full p-4" placeholder="Write your answers here..."></textarea>
                    )}
                    {showMsIframe && (
                        <iframe id="ms-iframe" className="pdf-frame" src={msPdfUrl}></iframe>
                    )}
                </div>
            </div>
        );
    };

    useEffect(() => {
        if (typeof document !== 'undefined') {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            document.head.appendChild(link);
            return () => {
                if (document.head.contains(link)) {
                    document.head.removeChild(link);
                }
            };
        }
    }, []);

    return (
        <div className="antialiased h-screen flex flex-col">
            {/* Tailwind CSS and FontAwesome are loaded via CDN in index.html or a similar setup */}
            <style>
                {`
                /* Custom styles for the app */
                :root {
                    --primary-color: #FF3B30; /* Ensure this matches tailwind.config.theme.extend.colors.primary */
                }
                body {
                    font-family: 'Inter', sans-serif;
                    background-color: #f8f9fa;
                    color: #333;
                    overflow: hidden; /* Prevent body scroll, content will scroll */
                }
                .dark body {
                    background-color: #1a202c; /* gray-900 */
                    color: #e2e8f0; /* gray-200 */
                }
                .pdf-frame {
                    width: 100%;
                    height: 100%;
                    border: none;
                }
                .answer-area {
                    background-color: #ffffff;
                    border-left: 1px solid #e2e8f0;
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                }
                .dark .answer-area {
                    background-color: #2d3748; /* gray-800 */
                    border-left-color: #4a5568; /* gray-700 */
                }
                textarea {
                    flex-grow: 1; /* Make textarea fill available space */
                    width: 100%;
                    border: 1px solid #cbd5e1;
                    border-radius: 0.375rem;
                    padding: 0.75rem;
                    resize: none; /* Disable manual resize */
                    font-family: 'Inter', sans-serif;
                    font-size: 0.9rem;
                    line-height: 1.5;
                    background-color: #f7fafc;
                    color: #1a202c;
                }
                .dark textarea {
                    background-color: #4a5568; /* gray-700 */
                    color: #e2e8f0; /* gray-200 */
                    border-color: #4a5568; /* gray-700 */
                }
                .timer-display {
                    font-variant-numeric: tabular-nums; /* Align numbers in monospace font */
                }
                .modal-overlay {
                    background-color: rgba(0, 0, 0, 0.7);
                }
                /* Style for active buttons in the navbar modes/layouts */
                .nav-btn-active {
                    background-color: var(--primary-color);
                    color: white;
                }
                .nav-btn-inactive {
                    background-color: rgb(243 244 246); /* Tailwind gray-100 */
                    color: rgb(55 65 81); /* Tailwind gray-700 */
                }
                .dark .nav-btn-inactive {
                    background-color: rgb(55 65 81); /* Tailwind gray-700 */
                    color: rgb(229 231 235); /* Tailwind gray-200 */
                }

                /* Specific styles for the new audio overlay button and player */
                .audio-toggle-button {
                    width: 60px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background-color: #007bff; /* Blue for visibility */
                    color: white;
                    font-size: 1.5rem;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
                    cursor: pointer;
                    transition: background-color 0.3s, transform 0.2s;
                }
                .audio-toggle-button:hover {
                    background-color: #0056b3;
                    transform: scale(1.05);
                }
                

                .audio-player-compact {
                    width: 300px; /* Limit width */
                    padding: 1rem;
                    background-color: white;
                    border-radius: 0.75rem; /* rounded-lg */
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-xl */
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem; /* space-y-3 */
                }
                .dark .audio-player-compact {
                    background-color: #2d3748; /* gray-800 */
                }
                .audio-player-compact audio {
                    width: 100%;
                    height: 30px;
                }
                .audio-player-compact .language-options label {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                }
                .audio-player-compact .language-options input[type="radio"] {
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                    width: 1rem;
                    height: 1rem;
                    border: 2px solid #ccc;
                    border-radius: 50%;
                    outline: none;
                    transition: border-color 0.2s;
                    position: relative;
                }
                .audio-player-compact .language-options input[type="radio"]:checked {
                    border-color: #007bff;
                }
                .audio-player-compact .language-options input[type="radio"]:checked::before {
                    content: '';
                    width: 0.5rem;
                    height: 0.5rem;
                    background-color: #007bff;
                    border-radius: 50%;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
                `}
            </style>
            {/* Top Navbar */}
            <nav className="flex-shrink-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-4">
                    <button onClick={() => window.history.back()} className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">{paperTitle}</h1>
                </div>

                <div className="flex items-center justify-end space-x-6 grow">
                    {/* Timer Section */}
                    <div className="flex items-center space-x-0 bg-[#00000010] pl-4 rounded-full">
                        <span className="timer-display text-2xl font-mono font-bold text-gray-900 dark:text-gray-100 mr-4">
                            {formatTime(timer.totalSeconds)}
                        </span>
                        <button onClick={toggleTimer} className="p-2 rounded-full hover:bg-[#00000010] dark:hover:bg-gray-700 transition w-[40px] h-[40px]" title="Play/Pause Timer">
                            {timer.isRunning ? (
                                <svg className="h-6 w-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                            ) : (
                                <svg className="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            )}
                        </button>
                        <button onClick={resetTimer} className="p-2 rounded-full hover:bg-[#00000010] dark:hover:bg-gray-700 transition w-[40px] h-[40px]" title="Reset Timer">
                            <i className="fas fa-stop-circle"></i>
                        </button>
                        <button onClick={openTimerSettings} className="p-0 rounded-full hover:bg-[#00000010] dark:hover:bg-gray-700 transition w-[40px] h-[40px]" title="Set Timer">
                            <i className="fas fa-sliders"></i>
                        </button>
                    </div>

                    {/* Mode Selection */}
                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 gap-1">
                        <button
                            onClick={() => setCurrentMode('doPaper')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition hover:brightness-[0.9] ${currentMode === 'doPaper' ? 'nav-btn-active' : 'nav-btn-inactive'}`}
                        >
                            Do Paper
                        </button>
                        <button
                            onClick={() => setCurrentMode('reviewPaper')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition hover:brightness-[0.9] ${currentMode === 'reviewPaper' ? 'nav-btn-active' : 'nav-btn-inactive'}`}
                        >
                            Review Paper
                        </button>
                    </div>

                    {/* Layout Selection */}
                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 gap-1">
                        <button
                            onClick={() => setCurrentLayout('fullScreen')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition hover:brightness-[0.9] ${currentLayout === 'fullScreen' ? 'nav-btn-active' : 'nav-btn-inactive'}`}
                            title="Full Screen Layout"
                        >
                            <i className="fas fa-window-maximize"></i>
                        </button>
                        <button
                            onClick={() => setCurrentLayout('splitScreen')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition hover:brightness-[0.9] ${currentLayout === 'splitScreen' ? 'nav-btn-active' : 'nav-btn-inactive'}`}
                            title="Split Screen Layout"
                        >
                            <i className="fas fa-columns"></i>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            {renderPanelLayout()}

            {/* Timer Settings Modal Overlay */}
            {showTimerSettingsModal && (
                <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50" onClick={(e) => e.target === e.currentTarget && closeTimerSettings()}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl w-full max-w-sm">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Set Timer Duration</h3>
                        <div className="mb-4">
                            <label htmlFor="hours-input" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Hours</label>
                            <input
                                type="number"
                                id="hours-input"
                                min="0"
                                max="99"
                                value={modalTime.hours}
                                onChange={(e) => setModalTime(prev => ({ ...prev, hours: parseInt(e.target.value) || 0 }))}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="minutes-input" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Minutes</label>
                            <input
                                type="number"
                                id="minutes-input"
                                min="0"
                                max="59"
                                value={modalTime.minutes}
                                onChange={(e) => setModalTime(prev => ({ ...prev, minutes: parseInt(e.target.value) || 0 }))}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="seconds-input" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Seconds</label>
                            <input
                                type="number"
                                id="seconds-input"
                                min="0"
                                max="59"
                                value={modalTime.seconds}
                                onChange={(e) => setModalTime(prev => ({ ...prev, seconds: parseInt(e.target.value) || 0 }))}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button onClick={closeTimerSettings} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>
                            <button onClick={setTimerFromInput} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-red-600 transition">Set Timer</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Audio Player Overlay */}
            <div id="audio-overlay-container" className="fixed bottom-4 left-4 z-50 flex items-end gap-3">
                {showAudioPlayerButton && (
                    <button onClick={toggleCompactAudioPlayer} className="audio-toggle-button">
                        <i className="fas fa-headphones"></i>
                    </button>
                )}

                {showCompactAudioPlayer && (
                    <div id="compact-audio-player" className="audio-player-compact">
                        <div className="flex justify-between items-center">
                            <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">Listening Recording</h3>
                            <button onClick={closeCompactAudioPlayer} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <audio ref={audioPlayerRef} controls className="w-full">
                            Your browser does not support the audio element.
                        </audio>
                        <div className="language-options flex justify-around text-gray-700 dark:text-gray-200 text-sm">
                            <label>
                                <input
                                    type="radio"
                                    name="audio-language"
                                    value="Mandarin"
                                    checked={audioLanguage === 'Mandarin'}
                                    onChange={updateAudioLanguage}
                                /> Mandarin
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="audio-language"
                                    value="Cantonese"
                                    checked={audioLanguage === 'Cantonese'}
                                    onChange={updateAudioLanguage}
                                /> Cantonese
                            </label>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
