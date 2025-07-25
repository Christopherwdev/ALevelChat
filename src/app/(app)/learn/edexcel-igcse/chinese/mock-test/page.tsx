"use client";

import { useRouter } from 'next/navigation';

const MockTestContent = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-auto w-full p-8">
      <h1 className="text-4xl font-bold mb-8 text-black">
        Edexcel IGCSE Chinese: AI Mock Tests
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
        {/* Listening */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-[#00000010] p-6 flex flex-col items-center border-2 border-[#00000020]">
          <i className="fas fa-headphones-alt text-5xl mb-4 text-[#ff3b30]"></i>
          <h2 className="text-2xl font-semibold mb-2">Listening</h2>
          <p className="text-gray-600 mb-4 text-center">Practice AI-powered listening mock tests with instant feedback.</p>
          <button className="btn-primary w-full" onClick={() => router.push('/learn/edexcel-igcse/chinese/mock-test/listening')}>Start</button>
        </div>
        {/* Reading */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-[#00000010] p-6 flex flex-col items-center border-2 border-[#00000020]">
          <i className="fas fa-book-open text-5xl mb-4 text-[#ff3b30]"></i>
          <h2 className="text-2xl font-semibold mb-2">Reading</h2>
          <p className="text-gray-600 mb-4 text-center">Take AI-graded reading mock tests and track your progress.</p>
          <button className="btn-primary w-full" onClick={() => router.push('/learn/edexcel-igcse/chinese/mock-test/reading')}>Start</button>
        </div>
        {/* Writing */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-[#00000010] p-6 flex flex-col items-center border-2 border-[#00000020]">
          <i className="fas fa-pen-nib text-5xl mb-4 text-[#ff3b30]"></i>
          <h2 className="text-2xl font-semibold mb-2">Writing</h2>
          <p className="text-gray-600 mb-4 text-center">Submit writing tasks and get instant AI feedback and grading.</p>
          <button className="btn-primary w-full" onClick={() => router.push('/learn/edexcel-igcse/chinese/mock-test/writing')}>Start</button>
        </div>
        {/* Speaking */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-[#00000010] p-6 flex flex-col items-center border-2 border-[#00000020]">
          <i className="fas fa-language text-5xl mb-4 text-[#ff3b30]"></i>
          <h2 className="text-2xl font-semibold mb-2">Translating</h2>
          <p className="text-gray-600 mb-4 text-center">Try AI-powered translating mock tests and receive detailed analysis.</p>
          <button className="btn-primary w-full" onClick={() => router.push('/learn/edexcel-igcse/chinese/mock-test/translating')}>Start</button>
        </div>
      </div>
    </div>
  );
};

export default MockTestContent;
