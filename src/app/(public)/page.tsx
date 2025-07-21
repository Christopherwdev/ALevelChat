import Link from 'next/link';
import Image from 'next/image';
import { BookText, Settings, MessageCircle } from 'lucide-react';
import ExamCard, { ExamCardProps } from '../(app)/learn/exam-card';


interface ServiceCard {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  buttonText: string;
  buttonColor: string;
  baseColor: string;
  subjects: string[];
}

export default function Homepage() {
  const serviceCards: ExamCardProps[] = [
    {
      id: 'edexcel-igcse/chinese',
      title: 'Edexcel IGCSE Chinese',
      icon: <BookText className="w-6 h-6" />,
      description: 'AI Mock Tests | Past Papers | AI Teacher | Private Tutor',
      buttonText: 'START NOW',
      buttonClassNames: 'bg-[#ff3b30] hover:shadow-[0_0_0_10px_#ff3b3040]',
      cardClassNames: 'bg-gradient-to-b from-white to-[rgba(239,68,68,0.2)] border-[#ff3b30]',
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



  return (
    <div className="min-h-screen bg-white mx-6 pt-20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center justify-center">
            <span className="text-lg text-gray-600 px-3 py-1 mb-4">
              🔥 EDEXCEL IAL + EDEXCEL IGCSE + IELTS + UNIVERSITY
            </span>
       
          
            <div className="lg:w-3/5 text-center">
              <h1 className="text-4xl lg:text-5xl font-serif font-medium text-gray-900 mb-6 leading-tight">
              Acclerate your <span>grades</span> with powerful tools to ace every mission!
              </h1>
              
              <p className="text-gray-800 mb-8 text-xl">
                With our help, you can easily study for public exams. With a good grade, together with our services, you can enter your dream college. Services are available at a shocking low price.
              </p>
              
              <div className="flex flex-col md:flex-row gap-8 justify-center">
                <Link 
                  href="/signup"
                  className="bg-red-500 hover:shadow-[0_0_0_10px_#ff3b3040] font-bold  text-white text-2xl px-10 py-3 border-4 border-[#ff3b30] rounded-2xl transition"
                >
                  START NOW
                </Link>
                <Link 
                  href="https://aitolearn.xyz/contact"
                  className="text-red-300 hover:text-[#ff3b30] text-2xl px-10 py-3 rounded-2xl font-bold border-4 border-[#ff3b3050] hover:border-red-500 transition"
                >
                  CONTACT US
                </Link>
              </div>
            </div>
            </div>
           
        
        </div>
        
        <div className="text-left mt-28 mb-12">
          <h2 className="text-4xl font-bold mb-2">
            We got your <span className="text-red-500">IAL 5A*</span> covered.
          </h2>
        </div>
        
        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {serviceCards.map((card) => (
            <div key={card.id} className="w-full">
              <ExamCard exam={card} />
            </div>
          ))}
        </div>

        {/* What is AIToLearn Section */}
        <div className="my-16 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">What is <span className="text-[#ff3b30]">AIToLearn</span>?</h2>
          <p className="text-lg text-gray-700 mb-4">
            AIToLearn is your all-in-one platform for mastering Edexcel IGCSE, IAL, and IELTS exams. We combine AI-powered tools, instant feedback, and expert resources to help you achieve your academic goals faster and smarter.
          </p>
          <p className="text-base text-gray-500">
            Whether you're aiming for top grades or just want to study more efficiently, AIToLearn provides everything you need: revision notes, mock tests, past papers, AI teacher, analytics, and more—all in one place.
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
            href="/contact"
            className="inline-block bg-[#ff3b30] hover:bg-[#ff3b30cc] text-white font-bold px-8 py-3 rounded-full text-lg transition"
          >
            Contact Us
          </a>
        </div>
        
        {/* Subject buttons section - outside exam cards and structured in 3 columns */}
        

        {/* Testimonial Section */}
        <div className="hidden flex flex-col items-left text-left border-2 mx-6 mb-12 p-4 border-gray-200 rounded-2xl">
          <div className="flex flex-row gap-8">
            <Image 
              src="/user-testimonial-150x150.jpg"
              alt="Jessica Wong"
              width={64}
              height={64}
              className="rounded-full"
            />
            <div className="flex flex-col text-left">
              <p className="text-2xl font-bold mb-1">Jessica Wong</p>
              <p className="text-lg text-grey-600">Edexcel IAL 5A*</p>
            </div>
          </div>
          <p className="text-2xl mt-4">
            AItoLearn transformed my exams dramatically. The mock test was super useful for my IELTS preparation. I am able to practice past papers and get instant feedback on my answers. The AI teacher is like having a personal tutor available 24/7.
          </p>
        </div>
      </div>
    </div>
  );
}
