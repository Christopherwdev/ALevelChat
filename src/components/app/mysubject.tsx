import React from 'react';
import Link from 'next/link';
import { Dna, FlaskConical, Atom, Calculator, Languages, Headphones, Book, Pencil, Speech } from "lucide-react";

interface Subject {
    name: string;
    color: string;
    url: string;
    score: number;
    pastPapers: number;
    Icon: React.ComponentType<{ size: number; color: string }>;
}

// Move the subjects array here
const subjects: Subject[] = [
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

const MySubjectsSection: React.FC = () => (
    <div className="bg-[#00000010] rounded-xl border-box shadow-xl p-0 pb-2  border-2 border-[#00000020]">
        <div className='p-3 border-b-2 border-b-[#00000020] flex justify-between gap-2 items-center align-center'>
            <h3 className="text-xl font-semibold text-gray-700">My subjects</h3>
            <button className='bg-black hover:shadow-[0_0_0_7.5px_#00000040] transition rounded-full text-white p-1 px-5'>Edit</button>
        </div>
        <div className="space-y-0">
            {subjects.map((subject, index) => (
                <Link
                    key={index}
                    href={subject.url}
                    className="flex items-center bg-gray-50 p-4 border-b-[2px] border-b-[#00000020] hover:bg-gray-100 transition-colors cursor-pointer group"
                    style={{ textDecoration: 'none' }}
                >
                    <div
                        className={`w-10 h-10 rounded-full mr-4 border-2 border-black flex items-center justify-center`}
                        style={{ backgroundColor: subject.color }}
                    >
                        <subject.Icon size={22} color="#fff" />
                    </div>
                    <div className="flex-1 justify-between flex-row">
                        <div className="flex flex-col items-start justify-start w-full">
                            <div className="text-lg font-medium text-gray-800">{subject.name}</div>
                            <div className="text-xs text-gray-500">Past papers completed: {subject.pastPapers}</div>
                        </div>
                    </div>
                    <span className="text-lg text-gray-500 font-semibold ml-2 align-self-end">{subject.score}%</span>
                    <svg className="w-5 h-5 text-gray-400 ml-4 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </Link>
            ))}
        </div>
    </div>
);

export default MySubjectsSection; 