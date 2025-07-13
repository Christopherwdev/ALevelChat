import Link from 'next/link';
import Image from 'next/image';
import { BookText, Settings, MessageCircle } from 'lucide-react';



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
  const serviceCards: ServiceCard[] = [
    {
      id: 'edexcel-igcse/chinese',
      title: 'Edexcel IGCSE Chinese',
      icon: BookText,
      description: 'AI Mock Tests | Past Papers | AI Teacher | Private Tutor',
      buttonText: 'Start Revision',
      buttonColor: 'bg-[#ff3b30]',
      baseColor: '#ff3b30',
      subjects: ['Listening', 'Reading', 'Writing', 'Translating'],
    },
    {
      id: 'edexcel-ial',
      title: 'Edexcel IAL Revision',
      icon: Settings,
      description: 'Revision Notes | Past Papers | AI Teacher | Private Tutor',
      buttonText: 'Start Revision',
      buttonColor: 'bg-[#ffac1a]',
      baseColor: '#ffac1a',
      subjects: ['Biology', 'Chemistry', 'Physics', 'Math'],
    },
    {
      id: 'ielts',
      title: 'IELTS English Revision',
      icon: MessageCircle,
      description: 'Revision Notes | Mock Test | AI Teacher | Private Tutor',
      buttonText: 'Start Revision',
      buttonColor: 'bg-[#007aff]',
      baseColor: '#007aff',
      subjects: ['Speaking', 'Writing', 'Listening', 'Reading'],
    },
  ];



  return (
    <div className="min-h-screen bg-white mx-6">
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
                  href="/contact"
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
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {serviceCards.map((card) => (
            <div
              key={card.id}
              className="p-4 rounded-2xl flex flex-col items-start bg-white"
            >
              <div className="bg-gray-200 p-3 rounded-full mb-4">
                <card.icon className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="text-3xl font-semibold text-gray-900 mb-4">{card.title}</h3>
              <p className="text-[#00000080] mb-6 flex-grow">{card.description}</p>
              <Link
                href={`/learn/${card.id}`}
                className={`flex items-center justify-between cursor-pointer px-6 py-3 rounded-full text-white border-black border-[3px] mb-2 font-semibold text-xl transition-all duration-200 ${card.buttonColor} w-full`}
                style={{ boxShadow: '0px 5px 20px #00000010' }}
              >
                {card.buttonText}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          ))}
        </div>
        
        {/* Subject buttons section - outside exam cards and structured in 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
          {serviceCards.map((card) => (
            <div key={`${card.id}-subjects-column`} className="flex flex-col items-center gap-4">
              {card.subjects.map((subject) => {
                // Use the card's baseColor for shadow/border
                const shadowColor = `0px 0px 0px 5px ${card.baseColor}33`; // 33 = ~20% opacity
                const borderColor = card.baseColor;

                return (
                  <Link
                    key={`${card.id}-${subject}`}
                    href={`/learn/${card.id}/${subject.toLowerCase().replace(/\s/g, '-')}`}
                    className="bg-white px-0 py-3 rounded-2xl text-xl text-black font-semibold border-[2.5px] transition-colors duration-200 text-center w-[95%]"
                    style={{
                      borderColor: '#00000015',
                      boxShadow: '0px 5px 20px #00000010',
                    }}
                  >
                    {subject}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Testimonial Section */}
        <div className="flex flex-col items-left text-left border-2 mx-6 mb-12 p-4 border-gray-200 rounded-2xl">
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
