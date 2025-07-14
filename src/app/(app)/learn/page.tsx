import { BookText, Settings, MessageCircle } from 'lucide-react'; // Importing Lucide React icons
import AppHeader from '@/components/app/header';
import MySubjectsSection from '@/components/app/mysubject';
import ExamCard, { ExamCardProps } from './exam-card';

const exams: Array<ExamCardProps> = [
  {
    id: 'edexcel-igcse/chinese',
    title: 'Edexcel IGCSE Chinese',
    icon: <BookText className="w-6 h-6" />,
    description: 'AI Mock Tests | Past Papers | AI Teacher | Private Tutor',
    buttonText: 'START NOW',
    buttonClassNames: 'bg-[#ff3b30] hover:shadow-[0_0_0_10px_#ff3b3040]',
    // cardClassNames: 'bg-gradient-to-b -from-white to-[rgba(239,68,68,0.2)]',
    cardClassNames: '',
    subjects: ['Listening', 'Reading', 'Writing', 'Translating'],
    subjectsClassNames: 'hover:border-red-500',
  },
  {
    id: 'edexcel-ial',
    title: 'Edexcel IAL Revision',
    icon: <Settings className="w-6 h-6" />,
    description: 'Revision Notes | Past Papers | AI Teacher | Private Tutor',
    buttonText: 'START NOW',
    buttonClassNames: 'bg-amber-500 hover:shadow-[0_0_0_10px_#ffc10750]',
    // cardClassNames: 'bg-gradient-to-b from-white to-[rgba(245,158,11,0.2)]',
    cardClassNames: '',
    subjects: ['Biology', 'Chemistry', 'Physics', 'Math'],
    subjectsClassNames: 'hover:border-amber-500',
  },
  {
    id: 'ielts',
    title: 'IELTS English Revision',
    icon: <MessageCircle className="w-6 h-6" />,
    description: 'Revision Notes | Mock Test | AI Teacher | Private Tutor',
    buttonText: 'START NOW',
    buttonClassNames: 'bg-blue-500 hover:shadow-[0_0_0_10px_#007aff50]',
    // cardClassNames: 'bg-gradient-to-b from-white to-[rgba(59,130,246,0.2)]',
    cardClassNames: '',
    subjects: ['Speaking', 'Writing', 'Listening', 'Reading'],
    subjectsClassNames: 'hover:border-blue-500',
  },
];

const LearnPage = () => {
  return (
    <>
      <AppHeader isAuthenticated={true} />
      <div className="min-h-screen bg-white p-0 font-inter">
        <div className="max-w-4xl mx-auto mt-5 p-4">
          <h1 className="text-5xl font-medium text-gray-800 text-center mb-5 font-bold font-serif">Learning</h1>
          <p className="text-lg text-gray-600 mb-8 text-center  ">
            Explore AI-powered revision tools, past papers, and expert resources for Edexcel IGCSE, IAL, and IELTS. Start your journey to top grades with instant feedback and 24/7 support.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {exams.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
              />
            ))}
          </div>

          <MySubjectsSection />
        </div>
      </div>
    </>
  );
};

export default LearnPage;
