"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Chart from 'react-apexcharts'; // Changed import to react-apexcharts

// Define global variables as they would be in the Canvas environment, but unused for localStorage version
declare global {
  const __app_id: string | undefined;
  const __firebase_config: string | undefined;
  const __initial_auth_token: string | undefined;
}

// Ensure __app_id is defined for local development/testing
const APP_ID = typeof __app_id !== 'undefined' ? __app_id : 'past-paper-tracker-app-v5';

// --- CONFIGURATION ---
interface SubjectData {
    papers: string[];
}

interface ExamLevelConfig {
    subjectsData: { [key: string]: SubjectData };
    paperMaxMarks: { [key: string]: number };
    series: string[];
    seriesOrder: { [key: string]: number };
    maxYearSelect: number;
    maxSeriesSelect: string;
}

interface AppModes {
    IAL: {
        selectedPapers: { [subject: string]: string[] };
        scores: { [cellId: string]: string };
        years: { year: number; series: string }[];
    };
    IGCSE: {
        selectedPapers: { [subject: string]: string[] };
        scores: { [cellId: string]: string };
        years: { year: number; series: string }[];
    };
}

interface DisabledPaper {
    examBoard: string;
    examLevel: 'IAL' | 'IGCSE';
    subject: string;
    series: string;
    paper: string | null;
    year: number | null;
}

const ialConfig: ExamLevelConfig = {
    subjectsData: {
        'Physics': { papers: ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5', 'Unit 6'] },
        'Chemistry': { papers: ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5', 'Unit 6'] },
        'Biology': { papers: ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5', 'Unit 6'] },
        'Math': { papers: ['P1', 'P2', 'P3', 'P4', 'M1', 'M2', 'M3', 'FP1', 'FP2', 'FP3', 'S1', 'S2', 'S3', 'D1', 'D2'] }
    },
    paperMaxMarks: {
        'Unit 1': 80, 'Unit 2': 80, 'Unit 4': 90, 'Unit 5': 90, 'Unit 3': 50, 'Unit 6': 50,
        'P1': 75, 'P2': 75, 'P3': 75, 'P4': 75, 'M1': 75, 'M2': 75, 'M3': 75,
        'FP1': 75, 'FP2': 75, 'FP3': 75, 'S1': 75, 'S2': 75, 'S3': 75, 'D1': 75, 'D2': 75
    },
    series: ['Jan', 'Jun', 'Oct'],
    seriesOrder: { 'Jan': 0, 'Jun': 1, 'Oct': 2 },
    maxYearSelect: 2025,
    maxSeriesSelect: 'Jun'
};

const igcseConfig: ExamLevelConfig = {
    subjectsData: {
        'Math A': { papers: ['Paper 1', 'Paper 2'] },
        'Math B': { papers: ['Paper 1', 'Paper 2'] },
        'Physics': { papers: ['Paper 1', 'Paper 2'] },
        'Chemistry': { papers: ['Paper 1', 'Paper 2'] },
        'Biology': { papers: ['Paper 1', 'Paper 2'] },
        'Chinese': { papers: ['Paper 1', 'Paper 2'] }
    },
    paperMaxMarks: {
        'Paper 1F': 100, 'Paper 1H': 100, 'Paper 2F': 100, 'Paper 2H': 100, // Math
        'Paper 1': 50, 'Paper 2': 80,
        'Paper 1P': 60, 'Paper 2P': 60, 'Paper 3P': 60, 'Paper 4P': 60, // Physics
        'Paper 1C': 60, 'Paper 2C': 60, 'Paper 3C': 60, 'Paper 4C': 60, // Chemistry
        'Paper 1B': 60, 'Paper 2B': 60, 'Paper 3B': 60, 'Paper 4B': 60 // Biology
    },
    series: ['Jan', 'Jun', 'Nov'],
    seriesOrder: { 'Jan': 0, 'Jun': 1, 'Nov': 2 },
    maxYearSelect: 2025,
    maxSeriesSelect: 'Nov'
};

const disabledPapersList: DisabledPaper[] = [
    { examBoard: 'Edexcel', examLevel: 'IGCSE', subject: 'Chinese', series: 'Jan', paper: null, year: null },
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
    { examBoard: "Edexcel", examLevel: "IGCSE", subject: "Chinese", series: "Nov", year: 2022, paper: null },
    { examBoard: "Edexcel", examLevel: "IGCSE", subject: "Chinese", series: "Nov", year: 2022, paper: null },
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

// --- UTILITY FUNCTIONS ---
const generateYearSeriesRange = (
    startYear: number, startSeries: string, endYear: number, endSeries: string,
    seriesOrderObj: { [key: string]: number }, maxYear: number, maxSeries: string
) => {
    const result: { year: number; series: string }[] = [];

    const actualEndYear = Math.min(endYear, maxYear);
    let actualEndSeries = endSeries;
    if (endYear === maxYear && seriesOrderObj[endSeries] > seriesOrderObj[maxSeries]) {
        actualEndSeries = maxSeries;
    }

    for (let year = actualEndYear; year >= startYear; year--) {
        const currentYearSeries: { year: number; series: string }[] = [];
        const sortedSeriesKeys = Object.keys(seriesOrderObj).sort((a, b) => seriesOrderObj[a] - seriesOrderObj[b]);

        for (let i = sortedSeriesKeys.length - 1; i >= 0; i--) {
            const serie = sortedSeriesKeys[i];
            if (year === actualEndYear && seriesOrderObj[serie] > seriesOrderObj[actualEndSeries]) {
                continue;
            }
            if (year === startYear && seriesOrderObj[serie] < seriesOrderObj[startSeries]) {
                continue;
            }
            currentYearSeries.push({ year, series: serie });
        }
        currentYearSeries.sort((a, b) => seriesOrderObj[a.series] - seriesOrderObj[b.series]);
        result.push(...currentYearSeries);
    }
    sortYearSeriesList(result, seriesOrderObj);
    return result;
};

const sortYearSeriesList = (list: { year: number; series: string }[], seriesOrderObj: { [key: string]: number }) => {
    list.sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return seriesOrderObj[b.series] - seriesOrderObj[a.series];
    });
};

const calculatePercentile = (scorePercentage: number) => {
    if (isNaN(scorePercentage)) return '0';
    if (scorePercentage < 0) scorePercentage = 0;
    if (scorePercentage > 100) scorePercentage = 100;

    let percentile;
    if (scorePercentage <= 70) {
        percentile = (scorePercentage / 70) * 50;
    } else {
        percentile = 50 + ((scorePercentage - 70) / 30) * 50;
    }
    return percentile.toFixed(0);
};

const getFullMonthName = (seriesAbbr: string) => {
    const months: { [key: string]: string } = { 'Jan': 'January', 'Jun': 'June', 'Oct': 'October', 'Nov': 'November' };
    return months[seriesAbbr] || seriesAbbr;
};

const App: React.FC = () => {
    const [appState, setAppState] = useState<any>(() => { // Changed to any for simpler initial state handling
        try {
            const saved = localStorage.getItem(APP_ID);
            if (saved) {
                const data = JSON.parse(saved);
                const loadedState: AppModes = {
                    IAL: data.modes?.IAL || {},
                    IGCSE: data.modes?.IGCSE || {}
                };

                // Ensure nested properties exist and are valid for each mode
                (['IAL', 'IGCSE'] as Array<'IAL' | 'IGCSE'>).forEach(mode => {
                    loadedState[mode].selectedPapers = loadedState[mode].selectedPapers || {};
                    for (const subject in loadedState[mode].selectedPapers) {
                        if (!Array.isArray(loadedState[mode].selectedPapers[subject])) {
                            loadedState[mode].selectedPapers[subject] = [];
                        }
                    }
                    loadedState[mode].scores = loadedState[mode].scores || {};

                    if (!loadedState[mode].years || !Array.isArray(loaded[mode].years) || !loadedState[mode].years.every(y => typeof y === 'object' && y.year && y.series)) {
                        console.warn(`Invalid 'years' data for ${mode} mode in localStorage, using default range.`);
                        if (mode === 'IAL') {
                            loadedState.IAL.years = generateYearSeriesRange(2019, 'Jan', 2025, 'Jun', ialConfig.seriesOrder, ialConfig.maxYearSelect, ialConfig.maxSeriesSelect);
                        } else {
                            loadedState.IGCSE.years = generateYearSeriesRange(2010, 'Jan', 2025, 'Nov', igcseConfig.seriesOrder, igcseConfig.maxYearSelect, igcseConfig.maxSeriesSelect);
                        }
                    }
                    sortYearSeriesList(loadedState[mode].years, (mode === 'IAL' ? ialConfig : igcseConfig).seriesOrder);
                });

                return {
                    currentMode: data.currentMode || 'IAL',
                    modes: loadedState
                };
            }
        } catch (error) {
            console.error("Error loading state from localStorage:", error);
        }
        // Default initial state if nothing found or error
        return {
            currentMode: 'IAL',
            modes: {
                IAL: {
                    selectedPapers: {
                        'Math': ['P1', 'P2', 'P3', 'P4'],
                        'Physics': ['Unit 1', 'Unit 2']
                    },
                    scores: {},
                    years: generateYearSeriesRange(2019, 'Jan', 2025, 'Jun', ialConfig.seriesOrder, ialConfig.maxYearSelect, ialConfig.maxSeriesSelect)
                },
                IGCSE: {
                    selectedPapers: {
                        'Math A': ['Paper 1H', 'Paper 2H'],
                        'Chinese': ['Paper 1H']
                    },
                    scores: {},
                    years: generateYearSeriesRange(2010, 'Jan', 2025, 'Nov', igcseConfig.seriesOrder, igcseConfig.maxYearSelect, igcseConfig.maxSeriesSelect)
                }
            }
        };
    });

    const [showModal, setShowModal] = useState(false);
    const [headerDate, setHeaderDate] = useState('');
    const [activeCellData, setActiveCellData] = useState<{
        subject: string;
        paper: string;
        year: number;
        series: string;
        mode: 'IAL' | 'IGCSE';
        score: string;
        maxMark: number;
    } | null>(null);

    const bottomActionsRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const dragOffsets = useRef({ x: 0, y: 0 });
    const currentPosition = useRef({ left: 0, top: 0 });
    const saveTimeout = useRef<number | null>(null);
    // No longer need apexChartInstance ref as Chart component handles it internally

    // Helper to get current mode's configuration
    const getCurrentConfig = useCallback(() => {
        return appState.currentMode === 'IAL' ? ialConfig : igcseConfig;
    }, [appState.currentMode]);

    // Save state to localStorage
    useEffect(() => {
        if (saveTimeout.current) {
            clearTimeout(saveTimeout.current);
        }
        saveTimeout.current = window.setTimeout(() => {
            localStorage.setItem(APP_ID, JSON.stringify({
                currentMode: appState.currentMode,
                modes: appState.modes
            }));
            console.log("State saved to localStorage");
        }, 500);
        return () => {
            if (saveTimeout.current) {
                clearTimeout(saveTimeout.current);
            }
        };
    }, [appState]);

    // Update header date on mount
    useEffect(() => {
        const today = new Date();
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
        setHeaderDate(today.toLocaleDateString('en-US', options));
    }, []);

    // Initial position for bottom actions bar
    useEffect(() => {
        const setInitialBottomBarPosition = () => {
            const bottomActions = bottomActionsRef.current;
            if (!bottomActions) return;

            bottomActions.style.transition = 'none';
            const rect = bottomActions.getBoundingClientRect();
            currentPosition.current.left = window.innerWidth - rect.width - 60;
            currentPosition.current.top = window.innerHeight - rect.height - 60;

            bottomActions.style.left = `${currentPosition.current.left}px`;
            bottomActions.style.top = `${currentPosition.current.top}px`;

            setTimeout(() => {
                bottomActions.style.transition = '';
            }, 50);
        };

        setInitialBottomBarPosition();
        // Hide on initial render
        if (bottomActionsRef.current) {
            bottomActionsRef.current.classList.add('opacity-0', 'translate-y-20', 'invisible');
        }
    }, []);

    // Dragging event handlers
    const startDrag = useCallback((e: React.MouseEvent) => {
        const bottomActions = bottomActionsRef.current;
        if (!bottomActions) return;

        // Do not start drag if the event target is an interactive element within the pane
        if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'SELECT' || (e.target as HTMLElement).getAttribute('contenteditable') === 'true') {
            return;
        }

        isDragging.current = true;
        bottomActions.classList.add('cursor-grabbing');
        bottomActions.classList.remove('cursor-grab');

        const rect = bottomActions.getBoundingClientRect();
        currentPosition.current.left = rect.left;
        currentPosition.current.top = rect.top;

        dragOffsets.current.x = e.clientX - currentPosition.current.left;
        dragOffsets.current.y = e.clientY - currentPosition.current.top;

        e.preventDefault();
    }, []);

    const drag = useCallback((e: MouseEvent) => {
        if (!isDragging.current) return;
        const bottomActions = bottomActionsRef.current;
        if (!bottomActions) return;

        e.preventDefault();

        let newX = e.clientX - dragOffsets.current.x;
        let newY = e.clientY - dragOffsets.current.y;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const rect = bottomActions.getBoundingClientRect();
        const elementWidth = rect.width;
        const elementHeight = rect.height;

        newX = Math.max(0, Math.min(viewportWidth - elementWidth, newX));
        newY = Math.max(0, Math.min(viewportHeight - elementHeight, newY));

        bottomActions.style.left = `${newX}px`;
        bottomActions.style.top = `${newY}px`;
    }, []);

    const endDrag = useCallback(() => {
        const bottomActions = bottomActionsRef.current;
        if (!bottomActions) return;

        isDragging.current = false;
        bottomActions.classList.remove('cursor-grabbing');
        bottomActions.classList.add('cursor-grab');
    }, []);

    useEffect(() => {
        const bottomActions = bottomActionsRef.current;
        if (bottomActions) {
            bottomActions.addEventListener('mousedown', startDrag as any); // Type assertion for ReactMouseEvent
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', endDrag);
        }

        return () => {
            if (bottomActions) {
                bottomActions.removeEventListener('mousedown', startDrag as any);
                document.removeEventListener('mousemove', drag);
                document.removeEventListener('mouseup', endDrag);
            }
        };
    }, [startDrag, drag, endDrag]);

    const hideBottomActions = useCallback(() => {
        setActiveCellData(null);
        if (bottomActionsRef.current) {
            bottomActionsRef.current.classList.add('translate-y-20', 'opacity-0', 'invisible');
        }
    }, []);

    // Chart options for ApexCharts, now derived directly from activeCellData
    const chartOptions: ApexCharts.ApexOptions = activeCellData ? {
        chart: {
            type: "area",
            height: 40,
            toolbar: { show: false },
            sparkline: { enabled: true },
            animations: { enabled: false },
            parentHeightOffset: 0
        },
        dataLabels: { enabled: false },
        stroke: {
            curve: 'smooth',
            width: 1,
            colors: ['var(--primary-color)']
        },
        series: [{
            name: "Distribution",
            data: [1, 2, 5, 10, 20, 40, 70, 90, 100, 95, 80, 60, 40, 20, 10, 5, 2, 1, 0.5, 0.2]
        }],
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                stops: [0, 90, 100],
                colorStops: [{
                    offset: 0,
                    color: 'var(--primary-color)',
                    opacity: 0.3
                }, {
                    offset: 100,
                    color: 'var(--primary-color)',
                    opacity: 0.1
                }]
            }
        },
        xaxis: {
            categories: Array.from({ length: 20 }, (_, i) => `${i * 5}%`),
            labels: { show: false },
            axisBorder: { show: false },
            axisTicks: { show: false },
            tooltip: { enabled: false }
        },
        yaxis: { show: false },
        grid: {
            show: false,
            padding: { left: -5, right: -5, top: -5, bottom: -5 }
        },
        tooltip: { enabled: false }
    } : {};


    const getFlatPaperList = useCallback(() => {
        const list: { subject: string; paper: string }[] = [];
        const currentConfig = getCurrentConfig();
        const currentSelectedPapers = appState.modes[appState.currentMode].selectedPapers;

        Object.keys(currentConfig.subjectsData).forEach(subject => {
            if (currentSelectedPapers[subject] && Array.isArray(currentSelectedPapers[subject])) {
                const sortedPapers = currentConfig.subjectsData[subject].papers.filter(p => currentSelectedPapers[subject].includes(p));
                sortedPapers.forEach(paper => {
                    list.push({ subject, paper });
                });
            }
        });
        return list;
    }, [appState.currentMode, appState.modes, getCurrentConfig]);

    const updateCellColor = useCallback((score: string | number, paper: string) => {
        const currentConfig = getCurrentConfig();
        const maxMark = currentConfig.paperMaxMarks[paper];

        if (score === '' || score === null || isNaN(Number(score))) {
            return ''; // Return empty string to reset color
        }

        const percentage = ((parseFloat(String(score)) / maxMark) * 100).toFixed(0);

        let color = '';
        if (Number(percentage) >= 90) color = 'var(--color-90)';
        else if (Number(percentage) >= 80) color = 'var(--color-80)';
        else if (Number(percentage) >= 60) color = 'var(--color-70)';
        else if (Number(percentage) >= 30) color = 'var(--color-50)';
        else color = 'var(--color-fail)';

        return color;
    }, [getCurrentConfig]);

    const calculateMeanScore = useCallback((subject: string, paper: string) => {
        let totalScore = 0;
        let count = 0;
        const currentScores = appState.modes[appState.currentMode].scores;
        const currentYears = appState.modes[appState.currentMode].years;

        currentYears.forEach(({ year, series: serie }) => {
            const cellId = `${appState.currentMode}_${year}_${serie}_${subject}_${paper}`.replace(/\s/g, '_');
            const scoreStr = currentScores[cellId];
            const score = parseFloat(scoreStr);

            if (!isNaN(score) && scoreStr !== 'N/A') {
                totalScore += score;
                count++;
            }
        });

        return count > 0 ? totalScore / count : null;
    }, [appState.currentMode, appState.modes]);

    const handleScoreInput = useCallback((e: React.ChangeEvent<HTMLDivElement>) => {
        const cell = e.target;
        if (!cell.classList.contains('score-cell') || cell.getAttribute('contenteditable') === 'false') return;

        const { id, paper, subject, year, series, mode } = cell.dataset as { id: string; paper: string; subject: string; year: string; series: string; mode: 'IAL' | 'IGCSE' };
        const score = cell.textContent || '';

        setAppState(prevState => {
            const newState = { ...prevState };
            newState.modes[mode].scores = {
                ...newState.modes[mode].scores,
                [id]: score
            };
            return newState;
        });

        const currentConfig = getCurrentConfig();
        setActiveCellData({
            subject, paper, year: parseInt(year), series, mode, score,
            maxMark: currentConfig.paperMaxMarks[paper]
        });
    }, [getCurrentConfig]);

    const handleCellFocus = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
        const cell = e.target;
        if (!cell.classList.contains('score-cell') || cell.getAttribute('contenteditable') === 'false') {
            return;
        }

        const { subject, paper, year, series, mode } = cell.dataset as { subject: string; paper: string; year: string; series: string; mode: 'IAL' | 'IGCSE' };
        const currentConfig = getCurrentConfig();
        const score = cell.textContent || '';
        const maxMark = currentConfig.paperMaxMarks[paper];

        setActiveCellData({
            subject, paper, year: parseInt(year), series, mode, score, maxMark
        });

        if (bottomActionsRef.current) {
            if (bottomActionsRef.current.classList.contains('opacity-0') || bottomActionsRef.current.style.left === '' || bottomActionsRef.current.style.top === '') {
                // Set initial position if it's hidden or not positioned yet
                const rect = bottomActionsRef.current.getBoundingClientRect();
                currentPosition.current.left = window.innerWidth - rect.width - 60;
                currentPosition.current.top = window.innerHeight - rect.height - 60;
                bottomActionsRef.current.style.left = `${currentPosition.current.left}px`;
                bottomActionsRef.current.style.top = `${currentPosition.current.top}px`;
            }
            bottomActionsRef.current.classList.remove('translate-y-20', 'opacity-0', 'invisible');
        }
    }, [getCurrentConfig]);

    const handleGoToPaper = useCallback((type: 'qp' | 'ms') => {
        if (!activeCellData) return;
        const { subject, paper, year, series, mode: examLevel } = activeCellData;
        const examBoard = "Edexcel"; // Assuming Edexcel

        const params = new URLSearchParams({
            subject: subject,
            paper: paper,
            series: series,
            year: String(year),
            examBoard: examBoard,
            examLevel: examLevel
        }).toString();

        window.open(`/past-paper/viewer?${params}&type=${type}`, '_blank');
    }, [activeCellData]);

    const handlePaperSelectionChange = useCallback((subject: string, paper: string, checked: boolean) => {
        setAppState(prevState => {
            const newState = { ...prevState };
            const currentSelectedPapers = newState.modes[newState.currentMode].selectedPapers;
            if (!currentSelectedPapers[subject]) {
                currentSelectedPapers[subject] = [];
            }

            if (checked) {
                if (!currentSelectedPapers[subject].includes(paper)) {
                    currentSelectedPapers[subject].push(paper);
                }
            } else {
                currentSelectedPapers[subject] = currentSelectedPapers[subject].filter(p => p !== paper);
            }
            return newState;
        });
    }, []);

    const handleSelectAllChange = useCallback((subject: string, checked: boolean) => {
        setAppState(prevState => {
            const newState = { ...prevState };
            const currentConfig = getCurrentConfig();
            const papers = currentConfig.subjectsData[subject].papers;

            if (checked) {
                newState.modes[newState.currentMode].selectedPapers[subject] = [...papers];
            } else {
                newState.modes[newState.currentMode].selectedPapers[subject] = [];
            }
            return newState;
        });
    }, [getCurrentConfig]);

    const handleSetYearRangeAndCloseModal = useCallback((startYear: number, startSeries: string, endYear: number, endSeries: string) => {
        const currentConfig = getCurrentConfig();
        const startDateWeight = startYear * 100 + currentConfig.seriesOrder[startSeries];
        const endDateWeight = endYear * 100 + currentConfig.seriesOrder[endSeries];

        if (startDateWeight > endDateWeight) {
            // This error handling would typically be shown in the UI, but for now, just log.
            console.error("Start date cannot be after end date.");
            return false; // Indicate validation failure
        }

        const newYears = generateYearSeriesRange(startYear, startSeries, endYear, endSeries,
            currentConfig.seriesOrder, currentConfig.maxYearSelect, currentConfig.maxSeriesSelect);

        setAppState(prevState => {
            const newState = { ...prevState };
            newState.modes[newState.currentMode].years = newYears;
            return newState;
        });
        setShowModal(false);
        return true; // Indicate success
    }, [getCurrentConfig]);

    const switchMode = useCallback((newMode: 'IAL' | 'IGCSE') => {
        setAppState(prevState => ({
            ...prevState,
            currentMode: newMode
        }));
    }, []);

    const currentConfig = getCurrentConfig();
    const flatPaperList = getFlatPaperList();
    const currentYears = appState.modes[appState.currentMode].years;

    const currentYear = new Date().getFullYear();
    const yearsForSelect = Array.from({ length: currentConfig.maxYearSelect - 2000 + 1 }, (_, i) => currentConfig.maxYearSelect - i);

    // Determine if the "no papers selected" message should be shown
    const showNoPapersState = flatPaperList.length === 0;

    return (
        <div id="app-container" className="w-full h-full flex flex-col box-border">
            <style>
                {`
                :root {
                    --primary-color: #007aff;
                    --color-90: #b7e1cd; /* Green for 90%+ */
                    --color-80: #b7e1cd; /* Green for 80%+ */
                    --color-70: #fce8b3; /* Amber for 70%+ */
                    --color-50: #fcd3b3; /* Light orange for 50%+ */
                    --color-fail: #f4c7c2; /* Red for Fail */
                }
                html, body {
                    height: 100%;
                    overflow: hidden; /* Prevent body scroll, table will scroll */
                }
                body {
                    font-family: 'Inter', sans-serif;
                    background-color: #f8f9fa;
                    color: #333;
                   
                }
                .table-container {
                    width: calc(100%);
                    height: calc(100vh - 100px); /* Adjust based on header height */
                    overflow: auto;
                    border: 1px solid #e2e8f0;
                    border-radius: 0rem;
                    margin-bottom: 30px;
                    // align-self: center;
                    position: relative; /* Needed for absolute positioning of message */
                }
                .table-container::-webkit-scrollbar {
                    display: none;
                }
                table {
                    border-collapse: separate;
                    border-spacing: 0;
                    width: 100%;
                }
                th, td {
                    border: 1px solid #e2e8f0;
                    padding: 0;
                    white-space: nowrap;
                    text-align: center;
                    position: relative;
                }

                td {
                    min-width:100px;
                }

                td:first-child {
                    min-width:170px;
                }
                
                th {
                    background-color: #fff;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                    padding: 0.5rem 0.75rem;
                    font-weight: 600;
                    color: #4a5568;
                }
                td:first-child {
                    position: sticky;
                    left: 0;
                    z-index: 11;
                    background-color: #fff;
                    padding: 0.25rem 0.75rem;
                    font-weight: 500;
                }
                th:first-child {
                    position: sticky;
                    left: 0;
                    z-index: 20;
                    background-color: #fff;
                    padding: 0;
                }
                #table-head th:first-child button {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.5rem 0.75rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #4a5568;
                    background-color: #fff;
                    border: none;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    border-radius: 0.5rem 0 0 0;
                }
                #table-head th:first-child button:hover {
                    background-color: #f0f0f0;
                }

                .score-cell {
                    min-width: 10px;
                    height: 32px;
                    line-height: 32px;
                    outline: none;
                    transition: background-color 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.875rem;
                }
                .score-cell:focus {
                    box-shadow: inset 0 0 0 2px black;
                }
                .score-cell.disabled {
                    background-color: #e9ecef;
                    cursor: not-allowed;
                    color: #6c757d;
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
                    background-color: #0056b3;
                }
                .custom-checkbox:checked {
                    background-color: var(--primary-color);
                    border-color: var(--primary-color);
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }

                .modal-overlay {
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .modal-content {
                    background-color: white;
                    border-radius: 0.5rem;
                    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
                    max-width: 90vw;
                    max-height: 90vh;
                    display: flex;
                    flex-direction: column;
                }
                .modal-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid #e2e8f0;
                }
                .modal-body {
                    padding: 1.5rem;
                    flex-grow: 1;
                    overflow-y: auto;
                }
                .modal-footer {
                    padding: 1rem;
                    background-color: #f8f9fa;
                    border-top: 1px solid #e2e8f0;
                    display: flex;
                    justify-content: flex-end;
                    border-radius: 0 0 0.5rem 0.5rem;
                }

                .overlay-graphs-container {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 0.75rem;
                    width: 100%;
                }
                .overlay-graph {
                    flex-shrink: 0;
                    width: 50%;
                    height: 90px;
                    border-radius: 0.25rem;
                    padding: 0px 5px;
                    background-color: #fcfcfc;
                    align-items: start;
                }
                .overlay-graph-title {
                    font-size: 12px;
                    font-weight: 600;
                    text-align: left;
                    margin-bottom: 2px;
                    color: #4a5568;
                    justify-content: space-between;
                }
                .progress-bar-container {
                    width: 100%;
                    height: 10px;
                    background-color: #e0e0e0;
                    border-radius: 5px;
                    overflow: hidden;
                    margin: 5px auto 0;
                }
                .progress-bar {
                    height: 100%;
                    background-color: var(--primary-color);
                    transition: width 0.3s ease-in-out;
                    border-radius: 5px;
                }
                #bottom-actions {
                   overflow: hidden;
                }
                #bottom-actions::-webkit-scrollbar {
                    display: none;
                }

                .mean-score-row {
                    font-weight: bold;
                    background-color: #e9e9e9;
                    position: sticky;
                    bottom: 0;
                    z-index: 15;
                }
                .mean-score-row td {
                    background-color: #e9e9e9;
                }
                .mean-score-row td:first-child {
                    background-color: #e9e9e9;
                }

                #chart-skewed-dist {
                    max-width: 100%;
                    margin: 0;
                    padding: 0;
                }
                #exam-level-select {
                    padding: 0.5rem 1rem;
                    border-radius: 0.375rem;
                    font-weight: 500;
                    color: #4a5568;
                    background-color: #e2e8f0;
                    transition: all 0.2s ease-in-out;
                    border: 1px solid #cbd5e0;
                }
                #exam-level-select:focus {
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
                }
                `}
            </style>

            <header className="flex justify-between items-center p-4 h-[80px]">
                <div id="left-header-content">
                    <h1 className="text-2xl font-bold text-gray-800" id="header-date">{headerDate}</h1>
                    <p className="text-xs text-gray-500 mt-1">Data saved locally in your browser</p>
                </div>
                <div className="flex items-center space-x-2">
                    <select
                        id="exam-level-select"
                        className="w-[150px] p-2 text-base bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        value={appState.currentMode}
                        onChange={(e) => switchMode(e.target.value as 'IAL' | 'IGCSE')}
                    >
                        <option value="IAL">IAL</option>
                        <option value="IGCSE">IGCSE</option>
                    </select>
                </div>
            </header>

            <div id="table-container" className="table-container flex-grow box-content">
                {showNoPapersState && (
                    <div id="no-papers-state" className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 text-lg">
                        <p className="mb-4">No papers selected. Click 'Select Papers' to get started.</p>
                        <button id="select-papers-intro-btn" className="btn-primary flex items-center gap-2 px-6 py-3 text-lg" onClick={() => setShowModal(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
                            <span>Select Papers</span>
                        </button>
                    </div>
                )}

                <table id="scores-table" className={showNoPapersState ? 'hidden' : ''}>
                    <thead id="table-head">
                        <tr>
                            <th className="p-0">
                                <button id="open-select-papers-modal-btn-in-table" className="btn-primary flex items-center justify-center" onClick={() => setShowModal(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
                                    <span className="ml-0">Select Papers</span>
                                </button>
                            </th>
                            {flatPaperList.map(({ subject, paper }) => (
                                <th key={`${subject}-${paper}`}>
                                    <div>{subject}</div>
                                    <div className="font-normal text-sm">{paper}</div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody id="table-body">
                        {currentYears.map(({ year, series: serie }) => (
                            <tr key={`${year}-${serie}`}>
                                <td>{`${year} ${serie}`}</td>
                                {flatPaperList.map(({ subject, paper }) => {
                                    const cellId = `${appState.currentMode}_${year}_${serie}_${subject}_${paper}`.replace(/\s/g, '_');
                                    const score = appState.modes[appState.currentMode].scores[cellId] || '';

                                    const isDisabled = disabledPapersList.some(item =>
                                        item.examLevel === appState.currentMode &&
                                        item.subject === subject &&
                                        item.series === serie &&
                                        (item.paper === null || item.paper === paper) &&
                                        (item.year === null || item.year === year)
                                    ) || (appState.currentMode === 'IAL' && serie === 'Oct' && paper.startsWith('FP'));

                                    const cellColor = updateCellColor(score, paper);

                                    return (
                                        <td key={cellId}>
                                            <div
                                                className={`score-cell ${isDisabled ? 'disabled' : ''}`}
                                                contentEditable={!isDisabled}
                                                style={{ backgroundColor: cellColor }}
                                                data-id={cellId}
                                                data-subject={subject}
                                                data-paper={paper}
                                                data-year={year}
                                                data-series={serie}
                                                data-mode={appState.currentMode}
                                                onInput={handleScoreInput}
                                                onFocus={handleCellFocus}
                                                suppressContentEditableWarning={true} // Suppress React warning
                                            >
                                                {isDisabled ? 'N/A' : score}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                    <tfoot id="table-foot">
                        <tr className="mean-score-row">
                            <td>Mean Score</td>
                            {flatPaperList.map(({ subject, paper }) => {
                                const mean = calculateMeanScore(subject, paper);
                                const meanText = mean !== null ? mean.toFixed(1) : 'N/A';
                                const meanCellColor = updateCellColor(mean !== null ? mean : '', paper);
                                return (
                                    <td key={`mean-${subject}-${paper}`}>
                                        <div className="score-cell" style={{ backgroundColor: meanCellColor }}>
                                            {meanText}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div
                id="bottom-actions"
                ref={bottomActionsRef}
                className="fixed p-4 bg-white rounded-lg shadow-lg z-20 transform-gpu flex flex-col items-center w-[290px] h-[150px] max-w-sm cursor-grab pt-6"
                style={{ left: currentPosition.current.left, top: currentPosition.current.top }}
            >
                <button id="close-bottom-actions-btn" className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors" onClick={hideBottomActions}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
                <div id="active-cell-info" className="leading-[1.2em] text-gray-700 text-sm mb-[15px] font-semibold pt-0 flex-col w-full">
                    {activeCellData ? (
                        <>
                            <span>{activeCellData.subject} {activeCellData.paper}</span><br /><br />
                            <span style={{ fontSize: '30px' }}>{activeCellData.series} {activeCellData.year}</span>
                            <span style={{ fontSize: '20px', fontWeight: 100, color: 'grey' }}>
                                {activeCellData.score && !isNaN(parseFloat(activeCellData.score)) && activeCellData.maxMark ?
                                    ` (${((parseFloat(activeCellData.score) / activeCellData.maxMark) * 100).toFixed(0)}%)` :
                                    activeCellData.score === 'N/A' ? ' (N/A)' : ''}
                            </span>
                        </>
                    ) : (
                        <span>Loading...</span>
                    )}
                </div>
                <div className="flex space-x-2 mb-2 w-full">
                    <button id="goto-qp-btn" className="btn-primary w-[100%]" onClick={() => handleGoToPaper('qp')}>Question</button>
                    <button id="goto-ms-btn" className="btn-primary w-[100%] bg-gray-500 hover:bg-gray-600" onClick={() => handleGoToPaper('ms')}>Answer</button>
                </div>
                <div id="paper-graphs" className="overlay-graphs-container w-full">
                    {activeCellData && (
                        <>
                            {/* Score Reached Progress Bar */}
                            <div className="overlay-graph">
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div className="overlay-graph-title">Grade: A*</div>
                                    <div className="overlay-graph-title">UMS: <span className="text-center mt-1 text-gray-600">{activeCellData.score || 0} / {activeCellData.maxMark || 0}</span></div>
                                </div>
                                <div className="progress-bar-container">
                                    <div className="progress-bar" style={{ width: `${Math.min(100, ((parseFloat(activeCellData.score) || 0) / activeCellData.maxMark) * 100).toFixed(0)}%` }}></div>
                                </div>
                            </div>
                            {/* Skewed Normal Distribution Graph */}
                            <div className="overlay-graph">
                                <div className="overlay-graph-title">
                                    {calculatePercentile(
                                        (activeCellData.score && !isNaN(parseFloat(activeCellData.score)) && activeCellData.maxMark && activeCellData.maxMark > 0) ?
                                            (parseFloat(activeCellData.score) / activeCellData.maxMark) * 100 : NaN
                                    )}th Percentile
                                </div>
                                {/* The Chart component from react-apexcharts */}
                                <Chart
                                    options={chartOptions}
                                    series={chartOptions.series}
                                    type={chartOptions.chart?.type}
                                    height={chartOptions.chart?.height}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Main Modal for Subject Selection and Year Range */}
            {showModal && (
                <div id="modal-container" className="fixed inset-0 modal-overlay z-50">
                    <div className="modal-content w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="text-2xl font-bold text-gray-800">Select Subjects and Papers</h2>
                            <p className="text-gray-600">Choose the papers you want to track. Changes are saved automatically.</p>
                        </div>
                        <div id="modal-content-main" className="modal-body no-scrollbar">
                            <div id="modal-content-subjects">
                                {Object.entries(currentConfig.subjectsData).map(([subject, data]) => (
                                    <div key={subject} className="mb-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-lg font-bold text-gray-700">{subject}</h3>
                                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-600 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="rounded custom-checkbox mr-2"
                                                    data-subject={subject}
                                                    checked={
                                                        appState.modes[appState.currentMode].selectedPapers[subject]?.length === data.papers.length && data.papers.length > 0
                                                    }
                                                    onChange={(e) => handleSelectAllChange(subject, e.target.checked)}
                                                    ref={el => {
                                                        if (el) {
                                                            const allChecked = appState.modes[appState.currentMode].selectedPapers[subject]?.length === data.papers.length && data.papers.length > 0;
                                                            const anyChecked = (appState.modes[appState.currentMode].selectedPapers[subject]?.length || 0) > 0 && (appState.modes[appState.currentMode].selectedPapers[subject]?.length || 0) < data.papers.length;
                                                            el.checked = allChecked;
                                                            el.indeterminate = anyChecked;
                                                        }
                                                    }}
                                                />
                                                Select All
                                            </label>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                            {data.papers.map(paper => (
                                                <label key={paper} className="flex items-center space-x-2 p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded custom-checkbox mr-2 paper-checkbox"
                                                        data-subject={subject}
                                                        data-paper={paper}
                                                        checked={appState.modes[appState.currentMode].selectedPapers[subject]?.includes(paper) || false}
                                                        onChange={(e) => handlePaperSelectionChange(subject, paper, e.target.checked)}
                                                    />
                                                    {paper}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Year Range Section */}
                            <div id="year-range-section" className="mt-8 pt-6 border-t border-gray-200">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Set Year Range</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <label htmlFor="start-year" className="block text-gray-700 w-24">Start:</label>
                                        <select
                                            id="start-year"
                                            className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={currentYears.length > 0 ? currentYears[currentYears.length - 1].year : yearsForSelect[0]}
                                            onChange={(e) => {
                                                const newYear = parseInt(e.target.value);
                                                setAppState(prevState => {
                                                    const newState = { ...prevState };
                                                    const currentModeYears = newState.modes[newState.currentMode].years;
                                                    const currentStartSeries = currentModeYears.length > 0 ? currentModeYears[currentModeYears.length - 1].series : currentConfig.series[0];
                                                    const currentEndYear = currentModeYears.length > 0 ? currentModeYears[0].year : currentConfig.maxYearSelect;
                                                    const currentEndSeries = currentModeYears.length > 0 ? currentModeYears[0].series : currentConfig.maxSeriesSelect;

                                                    newState.modes[newState.currentMode].years = generateYearSeriesRange(
                                                        newYear, currentStartSeries, currentEndYear, currentEndSeries,
                                                        currentConfig.seriesOrder, currentConfig.maxYearSelect, currentConfig.maxSeriesSelect
                                                    );
                                                    return newState;
                                                });
                                            }}
                                        >
                                            {yearsForSelect.map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                        <select
                                            id="start-series"
                                            className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={currentYears.length > 0 ? currentYears[currentYears.length - 1].series : currentConfig.series[0]}
                                            onChange={(e) => {
                                                const newSeries = e.target.value;
                                                setAppState(prevState => {
                                                    const newState = { ...prevState };
                                                    const currentModeYears = newState.modes[newState.currentMode].years;
                                                    const currentStartYear = currentModeYears.length > 0 ? currentModeYears[currentModeYears.length - 1].year : yearsForSelect[0];
                                                    const currentEndYear = currentModeYears.length > 0 ? currentModeYears[0].year : currentConfig.maxYearSelect;
                                                    const currentEndSeries = currentModeYears.length > 0 ? currentModeYears[0].series : currentConfig.maxSeriesSelect;

                                                    newState.modes[newState.currentMode].years = generateYearSeriesRange(
                                                        currentStartYear, newSeries, currentEndYear, currentEndSeries,
                                                        currentConfig.seriesOrder, currentConfig.maxYearSelect, currentConfig.maxSeriesSelect
                                                    );
                                                    return newState;
                                                });
                                            }}
                                        >
                                            {currentConfig.series.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <label htmlFor="end-year" className="block text-gray-700 w-24">End:</label>
                                        <select
                                            id="end-year"
                                            className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={currentYears.length > 0 ? currentYears[0].year : currentConfig.maxYearSelect}
                                            onChange={(e) => {
                                                const newYear = parseInt(e.target.value);
                                                setAppState(prevState => {
                                                    const newState = { ...prevState };
                                                    const currentModeYears = newState.modes[newState.currentMode].years;
                                                    const currentStartYear = currentModeYears.length > 0 ? currentModeYears[currentModeYears.length - 1].year : yearsForSelect[0];
                                                    const currentStartSeries = currentModeYears.length > 0 ? currentModeYears[currentModeYears.length - 1].series : currentConfig.series[0];
                                                    const currentEndSeries = currentModeYears.length > 0 ? currentModeYears[0].series : currentConfig.maxSeriesSelect;

                                                    newState.modes[newState.currentMode].years = generateYearSeriesRange(
                                                        currentStartYear, currentStartSeries, newYear, currentEndSeries,
                                                        currentConfig.seriesOrder, currentConfig.maxYearSelect, currentConfig.maxSeriesSelect
                                                    );
                                                    return newState;
                                                });
                                            }}
                                        >
                                            {yearsForSelect.map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                        <select
                                            id="end-series"
                                            className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={currentYears.length > 0 ? currentYears[0].series : currentConfig.maxSeriesSelect}
                                            onChange={(e) => {
                                                const newSeries = e.target.value;
                                                setAppState(prevState => {
                                                    const newState = { ...prevState };
                                                    const currentModeYears = newState.modes[newState.currentMode].years;
                                                    const currentStartYear = currentModeYears.length > 0 ? currentModeYears[currentModeYears.length - 1].year : yearsForSelect[0];
                                                    const currentStartSeries = currentModeYears.length > 0 ? currentModeYears[currentModeYears.length - 1].series : currentConfig.series[0];
                                                    const currentEndYear = currentModeYears.length > 0 ? currentModeYears[0].year : currentConfig.maxYearSelect;

                                                    newState.modes[newState.currentMode].years = generateYearSeriesRange(
                                                        currentStartYear, currentStartSeries, currentEndYear, newSeries,
                                                        currentConfig.seriesOrder, currentConfig.maxYearSelect, currentConfig.maxSeriesSelect
                                                    );
                                                    return newState;
                                                });
                                            }}
                                        >
                                            {currentConfig.series.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Year range error message - managed by handleSetYearRangeAndCloseModal */}
                                    {/* For React, you would typically have a state variable for this error and render conditionally */}
                                    {/* <p id="year-range-error" className="text-red-500 text-sm hidden">Start date cannot be after end date.</p> */}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                id="close-modal-btn"
                                className="btn-primary"
                                onClick={() => {
                                    const startY = parseInt((document.getElementById('start-year') as HTMLSelectElement).value);
                                    const startS = (document.getElementById('start-series') as HTMLSelectElement).value;
                                    const endY = parseInt((document.getElementById('end-year') as HTMLSelectElement).value);
                                    const endS = (document.getElementById('end-series') as HTMLSelectElement).value;
                                    handleSetYearRangeAndCloseModal(startY, startS, endY, endS);
                                }}
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
