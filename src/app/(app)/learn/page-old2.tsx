"use client"; // This directive marks the component as a Client Component


import React, { useState, useRef, useEffect } from 'react';
import { BookText, Settings, MessageCircle } from 'lucide-react'; // Importing Lucide React icons
import Navigation from '@/components/app/header';

// Helper function to convert hex color to RGB string
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

// Main App component
const App = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // Function to handle navigation
  const navigate = (path: string) => {
    const parts = path.split('/');
    if (parts[0] === 'learn') {
      if (parts.length === 2) {
        setSelectedExam(parts[1]);
        setCurrentPage('examDetail');
      } else if (parts.length === 3) {
        setSelectedExam(parts[1]);
        setSelectedSubject(parts[2]);
        setCurrentPage('subjectDetail');
      }
    } else {
      setCurrentPage(path);
      setSelectedExam(null);
      setSelectedSubject(null);
    }
  };

  // Data for exams and subjects, now including a baseColor for gradients
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
      id: 'edexcel-igcse-chinese',
      title: 'Edexcel IGCSE Chinese',
      icon: BookText,
      description: 'AI Mock Tests | Past Papers | AI Teacher | Private Tutor',
      buttonText: 'Start Revision',
      buttonColor: 'bg-[#ff3b30]',
      baseColor: '#ff3b30', // Red-500
      subjects: ['Listening', 'Reading', 'Writing', 'Translating'],
    },
    {
      id: 'edexcel-ial-revision',
      title: 'Edexcel IAL Revision',
      icon: Settings,
      description: 'Revision Notes | Past Papers | AI Teacher | Private Tutor',
      buttonText: 'Start Revision',
      buttonColor: 'bg-[#ffac1a]',
      baseColor: '#ffac1a', // Orange-500
      subjects: ['Biology', 'Chemistry', 'Physics', 'Math'],
    },
    {
      id: 'ielts-english-revision',
      title: 'IELTS English Revision',
      icon: MessageCircle,
      description: 'Revision Notes | Mock Test | AI Teacher | Private Tutor',
      buttonText: 'Start Revision',
      buttonColor: 'bg-[#007aff]',
      baseColor: '#007aff', // Blue-500
      subjects: ['Speaking', 'Writing', 'Listening', 'Reading'],
    },
  ];

  // Component for the Home Page
  const HomePage = () => (
   
    <div className="min-h-screen bg-white p-0 font-inter">
       
      <div className="max-w-4xl mx-auto mt-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-12 text-center">Choose Your Exam</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {exams.map((exam) => {
            const rgbColor = hexToRgb(exam.baseColor);
            return (
              <div
                key={exam.id}
                className="p-4 rounded-2xl  flex flex-col items-start"
                // Apply linear gradient from white to a semi-transparent version of exam color
                style={{ background: `linear-gradient(to bottom, #FFFFFF, rgba(${rgbColor}, 0.1))` }}
              >
              
                  <div className={"bg-gray-200 p-3 rounded-full mb-4"}>
                    <exam.icon className="w-6 h-6 text-gray-700" />
                  </div>
                  <h1 className="text-3xl font-semibold text-gray-900 mb-4">{exam.title}</h1>
           
                <p className="text-gray-600 mb-6 flex-grow">{exam.description}</p>
                <button
                  onClick={() => navigate(`learn/${exam.id}`)}
                  className={`flex items-center justify-between px-6 py-3 rounded-full text-white border-black border-[3px] mb-2 font-semibold text-xl transition-all duration-200 ${exam.buttonColor} w-full`}
                >
                  {exam.buttonText}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

        {/* Subject buttons section - outside exam cards and structured in 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
          {exams.map((exam) => (
            <div key={`${exam.id}-subjects-column`} className="flex flex-col items-center gap-4">
              {exam.subjects.map((subject) => {
                // Use the exam's baseColor for shadow/border
                const shadowColor = `0px 5px 20px 0px ${exam.baseColor}33`; // 33 = ~20% opacity
                const borderColor = exam.baseColor;

                return (
                  <button
                    key={`${exam.id}-${subject}`}
                    onClick={() => navigate(`learn/${exam.id}/${subject.toLowerCase().replace(/\s/g, '-')}`)}
                    className="bg-white px-0 py-3 rounded-2xl text-xl text-black font-semibold border-[2.5px] transition-colors duration-200 text-center w-[95%]"
                    style={{
                      borderColor: '#00000015',
                      boxShadow: '0px 5px 20px #00000010',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = shadowColor;
                      (e.currentTarget as HTMLButtonElement).style.borderColor = borderColor;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = '0px 5px 20px #00000010';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = '#00000015';
                    }}
                  >
                    {subject}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Component for Exam Detail Page
  const ExamDetailPage = () => {
    const exam = exams.find((e) => e.id === selectedExam);
    if (!exam) {
      return <div className="text-center p-8 text-red-600">Exam not found!</div>;
    }
    return (
      <div className="min-h-screen bg-gray-100 p-8 font-inter">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <button onClick={() => navigate('home')} className="mb-6 text-blue-600 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-6">{exam.title}</h1>
          <p className="text-gray-700 text-lg mb-8">{exam.description}</p>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Subjects for {exam.title}:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {exam.subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => navigate(`learn/${exam.id}/${subject.toLowerCase().replace(/\s/g, '-')}`)}
                className="bg-gray-200 px-6 py-3 rounded-xl text-gray-800 font-medium hover:bg-gray-300 transition-colors duration-200 text-center"
              >
                {subject}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Component for Subject Detail Page
  const SubjectDetailPage = () => {
    const exam = exams.find((e) => e.id === selectedExam);
    if (!exam) {
      return <div className="text-center p-8 text-red-600">Exam not found!</div>;
    }
    if (!selectedSubject) {
      return <div className="text-center p-8 text-red-600">Subject not found!</div>;
    }
    return (
      <div className="min-h-screen bg-gray-100 p-8 font-inter">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <button onClick={() => navigate(`learn/${exam.id}`)} className="mb-6 text-blue-600 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to {exam.title}
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            {exam.title} - {selectedSubject.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </h1>
          <p className="text-gray-700 text-lg">
            This is the detail page for the {selectedSubject.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} subject under the {exam.title} exam.
            You can add specific content, mock tests, or revision materials here.
          </p>
          {/* Add more content specific to the subject here */}
        </div>
      </div>
    );
  };

  // Render the appropriate page based on currentPage state
  let content;
  switch (currentPage) {
    case 'home':
      content = <HomePage />;
      break;
    case 'examDetail':
      content = <ExamDetailPage />;
      break;
    case 'subjectDetail':
      content = <SubjectDetailPage />;
      break;
    default:
      content = <HomePage />; // Fallback to home
  }

  return (
    <>
      <Navigation isAuthenticated={true} />
      {/* Tailwind CSS CDN */}
      <script src="https://cdn.tailwindcss.com"></script>
      {/* Inter font from Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>
        {`
          body {
            font-family: 'Inter', sans-serif;
          }
        `}
      </style>
      {content}
    </>
  );
};

export default App;
