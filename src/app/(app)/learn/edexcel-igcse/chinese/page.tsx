import { BookText, FileText, Lightbulb, Languages } from 'lucide-react';
import Link from 'next/link';
import RevisionToolCard from './_components/RevisionToolCard';
import "./ChinesePage.css";

const revisionTools = [
  { id: 'revision-notes', titleTop: 'Chinese', titleBottom: 'Revision Notes', icon: <BookText className="w-6 h-6 text-[#ff3b30]" /> },
  { id: 'past-papers?examBoard=Edexcel&examLevel=IGCSE&subject=Chinese&paper=Paper+1', titleTop: 'Chinese', titleBottom: 'Past Papers', icon: <FileText className="w-6 h-6 text-[#ff3b30]" /> },
  { id: 'ai-teacher', titleTop: 'AI Teacher', titleBottom: '& Grading', icon: <Lightbulb className="w-6 h-6 text-[#ff3b30]" /> },
];

const ContinueLessonButton: React.FC = () => {
  return (
    <div id="continue-lesson-button" className="continue-lesson-card flex items-center justify-center w-[75px] h-[75px] md:w-[115px] md:h-[115px]">
      <Languages size={90} color="#fff" />
    </div>
  );
};

const ChinesePage = () => {
  return (
    <div className="rounded-2xl p-6 pt-0 items-center flex justify-center">
      <div className='max-w-4xl'>
        <div className="flex flex-row items-stretch md:items-start gap-4 md:gap-6 mb-6">
          <ContinueLessonButton />
          <div className="flex flex-col flex-grow title-buttons-container">

            {/* Page Title */}
            <div className="text-4xl md:text-5xl font-bold text-black md:mb-6">
              Edexcel IGCSE <br className="block md:hidden" />
              <span className="font-medium" style={{ color: 'var(--subject-primary-color)' }}>
                Chinese
              </span>

            </div>
            <p className="text-gray-700 text-lg max-w-3xl hidden md:block">Welcome to the Chinese Revision Zone!<br></br>You can use the extensive resources below to prepare for your exams.</p>
          </div>

        </div>
        <p className="text-gray-700 text-lg max-w-3xl block md:hidden">Welcome to the Chinese Revision Zone!<br></br>You can use the extensive resources below to prepare for your exams.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
          {revisionTools.map((tool) => (
            <RevisionToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {/* Additional Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div className="bg-white border-2 border-[#00000020] rounded-2xl p-6 flex flex-col transition">
            <h3 className="text-2xl font-normal text-black mb-2">Revision Notes</h3>
            <p className="text-gray-700 text-base">Master every topic with concise, examiner-focused notes. Our study materials are tailored to the latest marking schemes, ensuring you know exactly how to earn top marks.</p>
          </div>
          <div className="bg-white border-2 border-[#00000020] rounded-2xl p-6 flex flex-col transition">
            <h3 className="text-2xl font-normal text-black mb-2">AI Mock Tests</h3>
            <p className="text-gray-700 text-base">Accelerate your progress with unlimited AI generated questions, expertly close to the actual exam style. Build confidence and pinpoint your strengths and weaknesses with every session.</p>
          </div>

          <div className="bg-white border-2 border-[#00000020] rounded-2xl p-6 flex flex-col transition">
            <h3 className="text-2xl font-normal text-black mb-2">Past Papers</h3>
            <p className="text-gray-700 text-base">Practice real exam papers anytime, anywhere, and get instant AI-powered grading. Track your scores and unlock powerful analytics to maximize your exam performance.</p>
          </div>
          <div className="bg-white border-2 border-[#00000020] rounded-2xl p-6 flex flex-col transition">
            <h3 className="text-2xl font-normal text-black mb-2">AI Teacher</h3>
            <p className="text-gray-700 text-base">Get instant help, explanations, and personalized feedback from our AI Teacher. Ask questions, get quizzes, and receive revision plans tailored to your needs.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChinesePage;
