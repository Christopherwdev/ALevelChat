'use client'; // This directive marks the component as a client component

import React, { useState, useCallback } from 'react';

const App: React.FC = () => {
    // State to track the currently selected subject (though not explicitly used for display on this page,
    // it can be used for future navigation or dynamic content loading).
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

    // Define the subject data
    const subjects = [
        { id: 'biology', name: 'Biology', category: 'Edexcel IAL', bgColorClass: 'card-biology' },
        { id: 'chemistry', name: 'Chemistry', category: 'Edexcel IAL', bgColorClass: 'card-chemistry' },
        { id: 'physics', name: 'Physics', category: 'Edexcel IAL', bgColorClass: 'card-physics' },
        { id: 'math', name: 'Math', category: 'Edexcel IAL', bgColorClass: 'card-math' },
    ];

    // Function to handle subject card click
    const handleSubjectClick = useCallback((subjectId: string) => {
        setSelectedSubject(subjectId);
        console.log(`Navigating to notes for: ${subjectId}`);
        // In a real application, you would use a router or state management
        // to navigate to the specific notes page, e.g.:
        // window.location.href = `/notes/${subjectId}`;
        // For this immersive, we'll just log it.
        // If this were part of a larger app, you might emit an event or change a global state.
    }, []);

    // Function to handle home button click
    const handleHomeClick = useCallback(() => {
        console.log('Navigating to home page.');
        // In a real application, you would navigate back to the main app interface
        // window.location.href = 'index.html';
    }, []);

    return (
        <div className="antialiased bg-gray-100 flex items-center justify-center min-h-screen p-4 transition-colors duration-300">
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                
                :root {
                    --primary-color: #007aff;
                    --biology-bg: #0fBD8C; 
                    --chemistry-bg: #FF6B6B;
                    --physics-bg: #4081FF;
                    --math-bg: #ffab1a;
                    --card-border-color: #222;
                }
                body {
                    font-family: 'Inter', sans-serif;
                    background-color: #f8f9fa;
                    color: #333;
                  
                    display: flex;
                    flex-direction: column;
                }
                .container {
                    flex-grow: 1;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: start;
                    align-items: left;
                  
                    max-width: 1200px;
                    margin: 0 auto;
                    width: 100%;
                    box-sizing: border-box;
                }
                .subject-card {
                    background-color: white;
                    border-radius: 0.75rem;
                    border: 2px solid var(--card-border-color);
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    padding: 15px;
                    text-align: center;
                    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: flex-start;
                    min-height: 150px;
                    position: relative;
                    overflow: hidden;
                }
                .subject-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.15);
                }
                .subject-tag {
                    background-color: rgba(0,0,0,0.1);
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 0.375rem;
                    font-size: 0.75rem;
                    font-weight: 500;
                    position: absolute;
                    z-index: 10;
                }
                .subject-name {
                    font-size: 2rem;
                    font-weight: 800;
                    color: white;
                    text-align: left;
                    margin-bottom: -10px;
                    flex-grow: 1;
                    display: flex;
                    align-items: flex-end;
                    width: 100%;
                }
                .start-now-btn {
                    font-size: 10px;
                    background-color: white;
                    color: black;
                    padding: 0.5rem 1rem;
                    border-radius: 100px;
                    font-weight: 600;
                    transition: background-color 0.2s, color 0.2s;
                    align-self: left;
                    margin-top: 1.2rem;
                    transition: all 0.3s;
                }
                .start-now-btn:hover {
                    box-shadow: 0px 0px 0px 7.5px #ffffff30;
                }

                /* Specific card background colors */
                .card-biology { background-color: var(--biology-bg); }
                .card-chemistry { background-color: var(--chemistry-bg); }
                .card-physics { background-color: var(--physics-bg); }
                .card-math { background-color: var(--math-bg); }
                `}
            </style>

            <div id="app-container" className="w-full flex flex-col">
                {/* Header Section */}
           

                {/* Main Content Area for Subject Selection */}
                <div className="container">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 mt-8">Edexcel IAL Revision Notes <span className="font-normal text-gray-400 text-xl">/ 4 Subjects</span></h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-8">
                        {subjects.map((subject) => (
                            <div
                                key={subject.id}
                                className={`subject-card ${subject.bgColorClass}`}
                                data-subject={`edexcel-ial/${subject.id}`}
                                onClick={() => handleSubjectClick(subject.id)}
                            >
                                <span className="subject-tag">{subject.category}</span>
                                <span className="subject-name">{subject.name}</span>
                                <button className="start-now-btn">START NOW</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
