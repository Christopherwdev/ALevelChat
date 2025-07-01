import Link from 'next/link';
import Image from 'next/image';

interface ServiceCard {
  title: string;
  description: string;
  cta: string;
  borderColor: string;
  buttonColor: string;
  fromColor: string;
  toColor: string;
}

export default function Homepage() {
  const serviceCards: ServiceCard[] = [
    {
      title: "Edexcel IGCSE Chinese",
      description: "AI Mock Tests | Past Papers | AI Teacher | Private Tutor",
      cta: "Start Revision →",
      borderColor: "border-red-500",
      buttonColor: "bg-red-500",
      fromColor: "from-white",
      toColor: "to-yellow-50",
    },
    {
      title: "Edexcel IAL Revision",
      description: "AI Mock Tests | Past Papers | AI Teacher | Private Tutor",
      cta: "Start Revision →",
      borderColor: "border-yellow-500",
      buttonColor: "bg-yellow-500",
      fromColor: "from-white",
      toColor: "to-yellow-50",
    },
    {
      title: "IELTS English Revision",
      description: "AI Mock Tests | Past Papers | AI Teacher | Private Tutor",
      cta: "Start Revision →",
      borderColor: "border-blue-500",
      buttonColor: "bg-blue-500",
      fromColor: "from-white",
      toColor: "to-blue-50",
    },
  ];

  const subjectTags = [
    "Listening", "Biology", "Speaking",
    "Chemistry", "Writing", "Physics",
    "Math", "Translating", "Reading"
  ];

  return (
    <div className="min-h-screen bg-white mx-6">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-left mb-4">
            <span className="text-3xl text-gray-600 px-3 py-1">
              🔥 EDEXCEL IAL + IELTS + UNIVERSITY
            </span>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between max-w-6xl mx-auto">
            <div className="lg:w-1/2 text-left">
              <h1 className="text-5xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Accelerate your grades with the ultimate{' '}
                <span className="text-red-500">IGCSE</span>,{' '}
                <span className="text-red-500">A-Level</span> &{' '}
                <span className="text-red-500">IELTS</span> resource base.
              </h1>
              
              <p className="text-gray-800 text-2xl mb-8">
                AI Tools for Edexcel IAL, IELTS preparation, and university 
                applications to help you achieve academic success.
              </p>
              
              <div className="flex space-x-8">
                <Link 
                  href="/signup"
                  className="bg-red-500 hover:bg-red-600 text-white text-4xl px-10 py-6 rounded-full font-medium transition-colors"
                >
                  Start now
                </Link>
                <Link 
                  href="/contact"
                  className="text-red-300 hover:text-red-500 text-4xl px-10 py-6 rounded-full font-medium border-4 border-red-300 hover:border-red-500 transition-colors"
                >
                  Contact us
                </Link>
              </div>
            </div>
            
            <div className="lg:w-1/2 mt-8 lg:mt-0 flex justify-center">
              <div className="relative">
                <Image
                  src="/marketing-illustration-276x300.png"
                  alt="Learning illustration"
                  width={400}
                  height={300}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-left mt-28 mb-12">
          <h2 className="text-4xl font-bold mb-2">
            We got your <span className="text-red-500">text</span> covered.
          </h2>
        </div>
        
        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {serviceCards.map((card, index) => (
            <div key={index} className={`bg-linear-to-b ${card.fromColor} ${card.toColor} border ${card.borderColor} rounded-xl p-6 pt-24 shadow-sm`}>
              <h3 className="text-5xl font-semibold mb-6">{card.title}</h3>
              <p className="text-gray-800 text-lg mb-4">
                {card.description}
              </p>
              <button className={`${card.buttonColor} text-white px-6 py-2 rounded-lg font-medium transition-colors w-full`}>
                {card.cta}
              </button>
            </div>
          ))}
        </div>
        
        {/* Subject Tags */}
        <div className="grid grid-cols-3 md:gap-4 mt-24 mb-12 mx-6">
          {subjectTags.map((tag, index) => (
            <div key={index} className="bg-white hover:bg-gray-50 text-center py-6 px-8 rounded-lg cursor-pointer border-3 border-red-300 hover:border-red-500 transition-colors shadow-md">
              <span className="text-2xl font-bold">{tag}</span>
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
