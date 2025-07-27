"use client";

import { useState, useRef, useEffect } from 'react';

const DetailsContent = () => (
  <div className="p-6 bg-white rounded-xl shadow-sm">
    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Edexcel IGCSE Details</h3>
    <p className="text-gray-700 leading-relaxed mb-4">
    The IGCSE, or International General Certificate of Secondary Education, is a globally recognized secondary school qualification, often taken by students in Years 10 and 11 (ages 14-16). It&apos;s an English-language based qualification that is similar to the GCSE in the UK and is often used as a stepping stone to A-Levels or other higher-level studies. 
    </p>
    <p className="text-gray-700 leading-relaxed">
      Our platform provides a structured approach to your IGCSE revision, offering AI-powered mock tests, detailed solutions, and access to AI teachers and private tutors for personalized support. Prepare effectively and achieve your best results!
    </p>
  </div>
);

const TimetableContent = () => (
  <div className="p-6 bg-white rounded-xl shadow-sm">
    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Exam Timetable</h3>
    <p className="text-gray-700 mb-4">
      Here you can find the provisional and final timetables for upcoming Edexcel IGCSE examinations. Please check regularly for updates.
    </p>
    <ul className="list-disc list-inside text-gray-700 space-y-2">
      <li>Summer 2025 Exam Series: Provisional Timetable (Available Now)</li>
      <li>Winter 2025 Exam Series: Provisional Timetable (Expected September 2025)</li>
      <li>January 2026 Exam Series: Provisional Timetable (Expected November 2025)</li>
    </ul>
    <p className="mt-4 text-sm text-gray-500">
      *Dates are subject to change. Always refer to the officIGCSE Edexcel website for the most accurate and up-to-date information.
    </p>
  </div>
);

const InfoTabs = [
  { label: 'Details', content: <DetailsContent /> },
  { label: 'Timetable', content: <TimetableContent /> },
];

const InfoPane = () => {
  const [activeTabIdx, setActiveTabIdx] = useState<number>(0);
  const [sliderStyle, setSliderStyle] = useState<Record<string, string>>({ width: '0px', left: '0px' });
  const tabRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const activeTab = tabRefs.current[activeTabIdx];
    if (activeTab) {
      const { offsetWidth, offsetLeft } = activeTab;
      setSliderStyle({
        width: offsetWidth + 'px',
        left: offsetLeft + 'px',
      });
    }
  }, [activeTabIdx]);
  
  return (
    <>
      {/* Pane selector */}
      <div className="bg-gray-100 rounded-xl p-2 shadow-inner mb-12">
        {/* Horizontal Tab Bar */}
        <div className="relative flex justify-around bg-white rounded-lg p-2 border-b border-gray-200 gap-x-2">
          {/* Sliding Indicator */}
          <span
            className="absolute bottom-0 left-0 h-1 bg-blue-600 rounded transition-all duration-300"
            style={{
              width: sliderStyle?.width || '0px',
              left: sliderStyle?.left || '0px',
            }}
          />
          { InfoTabs.map((tab, index) => (
            <button
              key={index}
              ref={el => { tabRefs.current[index] = el; }}
              className={`flex-1 py-3 px-4 text-center text-lg font-medium rounded-md transition-colors duration-200 ${
                activeTabIdx === index ? 'text-blue-600 font-bold' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTabIdx(index)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Pane */}
        <div className="mt-2">
          {InfoTabs[activeTabIdx].content}
        </div>
      </div>
    </>
  );
};

export default InfoPane;