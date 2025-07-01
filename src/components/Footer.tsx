import Image from 'next/image';
export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0">
          {/* Logo and Company Info */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/logo-300x300.png"
                alt="AIToLearn Logo"
                width={32}
                height={32}
              />
              <span className="text-xl font-bold">AIToLearn</span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-300">
              <p>Terms of Use</p>
              <p>Privacy Policy</p>
              <p>Contact Us</p>
              <p>All Tools</p>
            </div>
          </div>
          
          {/* Copyright and Rights */}
          <div className="text-right">
            <div className="space-y-2 text-sm text-gray-300">
              <p>[Copyright] Copyright 2025. xyz. All Rights Reserved.</p>
              <p>All resources for educational purposes only.</p>
              <p className="text-yellow-400 underline cursor-pointer">
                Missing an past paper or revision notes? Tell us here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
