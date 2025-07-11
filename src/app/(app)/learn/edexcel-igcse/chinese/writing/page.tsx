"use client"
import React, { useState, useEffect, useRef } from 'react';

// --- Type Definitions ---
interface WritingPrompt {
    prompt_id: string;
    type: string; // e.g., "writing_essay"
    instruction: string;
    points_to_include: string[];
    character_count_guidance: string;
    model_answer: string;
}

interface FeedbackPoint {
    criterion: string;
    details: string;
    marks_contributed: number;
}

interface WritingResult {
    prompt_id: string;
    user_answer: string;
    score: number;
    max_score: number;
    feedback_points: FeedbackPoint[];
    overall_feedback: string;
    model_answer: string;
}

interface MarkingResults {
    results: WritingResult[];
    overall_score_percentage: number;
}

const App: React.FC = () => {
    // --- State Variables ---
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);
    const [generatedPrompt, setGeneratedPrompt] = useState<WritingPrompt | null>(null);
    const [userWritingAnswer, setUserWritingAnswer] = useState<string>('');
    const [isTestActive, setIsTestActive] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<{ message: string; isError: boolean } | null>(null);
    const [markingResults, setMarkingResults] = useState<MarkingResults | null>(null);

    // Ref for the textarea to collect user's writing
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // --- Utility Functions ---

    // Display a loading spinner and message
    const showLoading = (message: string = 'Generating writing prompt...') => {
        setLoadingMessage(message);
        setStatusMessage(null); // Clear any previous status messages
    };

    // Clear loading state
    const hideLoading = () => {
        setLoadingMessage(null);
    };

    // Update status messages (e.g., for API errors)
    const updateStatus = (message: string, isError: boolean = false) => {
        console.log(isError ? `ERROR: ${message}` : `INFO: ${message}`);
        setStatusMessage({ message, isError });
        // Auto-hide status message after 5 seconds
        setTimeout(() => setStatusMessage(null), 5000);
    };

    // --- AI API Interaction ---

    // Start a new chat session with the AI
    const startNewChat = async () => {
        try {
            const response = await fetch('https://server-ef04.onrender.com/api/chat/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success) {
                setCurrentChatId(data.chatId);
                updateStatus('Connected to AI chat session.');
            } else {
                throw new Error(data.error || 'Failed to start chat session');
            }
        } catch (error: any) {
            updateStatus('Error connecting to AI: ' + error.message, true);
            throw error; // Re-throw to propagate error for calling functions
        }
    };

    // Send a message to the AI to generate a writing prompt and model answer
    const generateContent = async () => {
        showLoading('Generating writing prompt...');
        setMarkingResults(null); // Clear previous results
        setUserWritingAnswer(''); // Clear previous user answer

        if (!currentChatId) {
            try {
                await startNewChat(); // Ensure chat session is started
            } catch (error) {
                hideLoading();
                return; // Stop if chat session fails to start
            }
        }

        const prompt = `
            Generate ONE Edexcel IGCSE Chinese Writing Task. The task should be one of the typical question types for Section B, with a total of 20 marks.
            The prompt should be in Traditional Chinese characters and list 3-4 specific bullet points that MUST be included in the response.
            Also, generate a high-quality model answer in Traditional Chinese characters (around 150-250 characters) that directly addresses all the bullet points in the prompt.

            The output should be a single JSON object with the following structure. Note that you should not use the same questions as the sample below. Generate questions from any topic about Chinese life.
            {
                "writing_test": {
                    "prompt_id": "wp1",
                    "type": "writing_essay",
                    "instruction": "寫一封電子郵件給你的筆友，說說你和家人一起做的事情。",
                    "points_to_include": [
                        "說說你最近跟家人一起做過的一件事",
                        "你覺得這件事情怎麼樣",
                        "說說你對中學生做家務的看法",
                        "你怎麼做可以讓你的父母更開心"
                    ],
                    "character_count_guidance": "請用大約150-250個漢字。",
                    "model_answer": "這是一個關於家人活動的電子郵件模型答案，包括了所有要求點的內容。"
                },
                "max_marks": 20
            }
        `;

        try {
            const response = await fetch('https://server-ef04.onrender.com/api/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chatId: currentChatId,
                    message: `System: ${prompt}`
                })
            });

            const data = await response.json();
            if (!data || !data.success || !data.response) {
                throw new Error(data.error || "Invalid response from AI");
            }

            // Extract JSON from message content
            const jsonMatch = data.response.match(/{[\s\S]*}/);
            if (jsonMatch) {
                let jsonString = jsonMatch[0];
                // Remove bad control characters except for newlines and tabs
                jsonString = jsonString.replace(/[\u0000-\u0019]+/g, ' ');

                const parsedData = JSON.parse(jsonString);
                setGeneratedPrompt(parsedData.writing_test);
                updateStatus('Writing prompt generated successfully!');
                setIsTestActive(true);
                hideLoading();
            } else {
                throw new Error("Could not parse JSON from AI response.");
            }

        } catch (error: any) {
            updateStatus('Error generating content: ' + error.message, true);
            hideLoading();
            setIsTestActive(false); // Go back to start screen on error
        }
    };

    // Send user writing answer to AI for marking
    const markAnswerAI = async () => {
        if (!userWritingAnswer.trim()) {
            updateStatus('Your answer cannot be blank. Please enter your writing to submit.', true);
            return;
        }

        showLoading('Marking your writing...');

        if (!generatedPrompt) {
            updateStatus('Error: No prompt available to mark against.', true);
            hideLoading();
            return;
        }

        const markingPrompt = `
            I have provided you with an Edexcel IGCSE Chinese Writing Task and a model answer. The user has provided their written response.
            Please evaluate the user's answer against the original prompt's requirements and the provided model answer.
            The total marks for this writing task are 20.

            Original Prompt:
            Instruction: "${generatedPrompt.instruction}"
            Points to include: ${JSON.stringify(generatedPrompt.points_to_include)}
            Character count guidance: "${generatedPrompt.character_count_guidance}"

            Model Answer: "${generatedPrompt.model_answer}"

            User's Answer: "${userWritingAnswer}"

            Please provide detailed feedback based on the following criteria, and then calculate a score out of 20.
            Feedback Criteria:
            1.  **Content Coverage:** How well all required points are addressed.
            2.  **Language Accuracy:** Grammar, vocabulary, sentence structure.
            3.  **Fluency & Cohesion:** How well the ideas flow, logical connections.
            4.  **Appropriacy of Style:** Is the tone and format suitable for the task (e.g., email, article).
            5.  **Character Count:** Is the length within the guidance (consider it as a minor point, not a strict pass/fail).

            Return the output as a JSON object with the following structure:
            {
                "results": [
                    {
                        "prompt_id": "wp1",
                        "user_answer": "...",
                        "score": 15,
                        "max_score": 20,
                        "feedback_points": [
                            {"criterion": "Content Coverage", "details": "Addressed all points, but some could be expanded.", "marks_contributed": 8},
                            {"criterion": "Language Accuracy", "details": "Good range of vocabulary, some minor grammatical errors.", "marks_contributed": 5},
                            {"criterion": "Fluency & Cohesion", "details": "Ideas flow well, but transitions could be smoother.", "marks_contributed": 3},
                            {"criterion": "Appropriacy of Style", "details": "Email format was correctly followed.", "marks_contributed": 2},
                            {"criterion": "Character Count", "details": "Within the suggested range.", "marks_contributed": 2}
                        ],
                        "overall_feedback": "Overall strong effort, focus on refining grammar for higher marks.",
                        "model_answer": "AI generated model answer here."
                    }
                ],
                "overall_score_percentage": 75
            }
        `;

        try {
            const response = await fetch('https://server-ef04.onrender.com/api/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chatId: currentChatId,
                    message: `System: ${markingPrompt}`
                })
            });

            const data = await response.json();
            if (!data || !data.success || !data.response) {
                throw new Error(data.error || "Invalid response from AI for marking");
            }

            const jsonMatch = data.response.match(/{[\s\S]*}/);
            if (jsonMatch) {
                let jsonString = jsonMatch[0];
                // Remove bad control characters except for newlines and tabs
                jsonString = jsonString.replace(/[\u0000-\u0019]+/g, ' ');

                const results: MarkingResults = JSON.parse(jsonString);
                setMarkingResults(results);
                setIsTestActive(false); // Test is no longer active, results are shown
                hideLoading();
            } else {
                throw new Error("Could not parse marking JSON from AI response.");
            }

        } catch (error: any) {
            updateStatus('Error marking answers: ' + error.message, true);
            hideLoading();
            setIsTestActive(true); // Keep test active to allow re-submission or review
        }
    };

    // --- Lifecycle and Initial Load ---
    useEffect(() => {
        // This effect runs once on component mount to start a new chat session
        if (!currentChatId) {
            startNewChat();
        }
    }, [currentChatId]); // Dependency array ensures it runs when currentChatId changes

    // --- Render Content Based on State ---
    const renderContent = () => {
        if (loadingMessage) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <div className="spinner" style={{ marginBottom: '1rem' }}></div>
                    <p style={{ color: '#4b5563' }}>{loadingMessage}</p>
                </div>
            );
        }

        if (markingResults) {
            const result = markingResults.results[0]; // Assuming only one writing task result
            return (
                <div className="results-section">
                    <h3 style={{ color: '#FF3b30' }}>Your score: </h3>
                    <p style={{ textAlign: 'center', fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                        總分: <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{result.score} / {result.max_score} 分 ({markingResults.overall_score_percentage}%)</span>
                    </p>
                    <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '0.5rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
                        <h4 style={{ fontWeight: 700, color: '#1e40af', marginBottom: '0.5rem' }}>Overall:</h4>
                        <p style={{ color: '#1d4ed8' }}>{result.overall_feedback}</p>
                    </div>

                    <h4 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '1rem', color: '#1f2937' }}>Details: </h4>
                    <div style={{ marginBottom: '1.5rem' }}>
                        {result.feedback_points.map((point, index) => (
                            <div key={index} style={{ marginBottom: '0.5rem' }}>
                                <p style={{ fontWeight: 600, color: '#374151' }}>{point.criterion}:</p>
                                <p style={{ marginLeft: '1rem', color: '#4b5563' }}>{point.details} ({point.marks_contributed} 分)</p>
                            </div>
                        ))}
                    </div>

                    <h4 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '1rem', color: '#1f2937' }}>Your Answer: </h4>
                    <div style={{ background: '#f9f9f9', border: '1px solid #eee', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                        <p style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', color: '#333' }}>{result.user_answer}</p>
                    </div>

                    <h4 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '1rem', color: '#1f2937' }}>Model Answer: </h4>
                    <div style={{ background: '#f9f9f9', border: '1px solid #eee', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                        <p style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', color: '#333' }}>{result.model_answer}</p>
                    </div>
                </div>
            );
        }

        if (isTestActive && generatedPrompt) {
            return (
                <>
                    <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1e40af' }}>Writing Question:</h3>
                        <p id="writingInstruction" style={{ color: '#1f2937', fontWeight: 500, fontSize: '1.125rem', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{generatedPrompt.instruction}</p>
                        <p style={{ fontWeight: 600, marginTop: '1rem' }}>你必須包括以下幾點：</p>
                        <ul style={{ listStyleType: 'disc', marginLeft: '1.5rem', color: '#374151' }}>
                            {generatedPrompt.points_to_include.map((point, index) => (
                                <li key={index}>{point}</li>
                            ))}
                        </ul>
                        <p style={{ fontStyle: 'italic', marginTop: '1rem', color: '#4b5563' }}>{generatedPrompt.character_count_guidance}</p>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#1f2937' }}>你的答案:</h3>
                    <form>
                        <textarea
                            id="userWritingAnswer"
                            className="textarea-input"
                            placeholder="Type your writing here..."
                            rows={15}
                            style={{ fontSize: '1rem' }}
                            value={userWritingAnswer}
                            onChange={(e) => setUserWritingAnswer(e.target.value)}
                            ref={textareaRef}
                        ></textarea>
                    </form>
                </>
            );
        }

        // Default start screen
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Welcome to your IGCSE Chinese Writing Practice!</h2>
                <p style={{ color: '#374151', marginBottom: '1.5rem' }}>Click 'Start Test' to generate a new writing prompt.</p>
                <button onClick={generateContent} className="btn-primary">Start Test</button>
            </div>
        );
    };

    // --- Main Component Render ---
    return (
        <div id="igcseTool" className="igcse-tool-container">
            {/* Styles are embedded directly for simplicity, can be externalized if preferred */}
            <style>
                {`
                /* General Reset and Body Styling */
               body {
                    font-family: 'Inter', sans-serif;
                    background-color: #f0f4f8;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    margin: 0;
                    padding: 20px;
                    box-sizing: border-box;
                }

                /* Container styling */
                .igcse-tool-container {
                    width: 100%;
                    max-width: 900px;
                    margin: 0px auto;
                    border: 2px solid black;
                    border-radius: 12px;
                    background-color: white;
                    color: #333;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                /* Header Styling */
                .tool-header {
                    background-color: #FF3b30; /* Primary color */
                    color: white;
                    padding: 1rem;
                    text-align: center;
                    font-weight: 700; /* Equivalent to font-bold */
                    font-size: 1.5rem; /* Equivalent to text-2xl */
                    border-top-left-radius: 10px;
                    border-top-right-radius: 10px;
                }

                /* Content Area Styling */
                .tool-content {
                    flex-grow: 1;
                    padding: 1.5rem; /* Equivalent to p-6 or p-4 for inner elements */
                    overflow-y: auto; /* Make content scrollable */
                    background-color: white; /* Ensure white background for content */
                }

                /* Footer Styling */
                .tool-footer {
                    padding: 1rem;
                    display: flex;
                    justify-content: center;
                    gap: 1rem; /* Equivalent to gap-4 */
                    background-color: #f9f9f9; /* Light gray */
                    border-top: 1px solid #eee;
                    border-bottom-left-radius: 10px;
                    border-bottom-right-radius: 10px;
                }

                /* Button Styling */
                .btn-primary {
                    background-color: #FF3b30;
                    color: white;
                    padding: 0.75rem 1.5rem; /* Equivalent to px-6 py-3 */
                    border-radius: 9999px; /* Fully rounded, equivalent to rounded-full */
                    font-weight: 600; /* Equivalent to font-semibold */
                    transition: background-color 0.2s ease-in-out;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    display: flex; /* To align SVG and text */
                    align-items: center;
                    justify-content: center;
                }

                .btn-primary:hover {
                    background-color: #E6352C; /* Slightly darker red */
                }

                .btn-primary svg {
                    width: 1.25rem; /* Equivalent to w-5 */
                    height: 1.25rem; /* Equivalent to h-5 */
                    margin-right: 0.5rem; /* Equivalent to mr-2 */
                }

                .btn-secondary {
                    background-color: #4a5568; /* Dark gray */
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 9999px;
                    font-weight: 600;
                    transition: background-color 0.2s ease-in-out;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .btn-secondary:hover {
                    background-color: #2d3748; /* Even darker gray on hover */
                }

                /* Input Styling */
                .text-input,
                .textarea-input {
                    border: 1px solid #ccc;
                    border-radius: 6px; /* Equivalent to rounded-md */
                    padding: 0.75rem;
                    width: 100%;
                    font-size: 1rem;
                    color: #333;
                    background-color: white;
                    box-sizing: border-box; /* Ensure padding doesn't add to width */
                }

                .text-input:focus,
                .textarea-input:focus {
                    outline: none;
                    border-color: #FF3b30;
                    box-shadow: 0 0 0 2px rgba(255, 59, 48, 0.2);
                }

                /* Custom Spinner */
                .spinner {
                    border: 4px solid rgba(0, 0, 0, 0.1);
                    border-left-color: #FF3b30;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }

                /* Question Specific Styling */
                .question-block {
                    background-color: #fcfcfc;
                    border: 1px solid #eee;
                    border-radius: 8px; /* Equivalent to rounded-lg */
                    padding: 1.25rem;
                    margin-bottom: 1.5rem; /* Equivalent to mb-6 */
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); /* Equivalent to shadow-sm */
                }

                .question-instruction {
                    font-weight: 600;
                    margin-bottom: 1rem;
                    color: #333;
                    line-height: 1.5;
                }

                .question-options label {
                    display: flex;
                    align-items: center;
                    margin-bottom: 0.5rem; /* Equivalent to mb-2 */
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 4px; /* Equivalent to rounded */
                    transition: background-color 0.1s;
                }

                .question-options label:hover {
                    background-color: #f0f0f0;
                }

                .question-options input[type="radio"],
                .question-options input[type="checkbox"] {
                    margin-right: 0.75rem; /* Equivalent to mr-3 */
                    accent-color: #FF3b30; /* Custom color for checked state */
                }

                /* Table Styling for Questions */
                .question-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 1rem;
                    font-size: 0.95rem; /* Equivalent to text-sm */
                }

                .question-table th,
                .question-table td {
                    border: 1px solid #ddd;
                    padding: 0.75rem 0.5rem; /* Equivalent to px-3 py-2 */
                    text-align: left;
                    vertical-align: top;
                }

                .question-table th {
                    background-color: #f8f8f8;
                    font-weight: 600;
                    color: #555;
                }

                .question-table input[type="text"] {
                    padding: 0.5rem;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    width: 100%;
                    box-sizing: border-box; /* Ensure padding doesn't add to width */
                }

                /* Results Section Styling */
                .results-section h3 {
                    font-size: 1.25rem; /* Equivalent to text-xl */
                    font-weight: 700; /* Equivalent to font-bold */
                    margin-bottom: 1rem;
                    color: #FF3b30; /* Primary color */
                    text-align: center;
                }

                .result-item {
                    background-color: #f9f9f9;
                    border: 1px solid #eee;
                    border-radius: 8px;
                    padding: 1rem;
                    margin-bottom: 1rem;
                }

                .result-item.correct {
                    border-color: #d1fae5; /* Tailwind green-200 equivalent */
                    background-color: #ecfdf5; /* Tailwind green-50 equivalent */
                }

                .result-item.incorrect {
                    border-color: #fee2e2; /* Tailwind red-200 equivalent */
                    background-color: #ffeaea; /* Tailwind red-50 equivalent */
                }

                .result-score {
                    font-weight: bold;
                    color: #FF3b30;
                }

                /* Utility Classes */
                .hidden {
                    display: none !important;
                }

                .flex {
                    display: flex;
                }

                .flex-col {
                    flex-direction: column;
                }

                .items-center {
                    align-items: center;
                }

                .justify-center {
                    justify-content: center;
                }

                .justify-end {
                    justify-content: flex-end;
                }

                .h-full {
                    height: 100%;
                }

                .w-full {
                    width: 100%;
                }

                .text-center {
                    text-align: center;
                }

                .mb-4 {
                    margin-bottom: 1rem;
                }

                .mb-6 {
                    margin-bottom: 1.5rem;
                }

                .mb-2 {
                    margin-bottom: 0.5rem;
                }

                .mt-2 {
                    margin-top: 0.5rem;
                }

                .mt-6 {
                    margin-top: 1.5rem;
                }

                .font-bold {
                    font-weight: 700;
                }

                .font-semibold {
                    font-weight: 600;
                }

                .font-medium {
                    font-weight: 500;
                }

                .text-2xl {
                    font-size: 1.5rem; /* 24px */
                }

                .text-lg {
                    font-size: 1.125rem; /* 18px */
                }

                .text-sm {
                    font-size: 0.875rem; /* 14px */
                }

                .text-gray-600 {
                    color: #4b5563;
                }

                .text-gray-700 {
                    color: #374151;
                }

                .text-gray-800 {
                    color: #1f2937;
                }

                .text-blue-50 {
                    background-color: #eff6ff;
                }

                .border-blue-200 {
                    border-color: #bfdbfe;
                }

                .text-blue-800 {
                    color: #1e40af;
                }

                .text-blue-700 {
                    color: #1d4ed8;
                }

                .shadow-sm {
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                }

                .p-4 {
                    padding: 1rem;
                }

                .space-y-2 > *:not([hidden]) ~ *:not([hidden]) {
                    margin-top: 0.5rem;
                }

                .space-y-4 > *:not([hidden]) ~ *:not([hidden]) {
                    margin-top: 1rem;
                }

                .space-x-2 > *:not([hidden]) ~ *:not([hidden]) {
                    margin-left: 0.5rem;
                }

                .rounded-lg {
                    border-radius: 0.5rem;
                }

                .rounded-xl {
                    border-radius: 0.75rem;
                }
                `}
            </style>
            <div className="tool-header">
                IGCSE Chinese Writing
            </div>

            <div id="toolContent" className="tool-content">
                {statusMessage && (
                    <div
                        className={`p-3 rounded-lg text-sm mb-4 ${statusMessage.isError ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}
                        style={{
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            marginBottom: '1rem',
                            backgroundColor: statusMessage.isError ? '#fee2e2' : '#eff6ff',
                            color: statusMessage.isError ? '#b91c1c' : '#1e40af'
                        }}
                    >
                        {statusMessage.message}
                    </div>
                )}
                {renderContent()}
            </div>

            <div className={`tool-footer ${loadingMessage || (!isTestActive && !markingResults) ? 'hidden' : ''}`}>
                {isTestActive && (
                    <button onClick={markAnswerAI} className="btn-primary">
                        Submit Answers
                    </button>
                )}
                {!isTestActive && (markingResults || !loadingMessage) && (
                    <button onClick={() => {
                        setGeneratedPrompt(null);
                        setUserWritingAnswer('');
                        setMarkingResults(null);
                        setCurrentChatId(null); // Reset chat ID to start fresh
                        setIsTestActive(false); // Ensure start screen is shown
                    }} className="btn-secondary">
                        Start Again
                    </button>
                )}
            </div>
        </div>
    );
};

export default App;
