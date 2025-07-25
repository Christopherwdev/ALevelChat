"use client";

import { useRouter } from 'next/navigation';

const SubjectCard = ({ subject }) => {
  const router = useRouter();

  return (
    <div
      className={`flex flex-col justify-between align-start min-h-[150px] p-[15px] rounded-xl border-2 border-black shadow-[0 5px 20px rgba(0, 0, 0, 0.1)] transition-all cursor-pointer ${subject.bgColorClass}`}
      onClick={() => router.push(`/learn/edexcel-igcse/${subject.id}`)}
    >
      <span className="bg-black/10 text-white text-left self-start px-3 py-1 rounded-md text-xs font-medium">
        {subject.category}
      </span>
      <span className="mb-[-10px] text-[2rem] font-extrabold text-white text-left w-full">
        {subject.name}
      </span>
      <button className="text-[10px] bg-white text-black py-2 px-4 rounded-[100px] font-semibold transition-all duration-300 self-start mt-[1.2rem] hover:shadow-[0px_0px_0px_7.5px_#ffffff30]">
        START NOW
      </button>
    </div>
  );
};

export default SubjectCard;
