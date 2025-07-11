"use client"; // This directive is placed at the very top as requested

import React, { useState, useEffect, useRef, useCallback } from 'react';
// ApexCharts is loaded via CDN in the HTML, so we assume it's globally available.
// If using a module bundler, you'd typically import it: import ApexCharts from 'apexcharts';

// --- CONFIGURATION ---
// Using a new appId to avoid conflicts with previous localStorage data structure
const appId = 'past-paper-tracker-app-v5-react'; // Changed app ID for new structure

// IAL Specific Data
const ialSubjectsData = {
    'Physics': { papers: ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5', 'Unit 6'] },
    'Chemistry': { papers: ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5', 'Unit 6'] },
    'Biology': { papers: ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5', 'Unit 6'] },
    'Math': { papers: ['P1', 'P2', 'P3', 'P4', 'M1', 'M2', 'M3', 'FP1', 'FP2', 'FP3', 'S1', 'S2', 'S3', 'D1', 'D2'] }
};
const ialPaperMaxMarks: Record<string, number> = {
    'Unit 1': 80, 'Unit 2': 80, 'Unit 4': 90, 'Unit 5': 90, 'Unit 3': 50, 'Unit 6': 50,
    'P1': 75, 'P2': 75, 'P3': 75, 'P4': 75, 'M1': 75, 'M2': 75, 'M3': 75,
    'FP1': 75, 'FP2': 75, 'FP3': 75, 'S1': 75, 'S2': 75, 'S3': 75, 'D1': 75, 'D2': 75
};
const ialSeries = ['Jan', 'Jun', 'Oct'];
const ialSeriesOrder: Record<string, number> = { 'Jan': 0, 'Jun': 1, 'Oct': 2 };
const ialMaxYearSelect = 2025;
const ialMaxSeriesSelect = 'Jun';

// IGCSE Specific Data
const igcseSubjectsData = {
    'Math A': { papers: ['Paper 1', 'Paper 2'] },
    'Math B': { papers: ['Paper 1', 'Paper 2'] },
    'Physics': { papers:  ['Paper 1', 'Paper 2'] },
    'Chemistry': { papers: ['Paper 1', 'Paper 2'] },
    'Biology': { papers: ['Paper 1', 'Paper 2'] },
    'Chinese': { papers: ['Paper 1', 'Paper 2'] }
};
const igcsePaperMaxMarks: Record<string, number> = {
    'Paper 1F': 100, 'Paper 1H': 100, 'Paper 2F': 100, 'Paper 2H': 100, // Math
    'Paper 1': 50, 'Paper 2': 80,
    'Paper 1P': 60, 'Paper 2P': 60, 'Paper 3P': 60, 'Paper 4P': 60, // Physics
    'Paper 1C': 60, 'Paper 2C': 60, 'Paper 3C': 60, 'Paper 4C': 60, // Chemistry
    'Paper 1B': 60, 'Paper 2B': 60, 'Paper 3B': 60, 'Paper 4B': 60 // Biology
};
const igcseSeries = ['Jan', 'Jun', 'Nov'];
const igcseSeriesOrder: Record<string, number> = { 'Jan': 0, 'Jun': 1, 'Nov': 2 };
const igcseMaxYearSelect = 2025;
const igcseMaxSeriesSelect = 'Nov'; // Max year for IGCSE, adjusted for current year

// Editable list of disabled papers
const disabledPapersList = [
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

interface YearSeries {
    year: number;
    series: string;
}

interface AppStateMode {
    selectedPapers: Record<string, string[]>;
    scores: Record<string, string>;
    years: YearSeries[];
}

interface AppStateType {
    currentMode: 'IAL' | 'IGCSE';
    modes: {
        IAL: AppStateMode;
        IGCSE: AppStateMode;
    };
}

// --- UTILITY FUNCTIONS ---
// Generates an array of {year, series} objects within the specified range
const generateYearSeriesRange = (
    startYear: number,
    startSeries: string,
    endYear: number,
    endSeries: string,
    seriesOrderObj: Record<string, number>,
    maxYear: number,
    maxSeries: string
): YearSeries[] => {
    const result: YearSeries[] = [];

    // Ensure years do not go beyond the maxYearSelect/maxSeriesSelect boundary
    const actualEndYear = Math.min(endYear, maxYear);
    let actualEndSeries = endSeries;
    if (endYear === maxYear && seriesOrderObj[endSeries] > seriesOrderObj[maxSeries]) {
        actualEndSeries = maxSeries;
    }

    // Loop backwards from actualEndYear/actualEndSeries to startYear/startSeries
    for (let year = actualEndYear; year >= startYear; year--) {
        const currentYearSeries: YearSeries[] = [];
        // Sort series array to ensure iteration order is consistent (Jan, Jun, Oct/Nov)
        const sortedSeriesKeys = Object.keys(seriesOrderObj).sort((a, b) => seriesOrderObj[a] - seriesOrderObj[b]);

        for (let i = sortedSeriesKeys.length - 1; i >= 0; i--) {
            const serie = sortedSeriesKeys[i];
            // Skip series after the actual end series for the end year
            if (year === actualEndYear && seriesOrderObj[serie] > seriesOrderObj[actualEndSeries]) {
                continue;
            }
            // Skip series before the start series for the start year
            if (year === startYear && seriesOrderObj[serie] < seriesOrderObj[startSeries]) {
                continue;
            }
            currentYearSeries.push({ year, series: serie });
        }
        // Add the series for the current year in correct order (Jan, Jun, Oct/Nov)
        currentYearSeries.sort((a, b) => seriesOrderObj[a.series] - seriesOrderObj[b.series]);
        result.push(...currentYearSeries);
    }
    // Sort the generated list in descending order (latest year/series first)
    sortYearSeriesList(result, seriesOrderObj);
    return result;
};

const sortYearSeriesList = (list: YearSeries[], seriesOrderObj: Record<string, number>) => {
    list.sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year; // Descending year
        return seriesOrderObj[b.series] - seriesOrderObj[a.series]; // Descending series within year
    });
};

const getFullMonthName = (seriesAbbr: string): string => {
    const months: Record<string, string> = { 'Jan': 'January', 'Jun': 'June', 'Oct': 'October', 'Nov': 'November' };
    return months[seriesAbbr] || seriesAbbr; // Return full name or original if not found
};

// Calculate a simplified percentile based on a skewed distribution with median at 70%
const calculatePercentile = (scorePercentage: number): string => {
    if (isNaN(scorePercentage)) return '0';
    if (scorePercentage < 0) scorePercentage = 0;
    if (scorePercentage > 100) scorePercentage = 100;

    let percentile: number;
    if (scorePercentage <= 70) {
        // From 0-70% score, map to 0-50th percentile (linear)
        percentile = (scorePercentage / 70) * 50;
    } else {
        // From 70-100% score, map to 50-100th percentile (linear, but stretched)
        percentile = 50 + ((scorePercentage - 70) / 30) * 50;
    }
    return percentile.toFixed(0); // Round to nearest whole number
};

// --- ScoreCell Component ---
interface ScoreCellProps {
    id: string;
    score: string;
    subject: string;
    paper: string;
    year: number;
    series: string;
    mode: 'IAL' | 'IGCSE';
    maxMark: number;
    isDisabled: boolean;
    onScoreChange: (id: string, newScore: string, subject: string, paper: string) => void;
    onCellFocus: (cellData: { id: string, subject: string, paper: string, year: number, series: string, mode: 'IAL' | 'IGCSE' }) => void;
}

const ScoreCell: React.FC<ScoreCellProps> = React.memo(({
    id,
    score,
    subject,
    paper,
    year,
    series,
    mode,
    maxMark,
    isDisabled,
    onScoreChange,
    onCellFocus
}) => {
    const cellRef = useRef<HTMLDivElement>(null);
    // Local state for immediate visual feedback during typing
    const [currentInput, setCurrentInput] = useState<string>(score);

    // Effect to synchronize the DOM's textContent with the 'score' prop from parent
    // This runs when 'score' prop changes, but only if the cell is not actively being edited.
    useEffect(() => {
        if (cellRef.current) {
            // Only update the DOM if it's not currently focused by the user
            // or if the score prop has genuinely changed from the local input
            if (cellRef.current !== document.activeElement || currentInput !== score) {
                cellRef.current.textContent = score;
                setCurrentInput(score); // Keep local state in sync with prop
            }
        }
    }, [score]); // Only re-run if score prop changes

    const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
        const newValue = e.currentTarget.textContent || '';
        setCurrentInput(newValue); // Update local state for immediate visual feedback
        onScoreChange(id, newValue, subject, paper); // <-- add this line
    }, [id, onScoreChange, subject, paper]);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
        const finalValue = e.currentTarget.textContent || '';
        onScoreChange(id, finalValue, subject, paper); // Propagate change to parent
    }, [id, onScoreChange, subject, paper]);

    const handleFocus = useCallback(() => {
        onCellFocus({ id, subject, paper, year, series, mode });
    }, [id, subject, paper, year, series, mode, onCellFocus]);

    // Calculate percentage and bgColor based on currentInput (local state) for instant feedback
    const percentage = (currentInput && !isNaN(parseFloat(currentInput)) && maxMark) ?
        ((parseFloat(currentInput) / maxMark) * 100) : NaN;

    let bgColor = '';
    if (!isNaN(percentage)) {
        if (percentage >= 90) bgColor = 'var(--color-90)';
        else if (percentage >= 80) bgColor = 'var(--color-80)';
        else if (percentage >= 60) bgColor = 'var(--color-70)';
        else if (percentage >= 30) bgColor = 'var(--color-50)';
        else bgColor = 'var(--color-fail)';
    }

    return (
        <div
            ref={cellRef}
            className={`score-cell ${isDisabled ? 'disabled' : ''}`}
            contentEditable={!isDisabled}
            onInput={handleInput}
            onBlur={handleBlur}
            onFocus={handleFocus}
            style={{ backgroundColor: bgColor }}
            suppressContentEditableWarning={true} // Suppress React warning for contentEditable
            // No children or dangerouslySetInnerHTML. The DOM's textContent is managed
            // by the browser during typing, and by the useEffect for external updates.
        >
        </div>
    );
});

// --- Main App Component ---
const App: React.FC = () => {
    const [appState, setAppState] = useState<AppStateType>(() => {
        // Initial state from localStorage or defaults
        try {
            const saved = localStorage.getItem(appId);
            if (saved) {
                const data: AppStateType = JSON.parse(saved);
                // Ensure nested properties exist and are valid for each mode
                ['IAL', 'IGCSE'].forEach(mode => {
                    data.modes[mode].selectedPapers = data.modes[mode].selectedPapers || {};
                    for (const subject in data.modes[mode].selectedPapers) {
                        if (!Array.isArray(data.modes[mode].selectedPapers[subject])) {
                            data.modes[mode].selectedPapers[subject] = [];
                        }
                    }
                    data.modes[mode].scores = data.modes[mode].scores || {};
                    if (!data.modes[mode].years || !Array.isArray(data.modes[mode].years) || !data.modes[mode].years.every(y => typeof y === 'object' && y.year && y.series)) {
                        console.warn(`Invalid 'years' data for ${mode} mode in localStorage, using default range.`);
                        if (mode === 'IAL') {
                            data.modes.IAL.years = generateYearSeriesRange(2019, 'Jan', 2025, 'Jun', ialSeriesOrder, ialMaxYearSelect, ialMaxSeriesSelect);
                        } else { // IGCSE
                            data.modes.IGCSE.years = generateYearSeriesRange(2010, 'Jan', 2025, 'Nov', igcseSeriesOrder, igcseMaxYearSelect, igcseMaxSeriesSelect);
                        }
                    }
                    sortYearSeriesList(data.modes[mode].years, (mode === 'IAL' ? ialSeriesOrder : igcseSeriesOrder));
                });
                return data;
            }
        } catch (error) {
            console.error("Error loading state from localStorage:", error);
        }
        // Default state if no saved state or error
        return {
            currentMode: 'IAL',
            modes: {
                IAL: {
                    selectedPapers: {
                        'Math': ['P1', 'P2', 'P3', 'P4'],
                        'Physics': ['Unit 1', 'Unit 2']
                    },
                    scores: {},
                    years: generateYearSeriesRange(2019, 'Jan', 2025, 'Jun', ialSeriesOrder, ialMaxYearSelect, ialMaxSeriesSelect)
                },
                IGCSE: {
                    selectedPapers: {
                        'Math A': ['Paper 1H', 'Paper 2H'],
                        'Chinese': ['Paper 1H']
                    },
                    scores: {},
                    years: generateYearSeriesRange(2010, 'Jan', 2025, 'Nov', igcseSeriesOrder, igcseMaxYearSelect, igcseMaxSeriesSelect)
                }
            }
        };
    });

    const currentMode: 'IAL' | 'IGCSE' = appState.currentMode;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeCellData, setActiveCellData] = useState<{ id: string, subject: string, paper: string, year: number, series: string, mode: 'IAL' | 'IGCSE' } | null>(null);
    const [isBottomActionsVisible, setIsBottomActionsVisible] = useState(false);
    const bottomActionsRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const chartRef = useRef<HTMLDivElement>(null); // New ref for the chart container

    // Add state for dashboard mode
    const [dashboardMode, setDashboardMode] = useState<'score' | 'calendar'>('score');
    const [calendarRange, setCalendarRange] = useState<{start: string, end: string}>(() => {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth()-1, 1).toISOString().slice(0, 10);
        const end = new Date(today.getFullYear(), today.getMonth() + 3, 0).toISOString().slice(0, 10);
        return { start, end };
    });
    const [calendarData, setCalendarData] = useState<Record<string, string>>({});

    // Add state for calendar modal
    const [isCalendarRangeModalOpen, setIsCalendarRangeModalOpen] = useState(false);
    const [calendarRangeDraft, setCalendarRangeDraft] = useState(calendarRange);

    // Helper to generate calendar days between two dates
    function getCalendarDays(start: string, end: string) {
        const days = [];
        let current = new Date(start);
        const last = new Date(end);
        while (current <= last) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        return days;
    }

    // Helper to group days by month for table rendering
    function groupDaysByMonth(days: Date[]) {
        const months: Record<string, Date[]> = {};
        days.forEach(day => {
            const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}`;
            if (!months[key]) months[key] = [];
            months[key].push(day);
        });
        return months;
    }

    // --- Memoized Current Mode Data ---
    const getCurrentSubjectsData = useCallback(() => {
        return appState.currentMode === 'IAL' ? ialSubjectsData : igcseSubjectsData;
    }, [appState.currentMode]);

    const getCurrentPaperMaxMarks = useCallback(() => {
        return appState.currentMode === 'IAL' ? ialPaperMaxMarks : igcsePaperMaxMarks;
    }, [appState.currentMode]);

    const getCurrentSeries = useCallback((mode: 'IAL' | 'IGCSE' = appState.currentMode) => {
        return mode === 'IAL' ? ialSeries : igcseSeries;
    }, [appState.currentMode]);

    const getCurrentSeriesOrder = useCallback((mode: 'IAL' | 'IGCSE' = appState.currentMode) => {
        return mode === 'IAL' ? ialSeriesOrder : igcseSeriesOrder;
    }, [appState.currentMode]);

    const getCurrentMaxYearSelect = useCallback(() => {
        return appState.currentMode === 'IAL' ? ialMaxYearSelect : igcseMaxYearSelect;
    }, [appState.currentMode]);

    const getCurrentMaxSeriesSelect = useCallback(() => {
        return appState.currentMode === 'IAL' ? ialMaxSeriesSelect : igcseMaxSeriesSelect;
    }, [appState.currentMode]);

    const getFlatPaperList = useCallback(() => {
        const list: { subject: string; paper: string }[] = [];
        const currentSubjectsData = getCurrentSubjectsData();
        const currentSelectedPapers = appState.modes[currentMode].selectedPapers;

        Object.keys(currentSubjectsData).forEach(subject => {
            if (currentSelectedPapers[subject] && Array.isArray(currentSelectedPapers[subject])) {
                const sortedPapers = currentSubjectsData[subject].papers.filter(p => currentSelectedPapers[subject].includes(p));
                sortedPapers.forEach(paper => {
                    list.push({ subject, paper });
                });
            }
        });
        return list;
    }, [appState.currentMode, getCurrentSubjectsData]);

    const calculateMeanScore = useCallback((subject: string, paper: string): number | null => {
        let totalScore = 0;
        let count = 0;
        const currentScores = appState.modes[currentMode].scores;
        const currentYears = appState.modes[currentMode].years;

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

    // --- Effects ---

    // Save state to localStorage whenever appState changes
    useEffect(() => {
        const handler = setTimeout(() => {
            localStorage.setItem(appId, JSON.stringify(appState));
            console.log("State saved to localStorage");
        }, 500); // Debounce saving
        return () => clearTimeout(handler);
    }, [appState]);

    // Update header date on mount
    useEffect(() => {
        const today = new Date();
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
        document.getElementById('header-date')!.textContent = today.toLocaleDateString('en-US', options);
    }, []);

    // Set initial position of bottom actions bar and recalculate on resize
    useEffect(() => {
        const setPosition = () => {
            if (bottomActionsRef.current) {
                const rect = bottomActionsRef.current.getBoundingClientRect();
                const initialLeft = window.innerWidth - rect.width - 60;
                const initialTop = window.innerHeight - rect.height - 60;
                bottomActionsRef.current.style.left = `${initialLeft}px`;
                bottomActionsRef.current.style.top = `${initialTop}px`;
            }
        };

        setPosition(); // Set initial position
        window.addEventListener('resize', setPosition); // Recalculate on resize

        return () => {
            window.removeEventListener('resize', setPosition); // Cleanup
        };
    }, []); // Run once on mount


    // useEffect for ApexCharts initialization and updates
    useEffect(() => {
        let chart: any;
        if (activeCellData && chartRef.current && typeof window !== 'undefined' && (window as any).ApexCharts) {
            const { subject, paper, mode } = activeCellData;
            const currentScores = appState.modes[mode as 'IAL' | 'IGCSE'].scores;
            const cellId = activeCellData.id; // Use activeCellData.id directly
            const rawScore = currentScores[cellId] || '';
            const maxMark = getCurrentPaperMaxMarks()[paper];

            let percentage = 0;
            if (rawScore && !isNaN(parseFloat(rawScore)) && maxMark && maxMark > 0) {
                percentage = Math.min(100, (parseFloat(rawScore) / maxMark) * 100);
            }
            const currentPercentile = calculatePercentile(percentage);

            const chartOptions = {
                chart: {
                    type: "area",
                    height: 40,
                    toolbar: { show: false },
                    sparkline: { enabled: true },
                    animations: { enabled: false },
                    parentHeightOffset: 0
                },
                dataLabels: { enabled: false },
                stroke: { curve: 'smooth', width: 1, colors: ['var(--primary-color)'] },
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
                            offset: 0, color: 'var(--primary-color)', opacity: 0.3
                        }, {
                            offset: 100, color: 'var(--primary-color)', opacity: 0.1
                        }]
                    }
                },
                xaxis: {
                    categories: Array.from({ length: 20 }, (_, i) => `${i * 5}%`),
                    labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false }, tooltip: { enabled: false }
                },
                yaxis: { show: false },
                grid: { show: false, padding: { left: -5, right: -5, top: -5, bottom: -5 } },
                tooltip: { enabled: false }
            };

            chart = new (window as any).ApexCharts(chartRef.current, chartOptions);
            chart.render();
        }

        return () => {
            if (chart) {
                chart.destroy();
            }
        };
    }, [activeCellData, appState.modes, getCurrentPaperMaxMarks]); // Dependencies for the chart effect


    // --- Handlers ---

    const handleScoreChange = useCallback((id: string, newScore: string, subject: string, paper: string) => {
        setAppState(prevState => {
            const newState = { ...prevState };
            newState.modes[prevState.currentMode].scores = {
                ...newState.modes[prevState.currentMode].scores,
                [id]: newScore
            };
            return newState;
        });
        // Update active cell data if this was the active cell
        setActiveCellData(prevData => {
            if (prevData && prevData.id === id) {
                return { ...prevData, score: newScore }; // Update score in activeCellData
            }
            return prevData;
        });
    }, []);

    const handleCellFocus = useCallback((cellData: { id: string, subject: string, paper: string, year: number, series: string, mode: 'IAL' | 'IGCSE' }) => {
        setActiveCellData(cellData);
        setIsBottomActionsVisible(true);
    }, []);

    const handlePaperSelectionChange = useCallback((subject: string, paper: string, isChecked: boolean) => {
        setAppState(prevState => {
            const newState = { ...prevState };
            const currentSelectedPapers = { ...newState.modes[prevState.currentMode as 'IAL' | 'IGCSE'].selectedPapers };

            if (!currentSelectedPapers[subject]) {
                currentSelectedPapers[subject] = [];
            }

            if (isChecked) {
                if (!currentSelectedPapers[subject].includes(paper)) {
                    currentSelectedPapers[subject].push(paper);
                }
            } else {
                currentSelectedPapers[subject] = currentSelectedPapers[subject].filter(p => p !== paper);
            }
            newState.modes[prevState.currentMode as 'IAL' | 'IGCSE'].selectedPapers = currentSelectedPapers;
            return newState;
        });
    }, []);

    const handleSelectAllChange = useCallback((subject: string, isChecked: boolean) => {
        setAppState(prevState => {
            const newState = { ...prevState };
            const currentSubjectsData = prevState.currentMode === 'IAL' ? ialSubjectsData : igcseSubjectsData;
            const papers = currentSubjectsData[subject]?.papers || [];

            if (isChecked) {
                newState.modes[prevState.currentMode as 'IAL' | 'IGCSE'].selectedPapers[subject] = [...papers];
            } else {
                newState.modes[prevState.currentMode as 'IAL' | 'IGCSE'].selectedPapers[subject] = [];
            }
            return newState;
        });
    }, []);

    const handleSetYearRangeAndCloseModal = useCallback(() => {
        const startYear = parseInt((document.getElementById('start-year') as HTMLSelectElement).value);
        const startSeries = (document.getElementById('start-series') as HTMLSelectElement).value;
        const endYear = parseInt((document.getElementById('end-year') as HTMLSelectElement).value);
        const endSeries = (document.getElementById('end-series') as HTMLSelectElement).value;

        const currentSeriesOrderObj = getCurrentSeriesOrder();
        const startDateWeight = startYear * 100 + currentSeriesOrderObj[startSeries];
        const endDateWeight = endYear * 100 + currentSeriesOrderObj[endSeries];

        const yearRangeErrorElement = document.getElementById('year-range-error');
        if (startDateWeight > endDateWeight) {
            yearRangeErrorElement?.classList.remove('hidden');
            return;
        } else {
            yearRangeErrorElement?.classList.add('hidden');
        }

        setAppState(prevState => {
            const newState = { ...prevState };
            const newYears = generateYearSeriesRange(
                startYear, startSeries, endYear, endSeries,
                currentSeriesOrderObj, getCurrentMaxYearSelect(), getCurrentMaxSeriesSelect()
            );
            newState.modes[prevState.currentMode as 'IAL' | 'IGCSE'].years = newYears;
            return newState;
        });
        setIsModalOpen(false);
    }, [getCurrentSeriesOrder, getCurrentMaxYearSelect, getCurrentMaxSeriesSelect]);

    const switchMode = useCallback((newMode: 'IAL' | 'IGCSE') => {
        setAppState(prevState => ({
            ...prevState,
            currentMode: newMode
        }));
        setIsBottomActionsVisible(false); // Hide bottom actions when switching mode
    }, []);

    const handleGoToPaper = useCallback((type: 'qp' | 'ms') => {
        if (!activeCellData) return;
        const { subject, paper, year, series, mode: examLevel } = activeCellData;
        const examBoard = "Edexcel";

        const params = new URLSearchParams({
            subject: subject,
            paper: paper,
            series: series,
            year: year.toString(),
            examBoard: examBoard,
            examLevel: examLevel
        }).toString();

        window.open(`paper_viewer.html?${params}&type=${type}`, '_blank');
    }, [activeCellData]);

    const hideBottomActions = useCallback(() => {
        setIsBottomActionsVisible(false);
        setActiveCellData(null);
    }, []);

    // --- Draggable Bottom Actions Bar Logic ---
    const startDrag = useCallback((e: React.MouseEvent) => {
        if (!bottomActionsRef.current) return;

        // Do not start drag if the event target is an interactive element within the pane
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.getAttribute('contenteditable') === 'true') {
            return;
        }

        setIsDragging(true);
        bottomActionsRef.current.classList.add('cursor-grabbing');
        bottomActionsRef.current.classList.remove('cursor-grab');

        const rect = bottomActionsRef.current.getBoundingClientRect();
        dragOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }, []);

    const drag = useCallback((e: MouseEvent) => {
        if (!isDragging || !bottomActionsRef.current) return;

        e.preventDefault();

        let newX = e.clientX - dragOffset.current.x;
        let newY = e.clientY - dragOffset.current.y;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const rect = bottomActionsRef.current.getBoundingClientRect();
        const elementWidth = rect.width;
        const elementHeight = rect.height;

        newX = Math.max(0, Math.min(viewportWidth - elementWidth, newX));
        newY = Math.max(0, Math.min(viewportHeight - elementHeight, newY));

        bottomActionsRef.current.style.left = `${newX}px`;
        bottomActionsRef.current.style.top = `${newY}px`;
    }, [isDragging]);

    const endDrag = useCallback(() => {
        setIsDragging(false);
        if (bottomActionsRef.current) {
            bottomActionsRef.current.classList.remove('cursor-grabbing');
            bottomActionsRef.current.classList.add('cursor-grab');
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
        return () => {
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', endDrag);
        };
    }, [drag, endDrag]);

    // --- Render Functions for Sub-components (Modal, Table) ---

    const renderSubjectSelection = useCallback(() => {
        const currentSubjectsData = getCurrentSubjectsData();
        const currentSelectedPapers = appState.modes[currentMode].selectedPapers;

        return Object.entries(currentSubjectsData).map(([subject, data]) => {
            const allPapersSelected = data.papers.every(paper => currentSelectedPapers[subject]?.includes(paper));
            const somePapersSelected = data.papers.some(paper => currentSelectedPapers[subject]?.includes(paper));
            const isIndeterminate = !allPapersSelected && somePapersSelected;

            return (
                <div key={subject} className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-700">{subject}</h3>
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-600 cursor-pointer">
                            <input
                                type="checkbox"
                                className="rounded custom-checkbox mr-2"
                                checked={allPapersSelected}
                                ref={el => {
                                    if (el) el.indeterminate = isIndeterminate;
                                }}
                                onChange={(e) => handleSelectAllChange(subject, e.target.checked)}
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
                                    checked={currentSelectedPapers[subject]?.includes(paper) || false}
                                    onChange={(e) => handlePaperSelectionChange(subject, paper, e.target.checked)}
                                />
                                {paper}
                            </label>
                        ))}
                    </div>
                </div>
            );
        });
    }, [appState.currentMode, appState.modes, getCurrentSubjectsData, handlePaperSelectionChange, handleSelectAllChange]);

    const renderYearRangeSelectors = useCallback(() => {
        const currentSeriesArr = getCurrentSeries();
        const currentMaxYear = getCurrentMaxYearSelect();
        const currentYearsList = appState.modes[currentMode].years;

        let initialStartYear = 2019;
        let initialStartSeries = 'Jan';
        let initialEndYear = 2025;
        let initialEndSeries = 'Jun';

        if (currentYearsList.length > 0) {
            const latestYearSeries = currentYearsList[0];
            const earliestYearSeries = currentYearsList[currentYearsList.length - 1];
            initialStartYear = earliestYearSeries.year;
            initialStartSeries = earliestYearSeries.series;
            initialEndYear = latestYearSeries.year;
            initialEndSeries = latestYearSeries.series;
        } else {
            // Fallback for empty years list, should be handled by initial state
            if (appState.currentMode === 'IGCSE') {
                initialStartYear = 2010;
                initialEndSeries = 'Nov';
            }
        }

        const currentYear = new Date().getFullYear();
        const yearsOptions = [];
        for (let year = Math.max(currentYear, currentMaxYear); year >= 2000; year--) {
            yearsOptions.push(<option key={year} value={year}>{year}</option>);
        }

        const seriesOptions = currentSeriesArr.map(s => (
            <option key={s} value={s}>{s}</option>
        ));

        return (
            <div id="year-range-section" className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Set Year Range</h3>
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <label htmlFor="start-year" className="block text-gray-700 w-24">Start:</label>
                        <select id="start-year" className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            defaultValue={initialStartYear}>
                            {yearsOptions}
                        </select>
                        <select id="start-series" className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            defaultValue={initialStartSeries}>
                            {seriesOptions}
                        </select>
                    </div>
                    <div className="flex items-center space-x-4">
                        <label htmlFor="end-year" className="block text-gray-700 w-24">End:</label>
                        <select id="end-year" className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            defaultValue={initialEndYear}>
                            {yearsOptions}
                        </select>
                        <select id="end-series" className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            defaultValue={initialEndSeries}>
                            {seriesOptions}
                        </select>
                    </div>
                    <p id="year-range-error" className="text-red-500 text-sm hidden">Start date cannot be after end date.</p>
                </div>
            </div>
        );
    }, [appState.currentMode, getCurrentSeries, getCurrentMaxYearSelect, appState.modes]);


    const renderPaperGraphs = useCallback(() => {
        if (!activeCellData) return null;

        const { subject, paper, year, series, mode } = activeCellData;
        const currentScores = appState.modes[mode as 'IAL' | 'IGCSE'].scores;
        const cellId = `${mode}_${year}_${series}_${subject}_${paper}`.replace(/\s/g, '_');
        const rawScore = currentScores[cellId] || '';
        const maxMark = getCurrentPaperMaxMarks()[paper];

        let percentage = 0;
        if (rawScore && !isNaN(parseFloat(rawScore)) && maxMark && maxMark > 0) {
            percentage = Math.min(100, (parseFloat(rawScore) / maxMark) * 100);
        }
        const currentPercentile = calculatePercentile(percentage);

        return (
            <div className="overlay-graphs-container w-full">
                <div className="overlay-graph">
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'left' }}>
                        <div className="overlay-graph-title">Grade: A*</div>
                        <div className="overlay-graph-title">UMS: <span className="text-center mt-1 text-gray-600">{rawScore || 0} / {maxMark || 0}</span></div>
                    </div>
                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
                    </div>
                </div>
                <div className="overlay-graph">
                    <div className="overlay-graph-title">{currentPercentile}th Percentile</div>
                    <div id="chart-skewed-dist" ref={chartRef}></div> {/* Use the ref here */}
                </div>
            </div>
        );
    }, [activeCellData, appState.modes, getCurrentPaperMaxMarks, chartRef]); // Added chartRef to dependencies


    const flatPaperList = getFlatPaperList();
    const currentYears = appState.modes[currentMode].years;
    const currentPaperMaxMarks = getCurrentPaperMaxMarks();

    const noPapersSelected = flatPaperList.length === 0;

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
                    width: 100%;
                    height: calc(100vh - 100px); /* Adjust based on header height */
                    overflow: auto;
                    border: 1px solid #e2e8f0;
                   
                    margin-bottom: 30px;
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
                    border: 1px solid #00000010;
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
                    height: 34px;
                    line-height: 34px;
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
                    <h1 className="text-2xl font-bold text-gray-800" id="header-date"></h1>
                    <p className="text-xs text-gray-500 mt-1">Data saved locally in your browser</p>
                </div>

                <div className="flex rounded-full overflow-hidden border border-[#ff3b30] bg-white shadow" style={{boxShadow:'0 2px 8px #0001'}}>
                    <button
                        className={`px-6 py-2 font-semibold transition-all ${dashboardMode==='score' ? 'bg-[#ff3b30] text-white' : 'text-[#ff3b30] bg-white'}`}
                        style={{outline:'none'}}
                        onClick={()=>setDashboardMode('score')}
                    >Score</button>
                    <button
                        className={`px-6 py-2 font-semibold transition-all ${dashboardMode==='calendar' ? 'bg-[#ff3b30] text-white' : 'text-[#ff3b30] bg-white'}`}
                        style={{outline:'none'}}
                        onClick={()=>setDashboardMode('calendar')}
                    >Calendar</button>
                </div>
                <div className="flex items-center space-x-2">
                    {dashboardMode === 'score' ? (
                        <select
                            id="exam-level-select"
                            className="w-[150px] p-2 text-base bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            value={appState.currentMode}
                            onChange={(e) => switchMode(e.target.value as 'IAL' | 'IGCSE')}
                        >
                            <option value="IAL">IAL</option>
                            <option value="IGCSE">IGCSE</option>
                        </select>
                    ) : (
                        <button
                            className="btn-primary px-4 py-2 text-white bg-[#ff3b30] rounded-md font-semibold"
                            onClick={() => {
                                setCalendarRangeDraft(calendarRange);
                                setIsCalendarRangeModalOpen(true);
                            }}
                        >Set Date Range</button>
                    )}
                </div>
            </header>

          

            {dashboardMode === 'score' ? (
                <>
                    <div id="table-container" className={`table-container flex-grow box-content ${noPapersSelected ? 'hidden' : ''}`}>
                        <table id="scores-table">
                            <thead id="table-head">
                                <tr>
                                    <th>
                                        <button
                                            id="open-select-papers-modal-btn-in-table"
                                            className="btn-primary flex items-center justify-center"
                                            onClick={() => setIsModalOpen(true)}
                                        >
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
                                            const score = appState.modes[currentMode].scores[cellId] || '';

                                            const isDisabled = disabledPapersList.some(item =>
                                                item.examLevel === appState.currentMode &&
                                                item.subject === subject &&
                                                item.series === serie &&
                                                (item.paper === null || item.paper === paper) &&
                                                (item.year === null || item.year === year)
                                            ) || (appState.currentMode === 'IAL' && serie === 'Oct' && paper.startsWith('FP'));

                                            return (
                                                <td key={cellId}>
                                                    <ScoreCell
                                                        id={cellId}
                                                        score={score}
                                                        subject={subject}
                                                        paper={paper}
                                                        year={year}
                                                        series={serie}
                                                        mode={appState.currentMode}
                                                        maxMark={currentPaperMaxMarks[paper]}
                                                        isDisabled={isDisabled}
                                                        onScoreChange={handleScoreChange}
                                                        onCellFocus={handleCellFocus}
                                                    />
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
                                        const scoreForColor = mean !== null ? mean.toString() : ''; // Pass string for color function

                                        return (
                                            <td key={`mean-${subject}-${paper}`}>
                                                <div
                                                    className="score-cell"
                                                    style={{
                                                        backgroundColor: (() => {
                                                            let bgColor = '';
                                                            if (mean !== null) {
                                                                const percentage = (mean / currentPaperMaxMarks[paper]) * 100;
                                                                if (percentage >= 90) bgColor = 'var(--color-90)';
                                                                else if (percentage >= 80) bgColor = 'var(--color-80)';
                                                                else if (percentage >= 60) bgColor = 'var(--color-70)';
                                                                else if (percentage >= 30) bgColor = 'var(--color-50)';
                                                                else bgColor = 'var(--color-fail)';
                                                            }
                                                            return bgColor;
                                                        })()
                                                    }}
                                                >
                                                    {meanText}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Message and Button for when no papers are selected */}
                    {noPapersSelected && (
                        <div id="no-papers-state" className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 text-lg">
                            <p className="mb-4">No papers selected. Click 'Select Papers' to get started.</p>
                            <button id="select-papers-intro-btn" className="btn-primary flex items-center gap-2 px-6 py-3 text-lg" onClick={() => setIsModalOpen(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
                                <span>Select Papers</span>
                            </button>
                        </div>
                    )}

                    <div
                        id="bottom-actions"
                        ref={bottomActionsRef}
                        className={`fixed p-4 bg-white rounded-xl border-2 border-[#00000015] shadow-2xl shadow-[#00000020] z-20 flex flex-col items-center w-[290px] h-[155px] max-w-sm cursor-grab pt-6 transition-transform duration-300 ${isBottomActionsVisible ? 'translate-y-0 opacity-100 visible' : 'translate-y-20 opacity-0 invisible'}`}
                        onMouseDown={startDrag}
                        style={{ position: 'fixed' }} // Ensure position is fixed for dragging
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
                                        {(() => {
                                            const score = appState.modes[activeCellData.mode as 'IAL' | 'IGCSE'].scores[activeCellData.id];
                                            const maxMark = getCurrentPaperMaxMarks()[activeCellData.paper];
                                            if (score && !isNaN(parseFloat(score)) && maxMark) {
                                                const percentage = ((parseFloat(score) / maxMark) * 100).toFixed(0);
                                                return ` (${percentage}%)`;
                                            } else if (score === 'N/A') {
                                                return ' (N/A)';
                                            }
                                            return '';
                                        })()}
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
                            {renderPaperGraphs()}
                        </div>
                    </div>
                </>
            ) : (
                // Calendar mode
                <div className="flex flex-col items-center w-full h-[calc(100vh-80px-60px)] min-h-[500px] overflow-scroll">
                    <div className="flex gap-4 mt-2">
                        {/* Remove the Set Date Range button from here */}
                    </div>
                    <div className="flex-1 w-full flex justify-center items-stretch">
                        <div className="overflow-auto w-full h-full min-h-0">
                            {/* Render calendar table */}
                            {(() => {
                                const days = getCalendarDays(calendarRange.start, calendarRange.end);
                                if (!days.length) return <div className="text-gray-400">No days in range</div>;
                                const months = groupDaysByMonth(days);
                                return Object.entries(months).map(([monthKey, monthDays]) => {
                                    const firstDay = monthDays[0];
                                    const year = firstDay.getFullYear();
                                    const month = firstDay.getMonth();
                                    const monthName = firstDay.toLocaleString('default', { month: 'long' });
                                    // Find the weekday of the 1st (0=Sun, 1=Mon...)
                                    const firstWeekday = new Date(year, month, 1).getDay();
                                    // Build weeks
                                    const weeks: (Date|null)[][] = [[]];
                                    let week = weeks[0];
                                    for (let i=0; i<firstWeekday; ++i) week.push(null);
                                    monthDays.forEach((date, idx) => {
                                        if (week.length === 7) { week = []; weeks.push(week); }
                                        week.push(date);
                                    });
                                    while (week.length < 7) week.push(null);
                                    return (
                                        <div key={monthKey} className="mb-8 w-full">
                                            <div className="text-xl font-bold mb-0 bg-white text-center">{monthName} {year}</div>
                                            <div className="overflow-auto w-full">
                                                <table className="w-full border-collapse bg-white shadow rounded-lg overflow-hidden min-w-[900px]" style={{tableLayout:'fixed'}}>
                                                    <thead>
                                                        <tr className="bg-[#ff3b30] text-white">
                                                            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>(<th key={d} className="py-2 font-semibold">{d}</th>))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {weeks.map((week,wi)=>(
                                                            <tr key={wi}>
                                                                {week.map((date,di)=>(
                                                                    <td key={di} className="align-top border border-gray-200 h-32 p-1 relative group min-w-[120px] min-h-[100px]">
                                                                        {date && (
                                                                            <div className="absolute top-1 left-2 text-sm font-bold text-gray-500">{date.getDate()}</div>
                                                                        )}
                                                                        {date && (
                                                                            <textarea
                                                                                className="w-full h-full p-2 pt-6 resize-none bg-transparent focus:bg-[#fff3f2] border-none outline-none text-sm text-gray-800"
                                                                                placeholder=""
                                                                                value={calendarData[date.toISOString().slice(0,10)]||''}
                                                                                onChange={e=>setCalendarData(d=>({...d,[date.toISOString().slice(0,10)]:e.target.value}))}
                                                                            />
                                                                        )}
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </div>
                    {/* Calendar Date Range Modal */}
                    {isCalendarRangeModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={e => { if (e.target === e.currentTarget) setIsCalendarRangeModalOpen(false); }}>
                            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">Set Calendar Date Range</h3>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input type="date" value={calendarRangeDraft.start} onChange={e=>setCalendarRangeDraft(r=>({...r,start:e.target.value}))} className="w-full border border-gray-300 rounded-md p-2" />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                    <input type="date" value={calendarRangeDraft.end} onChange={e=>setCalendarRangeDraft(r=>({...r,end:e.target.value}))} className="w-full border border-gray-300 rounded-md p-2" />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button onClick={()=>setIsCalendarRangeModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">Cancel</button>
                                    <button onClick={()=>{setCalendarRange(calendarRangeDraft);setIsCalendarRangeModalOpen(false);}} className="px-4 py-2 bg-[#ff3b30] text-white rounded-md hover:bg-red-600 transition">Done</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Main Modal for Subject Selection and Year Range */}
            {isModalOpen && (
                <div id="modal-container" className="fixed inset-0 modal-overlay z-50" onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        handleSetYearRangeAndCloseModal();
                    }
                }}>
                    <div className="modal-content w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="text-2xl font-bold text-gray-800">Select Subjects and Papers</h2>
                            <p className="text-gray-600">Choose the papers you want to track. Changes are saved automatically.</p>
                        </div>
                        <div id="modal-content-main" className="modal-body no-scrollbar">
                            <div id="modal-content-subjects">
                                {renderSubjectSelection()}
                            </div>
                            {renderYearRangeSelectors()}
                        </div>
                        <div className="modal-footer">
                            <button id="close-modal-btn" className="btn-primary" onClick={handleSetYearRangeAndCloseModal}>Done</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
