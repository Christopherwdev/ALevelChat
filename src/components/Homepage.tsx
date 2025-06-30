export default function Homepage() {
  const features = [
    {
      title: 'AI Paper Grader',
      description: 'Get instant feedback on your essays and exam papers with advanced AI analysis.',
      icon: '📝',
    },
    {
      title: 'Speaking Prep',
      description: 'Practice and improve your speaking skills with AI-powered conversation scenarios.',
      icon: '🗣️',
    },
    {
      title: 'Study Analytics',
      description: 'Track your progress and identify areas for improvement with detailed analytics.',
      icon: '📊',
    },
    {
      title: 'Resources Library',
      description: 'Access a vast library of study materials, past papers, and practice questions.',
      icon: '📚',
    },
  ];

  const testimonials = [
    {
      quote: "AitoLearn has completely transformed how I prepare for my IGCSE exams. The AI feedback is like having a personal tutor available 24/7.",
      author: "Sarah Chen",
      role: "IGCSE Student",
    },
    {
      quote: "As a teacher, I've found AitoLearn to be an invaluable tool. It helps me provide better, more personalized guidance to my students.",
      author: "James Wilson",
      role: "High School Teacher",
    },
    {
      quote: "The speaking practice feature helped me achieve a band 8 in IELTS. It's incredible how accurate the AI feedback is!",
      author: "Maria Garcia",
      role: "IELTS Student",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Ace Your Exams with AI-Powered Learning
            </h1>
            <p className="mt-6 text-xl sm:text-2xl max-w-3xl mx-auto">
              Personalized study assistance for GCSE, IGCSE, IAL and IELTS using advanced AI technology.
            </p>
            <div className="mt-10">
              <a href="/signup" className="px-8 py-3 bg-white text-indigo-600 font-medium rounded-lg text-lg hover:bg-gray-100 transition-colors">
                Get Started Free
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Features that Empower Your Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600 italic mb-4">{testimonial.quote}</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
