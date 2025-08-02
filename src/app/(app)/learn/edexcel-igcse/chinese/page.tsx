"use client";

import { useState } from 'react';
import { BookText, FileText, Lightbulb, Languages, Pen, TrendingUp, Users, ChevronDown, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import RevisionToolCard from './_components/RevisionToolCard';
import "./ChinesePage.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

const revisionTools = [
  { id: 'revision-notes', titleTop: 'Chinese', titleBottom: 'Revision Notes', icon: <BookText className="w-6 h-6 text-[#ff3b30]" /> },
  { id: 'past-papers?examBoard=Edexcel&examLevel=IGCSE&subject=Chinese&paper=Paper+1', titleTop: 'Chinese', titleBottom: 'Past Papers', icon: <FileText className="w-6 h-6 text-[#ff3b30]" /> },
  { id: 'ai-teacher', titleTop: 'Chinese', titleBottom: 'AI Teacher', icon: <Lightbulb className="w-6 h-6 text-[#ff3b30]" /> },
  { id: 'mock-test', titleTop: 'Chinese', titleBottom: 'Mock Tests', icon: <Pen className="w-6 h-6 text-[#ff3b30]" /> },
];

const navigate = (path: string) => {
  window.location.href = `/${path.replace(/^\//, '')}`;
};

const ContinueLessonButton: React.FC = () => {
  return (
    <div id="continue-lesson-button" className="continue-lesson-card flex items-center justify-center w-[75px] h-[75px] md:w-[115px] md:h-[115px]">
      <Languages size={70} color="#fff" />
    </div>
  );
};

// Mock data for charts
const pastPapersData = {
  labels: ['Paper 1', 'Paper 2'],
  datasets: [
    {
      label: 'Your Score',
      data: [85, 92],
      backgroundColor: [
        '#ff3b30',
        '#ff3b30',
      ],
      borderColor: [
        '#ff3b30',
        '#ff3b30',
      ],
      borderWidth: 2,
    },
    {
      label: 'Class Average',
      data: [78, 81],
      backgroundColor: [
        'rgba(142, 142, 147, 0.6)',
        'rgba(142, 142, 147, 0.6)',
      ],
      borderColor: [
        'rgba(142, 142, 147, 1)',
        'rgba(142, 142, 147, 1)',
      ],
      borderWidth: 2,
    },
  ],
};

// Mock data for different components over time
const mockTestsDataByComponent = {
  overall: {
    yourData: [72, 75, 78, 82, 79, 85, 88, 80],
    classData: [68, 70, 72, 74, 71, 75, 77, 69],
  },
  listening: {
    yourData: [75, 78, 82, 85, 80, 88, 90, 82],
    classData: [70, 72, 75, 78, 73, 80, 82, 74],
  },
  reading: {
    yourData: [70, 73, 76, 79, 77, 82, 85, 78],
    classData: [65, 68, 70, 73, 69, 75, 77, 70],
  },
  writing: {
    yourData: [68, 72, 75, 78, 76, 81, 84, 77],
    classData: [63, 66, 69, 72, 68, 74, 76, 69],
  },
  translating: {
    yourData: [73, 76, 79, 82, 80, 85, 87, 81],
    classData: [68, 71, 74, 77, 73, 79, 81, 74],
  },
  speaking: {
    yourData: [65, 68, 71, 74, 72, 77, 80, 73],
    classData: [60, 63, 66, 69, 65, 71, 73, 66],
  },
};

const mockTestsLabels = ['Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5', 'Test 6', 'Test 7', 'Test 8'];

const getMockTestsData = (component: string) => ({
  labels: mockTestsLabels,
  datasets: [
    {
      label: 'Your Performance',
      data: mockTestsDataByComponent[component as keyof typeof mockTestsDataByComponent].yourData,
      borderColor: '#ff3b30',
      backgroundColor: 'rgba(255, 59, 48, 0.1)',
      tension: 0.4,
      fill: true,
    },
    {
      label: 'Class Average',
      data: mockTestsDataByComponent[component as keyof typeof mockTestsDataByComponent].classData,
      borderColor: '#8e8e93',
      backgroundColor: 'rgba(142, 142, 147, 0.1)',
      tension: 0.4,
      fill: true,
    },
  ],
});

// Function to calculate predicted grade based on average score
const getPredictedGrade = (averageScore: number): string => {
  if (averageScore >= 90) return 'A*';
  if (averageScore >= 80) return 'A';
  if (averageScore >= 70) return 'B';
  if (averageScore >= 60) return 'C';
  if (averageScore >= 50) return 'D';
  if (averageScore >= 40) return 'E';
  return 'U';
};

// Calculate average score for past papers
const pastPapersAverageScore = Math.round((85 + 92) / 2); // Average of Paper 1 (85%) and Paper 2 (92%)
const predictedGrade = getPredictedGrade(pastPapersAverageScore);

const revisionNotesData = {
  labels: ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'],
  datasets: [
    {
      data: [85, 72, 90, 68, 78],
      backgroundColor: [
        'rgba(255, 59, 48, 0.8)',
        'rgba(255, 149, 0, 0.8)',
        'rgba(255, 204, 0, 0.8)',
        'rgba(88, 86, 214, 0.8)',
        'rgba(52, 199, 89, 0.8)',
      ],
      borderColor: [
        'rgba(255, 59, 48, 1)',
        'rgba(255, 149, 0, 1)',
        'rgba(255, 204, 0, 1)',
        'rgba(88, 86, 214, 1)',
        'rgba(52, 199, 89, 1)',
      ],
      borderWidth: 2,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: 'white',
      bodyColor: 'white',
      borderColor: '#ff3b30',
      borderWidth: 1,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: function(value: any) {
          return value + '%';
        },
      },
    },
  },
};

const horizontalBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: 'white',
      bodyColor: 'white',
      borderColor: '#ff3b30',
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: function(value: any) {
          return value + '%';
        },
      },
    },
  },
};

const ChinesePage = () => {
  const [selectedComponent, setSelectedComponent] = useState('overall');
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);

  const openOverlay = (type: string) => {
    setActiveOverlay(type);
  };

  const closeOverlay = () => {
    setActiveOverlay(null);
  };

  return (
    <div className="rounded-2xl p-6 pt-5 items-center flex justify-center bg-[#00000005]">
      <div className='w-4xl'>
         <nav className="inline-block self-start text-gray-500 text-sm mb-6 font-light border-[1px] bg-[#00000005] border-[#00000010] px-3 py-1 rounded-lg">
              <a href="#"  className="transition duration-300 hover:underline hover:text-[#ff3b30]">Learn</a>
              <span className="mx-2">/</span>
              <a href="#"  className="transition duration-300 hover:underline hover:text-[#ff3b30]">Edexcel IGCSE</a>
              <span className="mx-2">/</span>
              <span className='font-semibold'>Chinese</span>
            </nav>
            <div className="flex flex-row items-stretch md:items-start gap-4 md:gap-6 mb-6">
          <ContinueLessonButton />
          <div className="flex flex-col flex-grow title-buttons-container">
           
            {/* Page Title */}
            <div className="text-4xl md:text-5xl font-bold text-black md:mb-6">
              Edexcel IGCSE <br className="block md:hidden" />
              <span className="font-medium" style={{ color: 'var(--subject-primary-color)' }}>
                Chinese
              </span>

            </div>
            <p className="text-gray-700 text-lg max-w-3xl hidden md:block">Welcome to the Chinese Revision Zone!<br></br>Track your progress and compare with other students.</p>
          </div>

        </div>
        <p className="text-gray-700 text-lg max-w-3xl block md:hidden">Welcome to the Chinese Revision Zone!<br></br>Track your progress and compare with other students.</p>



        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Link href="/learn/edexcel-igcse/chinese/revision-notes" className="bg-white border-3 border-[#00000020] rounded-2xl p-4 flex flex-col items-center transition hover:border-[#ff3b30] hover:bg-[#ff3b3005] hover:shadow-[0_0_0_5px_#ff3b3050] ">
            <BookText className="w-8 h-8 text-[#ff3b30] mb-2" />
            <span className="text-sm font-medium text-black">Revision Notes</span>
          </Link>
          <Link href="/learn/edexcel-igcse/chinese/past-papers" className="bg-white border-3 border-[#00000020] rounded-2xl p-4 flex flex-col items-center transition hover:border-[#ff3b30] hover:bg-[#ff3b3005] hover:shadow-[0_0_0_5px_#ff3b3050] ">
            <FileText className="w-8 h-8 text-[#ff3b30] mb-2" />
            <span className="text-sm font-medium text-black">Past Papers</span>
          </Link>
          <Link href="/learn/edexcel-igcse/chinese/mock-test" className="bg-white border-3 border-[#00000020] rounded-2xl p-4 flex flex-col items-center transition hover:border-[#ff3b30] hover:bg-[#ff3b3005] hover:shadow-[0_0_0_5px_#ff3b3050] ">
            <Pen className="w-8 h-8 text-[#ff3b30] mb-2" />
            <span className="text-sm font-medium text-black">Mock Tests</span>
          </Link>
          <Link href="/learn/edexcel-igcse/chinese/ai-teacher" className="bg-white border-3 border-[#00000020] rounded-2xl p-4 flex flex-col items-center transition hover:border-[#ff3b30] hover:bg-[#ff3b3005] hover:shadow-[0_0_0_5px_#ff3b3050] ">
            <Lightbulb className="w-8 h-8 text-[#ff3b30] mb-2" />
            <span className="text-sm font-medium text-black">AI Teacher</span>
          </Link>
        </div>

        {/* Progress Analytics Section */}
        <div className="grid grid-cols-1  lg:grid-cols-1  gap-6 mt-10">
          {/* Past Papers Progress */}
          <div className="bg-white border-2 border-[#00000020] rounded-2xl p-6 flex flex-col transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-black">Past Papers</h3>
              <button
                onClick={() => openOverlay('past-papers')}
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="View more past papers analytics"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="flex justify-start gap-6 mb-4">
              <div className="text-left">
                <div className="text-2xl font-bold text-[#ff3b30]">12</div>
                <div className="text-[10px] text-gray-600">Done</div>
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-[#ff3b30]">88%</div>
                <div className="text-[10px] text-gray-600">Avg Score</div>
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-500">81%</div>
                <div className="text-[10px] text-gray-600">Class Avg</div>
              </div>
              <div className="text-center bg-[#ff3b3030] px-4 py-1 rounded-lg items-center flex align-center justify-center">
                <div className="text-4xl font-bold text-[#ff3b30] align-center justify-center items-center">{predictedGrade}</div>
                {/* <div className="text-[10px] font-bold text-[#ff3b30]">PREDICTED</div> */}
              </div>
            </div>
            <div className="h-48">
              <Bar data={pastPapersData} options={horizontalBarOptions} />
            </div>
          </div>

                    {/* Mock Tests Performance */}
          <div className="bg-white border-2 border-[#00000020] rounded-2xl p-6 flex flex-col transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-black">Mock Tests Performance</h3>
              <button
                onClick={() => openOverlay('mock-tests')}
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="View more mock tests analytics"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="justify-between flex items-center mb-4 gap-2">
            <div className="flex justify-start gap-6">
              <div className="text-left">
                <div className="text-2xl font-bold text-[#ff3b30]">8</div>
                <div className="text-[10px] text-gray-600">Done</div>
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-[#ff3b30]">
                  {Math.round(mockTestsDataByComponent[selectedComponent as keyof typeof mockTestsDataByComponent].yourData.reduce((a, b) => a + b, 0) / 8)}%
                </div>
                <div className="text-[10px] text-gray-600">Avg Score</div>
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-500">
                  {Math.round(mockTestsDataByComponent[selectedComponent as keyof typeof mockTestsDataByComponent].classData.reduce((a, b) => a + b, 0) / 8)}%
                </div>
                <div className="text-[10px] text-gray-600">Class Avg</div>
              </div>
            </div>
            <div className="relative flex h-10">
                <select
                  value={selectedComponent}
                  onChange={(e) => setSelectedComponent(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-1 pr-8 text-sm focus:outline-none focus:border-[#ff3b30]"
                >
                  <option value="overall">Overall</option>
                  <option value="listening">Listening</option>
                  <option value="reading">Reading</option>
                  <option value="writing">Writing</option>
                  <option value="translating">Translating</option>
                  <option value="speaking">Speaking</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            
            </div>
            <div className="h-48">
              <Line data={getMockTestsData(selectedComponent)} options={chartOptions} />
            </div>
          </div>

          {/* Revision Notes Completion */}
          <div className="bg-white border-2 border-[#00000020] rounded-2xl p-6 flex flex-col transition ">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-black">Revision Notes Progress</h3>
              <button
                onClick={() => openOverlay('revision-notes')}
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="View more revision notes analytics"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="flex justify-start gap-6 mb-4">
              <div className="text-left">
                <div className="text-2xl font-bold text-[#ff3b30]">78%</div>
                <div className="text-[10px] text-gray-600">Overall</div>
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-[#ff3b30]">3/5</div>
                <div className="text-[10px] text-gray-600">Units Done</div>
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-500">65%</div>
                <div className="text-[10px] text-gray-600">Class Avg</div>
              </div>
            </div>
            <div className="h-48">
              <Doughnut 
                data={revisionNotesData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      display: false,
                    },
                  },
                  scales: {},
                }} 
              />
            </div>
          </div>
        </div>

        {/* View More Analytics Button */}
        <div className="flex justify-center mt-8">
          <button className="bg-white border-2 border-[#ff3b30] text-[#ff3b30] rounded-xl px-8 py-3 font-medium transition hover:bg-[#ff3b30] hover:text-white">
            View More Analytics
          </button>
        </div>

        {/* Quick Actions */}
      

        {/* Analytics Overlays */}
        {activeOverlay && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur bg-opacity-50 z-100000 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-black">
                  {activeOverlay === 'past-papers' && 'Past Papers Analytics'}
                  {activeOverlay === 'mock-tests' && 'Mock Tests Analytics'}
                  {activeOverlay === 'revision-notes' && 'Revision Notes Analytics'}
                </h2>
                <button
                  onClick={closeOverlay}
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close overlay"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              <div className="p-6">
                {activeOverlay === 'past-papers' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-700 mb-2">Paper Performance</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Paper 1:</span>
                            <span className="font-semibold">85%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Paper 2:</span>
                            <span className="font-semibold">92%</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span>Average:</span>
                            <span className="font-semibold text-[#ff3b30]">{pastPapersAverageScore}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-700 mb-2">Grade Analysis</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Predicted Grade:</span>
                            <span className="font-semibold text-[#ff3b30]">{predictedGrade}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Next Grade Target:</span>
                            <span className="font-semibold">A*</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Points Needed:</span>
                            <span className="font-semibold">1.5%</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-700 mb-2">Class Comparison</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Class Average:</span>
                            <span className="font-semibold">81%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Your Rank:</span>
                            <span className="font-semibold text-[#ff3b30]">Top 15%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Improvement:</span>
                            <span className="font-semibold text-green-600">+7%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="h-64">
                      <Bar data={pastPapersData} options={horizontalBarOptions} />
                    </div>
                  </div>
                )}
                
                {activeOverlay === 'mock-tests' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-700 mb-2">Component Analysis</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Listening:</span>
                            <span className="font-semibold">82%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Reading:</span>
                            <span className="font-semibold">78%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Writing:</span>
                            <span className="font-semibold">77%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Speaking:</span>
                            <span className="font-semibold">73%</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-700 mb-2">Progress Tracking</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Tests Completed:</span>
                            <span className="font-semibold">8</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Average Score:</span>
                            <span className="font-semibold text-[#ff3b30]">80%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Improvement:</span>
                            <span className="font-semibold text-green-600">+8%</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-700 mb-2">Performance Insights</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Strongest Area:</span>
                            <span className="font-semibold text-green-600">Listening</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Needs Focus:</span>
                            <span className="font-semibold text-orange-600">Speaking</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Consistency:</span>
                            <span className="font-semibold text-blue-600">Good</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="h-64">
                      <Line data={getMockTestsData(selectedComponent)} options={chartOptions} />
                    </div>
                  </div>
                )}
                
                {activeOverlay === 'revision-notes' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-700 mb-2">Unit Progress</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Unit 1:</span>
                            <span className="font-semibold">85%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Unit 2:</span>
                            <span className="font-semibold">72%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Unit 3:</span>
                            <span className="font-semibold">90%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Unit 4:</span>
                            <span className="font-semibold">68%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Unit 5:</span>
                            <span className="font-semibold">78%</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-700 mb-2">Completion Status</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Units Completed:</span>
                            <span className="font-semibold">3/5</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Overall Progress:</span>
                            <span className="font-semibold text-[#ff3b30]">78%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Time Remaining:</span>
                            <span className="font-semibold">2 weeks</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-700 mb-2">Study Insights</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Best Unit:</span>
                            <span className="font-semibold text-green-600">Unit 3</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Needs Review:</span>
                            <span className="font-semibold text-orange-600">Unit 4</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Next Focus:</span>
                            <span className="font-semibold text-blue-600">Unit 4</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="h-64">
                      <Doughnut 
                        data={revisionNotesData} 
                        options={{
                          ...chartOptions,
                          plugins: {
                            ...chartOptions.plugins,
                            legend: {
                              display: true,
                              position: 'bottom' as const,
                            },
                          },
                          scales: {},
                        }} 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ChinesePage;
