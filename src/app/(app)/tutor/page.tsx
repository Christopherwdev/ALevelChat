import React from 'react';
import { User, CalendarCheck } from 'lucide-react'; // Importing Lucide React icons for tutors and booking
import AppHeader from '@/components/app/header'; // Assuming AppHeader is a shared component

// Define the props for a single tutor card
interface TutorCardProps {
  id: string;
  name: string;
  subjects: string[];
  description: string;
  buttonText: string;
  buttonClassNames?: string;
  cardClassNames?: string;
  subjectsClassNames?: string;
}

// TutorCard Component to display individual tutor details
const TutorCard: React.FC<{ tutor: TutorCardProps }> = ({ tutor }) => {
  return (
    <div className={`bg-white rounded-xl p-6 flex flex-col items-center transition-all duration-300 ease-in-out  ${tutor.cardClassNames}`}>
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <User className="w-10 h-10 text-gray-700" /> {/* Generic user icon */}
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-left">{tutor.name}</h2>
      <p className="text-sm text-gray-500 mb-4">
        <span className="font-medium">Subjects:</span> {tutor.subjects.join(', ')}
      </p>
      <p className="text-gray-600 text-base flex-grow mb-6">{tutor.description}</p>
      <button
        className={`mt-auto w-auto py-3 px-6 rounded-lg text-white font-bold text-lg transition-all duration-300 ease-in-out transform ${tutor.buttonClassNames}`}
      >
        <CalendarCheck className="inline-block mr-2 w-5 h-5" />
        {tutor.buttonText}
      </button>
    </div>
  );
};

// Data for the tutors
const tutors: Array<TutorCardProps> = [
  {
    id: 'Chris-Wong',
    name: 'K. O. Wong',
    subjects: ['Maths', 'Physics', 'Chemistry', 'Biology'],
    description: 'Greetings. Having recently completed the 2025 IAL exams, I am familiar with the latest exam formats and question styles. With over three years of tutoring experience, I understand the challenges students encounter and am committed to helping them find effective solutions. I look forward to supporting your academic journey and learning together.',
    buttonText: 'Book Mr. WONG',
    buttonClassNames: 'bg-black hover:shadow-[0_0_0_7.5px_#00000030]',
    cardClassNames: '',
    subjectsClassNames: '',
  },
  {
    id: 'Hayden-Cheng',
    name: 'P. H. Cheng',
    subjects: ['UCAT', 'Medical Interview'],
    description: 'Hi there! I specialize in instructing International Advanced Level (IAL) subjects in Physics, Chemistry, Biology and Mathematics, as well as offering comprehensive guidance for applying to study medicine in both UK and Hong Kong universities. I also provide effective coaching for the University Clinical Aptitude Test (UCAT). With a tailored approach to each subject area, I aim to equip students with the skills and knowledge necessary to secure an offer in their dream subject.',
    buttonText: 'Book Mr. MAK',
    buttonClassNames: 'bg-black hover:shadow-[0_0_0_7.5px_#00000030]',
    cardClassNames: '',
    subjectsClassNames: '',
  },
];

// Main TutorPage Component
const TutorPage = () => {
  return (
    <>
      <AppHeader isAuthenticated={true} /> {/* Assuming user is authenticated for this page */}
      <div className="min-h-screen bg-gray-50 p-4 font-inter">
        <div className="max-w-5xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl">
          <h1 className="text-5xl font-bold text-gray-900 text-center mb-6 leading-tight">
            Meet Our Expert Tutors
          </h1>
          <p className="text-xl text-gray-700 mb-12 text-center max-w-3xl mx-auto">
            Learn from proven achievers. Our team consists of pre-university students who predicted 4A* in their IAL as well as holding offers to various prestigious university, sharing their firsthand strategies and insights to help you excel.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {tutors.map((tutor) => (
              <TutorCard
                key={tutor.id}
                tutor={tutor}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TutorPage;
