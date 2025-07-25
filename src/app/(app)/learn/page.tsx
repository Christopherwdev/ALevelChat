import { BookText, Settings, MessageCircle } from 'lucide-react'; // Importing Lucide React icons
// import AppHeader from '@/components/app/header';
import MySubjectsSection from '@/components/app/mysubject';
import ExamCard, { ExamCardProps } from './exam-card';
import { createClient } from '@/utils/supabase/server';

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

const LearnPage = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single();
  
  return (
    <>
      {/* <AppHeader isAuthenticated={true} /> */}
      <div className="min-h-screen bg-white p-0 font-inter pt-[50px]">
        <div className="max-w-5xl mx-auto mt-10 p-4">
          {/* <h1 className="text-5xl text-black text-left mb-10 font-bold">AIToLearn <span className='font-light'>Revision</span></h1> */}
          <h1 className="text-5xl text-black text-left mb-10 font-bold">
            Welcome, <br />
            <span className='font-light'>{profile.full_name ?? 'user'}</span>
          </h1>
            
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl">
            {exams.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
              />
            ))}
          </div>

          {/* What is AIToLearn Section */}
          <div className="my-16 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">What is <span className="text-[#ff3b30]">AIToLearn</span>?</h2>
            <p className="text-lg text-gray-700 mb-4">
              AIToLearn is your all-in-one platform for mastering Edexcel IGCSE, IAL, and IELTS exams. We combine AI-powered tools, instant feedback, and expert resources to help you achieve your academic goals faster and smarter.
            </p>
            <p className="text-base text-gray-500">
              Whether you&apos;re aiming for top grades or just want to study more efficiently, AIToLearn provides everything you need: revision notes, mock tests, past papers, AI teacher, analytics, and more—all in one place.
            </p>
          </div>

          {/* Features Section */}
          <div className="my-16 max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black text-center">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <BookText className="w-10 h-10 text-[#ff3b30] flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-black mb-1">AI Mock Tests</h3>
                  <p className="text-gray-700">Practice with realistic, AI-graded mock tests for every paper. Get instant feedback and see where you can improve.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Settings className="w-10 h-10 text-amber-500 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-black mb-1">Past Papers & Analytics</h3>
                  <p className="text-gray-700">Access a huge library of past papers and track your progress with smart analytics and score tracking.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MessageCircle className="w-10 h-10 text-blue-500 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-black mb-1">AI Teacher & Grading</h3>
                  <p className="text-gray-700">Ask questions, get explanations, and receive personalized feedback from our AI Teacher—anytime, anywhere.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <svg className="w-10 h-10 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 7v7m0 0H4m8 0h8" /></svg>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-1">Private Tutor & Community</h3>
                  <p className="text-gray-700">Connect with expert tutors or get help from our supportive student community for any subject or question.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="my-20 max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black">Need help or have questions?</h2>
            <p className="text-lg text-gray-700 mb-6">Our team is here to support you. Reach out for personalized advice or technical support.</p>
            <a
              href="https://aitolearn.xyz/contact"
              className="inline-block bg-[#ff3b30] hover:bg-[#ff3b30cc] text-white font-bold px-8 py-3 rounded-full text-lg transition"
            >
              Contact Us
            </a>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start w-full hidden">
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
