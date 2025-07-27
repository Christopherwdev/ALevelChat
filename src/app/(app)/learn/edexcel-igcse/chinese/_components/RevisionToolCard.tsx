"use client";

import { useRouter } from "next/navigation";
import { JSX } from "react";

export interface RevisionToolCardProps {
  tool: {
    id: string;
    titleTop: string;
    titleBottom: string;
    icon: JSX.Element;
  };
}

const RevisionToolCard = ({ tool }: RevisionToolCardProps) => {
  const router = useRouter();

  return (
    <div
      className="bg-white p-4 mt-0 hover:cursor-pointer rounded-4xl flex items-center space-x-2 border-[4px] border-[#00000010] hover:border-[#ff3b30] hover:shadow-[0 0 0 10px #ff3b3020] transition duration-200"
      onClick={() => { router.push(`/learn/edexcel-igcse/chinese/${tool.id}`); }}
    >
      <div className="border-2 p-3 rounded-full border-[#ff3b30]">
        {tool.icon}
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-xl font-bold text-[#ff3b30]">
          {tool.titleTop}
        </span>
        <span className="text-lg font-semibold text-gray-900">
          {tool.titleBottom}
        </span>
      </div>
    </div>
  );
};

export default RevisionToolCard;
