import Link from 'next/link';
import InfoPane from './_components/InfoPane';
import SubjectCard from './_components/SubjectCard';

const IGCSEPage = () => {
  const IGCSESubjects = [
    { id: 'chinese', name: 'Chinese', category: 'Edexcel IGCSE', bgColorClass: 'bg-[#ff3b30]' },
    { id: '', name: 'Coming Soon...', category: 'Edexcel IGCSE', bgColorClass: 'bg-[#00000050]' },
  ];

  return (
    <div className="min-h-screen bg-white p-0">
      <div className="max-w-5xl mx-auto px-4 py-8 rounded-sm pt-20">
        {/* Breadcrumbs */}
        <nav className="inline-block text-gray-500 text-sm mb-6 font-light border-[1px] bg-[#00000010] border-[#00000020] px-3 py-1 rounded-lg">
          <Link href="/" className="transition duration-300 hover:underline hover:text-[#ff3b30]">Learn</Link>
          <span className="mx-2">/</span>
          <span>Edexcel IGCSE</span>
        </nav>

        {/* Page Title */}
        <h1 className="text-5xl font-bold text-black mb-8">
          Edexcel IGCSE <span className="font-medium text-[black]">Revision</span>
        </h1>
        <p className="text-gray-700 text-lg mb-10 max-w-3xl">
          For each of the subjects below, there are revision notes, factsheets, questions from past exam papers separated by topic and other worksheets.
        </p>

        {/* Subject Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {IGCSESubjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>

        <InfoPane />
      </div>
    </div>
  );
};

export default IGCSEPage;
