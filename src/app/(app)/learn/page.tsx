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
    cardClassNames: 'bg-gradient-to-b -from-white to-[rgba(239,68,68,0.2)] border-[#ff3b30]',

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
    cardClassNames: 'bg-gradient-to-b from-white to-[rgba(245,158,11,0.2)] border-amber-500',

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
    cardClassNames: 'bg-gradient-to-b from-white to-[rgba(59,130,246,0.2)] border-blue-500',
  
    subjects: ['Speaking', 'Writing', 'Listening', 'Reading'],
    subjectsClassNames: 'hover:border-blue-500',
  },
];

const LearnPage = () => {
  return (
    <>
      {/* <AppHeader isAuthenticated={true} /> */}
      <div className="min-h-screen bg-white p-0 font-inter pt-[50px]">
        <div className="max-w-5xl mx-auto mt-5 p-4">
          <h1 className="text-5xl text-black text-left mb-10 font-bold">AIToLearn <span className='font-light'>Revision</span></h1>
         
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl">
            {exams.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
              />
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start w-full">
            <div className="md:w-5/7 w-full">
              <MySubjectsSection />
            </div>
            {/* Analytics Section */}
            <div className="md:w-2/7 w-full">
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
    </>
  );
};

export default LearnPage;
