"use client"
import React, { useState, useEffect, useRef } from 'react';

// --- Type Definitions ---
interface TranslationQuestion {
    id: string;
    type: '2_mark_translation' | '3_mark_translation';
    english_sentence: string;
}

interface TranslationResultItem {
    question_id: string;
    english_sentence: string;
    user_translation: string;
    correct_translation: string;
    score: number;
    max_score: number;
    feedback: string;
}

interface MarkingResults {
    results: TranslationResultItem[];
    total_score: number;
    max_total_score: number;
    overall_score_percentage: number;
    overall_feedback: string;
}

const App: React.FC = () => {
    // --- State Variables ---
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);
    const [generatedQuestions, setGeneratedQuestions] = useState<TranslationQuestion[]>([]);
    const [correctTranslations, setCorrectTranslations] = useState<{ [key: string]: string }>({});
    const [userTranslations, setUserTranslations] = useState<{ [key: string]: string }>({});
    const [isTestActive, setIsTestActive] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<{ message: string; isError: boolean } | null>(null);
    const [markingResults, setMarkingResults] = useState<MarkingResults | null>(null);

    // Ref for the form to collect user translations
    const formRef = useRef<HTMLFormElement>(null);

    // --- Utility Functions ---

    // Display a loading spinner and message
    const showLoading = (message: string = 'Generating translation questions...') => {
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

    // Send a message to the AI to generate translation questions and correct answers
    const generateContent = async () => {
        showLoading('Generating translation questions...');
        setMarkingResults(null); // Clear previous results
        setUserTranslations({}); // Clear previous user answers

        if (!currentChatId) {
            try {
                await startNewChat(); // Ensure chat session is started
            } catch (error) {
                hideLoading();
                return; // Stop if chat session fails to start
            }
        }

        const prompt = `
            Generate 6 Edexcel IGCSE Chinese Translation questions.
            For each question, provide an English sentence to be translated and its correct Traditional Chinese translation.

            The first 3 questions (q1, q2, q3) should be suitable for a 2-mark rubric:
            - 0 marks: No rewardable material.
            - 1 mark: Meaning partially communicated with errors that hinder clarity or prevent meaning being conveyed.
            - 2 marks: Meaning fully communicated with occasional errors that do not hinder clarity.

            The remaining 3 questions (q4, q5, q6) should be suitable for a 3-mark rubric:
            - 0 marks: No rewardable material.
            - 1 mark: Some words are communicated but the overall meaning of the sentence is not communicated.
            - 2 marks: The meaning of the sentence is partially communicated. Linguistic structures and vocabulary are mostly accurate with some errors that hinder clarity or prevent meaning being conveyed.
            - 3 marks: The meaning of the sentence is fully communicated. Linguistic structures and vocabulary are accurate with only occasional errors that do not hinder clarity.
            

            The output should be a single JSON object with the following structure. Note that you should not use the same questions as the sample below. Generate questions from any topic about Chinese life.
            {
                "translation_test": {
                    "questions": [
                        {
                            "id": "q1",
                            "type": "2_mark_translation",
                            "english_sentence": "I am in Shanghai."
                        },
                        {
                            "id": "q2",
                            "type": "2_mark_translation",
                            "english_sentence": "I am staying at my friend’s house."
                        },
                        {
                            "id": "q3",
                            "type": "2_mark_translation",
                            "english_sentence": "We went to a famous park yesterday."
                        },
                        {
                            "id": "q4",
                            "type": "3_mark_translation",
                            "english_sentence": "We are going to see many different places next week."
                        },
                        {
                            "id": "q5",
                            "type": "3_mark_translation",
                            "english_sentence": "After eating, I will go to the library to read books and do my homework."
                        },
                        {
                            "id": "q6",
                            "type": "3_mark_translation",
                            "english_sentence": "Although it was very cold today, my heart felt warm because I met an old friend."
                        }
                    ]
                },
                "correct_answers": {
                    "q1": "我在上海。",
                    "q2": "我住在朋友家。",
                    "q3": "我們昨天去了一個有名的公園。",
                    "q4": "我們下週要去很多不同的地方。",
                    "q5": "吃完飯以後，我要去圖書館看書和做功課。",
                    "q6": "雖然今天很冷，但是我的心裏很溫暖，因為我遇到了一位老朋友。"
                }
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
                const parsedData = JSON.parse(jsonMatch[0]);
                setGeneratedQuestions(parsedData.translation_test.questions);
                setCorrectTranslations(parsedData.correct_answers);
                updateStatus('Translation questions generated successfully!');
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

    // Send user translations to AI for marking
    const markAnswerAI = async () => {
        // Check if any translation is provided
        const hasAnyAnswer = Object.values(userTranslations).some(answer => answer.trim() !== '');
        if (!hasAnyAnswer) {
            updateStatus('Your answer cannot be blank. Please enter at least one translation to submit.', true);
            return;
        }

        showLoading('Marking your translations...');

        const markingPrompt = `
            I have provided you with Edexcel IGCSE Chinese Translation questions, the correct Traditional Chinese translations, and the user's Traditional Chinese translations.
            Please evaluate each of the user's translations against the original English sentence and the correct Traditional Chinese translation, applying the specified rubric for each question type.

            Rubrics:
            For 2-mark questions (q1, q2, q3):
            - 0 marks: No rewardable material.
            - 1 mark: Meaning partially communicated with errors that hinder clarity or prevent meaning being conveyed.
            - 2 marks: Meaning fully communicated with occasional errors that do not hinder clarity.

            For 3-mark questions (q4, q5, q6):
            - 0 marks: No rewardable material.
            - 1 mark: Some words are communicated but the overall meaning of the sentence is not communicated.
            - 2 marks: The meaning of the sentence is partially communicated. Linguistic structures and vocabulary are mostly accurate with some errors that hinder clarity or prevent meaning being conveyed.
            - 3 marks: The meaning of the sentence is fully communicated. Linguistic structures and vocabulary are accurate with only occasional errors that do not hinder clarity.

            Each question is for its specified mark. Calculate an overall total score and percentage.

            Questions and Correct Answers: ${JSON.stringify(generatedQuestions.map(q => ({
                id: q.id,
                english_sentence: q.english_sentence,
                type: q.type,
                correct_translation: correctTranslations[q.id]
            })))}
            User's Translations: ${JSON.stringify(userTranslations)}

            Return the output as a JSON object with the following structure:
            {
                "results": [
                    {
                        "question_id": "q1",
                        "english_sentence": "...",
                        "user_translation": "...",
                        "correct_translation": "...",
                        "score": 1,
                        "max_score": 2,
                        "feedback": "..."
                    },
                    // ... for all 6 questions
                ],
                "total_score": 12,
                "max_total_score": 15,
                "overall_score_percentage": 80,
                "overall_feedback": "..."
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
                const results: MarkingResults = JSON.parse(jsonMatch[0]);
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

    // --- UI Rendering Logic ---

    // Collect user's translation answers from the form
    const collectUserTranslations = () => {
        const newTranslations: { [key: string]: string } = {};
        if (!formRef.current) return;

        generatedQuestions.forEach(q => {
            const textarea = formRef.current?.querySelector<HTMLTextAreaElement>(`#translation-${q.id}`);
            newTranslations[q.id] = textarea ? textarea.value.trim() : '';
        });
        setUserTranslations(newTranslations);
    };

    // Combined function to collect answers and then mark them
    const handleSubmitTranslations = () => {
        collectUserTranslations();
        // Marking happens after userTranslations state is updated, so we need to call it directly
        markAnswerAI();
    };

    // --- Lifecycle and Initial Load ---
    useEffect(() => {
        // This effect runs once on component mount to start a new chat session
        // or whenever currentChatId becomes null (e.g., after starting again)
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
            return (
                <div className="results-section">
                    <h3 style={{ color: '#FF3b30' }}>Your score: </h3>
                    <p style={{ textAlign: 'center', fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                        Total: <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{markingResults.total_score} / {markingResults.max_total_score} 分 ({markingResults.overall_score_percentage}%)</span>
                    </p>
                    <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '0.5rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
                        <h4 style={{ fontWeight: 700, color: '#1e40af', marginBottom: '0.5rem' }}>Overall:</h4>
                        <p style={{ color: '#1d4ed8' }}>{markingResults.overall_feedback}</p>
                    </div>

                    <h4 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '1rem', color: '#1f2937' }}>Details:</h4>
                    <div style={{ marginTop: '1rem' }}>
                        {markingResults.results.map((result, index) => (
                            <div key={result.question_id} className={`result-item ${result.score > 0 ? 'correct' : 'incorrect'}`} style={{ marginBottom: '1rem' }}>
                                <h4 style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.25rem' }}>
                                    ({String.fromCharCode(97 + index)}) Original Sentence: {result.english_sentence}
                                    <span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: '#4b5563' }}>({result.max_score} 分)</span>
                                </h4>
                                <p><strong>Your translation: </strong> <span style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', color: '#333' }}>{result.user_translation || '未作答'}</span></p>
                                <p><strong>Correct translation: </strong> <span style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', color: '#333' }}>{result.correct_translation}</span></p>
                                <p><strong>Score:</strong> <span className="result-score">{result.score} / {result.max_score} 分</span></p>
                                <p><strong>Feedback:</strong> {result.feedback}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (isTestActive && generatedQuestions.length > 0) {
            return (
                <>
                    <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1e40af' }}>將以下句子翻譯成中文。</h3>
                    </div>

                    <form id="translationForm" ref={formRef}>
                        {generatedQuestions.map((q, index) => {
                            const maxMarks = (q.type === '2_mark_translation') ? 2 : 3;
                            return (
                                <div className="question-block" data-question-id={q.id} key={q.id}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1f2937' }}>
                                        ({String.fromCharCode(97 + index)}) {q.english_sentence} <span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: '#4b5563' }}>({maxMarks} 分)</span>
                                    </h3>
                                    <textarea
                                        id={`translation-${q.id}`}
                                        className="textarea-input"
                                        placeholder="請在此處輸入你的中文翻譯 (繁體字)..."
                                        rows={4}
                                        style={{ fontSize: '1rem' }}
                                        value={userTranslations[q.id] || ''}
                                        onChange={(e) => setUserTranslations(prev => ({ ...prev, [q.id]: e.target.value }))}
                                    ></textarea>
                                </div>
                            );
                        })}
                    </form>
                </>
            );
        }

        // Default start screen
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Welcome to your Edexcel IGCSE Chinese Translating Practice!</h2>
                <p style={{ color: '#374151', marginBottom: '1.5rem' }}>Click 'Start Test' to generate new translation questions.</p>
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
                    height: 90vh; /* Adjust as needed */
                    max-width: 900px; /* Equivalent to max-w-4xl */
                    margin: 0px auto;
                    border: 2px solid black;
                    border-radius: 12px; /* Equivalent to rounded-xl */
                    overflow: hidden;
                    background-color: white; /* White background for the tool */
                    color: #333;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Equivalent to shadow-lg */
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
                Edexcel IGCSE Chinese Translating
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
                    <button onClick={handleSubmitTranslations} className="btn-primary">
                        Submit Answers
                    </button>
                )}
                {!isTestActive && (markingResults || !loadingMessage) && (
                    <button onClick={() => {
                        setGeneratedQuestions([]);
                        setCorrectTranslations({});
                        setUserTranslations({});
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
