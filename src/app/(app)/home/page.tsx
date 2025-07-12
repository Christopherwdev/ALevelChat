
import AppHeader from '@/components/app/header';
import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Dna, FlaskConical, Atom, Calculator, Languages, Headphones, Book, Pencil, Speech } from "lucide-react";

// Main App component
export default function App() {
    // Sample data for subjects
    const subjects = [
        { name: 'Biology', color: '#0fBD8C', url: '/learn/edexcel-ial/biology', score: 85, pastPapers: 12, Icon: Dna },
        { name: 'Chemistry', color: '#FF6B6B', url: '/learn/edexcel-ial/chemistry', score: 78, pastPapers: 9, Icon: FlaskConical },
        { name: 'Physics', color: '#4081FF', url: '/learn/edexcel-ial/physics', score: 92, pastPapers: 15, Icon: Atom },
        { name: 'Math', color: '#ffab1a', url: '/learn/edexcel-ial/math', score: 88, pastPapers: 10, Icon: Calculator },
        { name: 'Chinese', color: '#ff3b30', url: '/learn/edexcel-igcse/chinese', score: 95, pastPapers: 20, Icon: Languages },
        { name: 'Reading', color: '#007aff', url: '/learn/ielts/reading', score: 80, pastPapers: 7, Icon: Book },
        { name: 'Speaking', color: '#007aff', url: '/learn/ielts/speaking', score: 82, pastPapers: 8, Icon: Speech },
        { name: 'Writing', color: '#007aff', url: '/learn/ielts/writing', score: 75, pastPapers: 5, Icon: Pencil },
        { name: 'Listening', color: '#007aff', url: '/learn/ielts/listening', score: 90, pastPapers: 13, Icon: Headphones },
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
                    <h1 className="text-4xl font-bold text-gray-800 relative mb-10">
                        Home
                    </h1>
                </header>

                {/* Main content area */}
                <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left pane: Welcome, Buttons Pane, Horizontal Scroll, My Subjects */}
                    <div className="lg:col-span-2 flex flex-col space-y-6">
                        {/* Welcome and Buttons Pane */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <h2 className="text-3xl font-medium text-gray-700 mb-4 md:mb-0">
                                Welcome, <br /> <span className='font-bold'>Christopher Wong</span>
                            </h2>
                            <div className="flex items-center space-x-2 p-4 bg-gray-200 rounded-xl shadow-inner">
                                <div className="w-12 h-12 bg-blue-500 rounded-full shadow-xl cursor-pointer hover:scale-105 transition-transform"></div>
                                <div className="w-12 h-12 bg-blue-500 rounded-full shadow-xl cursor-pointer hover:scale-105 transition-transform"></div>
                                <div className="w-12 h-12 bg-blue-500 rounded-full shadow-xl cursor-pointer hover:scale-105 transition-transform"></div>
                            </div>
                        </div>

                        {/* Horizontal Scroll list of widgets */}
                        <div className="flex overflow-x-auto space-x-4 p-0 bg-white rounded-xl scrollbar-hide">
                            <div className="flex-shrink-0 w-64 h-40 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-center">
                            </div>
                            <div className="flex-shrink-0 w-64 h-40 bg-gray-200 rounded-xl"></div>
                            <div className="flex-shrink-0 w-64 h-40 bg-gray-200 rounded-xl"></div>
                            <div className="flex-shrink-0 w-64 h-40 bg-gray-200 rounded-xl"></div>
                        </div>

                        {/* My Subjects section */}
                        <div className="bg-[#00000010] rounded-xl border-box shadow-xl p-0 pb-2  border-1 border-[#00000020]">
                            <h3 className="text-xl font-semibold text-gray-700 p-3">My subjects</h3>
                            <div className="space-y-0">
                                {subjects.map((subject, index) => (
                                    <Link
                                        key={index}
                                        href={subject.url}
                                        className="flex items-center bg-gray-50 p-4 border-1 border-[#00000020] hover:bg-gray-100 transition-colors cursor-pointer group"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-full mr-4 border-2 border-black flex items-center justify-center`}
                                            style={{ backgroundColor: subject.color }}
                                        >
                                            <subject.Icon size={22} color="#fff" />
                                        </div>
                                        <div className="flex-1 justify-between flex-row">
                                            <div className="flex flex-col items-start justify-start">
                                                <div className="text-lg font-medium text-gray-800">{subject.name}</div>
                                                <div className="text-xs text-gray-500">Past papers completed: {subject.pastPapers}</div>

                                            </div>
                                            

                                        </div>
                                        <span className="text-sm text-gray-500 font-semibold ml-2 align-self-end">Score: {subject.score}</span>

                                        <svg className="w-5 h-5 text-gray-400 ml-4 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right pane of widgets */}
                    <div className="lg:col-span-1 bg-white rounded-xl shadow-xl p-6 flex items-center justify-center text-gray-500 text-center">
                        Right pane of widgets (analytics, schedule, etc)
                    </div>
                </main>
            </div>
        </>
    );
}
