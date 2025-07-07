"use client"; // This directive marks the component as a Client Component

import AppHeader from '@/components/app/header';
import React, { useState, useCallback } from 'react';
import { BookText, Settings, MessageCircle, FileText, Lightbulb, HelpCircle } from 'lucide-react'; // Importing Lucide React icons

// Helper function to convert hex color to RGB string (re-used from previous component)
const hexToRgb = (hex: string) => {
  let r = 0, g = 0, b = 0;
  // Handle #RRGGBB format
  if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  // Handle #RGB format (though not used in current data, good for robustness)
  else if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  }
  return `${r}, ${g}, ${b}`;
};

// AppHeader component (mocked for this example as it's not provided in this context)
// In a real application, you would import this from your components directory.


// Main App component (representing the Edexcel IAL page)
const App = () => {
  // State for the active tab in the 3-pane window
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'timetable', 'find-tutor'

  // Data for exams and subjects (re-used from previous component for consistency)
  const exams: Array<{
    id: string;
    title: string;
    icon: React.ElementType;
    description: string;
    buttonText: string;
    buttonColor: string;
    baseColor: string;
    subjects: string[];
  }> = [
    {
      id: 'edexcel-igcse/chinese',
      title: 'Edexcel IGCSE Chinese',
      icon: BookText,
      description: 'AI Mock Tests | Past Papers | AI Teacher | Private Tutor',
      buttonText: 'Start Revision',
      buttonColor: 'bg-[#ff3b30]',
      baseColor: '#ff3b30', // Red-500
      subjects: ['Listening', 'Reading', 'Writing', 'Translating'],
    },
    {
      id: 'edexcel-ial',
      title: 'Edexcel IAL Revision',
      icon: Settings,
      description: 'Revision Notes | Past Papers | AI Teacher | Private Tutor',
      buttonText: 'Start Revision',
      buttonColor: 'bg-[#ffac1a]',
      baseColor: '#ffac1a', // Orange-500
      subjects: ['Biology', 'Chemistry', 'Physics', 'Math'],
    },
    {
      id: 'ielts',
      title: 'IELTS English Revision',
      icon: MessageCircle,
      description: 'Revision Notes | Mock Test | AI Teacher | Private Tutor',
      buttonText: 'Start Revision',
      buttonColor: 'bg-[#007aff]',
      baseColor: '#007aff', // Blue-500
      subjects: ['Speaking', 'Writing', 'Listening', 'Reading'],
    },
  ];

  // Define the subject data for Edexcel IAL specifically
  const ialSubjects = [
    { id: 'biology', name: 'Biology', category: 'Edexcel IAL', bgColorClass: 'card-biology', baseColor: '#0fBD8C' },
    { id: 'chemistry', name: 'Chemistry', category: 'Edexcel IAL', bgColorClass: 'card-chemistry', baseColor: '#FF6B6B' },
    { id: 'physics', name: 'Physics', category: 'Edexcel IAL', bgColorClass: 'card-physics', baseColor: '#4081FF' },
    { id: 'math', name: 'Math', category: 'Edexcel IAL', bgColorClass: 'card-math', baseColor: '#ffab1a' },
  ];

  // Revision Tools data
  const revisionTools = [
    { id: 'past-papers', titleTop: 'Edexcel IAL', titleBottom: 'Past Papers', icon: FileText },
    { id: 'ai-teacher', titleTop: 'AI Teacher', titleBottom: '& Grading', icon: Lightbulb },
    { id: 'ask-help', titleTop: 'Ask for', titleBottom: 'Our Help', icon: HelpCircle },
  ];

  // Function to handle subject card click (similar to previous component)
  const handleSubjectClick = useCallback((subjectId: string) => {
    // In a real application, this would navigate to the subject-specific revision page
    window.location.href = `/learn/edexcel-ial/${subjectId}`;
  }, []);

  // Function to handle navigation (for breadcrumbs and other links)
  const navigate = (path: string) => {
    window.location.href = `/${path.replace(/^\//, '')}`;
  };

  // Content for the "Details" tab
  const DetailsContent = () => (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Edexcel IAL Details</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        The Edexcel International Advanced Level (IAL) is a globally recognized qualification, equivalent to A-levels in the UK. It's designed for students who wish to progress to higher education. For each of the subjects below, there are comprehensive revision notes, factsheets, questions from past exam papers separated by topic, and other worksheets to aid your learning.
      </p>
      <p className="text-gray-700 leading-relaxed">
        Our platform provides a structured approach to your IAL revision, offering AI-powered mock tests, detailed solutions, and access to AI teachers and private tutors for personalized support. Prepare effectively and achieve your best results!
      </p>
    </div>
  );

  // Content for the "Timetable" tab
  const TimetableContent = () => (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Exam Timetable</h3>
      <p className="text-gray-700 mb-4">
        Here you can find the provisional and final timetables for upcoming Edexcel IAL examinations. Please check regularly for updates.
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2">
        <li>Summer 2025 Exam Series: Provisional Timetable (Available Now)</li>
        <li>Winter 2025 Exam Series: Provisional Timetable (Expected September 2025)</li>
        <li>January 2026 Exam Series: Provisional Timetable (Expected November 2025)</li>
      </ul>
      <p className="mt-4 text-sm text-gray-500">
        *Dates are subject to change. Always refer to the official Edexcel website for the most accurate and up-to-date information.
      </p>
    </div>
  );

  // Content for the "Find a Tutor" tab
  const FindTutorContent = () => (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Find a Private Tutor</h3>
      <p className="text-gray-700 mb-4">
        Need personalized help? Our platform connects you with experienced private tutors specializing in Edexcel IAL subjects.
      </p>
      <form className="space-y-4">
        <div>
          <label htmlFor="subject" className="block text-gray-700 text-sm font-semibold mb-2">Subject:</label>
          <select id="subject" name="subject" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
            <option value="">Select a Subject</option>
            {ialSubjects.map(subject => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="level" className="block text-gray-700 text-sm font-semibold mb-2">Level:</label>
          <input type="text" id="level" name="level" value="Edexcel IAL" readOnly className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" />
        </div>
        <div>
          <label htmlFor="message" className="block text-gray-700 text-sm font-semibold mb-2">Your Message:</label>
          <textarea id="message" name="message" rows={4} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Describe your learning needs..."></textarea>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
          Request a Tutor
        </button>
      </form>
    </div>
  );


  return (
    <div className="min-h-screen bg-white p-0  font-inter">
      {/* Tailwind CSS CDN and Inter font */}
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>
        {`
          body {
            font-family: 'Inter', sans-serif;
          }
          :root {
            --primary-color: #007aff;
            --biology-bg: #0fBD8C;
            --chemistry-bg: #FF6B6B;
            --physics-bg: #4081FF;
            --math-bg: #ffab1a;
            --card-border-color: #222; /* Not directly used in this component's subject cards, but kept for consistency */
          }
          .subject-card {
            background-color: white;
            border-radius: 0.75rem;
            border: 2px solid black; 
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            padding: 15px;
            text-align: center;
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-start;
            min-height: 150px;
            position: relative;
            overflow: hidden;
          }
          .subject-card:hover {
            
          }
          .subject-tag {
            background-color: rgba(0,0,0,0.1);
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 0.375rem;
            font-size: 0.75rem;
            font-weight: 500;
            position: absolute;
            top: 15px; /* Position at top-left */
            left: 15px;
            z-index: 10;
          }
          .subject-name {
            font-size: 2rem;
            font-weight: 800;
            color: white;
            text-align: left;
            margin-bottom: -10px;
            flex-grow: 1;
            display: flex;
            align-items: flex-end;
            width: 100%;
          }
          .start-now-btn {
            font-size: 10px;
            background-color: white;
            color: black;
            padding: 0.5rem 1rem;
            border-radius: 100px;
            font-weight: 600;
            transition: background-color 0.2s, color 0.2s;
            align-self: flex-start; /* Align to the start (left) */
            margin-top: 1.2rem;
            transition: all 0.3s;
          }
          .start-now-btn:hover {
            box-shadow: 0px 0px 0px 7.5px #ffffff30;
          }

          /* Specific card background colors */
          .card-biology { background-color: var(--biology-bg); }
          .card-chemistry { background-color: var(--chemistry-bg); }
          .card-physics { background-color: var(--physics-bg); }
          .card-math { background-color: var(--math-bg); }
        `}
      </style>

      <AppHeader isAuthenticated={true} />

      <div className="max-w-5xl mx-auto px-4 py-8 rounded-sm">
        {/* Breadcrumbs */}
        <nav className="text-gray-500 text-sm mb-6 font-semibold">
          <a href="#" onClick={() => navigate('/')} className="transition duration-300 hover:underline hover:text-[#ff3b30]">Learn</a>
          <span className="mx-2">/</span>
          <span>Edexcel IAL</span>
        </nav>

        {/* Page Title */}
        <h1 className="text-6xl font-extrabold text-gray-400 mb-8">
        <span className="text-[#ff3b30]">Edexcel</span> IAL<br></br> <span className="font-medium text-[#000000]">Revision</span>
        </h1>
        <p className="text-gray-700 text-lg mb-10 max-w-3xl">
          For each of the subjects below, there are revision notes, factsheets, questions from past exam papers separated by topic and other worksheets.
        </p>

        {/* Subject Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {ialSubjects.map((subject) => (
            <div
              key={subject.id}
              className={`subject-card ${subject.bgColorClass}`}
              onClick={() => handleSubjectClick(subject.id)}
              
            >
              <span className="subject-tag">{subject.category}</span>
              <span className="subject-name">{subject.name}</span>
              <button className="start-now-btn">START NOW</button>
            </div>
          ))}
        </div>

        {/* Revision Tools Section */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center justify-between">
          Revision Tools
          <a href="#" className="text-blue-600 text-base font-semibold flex items-center hover:underline">
            See all
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </a>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {revisionTools.map((tool) => (
            <div key={tool.id} className="bg-white p-6 hover:cursor-pointer rounded-4xl flex items-center space-x-2 border-[5px] border-[#00000010] transition duration-200 hover:border-[5px] hover:border-[#ff3b30] hover:ring-[10px] hover:ring-[#ff3b3020]">
              <div className="border-2 border-[#ff3b30] p-3 rounded-full">
                <tool.icon className="w-6 h-6 text-[#ff3b30]" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-2xl font-bold text-[#ff3b30]">{tool.titleTop}</span>
                <span className="text-xl font-semibold text-gray-900">{tool.titleBottom}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 3-Pane Window Section */}
        <div className="bg-gray-100 rounded-xl p-2 shadow-inner mb-12">
          {/* Horizontal Tab Bar */}
          <div className="relative flex justify-around bg-white rounded-lg p-2 border-b border-gray-200 gap-x-2">
            {/* Sliding Indicator */}
            <div
              className="absolute bottom-0 left-0 h-1 bg-blue-600 rounded transition-transform duration-300"
              style={{
                width: '33.3333%',
                transform: `translateX(${['details', 'timetable', 'find-tutor'].indexOf(activeTab) * 100}%)`,
              }}
            />
            <button
              className={`flex-1 py-3 px-4 text-center text-lg font-medium rounded-md transition-colors duration-200 ${
                activeTab === 'details' ? 'text-blue-600 font-bold' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button
              className={`flex-1 py-3 px-4 text-center text-lg font-medium rounded-md transition-colors duration-200 ${
                activeTab === 'timetable' ? 'text-blue-600 font-bold' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('timetable')}
            >
              Timetable
            </button>
            <button
              className={`flex-1 py-3 px-4 text-center text-lg font-medium rounded-md transition-colors duration-200 ${
                activeTab === 'find-tutor' ? 'text-blue-600 font-bold' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('find-tutor')}
            >
              Find a Tutor
            </button>
          </div>

          {/* Content Pane */}
          <div className="mt-2">
            {activeTab === 'details' && <DetailsContent />}
            {activeTab === 'timetable' && <TimetableContent />}
            {activeTab === 'find-tutor' && <FindTutorContent />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
