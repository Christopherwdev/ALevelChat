"use client"
import { useState } from 'react';
import { Dna, FlaskConical, Atom, Calculator, Languages, Headphones, Book, Pencil, Speech } from "lucide-react";

const exams = [
  { key: 'ial', label: 'Edexcel IAL' },
  { key: 'igcse', label: 'Edexcel IGCSE' },
  { key: 'ielts', label: 'IELTS' },
];

const subjectsByExam = {
  ial: [
    { name: 'Biology', color: '#0fBD8C', url: '/learn/edexcel-ial/biology', score: 85, pastPapers: 12, Icon: Dna },
    { name: 'Chemistry', color: '#FF6B6B', url: '/learn/edexcel-ial/chemistry', score: 78, pastPapers: 9, Icon: FlaskConical },
    { name: 'Physics', color: '#4081FF', url: '/learn/edexcel-ial/physics', score: 92, pastPapers: 15, Icon: Atom },
    { name: 'Math', color: '#ffab1a', url: '/learn/edexcel-ial/math', score: 88, pastPapers: 10, Icon: Calculator },
  ],
  igcse: [
    { name: 'Chinese', color: '#ff3b30', url: '/learn/edexcel-igcse/chinese', score: 95, pastPapers: 20, Icon: Languages },
  ],
  ielts: [
    { name: 'Reading', color: '#007aff', url: '/learn/ielts/reading', score: 80, pastPapers: 7, Icon: Book },
    { name: 'Speaking', color: '#007aff', url: '/learn/ielts/speaking', score: 82, pastPapers: 8, Icon: Speech },
    { name: 'Writing', color: '#007aff', url: '/learn/ielts/writing', score: 75, pastPapers: 5, Icon: Pencil },
    { name: 'Listening', color: '#007aff', url: '/learn/ielts/listening', score: 90, pastPapers: 13, Icon: Headphones },
  ],
};

const LearnPage = () => {
  const [selectedExam, setSelectedExam] = useState<keyof typeof subjectsByExam>('ial');
  const subjects = subjectsByExam[selectedExam];

  return (
    <div className="min-h-screen bg-white p-0 font-inter">
      <div className="max-w-5xl mx-auto mt-5 p-4 pt-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Subjects Section */}
          <div className="md:w-2/3 w-full">
            <h1 className="text-3xl font-bold text-gray-800 text-left mb-5 font-bold">Subjects</h1>
            <div className="flex gap-3 mb-6">
              {exams.map((exam) => (
                <button
                  key={exam.key}
                  onClick={() => setSelectedExam(exam.key as keyof typeof subjectsByExam)}
                  className={`px-5 py-2 rounded-full font-semibold border-2 transition-all duration-200 text-sm ${selectedExam === exam.key ? 'bg-black text-white border-black shadow' : 'bg-white text-black border-gray-300 hover:bg-gray-100'}`}
                >
                  {exam.label}
                </button>
              ))}
            </div>
            <div className=" rounded-2xl border-box shadow-2xl shadow-[#00000010] p-0 pb-0 overflow-hidden border-2 border-[#00000020]">
              <div className="space-y-0">
                {subjects.map((subject, index) => (
                  <a
                    key={index}
                    href={subject.url}
                    className={`flex items-center bg-gray-50 p-4 ${index !== subjects.length - 1 ? 'border-b-2 border-b-[#00000020]' : ''} hover:bg-gray-100 transition-colors cursor-pointer group`}
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
                  </a>
                ))}
              </div>
            </div>
          </div>
          {/* Analytics Section */}
          <div className="md:w-1/3 w-full">
            <div className="bg-white border-2 border-[#00000020] rounded-2xl shadow-2xl shadow-[#00000010] p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Analytics</h2>
              <div className="space-y-3">
                <div className="text-lg text-gray-700">Your Progress</div>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-black">--</span>
                  <span className="text-gray-500">Subjects Completed</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-black">--%</span>
                  <span className="text-gray-500">Average Score</span>
                </div>
                {/* Add more analytics as needed */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;
