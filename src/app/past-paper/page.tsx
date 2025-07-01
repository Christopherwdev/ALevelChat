"use client"; // Add this directive at the very top to mark it as a client component

import React, { useState, useEffect, useCallback, useRef } from 'react';
// Removed direct import: import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
// The ZXing library will now be loaded via a CDN script and accessed globally.

// Define TypeScript interfaces for better type safety
interface Paper {
    examBoard: string;
    examLevel: string;
    subject: string;
    paper: string;
    series: string;
    year: number | string;
    isComingSoon: boolean;
    id: string;
}

interface DisabledPaperConfig {
    examBoard: string | null;
    examLevel: string | null;
    subject: string | null;
    paper: string | null;
    series: string | null;
    year: number | null;
}

// --- CONFIGURATION ---
// Define subjects and their papers for each exam board and level
const papersConfig: Record<string, Record<string, Record<string, string[]>>> = {
    'Edexcel': {
        'IAL': {
            'Physics': ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5', 'Unit 6'],
            'Chemistry': ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5', 'Unit 6'],
            'Biology': ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5', 'Unit 6'],
            'Math': ['P1', 'P2', 'P3', 'P4', 'M1', 'M2', 'M3', 'FP1', 'FP2', 'FP3', 'S1', 'S2', 'S3', 'D1']
        },
        'IGCSE': {
            'Chinese': ['Paper 1', 'Paper 2']
            // 'Physics': ['1P', '2P'],
            // 'Chemistry': ['1C', '2C'],
            // 'Biology': ['1B', '2B'],
            // 'Math A': ['1F', '1H', '2F', '2H'],
            // 'Math B': ['Paper 1', 'Paper 2']
        }
    },
    'Cambridge': {
        'IAL': {}, // All subjects here will be "Coming Soon"
        'IGCSE': {} // All subjects here will be "Coming Soon"
    }
};

const allSeries = ['Jan', 'Jun', 'Oct', 'Nov'];
const years = [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011];

// --- DISABLED PAPERS CONFIGURATION ---
const disabledPapersConfig: DisabledPaperConfig[] = [
    { examBoard: 'Edexcel', examLevel: 'IAL', subject: 'Physics', paper: 'Unit 1', series: 'Jun', year: 2023 },
    { examBoard: "Edexcel", examLevel: "IGCSE", subject: "Chinese", series: "Nov", year: 2011, paper: null },
    { examBoard: "Edexcel", examLevel: "IGCSE", subject: "Chinese", series: "Nov", year: 2012, paper: null },
    { examBoard: "Edexcel", examLevel: "IGCSE", subject: "Chinese", series: "Nov", year: 2013, paper: null },
    { examBoard: "Edexcel", examLevel: "IGCSE", subject: "Chinese", series: "Nov", year: 2014, paper: null },
    { examBoard: "Edexcel", examLevel: "IGCSE", subject: "Chinese", series: "Nov", year: 2015, paper: null },
    { examBoard: "Edexcel", examLevel: "IGCSE", subject: "Chinese", series: "Jun", year: 2015, paper: null },
    { examBoard: "Edexcel", examLevel: "IGCSE", subject: "Chinese", series: "Nov", year: 2016, paper: null },
    { examBoard: "Edexcel", examLevel: "IGCSE", subject: "Chinese", series: "Nov", year: 2017, paper: null },
    { examBoard: "Edexcel", examLevel: "IGCSE", subject: "Chinese", series: "Nov", year: 2018, paper: null },
    { examBoard: "Edexcel", examLevel: "IGCSE", subject: "Chinese", series: "Nov", year: 2019, paper: null },
    { examBoard: "Edexcel", examLevel: "IGCSE", subject: "Chinese", series: "Jun", year: 2020, paper: null },
    { examBoard: "Edexcel", examLevel: "IGCSE", subject: "Chinese", series: "Jun", year: 2021, paper: null },
    { examBoard: "Edexcel", examLevel: "IGCSE", subject: "Chinese", series: "Nov", year: 2022, paper: null },
    { examBoard: "Edexcel", examLevel: "IGCSE", subject: "Math A", series: "Jan", year: 2011, paper: null },
    { examBoard: "Edexcel", examLevel: "IGCSE", subject: "Math A", series: "Nov", year: 2011, paper: null },
    { examBoard: "Edexcel", examLevel: "IGCSE", subject: "Math A", series: "Nov", year: 2012, paper: null },
    { examBoard: "Edexcel", examLevel: "IGCSE", subject: "Math A", series: "Nov", year: 2013, paper: null },
    { examBoard: "Edexcel", examLevel: "IGCSE", subject: "Math A", series: "Nov", year: 2014, paper: null },
    { examBoard: "Edexcel", examLevel: "IGCSE", subject: "Math A", series: "Nov", year: 2015, paper: null },
    { examBoard: "Edexcel", examLevel: "IGCSE", subject: "Math A", series: "Nov", year: 2016, paper: null },
    { examBoard: "Edexcel", examLevel: "IGCSE", subject: "Math A", series: "Nov", year: 2017, paper: null },
    { examBoard: "Edexcel", examLevel: "IGCSE", subject: "Math A", series: "Nov", year: 2018, paper: null },
    { examBoard: "Edexcel", examLevel: "IGCSE", subject: "Math A", series: "Nov", year: 2019, paper: null },
    { examBoard: "Edexcel", examLevel: "IGCSE", subject: "Math A", series: "Jun", year: 2020, paper: null },
    { examBoard: "Edexcel", examLevel: "IGCSE", subject: "Math A", series: "Nov", year: 2022, paper: null }
];

// Helper function to map abbreviated month to full month
const getFullMonthName = (abbr: string): string => {
    switch (abbr) {
        case 'Jan': return 'January';
        case 'Jun': return 'June';
        case 'Oct': return 'October';
        case 'Nov': return 'November';
        default: return '';
    }
};

// Function to check if a paper matches a disabled entry
const isPaperDisabled = (paper: Paper): boolean => {
    return disabledPapersConfig.some(disabledEntry => {
        const matchBoard = disabledEntry.examBoard === null || disabledEntry.examBoard === paper.examBoard;
        const matchLevel = disabledEntry.examLevel === null || disabledEntry.examLevel === paper.examLevel;
        const matchSubject = disabledEntry.subject === null || disabledEntry.subject === paper.subject;
        const matchPaper = disabledEntry.paper === null || disabledEntry.paper === paper.paper;
        const matchSeries = disabledEntry.series === null || disabledEntry.series === paper.series;
        const matchYear = disabledEntry.year === null || disabledEntry.year === paper.year;
        return matchBoard && matchLevel && matchSubject && matchPaper && matchSeries && matchYear;
    });
};

// Generate all papers based on the config
const generateAllPapers = (): Paper[] => {
    const generatedPapers: Paper[] = [];
    Object.entries(papersConfig).forEach(([board, levels]) => {
        Object.entries(levels).forEach(([level, subjects]) => {
            if (board === 'Cambridge') {
                const commonSubjects = ['Biology', 'Physics', 'Chemistry', 'Math'];
                commonSubjects.forEach(subject => {
                    const paper: Paper = {
                        examBoard: board,
                        examLevel: level,
                        subject: subject,
                        paper: 'N/A',
                        series: 'N/A',
                        year: 'N/A',
                        isComingSoon: true,
                        id: `${board}_${level}_${subject}_ComingSoon`.replace(/\s/g, '_')
                    };
                    if (!isPaperDisabled(paper)) {
                        generatedPapers.push(paper);
                    }
                });
            } else {
                Object.entries(subjects).forEach(([subject, papers]) => {
                    papers.forEach(paper => {
                        let seriesForThisPaper: string[] = [];

                        if (level === 'IAL') {
                            seriesForThisPaper = ['Jan', 'Jun', 'Oct'];
                            const specificMathPapers = ['FP1', 'FP2', 'FP3', 'S3', 'M3'];
                            if (subject === 'Math' && specificMathPapers.includes(paper)) {
                                seriesForThisPaper = ['Jan', 'Jun'];
                            }
                        } else if (level === 'IGCSE') {
                            seriesForThisPaper = ['Jan', 'Jun', 'Nov'];
                            if (subject === 'Chinese') {
                                seriesForThisPaper = ['Jun', 'Nov'];
                            }
                        }

                        seriesForThisPaper.forEach(serie => {
                            years.forEach(year => {
                                const newPaper: Paper = {
                                    examBoard: board,
                                    examLevel: level,
                                    subject,
                                    paper,
                                    series: serie,
                                    year,
                                    isComingSoon: false,
                                    id: `${board}_${level}_${subject}_${paper}_${serie}_${year}`.replace(/\s/g, '_')
                                };
                                if (!isPaperDisabled(newPaper)) {
                                    generatedPapers.push(newPaper);
                                }
                            });
                        });
                    });
                });
            }
        });
    });

    // Sort papers
    generatedPapers.sort((a, b) => {
        if (a.isComingSoon && !b.isComingSoon) return 1;
        if (!a.isComingSoon && b.isComingSoon) return -1;
        if (a.isComingSoon && b.isComingSoon) return 0;

        if (typeof a.year === 'number' && typeof b.year === 'number' && a.year !== b.year) return b.year - a.year;
        if (a.examLevel !== b.examLevel) return a.examLevel.localeCompare(b.examLevel);
        if (a.examBoard !== b.examBoard) return a.examBoard.localeCompare(b.examBoard);
        if (a.subject !== b.subject) return a.subject.localeCompare(b.subject);
        return a.paper.localeCompare(b.paper);
    });

    return generatedPapers;
};

const allPapers: Paper[] = generateAllPapers();

// Tailwind CSS configuration (moved here for React context)
const tailwindConfig = `
    tailwind.config = {
        darkMode: 'class',
        theme: {
            extend: {
                colors: {
                    primary: '#FF3B30',
                    biology: '#0FBD8C',
                    chemistry: '#FF8585',
                    physics: '#4081FF',
                    math: '#FFAB1A',
                    chinese: '#9C27B0'
                },
            },
        },
    };

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
`;

// Declare ZXing globally for TypeScript to recognize it
declare const ZXing: any;

const App: React.FC = () => {
    // State variables
    const [examLevel, setExamLevel] = useState<string>('IGCSE');
    const [examBoard, setExamBoard] = useState<string>('Edexcel');
    const [subject, setSubject] = useState<string>('');
    const [unit, setUnit] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isKeywordSearchActive, setIsKeywordSearchActive] = useState<boolean>(false);
    const [filteredPapers, setFilteredPapers] = useState<Paper[]>([]);
    const [isCameraOverlayOpen, setIsCameraOverlayOpen] = useState<boolean>(false);
    const [cameraStatus, setCameraStatus] = useState<string>('Starting camera...');
    const [detectedBarcode, setDetectedBarcode] = useState<string | null>(null);

    // Refs for DOM elements
    const videoRef = useRef<HTMLVideoElement>(null);
    // Initialize codeReaderRef with a type that can be null or the ZXing BrowserMultiFormatReader
    const codeReaderRef = useRef<any | null>(null); // Use 'any' for ZXing types due to CDN global access
    const streamRef = useRef<MediaStream | null>(null);

    // Helper to get subject color class
    const getSubjectColor = useCallback((subj: string): string => {
        switch (subj) {
            case 'Biology': return 'biology';
            case 'Chemistry': return 'chemistry';
            case 'Physics': return 'physics';
            case 'Math':
            case 'Math A':
            case 'Math B': return 'math';
            case 'Chinese': return 'chinese';
            default: return 'primary';
        }
    }, []);

    // Function to apply filters and search
    const applyFiltersAndSearch = useCallback((query: string) => {
        const lowerCaseQuery = query.toLowerCase().trim();
        setIsKeywordSearchActive(lowerCaseQuery.length > 0);

        let papersToFilter = allPapers.filter(paper =>
            paper.examLevel === examLevel &&
            paper.examBoard === examBoard
        );

        let currentFilteredPapers: Paper[];

        if (lowerCaseQuery.length > 0) {
            currentFilteredPapers = papersToFilter.filter(paper => {
                const paperFullText = `${paper.subject} ${paper.paper} ${paper.series} ${paper.year} ${getFullMonthName(paper.series)}`.toLowerCase();
                return paperFullText.includes(lowerCaseQuery);
            });
        } else {
            currentFilteredPapers = papersToFilter.filter(paper => {
                let matchSubject = true;
                let matchUnit = true;

                if (subject && paper.subject !== subject) {
                    matchSubject = false;
                }

                if (unit && paper.paper !== unit) {
                    matchUnit = false;
                }
                return matchSubject && matchUnit;
            });
        }
        setFilteredPapers(currentFilteredPapers);
    }, [examLevel, examBoard, subject, unit]); // Dependencies for useCallback

    // Effect to update subjects and units when exam level or board changes
    useEffect(() => {
        const subjectsForCurrentSelection = papersConfig[examBoard]?.[examLevel];
        let defaultSubject = '';
        if (subjectsForCurrentSelection && Object.keys(subjectsForCurrentSelection).length > 0) {
            defaultSubject = Object.keys(subjectsForCurrentSelection)[0];
        }
        setSubject(defaultSubject);
        // This will trigger the effect for `subject` which then updates units and filters
    }, [examLevel, examBoard]);

    // Effect to update units when subject changes
    useEffect(() => {
        const unitsForSubject = papersConfig[examBoard]?.[examLevel]?.[subject];
        let defaultUnit = '';
        if (unitsForSubject && unitsForSubject.length > 0) {
            defaultUnit = unitsForSubject[0];
        }
        setUnit(defaultUnit);
        // This will trigger the effect for `unit` which then updates filters
    }, [subject, examBoard, examLevel]);

    // Effect to apply filters whenever relevant state changes
    useEffect(() => {
        applyFiltersAndSearch(searchTerm);
    }, [searchTerm, examLevel, examBoard, subject, unit, applyFiltersAndSearch]);

    // Camera functions
    const startCamera = useCallback(() => {
        setCameraStatus('Starting camera...');
        setDetectedBarcode(null);

        // Ensure ZXing is available globally before trying to use it
        if (typeof ZXing === 'undefined' || !ZXing.BrowserMultiFormatReader) {
            setCameraStatus('ZXing library not loaded. Please try again.');
            console.error('ZXing library not available globally.');
            return;
        }

        if (!codeReaderRef.current) {
            codeReaderRef.current = new ZXing.BrowserMultiFormatReader();
        }

        codeReaderRef.current.getVideoInputDevices()
            .then((videoInputDevices: MediaDeviceInfo[]) => {
                if (videoInputDevices.length === 0) {
                    setCameraStatus('No camera found');
                    return;
                }

                const selectedDeviceId = videoInputDevices[0].deviceId;
                setCameraStatus('Camera ready - Point at barcode');

                if (videoRef.current) {
                    codeReaderRef.current.decodeFromVideoDevice(selectedDeviceId, videoRef.current, (result: any, err: any) => {
                        if (result) {
                            const code = result.getText();
                            if (/^p\w+a$/i.test(code)) {
                                setDetectedBarcode(code);
                                setCameraStatus('Barcode detected!');
                                stopCamera(); // Stop camera once barcode is detected
                            }
                        }
                        // Check if err is an instance of ZXing.NotFoundException
                        if (err && !(err instanceof ZXing.NotFoundException)) {
                            console.error(err);
                        }
                    });
                }
            })
            .catch((err: any) => {
                console.error(err);
                setCameraStatus('Error accessing camera');
            });
    }, []);

    const stopCamera = useCallback(() => {
        if (codeReaderRef.current) {
            codeReaderRef.current.reset();
        }
        if (videoRef.current?.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }, []);

    // Handle camera overlay open/close
    useEffect(() => {
        if (isCameraOverlayOpen) {
            startCamera();
        } else {
            stopCamera();
        }
        // Cleanup function for useEffect
        return () => {
            stopCamera();
        };
    }, [isCameraOverlayOpen, startCamera, stopCamera]);

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    const handleQuickFilterClick = (year: number) => {
        if (isKeywordSearchActive) return;
        // This is a simplified example; a more robust filter system would track active filters
        // For now, these quick filters will just refine the current view based on year.
        // This will override subject/unit selections if active in the UI, which might not be ideal.
        // A proper filter system would need an object to hold all active filters.
        const filteredPapersByYear = allPapers.filter(paper =>
            paper.examLevel === examLevel &&
            paper.examBoard === examBoard &&
            paper.year === year
        );
        setFilteredPapers(filteredPapersByYear);
    };

    const handlePaperAction = (paper: Paper, type: 'qp' | 'ms' | 'share') => {
        if (paper.isComingSoon) return;

        if (type === 'qp' || type === 'ms') {
            const params = new URLSearchParams({
                subject: paper.subject,
                paper: paper.paper,
                series: paper.series,
                year: paper.year.toString(),
                examBoard: examBoard,
                examLevel: examLevel
            }).toString();
            window.open(`past-paper/viewer?${params}&type=${type}`, '_blank');
        } else if (type === 'share') {
            const shareText = `${paper.examBoard} ${paper.examLevel} ${paper.subject} ${paper.paper} ${getFullMonthName(paper.series)} ${paper.year}`;
            if (navigator.share) {
                navigator.share({
                    title: 'Past Paper',
                    text: shareText,
                    url: window.location.href
                }).catch(error => console.error('Error sharing:', error));
            } else {
                navigator.clipboard.writeText(shareText).then(() => {
                    // Simple toast message (can be replaced with a proper UI component)
                    const toast = document.createElement('div');
                    toast.textContent = 'Paper details copied to clipboard!';
                    toast.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg transition-opacity duration-300 opacity-0';
                    document.body.appendChild(toast);
                    setTimeout(() => { toast.style.opacity = '1'; }, 10);
                    setTimeout(() => {
                        toast.style.opacity = '0';
                        toast.addEventListener('transitionend', () => toast.remove());
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy text:', err);
                });
            }
        }
    };

    const renderPapers = useCallback((papersToRender: Paper[]) => {
        if (papersToRender.length === 0) {
            return (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <div className="text-lg mb-2">No papers found</div>
                    <div className="text-sm">Try adjusting your search terms or filters</div>
                </div>
            );
        }

        const papersByYear: Record<string, Paper[]> = {};
        papersToRender.forEach(paper => {
            const yearKey = paper.year === 'N/A' ? 'Coming Soon' : paper.year.toString();
            if (!papersByYear[yearKey]) {
                papersByYear[yearKey] = [];
            }
            papersByYear[yearKey].push(paper);
        });

        return Object.entries(papersByYear)
            .sort(([a], [b]) => {
                if (a === 'Coming Soon') return 1;
                if (b === 'Coming Soon') return -1;
                return parseInt(b) - parseInt(a);
            })
            .map(([year, yearPapers]) => (
                <div key={year} className="">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 ml-2 border-b pb-1 dark:text-gray-200 dark:border-gray-700">
                        {year}
                    </h3>
                    <div className="space-y-1">
                        {year === 'Coming Soon' ? (
                            yearPapers.map(paper => (
                                <PaperCard key={paper.id} paper={paper} getSubjectColor={getSubjectColor} getFullMonthName={getFullMonthName} onAction={handlePaperAction} />
                            ))
                        ) : (
                            Object.entries(yearPapers.reduce((acc, paper) => {
                                if (!acc[paper.series]) {
                                    acc[paper.series] = [];
                                }
                                acc[paper.series].push(paper);
                                return acc;
                            }, {} as Record<string, Paper[]>))
                                .sort(([a], [b]) => {
                                    const seriesOrder: Record<string, number> = { 'Jan': 0, 'Jun': 1, 'Oct': 2, 'Nov': 3 };
                                    return (seriesOrder[a] || 99) - (seriesOrder[b] || 99);
                                })
                                .map(([, seriesPapers]) => (
                                    seriesPapers.map(paper => (
                                        <PaperCard key={paper.id} paper={paper} getSubjectColor={getSubjectColor} getFullMonthName={getFullMonthName} onAction={handlePaperAction} />
                                    ))
                                ))
                        )}
                    </div>
                </div>
            ));
    }, [getSubjectColor, handlePaperAction]);


    const subjectsForCurrentSelection = papersConfig[examBoard]?.[examLevel] || {};
    const unitsForCurrentSubject = subjectsForCurrentSelection[subject] || [];

    return (
        <>
            {/* Tailwind CSS config script */}
            <script dangerouslySetInnerHTML={{ __html: tailwindConfig }}></script>
            {/* ZXing Library CDN Script - Added to resolve import error */}
            <script src="https://cdn.jsdelivr.net/npm/@zxing/library@0.21.3/umd/index.min.js"></script>

            {/* Custom styles */}
            <style>
                {`
                :root {
                    --primary-color: #FF3B30;
                }
                body {
                    font-family: 'Inter', sans-serif;
                    background-color: #f8f9fa;
                    color: #333;
                }
                .btn-primary {
                    background-color: var(--primary-color);
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 0.375rem;
                    font-weight: 500;
                    transition: background-color 0.2s;
                }
                .btn-primary:hover {
                    background-color: #e0332b;
                }
                .paper-card {
                    transition: all 0.2s ease;
                    border: 1px solid #e2e8f0;
                }
                .camera-overlay {
                    background: rgba(0, 0, 0, 0.9);
                }
                #video {
                    max-width: 100%;
                    max-height: 70vh;
                    border-radius: 8px;
                }
                .search-highlight {
                    background-color: #fef3c7;
                    padding: 2px 4px;
                    border-radius: 3px;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .unit-button.active {
                    background-color: var(--primary-color);
                    color: white;
                }
                .unit-button {
                    border: none;
                }
                select {
                    border-radius: 20px;
                }
                .filter-disabled {
                    pointer-events: none;
                    opacity: 0.5;
                    transition: opacity 0.3s ease;
                }
                #left-sidebar::-webkit-scrollbar {
                    display: none
                }
                `}
            </style>

            <div className="w-full h-screen flex flex-col antialiased bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-200">
                {/* Header */}
                <header className="flex justify-between items-center p-4 bg-white border-b dark:bg-gray-800 dark:border-gray-700 h-[80px]">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Past Papers</h1>
                        <p className="text-xs text-gray-500 mt-1">Search and access past papers</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Exam Level Selector */}
                        <div className="relative">
                            <select
                                id="exam-level-select"
                                className="w-[150px] p-2 text-base bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                value={examLevel}
                                onChange={(e) => setExamLevel(e.target.value)}
                            >
                                <option value="IAL">IAL</option>
                                <option value="IGCSE">IGCSE</option>
                            </select>
                        </div>

                        <button
                            id="camera-search-btn"
                            className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-100 transition dark:bg-gray-700 dark:hover:bg-gray-600"
                            title="Scan barcode"
                            onClick={() => setIsCameraOverlayOpen(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 dark:text-gray-200">
                                <path d="M9 12l2 2 4-4"/>
                                <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                                <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                                <path d="M12 21c0-1-1-3-3-3s-3 2-3 3 1 3 3 3 3-2 3-3"/>
                                <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"/>
                            </svg>
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar - Search and Filters */}
                    <div id="left-sidebar" className="w-80 bg-white border-r flex flex-col dark:bg-gray-800 dark:border-gray-700 overflow-auto no-scrollbar">
                        <div className="p-4 border-b dark:border-gray-700">
                            <div className="relative">
                                <input
                                    type="text"
                                    id="search-input"
                                    placeholder="Search papers (e.g. Biology Unit 1 2023)"
                                    className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                    value={searchTerm}
                                    onChange={handleSearchInputChange}
                                />
                                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <button
                                    id="clear-search-btn"
                                    className={`absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 ${searchTerm.length > 0 ? '' : 'hidden'}`}
                                    onClick={handleClearSearch}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                </button>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                                Search by subject, paper, year, or series
                            </div>
                        </div>

                        {/* Exam Board Selector */}
                        <div id="exam-board-filter-section" className={`p-4 border-b dark:border-gray-700 ${isKeywordSearchActive ? 'filter-disabled' : ''}`}>
                            <label htmlFor="examBoardSelect" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Select Exam Board</label>
                            <div className="relative">
                                <select
                                    id="examBoardSelect"
                                    className="w-full p-2 text-base bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                    value={examBoard}
                                    onChange={(e) => setExamBoard(e.target.value)}
                                    disabled={isKeywordSearchActive}
                                >
                                    <option value="Edexcel">Edexcel</option>
                                    <option value="Cambridge">Cambridge</option>
                                </select>
                            </div>
                        </div>

                        {/* Subject Selector */}
                        <div id="subject-filter-section" className={`p-4 border-b dark:border-gray-700 ${isKeywordSearchActive ? 'filter-disabled' : ''}`}>
                            <label htmlFor="subjectSelect" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Select Subject</label>
                            <div className="relative">
                                <select
                                    id="subjectSelect"
                                    className="w-full p-2 text-base bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    disabled={isKeywordSearchActive || Object.keys(subjectsForCurrentSelection).length === 0}
                                >
                                    {Object.keys(subjectsForCurrentSelection).length > 0 ? (
                                        Object.keys(subjectsForCurrentSelection).map(subj => (
                                            <option key={subj} value={subj}>{subj}</option>
                                        ))
                                    ) : (
                                        <option value="">No Subjects Available</option>
                                    )}
                                </select>
                            </div>
                        </div>

                        {/* Unit Selector */}
                        <div id="unit-filter-section" className={`p-4 border-b dark:border-gray-700 ${isKeywordSearchActive ? 'filter-disabled' : ''}`}>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Select Unit</label>
                            <div className="flex flex-wrap gap-2 unit-buttons bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                                {unitsForCurrentSubject.length > 0 ? (
                                    unitsForCurrentSubject.map(unitOption => (
                                        <button
                                            key={unitOption}
                                            className={`unit-button px-0 py-1 w-[30%] grow rounded-md text-sm font-medium transition ${unit === unitOption ? 'active bg-primary text-white dark:bg-primary' : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200'}`}
                                            onClick={() => { if (!isKeywordSearchActive) setUnit(unitOption); }}
                                            disabled={isKeywordSearchActive}
                                        >
                                            {unitOption}
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-sm text-gray-500 dark:text-gray-400">No specific units</div>
                                )}
                            </div>
                        </div>

                        {/* Quick Filters */}
                        <div id="quick-filters-section" className={`p-4 border-b dark:border-gray-700 ${isKeywordSearchActive ? 'filter-disabled' : ''}`}>
                            <h3 className="font-semibold text-gray-700 mb-3 dark:text-gray-200">Quick Filters</h3>
                            <div className="space-y-2">
                                {years.slice(0, 1).map(yearOption => ( // Only show 2023 for now, as in original HTML
                                    <button
                                        key={yearOption}
                                        className="filter-btn w-full text-left px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition text-sm dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                                        onClick={() => handleQuickFilterClick(yearOption)}
                                        disabled={isKeywordSearchActive}
                                    >
                                        {yearOption}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Search Results Count */}
                        <div className="p-4">
                            <div id="results-count" className="text-sm text-gray-600 dark:text-gray-400">
                                Showing {filteredPapers.length} paper{filteredPapers.length !== 1 ? 's' : ''}
                            </div>
                        </div>
                    </div>

                    {/* Right Content Area - Papers List */}
                    <div className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900 flex justify-center">
                        <div id="papers-container" className="space-y-6 max-w-[1200px] mx-auto">
                            {renderPapers(filteredPapers)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Camera Search Overlay */}
            {isCameraOverlayOpen && (
                <div id="camera-overlay" className="fixed inset-0 camera-overlay z-50 flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) setIsCameraOverlayOpen(false); }}>
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 dark:bg-gray-800">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Scan Paper Barcode</h3>
                            <button
                                id="close-camera-btn"
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                onClick={() => setIsCameraOverlayOpen(false)}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>

                        <div className="text-center">
                            <video id="video" ref={videoRef} className="mb-4 bg-black"></video>
                            <div id="camera-status" className="text-sm text-gray-600 mb-4 dark:text-gray-400">
                                {cameraStatus}
                            </div>
                            {detectedBarcode && (
                                <div id="barcode-result">
                                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 dark:bg-green-800 dark:border-green-700 dark:text-green-200">
                                        <strong>Barcode detected:</strong> <span id="detected-barcode">{detectedBarcode}</span>
                                    </div>
                                    <button
                                        id="search-barcode-btn"
                                        className="btn-primary w-full"
                                        onClick={() => {
                                            setSearchTerm(detectedBarcode);
                                            setIsCameraOverlayOpen(false);
                                        }}
                                    >
                                        Search for this paper
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// PaperCard Component (extracted for reusability and cleaner code)
interface PaperCardProps {
    paper: Paper;
    getSubjectColor: (subject: string) => string;
    getFullMonthName: (abbr: string) => string;
    onAction: (paper: Paper, type: 'qp' | 'ms' | 'share') => void;
}

const PaperCard: React.FC<PaperCardProps> = ({ paper, getSubjectColor, getFullMonthName, onAction }) => {
    const subjectColor = getSubjectColor(paper.subject);
    const seriesDisplay = paper.series === 'N/A' ? '' : `${paper.series} `;
    const yearDisplay = paper.year === 'N/A' ? '' : `${paper.year}`;
    const paperPartDisplay = paper.paper === 'N/A' ? '' : paper.paper;

    return (
        <div className="paper-card gap-[80px] bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-center text-sm">
            {paper.isComingSoon ? (
                <div className="flex items-center space-x-2">
                    <span className={`font-semibold text-${subjectColor}`}>{paper.subject}</span>
                    <span className="text-gray-500 dark:text-gray-400">Coming Soon for {paper.examBoard} {paper.examLevel}</span>
                </div>
            ) : (
                <div className="flex items-center space-x-2">
                    <span className={`font-semibold text-${subjectColor}`}>{paper.subject}</span>
                    <span className="text-gray-700 dark:text-gray-300">{paperPartDisplay}</span>
                    <span className="text-gray-500 dark:text-gray-400">{seriesDisplay}{yearDisplay}</span>
                </div>
            )}
            <div className="flex space-x-2">
                <button
                    className={`qp-btn flex items-center justify-center px-3 py-1 bg-blue-500 text-white rounded-md text-xs font-medium hover:bg-blue-600 transition ${paper.isComingSoon ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => onAction(paper, 'qp')}
                    disabled={paper.isComingSoon}
                >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    Question
                </button>
                <button
                    className={`ms-btn flex items-center justify-center px-3 py-1 bg-green-500 text-white rounded-md text-xs font-medium hover:bg-green-600 transition ${paper.isComingSoon ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => onAction(paper, 'ms')}
                    disabled={paper.isComingSoon}
                >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Answer
                </button>
            </div>
            <button
                className={`share-btn text-gray-400 hover:text-gray-600 transition dark:text-gray-500 dark:hover:text-gray-300 ${paper.isComingSoon ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => onAction(paper, 'share')}
                disabled={paper.isComingSoon}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                </svg>
            </button>
        </div>
    );
};

export default App;
