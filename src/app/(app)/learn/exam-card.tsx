"use client";

import { useRouter } from "next/navigation";
import { ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface ExamCardProps {
  id: string;
  title: string;
  icon: React.ReactElement;
  description: string;
  buttonText: string;
  buttonClassNames: string;
  cardClassNames: string;
  subjects: string[];
  subjectsClassNames?: string;
}

const ExamCard = ({exam}: {exam: ExamCardProps}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-between">
      <div
        key={exam.id}
        className={cn("p-4 rounded-2xl  flex flex-col items-start border-2 border-[#00000020] shadow-2xl shadow-[#00000010]", exam.cardClassNames)}
      >
        <div className="bg-gray-200 p-3 rounded-full mb-4">
          {exam.icon}
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">{exam.title}</h1>
        
        <p className="text-[#00000080] mb-6 flex-grow">{exam.description}</p>
        <button
          onClick={() => router.push(`/learn/${exam.id}`)}
          className={cn("flex items-center justify-between cursor-pointer px-6 py-3 rounded-full text-white mb-2 font-semibold text-xl transition-all duration-200 w-full", exam.buttonClassNames)}
        >
          {exam.buttonText}
          <ChevronsRight className="w-5 h-5 ml-2" />
        </button>
      </div>
      
      {/* Subject buttons */}
      {/* <div className="flex flex-col items-center gap-4 w-full pt-8">
        {exam.subjects.map((subject, id) => (
          <button
            key={id}
            className={cn("bg-white px-0 py-3 rounded-2xl text-xl text-black font-semibold border-[2.5px] border-[#00000015] shadow-md transition-colors duration-200 text-center w-[95%]", exam.subjectsClassNames)}
            onClick={() => router.push(`/learn/${exam.id}/${subject.toLowerCase().replace(/\s/g, '-')}`)}
          >
            {subject}
          </button>
        ))}
      </div>*/}
    </div>
  );
};

export default ExamCard;