
import AppHeader from '@/components/app/header';
import MySubjectsSection from '../../../components/app/mysubject';
import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Dna, FlaskConical, Atom, Calculator, Languages, Headphones, Book, Pencil, Speech } from "lucide-react";

// Main App component
export default function App() {
    // Sample data for subjects
    const subjects = [
        { name: 'Edexcel IAL Biology', color: '#0fBD8C', url: '/learn/edexcel-ial/biology', score: 85, pastPapers: 12, Icon: Dna },
        { name: 'Edexcel IAL Chemistry', color: '#FF6B6B', url: '/learn/edexcel-ial/chemistry', score: 78, pastPapers: 9, Icon: FlaskConical },
        { name: 'Edexcel IAL Physics', color: '#4081FF', url: '/learn/edexcel-ial/physics', score: 92, pastPapers: 15, Icon: Atom },
        { name: 'Edexcel IAL Math', color: '#ffab1a', url: '/learn/edexcel-ial/math', score: 88, pastPapers: 10, Icon: Calculator },
        { name: 'Edexcel IGCSE Chinese', color: '#ff3b30', url: '/learn/edexcel-igcse/chinese', score: 95, pastPapers: 20, Icon: Languages },
        { name: 'IELTS Reading', color: '#007aff', url: '/learn/ielts/reading', score: 80, pastPapers: 7, Icon: Book },
        { name: 'IELTS Speaking', color: '#007aff', url: '/learn/ielts/speaking', score: 82, pastPapers: 8, Icon: Speech },
        { name: 'IELTS Writing', color: '#007aff', url: '/learn/ielts/writing', score: 75, pastPapers: 5, Icon: Pencil },
        { name: 'IELTS Listening', color: '#007aff', url: '/learn/ielts/listening', score: 90, pastPapers: 13, Icon: Headphones },
    ];

    return (
        <>
          <AppHeader isAuthenticated={true} />
            <Head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" crossOrigin="anonymous" referrerPolicy="no-referrer" />
            </Head>
            <div className="min-h-screen bg-white font-sans p-4 md:p-8 flex flex-col items-center">
                {/* Header */}
                <header className="w-full max-w-6xl flex justify-center my-10">
                    <h1 className="text-6xl font-bold text-gray-800 relative mb-10">
                        AIToLearn
                    </h1>
                </header>

                {/* Main content area */}
                <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-20">
                    {/* Left pane: Welcome, Buttons Pane, Horizontal Scroll, My Subjects */}
                    <div className="lg:col-span-2 flex flex-col space-y-6">
                        {/* Welcome and Buttons Pane */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <h2 className="text-3xl font-medium text-gray-700 mb-4 md:mb-0">
                                <span className='font-serif'>Welcome, </span><br /> <span className='font-bold text-4xl'>Christopher Wong</span>
                            </h2>
                            <div className="flex items-center space-x-3 p-4 bg-gray-100 rounded-xl shadow-inner">
                                <Link href="/dashboard" className="w-12 h-12 bg-[#ff3b30] rounded-full shadow-xl cursor-pointer transition-transform flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </Link>
                                <Link href="/practice" className="w-12 h-12 bg-[#007aff] rounded-full shadow-xl cursor-pointer transition-transform flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </Link>
                                <Link href="/past-paper" className="w-12 h-12 bg-[#0fBD8C] rounded-full shadow-xl cursor-pointer transition-transform flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Horizontal Scroll list of widgets */}
                        <div className="flex overflow-x-auto space-x-4 p-0 bg-white rounded-xl scrollbar-hide">
                          
                            <div className="flex-shrink-0 w-64 h-40 bg-gray-200 rounded-xl"></div>
                            <div className="flex-shrink-0 w-64 h-40 bg-gray-200 rounded-xl"></div>
                            <div className="flex-shrink-0 w-64 h-40 bg-gray-200 rounded-xl"></div>
                        </div>

                        {/* My Subjects section (modular) */}
                        <MySubjectsSection />
                    </div>

                    {/* Right pane of widgets */}
                    <div className="lg:col-span-1 border-2 border-[#00000020] bg-white rounded-xl shadow-xl p-6 flex items-center justify-center text-gray-500 text-center">
                       
                    </div>
                </main>
            </div>
        </>
    );
}
