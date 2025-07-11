"use client"
import React, { useState, useEffect, useRef } from 'react';

// --- Type Definitions ---
interface Question {
    id: string;
    type: 'multiple_choice_single' | 'checkbox_multiple' | 'fill_in_the_blank' | 'table_fill_in_blanks' | 'matching_single_choice' | 'table_radio' | 'table_checkbox';
    instruction: string;
    options?: string[]; // For multiple_choice_single, checkbox_multiple
    blank_label?: string; // For fill_in_the_blank
    headers?: string[]; // For table questions and matching
    rows?: Array<{ label: string; id: string; options?: string[] }>; // For table questions and matching
    shared_options?: string[]; // For matching_single_choice
}

interface ReadingTest {
    passage: string;
    questions: Question[];
}

interface CorrectAnswers {
    [key: string]: string | string[];
}

interface UserAnswers {
    [key: string]: string | string[];
}

interface ResultItem {
    question_id: string;
    user_answer: string | string[];
    correct: boolean;
    feedback: string;
    score: number;
}

interface MarkingResults {
    results: ResultItem[];
    overall_score_percentage: number;
    overall_feedback: string;
}

const App: React.FC = () => {
    // --- State Variables ---
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);
    const [generatedPassage, setGeneratedPassage] = useState<string>('');
    const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
    const [correctAnswers, setCorrectAnswers] = useState<CorrectAnswers>({});
    const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
    const [isTestActive, setIsTestActive] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<{ message: string; isError: boolean } | null>(null);
    const [markingResults, setMarkingResults] = useState<MarkingResults | null>(null);

    // Ref for the form to collect answers
    const formRef = useRef<HTMLFormElement>(null);

    // --- Utility Functions ---

    // Display a loading spinner and message
    const showLoading = (message: string = 'Generating reading test...') => {
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

    // Send a message to the AI to generate passage, questions, and answers
    const generateContent = async () => {
        showLoading('Generating reading test...');
        setMarkingResults(null); // Clear previous results

        if (!currentChatId) {
            try {
                await startNewChat(); // Ensure chat session is started
            } catch (error) {
                hideLoading();
                return; // Stop if chat session fails to start
            }
        }

        const prompt = `
            Generate a short IGCSE Chinese reading passage (around 150-200 characters) in **Traditional Chinese characters**.
            Then, generate 3-4 diverse reading comprehension questions based on the passage. The questions should be in English and cover the types found in IGCSE Chinese reading exams, such as:
            1.  Multiple-choice (single correct answer from A/B/C/D).
            2.  Matching (a list of statements/questions matched to a common set of single-letter options).
            3.  Checkbox (multiple correct answers from A/B/C/D/E/F/G/H).
            4.  Fill-in-the-blanks (requiring short English text or numbers).
            5.  Table-based questions:
                a.  Table where rows are labels and columns are options for radio buttons.
                b.  Table where rows are labels and columns are options for checkboxes.
                c.  Table where rows are labels and columns are fields for short text/number answers.

            Provide the output as a single JSON object with the following structure. Note that you should not use the same questions as the sample below. Generate questions from any topic about Chinese life.
            {
                "reading_test": {
                    "passage": "Your Traditional Chinese passage text here",
                    "questions": [
                        {
                            "id": "q1",
                            "type": "multiple_choice_single",
                            "instruction": "What is the main topic of the conversation? (Choose ONE)",
                            "options": ["A. Weather", "B. Food", "C. Travel", "D. Sports"]
                        },
                        {
                            "id": "q2",
                            "type": "matching_single_choice",
                            "instruction": "Match the following statements with the correct option:",
                            "headers": ["Statement", "Option"],
                            "shared_options": ["A", "B", "C", "D", "E"],
                            "rows": [
                                {"label": "The first thing mentioned was...", "id": "q2a"},
                                {"label": "The person felt...", "id": "q2b"}
                            ]
                        },
                        {
                            "id": "q3",
                            "type": "checkbox_multiple",
                            "instruction": "Which of the following items are mentioned? (Mark ALL correct boxes)",
                            "options": ["A. Books", "B. Music", "C. Movies", "D. Games", "E. Clothes", "F. Food", "G. Plants", "H. Animals"]
                        },
                        {
                            "id": "q4",
                            "type": "fill_in_the_blank",
                            "instruction": "The event will take place on ______.",
                            "blank_label": "Date"
                        },
                        {
                            "id": "q5",
                            "type": "table_fill_in_blanks",
                            "instruction": "Complete the table about the characteristics:",
                            "headers": ["Feature", "Description"],
                            "rows": [
                                {"label": "Building height", "id": "q5a"},
                                {"label": "Street noise level", "id": "q5b"}
                            ]
                        },
                        {
                            "id": "q6",
                            "type": "table_radio",
                            "instruction": "Indicate the correct option for each person:",
                            "headers": ["Person", "Option 1", "Option 2", "Option 3"],
                            "options": ["A", "B", "C"],
                            "rows": [
                                {"label": "Mr. Wang", "id": "q6a"},
                                {"label": "Ms. Li", "id": "q6b"}
                            ]
                        },
                        {
                            "id": "q7",
                            "type": "table_checkbox",
                            "instruction": "Mark all correct characteristics for each item:",
                            "headers": ["Item", "Characteristic A", "Characteristic B", "Characteristic C"],
                            "options": ["A", "B", "C"],
                            "rows": [
                                {"label": "Product X", "id": "q7a"},
                                {"label": "Product Y", "id": "q7b"}
                            ]
                        }
                    ]
                },
                "correct_answers": {
                    "q1": "C",
                    "q2a": "B",
                    "q2b": "A",
                    "q3": ["A", "D", "F"],
                    "q4": "Friday",
                    "q5a": "very high",
                    "q5b": "low",
                    "q6a": "B",
                    "q6b": "C",
                    "q7a": ["A", "C"],
                    "q7b": ["B"]
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
                setGeneratedPassage(parsedData.reading_test.passage);
                setGeneratedQuestions(parsedData.reading_test.questions);
                setCorrectAnswers(parsedData.correct_answers);
                updateStatus('Test generated successfully!');
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

    // Send user answers to AI for marking
    const markAnswersAI = async () => {
        showLoading('Marking your answers...');

        const markingPrompt = `
            I have given you a Chinese reading passage and questions. The user has provided the following answers.
            Please evaluate the user's answers against the correct answers you provided earlier.

            Passage: "${generatedPassage}"
            Questions: ${JSON.stringify(generatedQuestions)}
            Correct Answers: ${JSON.stringify(correctAnswers)}
            User's Answers: ${JSON.stringify(userAnswers)}

            For each question, indicate if the user's answer is correct or incorrect, and provide a brief explanation or the correct answer if it was wrong. Calculate a score for each question (e.g., 1 for correct, 0 for incorrect, or partial marks for multi-part questions if applicable).
            Finally, calculate an overall percentage score for the entire test.

            Return the output as a JSON object with the following structure:
            {
                "results": [
                    {
                        "question_id": "q1",
                        "user_answer": "...",
                        "correct": true/false,
                        "feedback": "...",
                        "score": 1
                    },
                    // ... for all questions
                ],
                "overall_score_percentage": 75,
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
            // Optionally, display collected answers and instruct user to try again
            setIsTestActive(true); // Keep test active to allow re-submission or review
        }
    };

    // --- UI Rendering Logic ---

    // Render a single question based on its type
    const renderQuestion = (q: Question) => {
        switch (q.type) {
            case 'multiple_choice_single':
                return (
                    <div className="question-block" data-question-id={q.id} key={q.id}>
                        <p className="question-instruction">{q.id.toUpperCase()}. {q.instruction}</p>
                        <div className="question-options" style={{ marginTop: '0.5rem' }}>
                            {q.options?.map(option => {
                                const optionValue = option.split('. ')[0];
                                return (
                                    <label key={optionValue} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '4px', transition: 'background-color 0.1s' }}>
                                        <input type="radio" name={q.id} value={optionValue} style={{ marginRight: '0.75rem', accentColor: '#FF3b30' }} />
                                        <span>{option}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                );

            case 'checkbox_multiple':
                return (
                    <div className="question-block" data-question-id={q.id} key={q.id}>
                        <p className="question-instruction">{q.id.toUpperCase()}. {q.instruction}</p>
                        <div className="question-options" style={{ marginTop: '0.5rem' }}>
                            {q.options?.map(option => {
                                const optionValue = option.split('. ')[0];
                                return (
                                    <label key={optionValue} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '4px', transition: 'background-color 0.1s' }}>
                                        <input type="checkbox" name={q.id} value={optionValue} style={{ marginRight: '0.75rem', accentColor: '#FF3b30' }} />
                                        <span>{option}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                );

            case 'fill_in_the_blank':
                return (
                    <div className="question-block" data-question-id={q.id} key={q.id}>
                        <p className="question-instruction">{q.id.toUpperCase()}. {q.instruction}</p>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                            <label htmlFor={`${q.id}-input`} style={{ fontWeight: 500, marginRight: '0.5rem' }}>{q.blank_label || 'Answer'}:</label>
                            <input type="text" id={`${q.id}-input`} name={q.id} className="text-input" style={{ flexGrow: 1 }} placeholder="Type your answer here..." />
                        </div>
                    </div>
                );

            case 'table_fill_in_blanks':
                return (
                    <div className="question-block" data-question-id={q.id} key={q.id}>
                        <p className="question-instruction">{q.id.toUpperCase()}. {q.instruction}</p>
                        <table className="question-table">
                            <thead>
                                <tr>
                                    {q.headers?.map((header, index) => (
                                        <th key={index} style={{ padding: '0.75rem 0.5rem' }}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {q.rows?.map(row => (
                                    <tr key={row.id}>
                                        <td style={{ padding: '0.75rem 0.5rem' }}>{row.label}</td>
                                        <td style={{ padding: '0.75rem 0.5rem' }}>
                                            <input type="text" name={row.id} className="text-input" placeholder="Enter answer" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case 'matching_single_choice':
                return (
                    <div className="question-block" data-question-id={q.id} key={q.id}>
                        <p className="question-instruction">{q.id.toUpperCase()}. {q.instruction}</p>
                        <table className="question-table">
                            <thead>
                                <tr>
                                    <th style={{ padding: '0.75rem 0.5rem' }}>{q.headers?.[0]}</th>
                                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>{q.headers?.[1]}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {q.rows?.map(row => (
                                    <tr key={row.id}>
                                        <td style={{ padding: '0.75rem 0.5rem' }}>{row.label}</td>
                                        <td style={{ padding: '0.75rem 0.5rem' }}>
                                            <input type="text" name={row.id} className="text-input" placeholder="Enter option (e.g., A)" style={{ width: '80px', textAlign: 'center', margin: 'auto' }} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {q.shared_options && q.shared_options.length > 0 && (
                            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#555' }}>Available Options: {q.shared_options.join(', ')}</p>
                        )}
                    </div>
                );

            case 'table_radio':
                return (
                    <div className="question-block" data-question-id={q.id} key={q.id}>
                        <p className="question-instruction">{q.id.toUpperCase()}. {q.instruction}</p>
                        <table className="question-table">
                            <thead>
                                <tr>
                                    <th style={{ padding: '0.75rem 0.5rem' }}>{q.headers?.[0]}</th>
                                    {q.options?.map((option, index) => (
                                        <th key={index} style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>{option}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {q.rows?.map(row => (
                                    <tr key={row.id}>
                                        <td style={{ padding: '0.75rem 0.5rem' }}>{row.label}</td>
                                        {q.options?.map((option, index) => (
                                            <td key={index} style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                                                <input type="radio" name={row.id} value={option} style={{ accentColor: '#FF3b30' }} />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case 'table_checkbox':
                return (
                    <div className="question-block" data-question-id={q.id} key={q.id}>
                        <p className="question-instruction">{q.id.toUpperCase()}. {q.instruction}</p>
                        <table className="question-table">
                            <thead>
                                <tr>
                                    <th style={{ padding: '0.75rem 0.5rem' }}>{q.headers?.[0]}</th>
                                    {q.options?.map((option, index) => (
                                        <th key={index} style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>{option}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {q.rows?.map(row => (
                                    <tr key={row.id}>
                                        <td style={{ padding: '0.75rem 0.5rem' }}>{row.label}</td>
                                        {q.options?.map((option, index) => (
                                            <td key={index} style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                                                <input type="checkbox" name={row.id} value={option} style={{ accentColor: '#FF3b30' }} />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            default:
                return <p key={q.id} style={{ color: '#ef4444' }}>Unsupported question type: {q.type}</p>;
        }
    };

    // Collect user answers from the form
    const collectUserAnswers = () => {
        const newAnswers: UserAnswers = {};
        if (!formRef.current) return;

        generatedQuestions.forEach(q => {
            if (q.type === 'multiple_choice_single') {
                const selected = formRef.current?.querySelector<HTMLInputElement>(`input[name="${q.id}"]:checked`);
                newAnswers[q.id] = selected ? selected.value : '';
            } else if (q.type === 'checkbox_multiple') {
                const selected = Array.from(formRef.current?.querySelectorAll<HTMLInputElement>(`input[name="${q.id}"]:checked`) || []).map(input => input.value);
                newAnswers[q.id] = selected;
            } else if (q.type === 'fill_in_the_blank') {
                const input = formRef.current?.querySelector<HTMLInputElement>(`input[name="${q.id}"]`);
                newAnswers[q.id] = input ? input.value.trim() : '';
            } else if (q.type === 'table_fill_in_blanks' || q.type === 'matching_single_choice') {
                q.rows?.forEach(row => {
                    const input = formRef.current?.querySelector<HTMLInputElement>(`input[name="${row.id}"]`);
                    newAnswers[row.id] = input ? input.value.trim() : '';
                });
            } else if (q.type === 'table_radio') {
                q.rows?.forEach(row => {
                    const selected = formRef.current?.querySelector<HTMLInputElement>(`input[name="${row.id}"]:checked`);
                    newAnswers[row.id] = selected ? selected.value : '';
                });
            } else if (q.type === 'table_checkbox') {
                q.rows?.forEach(row => {
                    const selected = Array.from(formRef.current?.querySelectorAll<HTMLInputElement>(`input[name="${row.id}"]:checked`) || []).map(input => input.value);
                    newAnswers[row.id] = selected;
                });
            }
        });
        setUserAnswers(newAnswers);
    };

    // Combined function to collect answers and then mark them
    const handleSubmitAnswers = () => {
        collectUserAnswers();
        // Marking happens after userAnswers state is updated, so we need to call it directly
        markAnswersAI();
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
                    <h3 style={{ color: '#FF3b30' }}>Your Test Results</h3>
                    <p style={{ textAlign: 'center', fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>Overall Score: <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{markingResults.overall_score_percentage}%</span></p>
                    <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '0.5rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
                        <h4 style={{ fontWeight: 700, color: '#1e40af', marginBottom: '0.5rem' }}>Overall Feedback:</h4>
                        <p style={{ color: '#1d4ed8' }}>{markingResults.overall_feedback}</p>
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                        {markingResults.results.map(result => (
                            <div key={result.question_id} className={`result-item ${result.correct ? 'correct' : 'incorrect'}`} style={{ marginBottom: '1rem' }}>
                                <h4 style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.25rem' }}>Question {result.question_id.toUpperCase()}</h4>
                                <p><strong>Your Answer:</strong> {Array.isArray(result.user_answer) ? result.user_answer.join(', ') : result.user_answer || 'N/A'}</p>
                                <p><strong>Correct:</strong> <span style={{ fontWeight: 700 }}>{result.correct ? 'Yes' : 'No'}</span></p>
                                <p><strong>Feedback:</strong> {result.feedback}</p>
                                <p><strong>Score:</strong> <span className="result-score">{result.score}</span></p>
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
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1e40af' }}>Reading Passage:</h3>
                        <p id="readingPassage" style={{ color: '#1f2937', fontWeight: 500, fontSize: '1.125rem' }}>{generatedPassage}</p>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#1f2937' }}>Questions:</h3>
                    <form id="readingQuestionsForm" ref={formRef}>
                        {generatedQuestions.map(q => renderQuestion(q))}
                    </form>
                </>
            );
        }

        // Default start screen
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Welcome to your IGCSE Chinese Reading Practice!</h2>
                <p style={{ color: '#374151', marginBottom: '1.5rem' }}>Click 'Start Test' to generate a new reading passage and questions.</p>
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
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* Subtle shadow */
                }

                /* Header Styling */
                .tool-header {
                    background-color: #FF3b30; /* Primary color */
                    color: white;
                    padding: 1rem;
                    text-align: center;
                    font-weight: 700; /* Equivalent to font-bold */
                    font-size: 1.5rem; /* Equivalent to text-2xl */
            
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
                    border-bottom-left-radius: 0.75rem; /* Match container border-radius */
                    border-bottom-right-radius: 0.75rem; /* Match container border-radius */
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
                    padding: 0.5rem; /* Adjusted padding for better fit */
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    width: 100%; /* For text inputs */
                    box-sizing: border-box; /* Ensure padding doesn't add to width */
                }

                .question-table input[type="radio"],
                .question-table input[type="checkbox"] {
                    width: auto; /* Reset width for radio/checkbox */
                    display: inline-block; /* Allow natural sizing */
                    margin: auto; /* Center radio/checkbox */
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
                IGCSE Chinese Reading
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
                    <button onClick={handleSubmitAnswers} className="btn-primary">
                        Submit Answers
                    </button>
                )}
                {!isTestActive && (markingResults || !loadingMessage) && (
                    <button onClick={() => {
                        setGeneratedPassage('');
                        setGeneratedQuestions([]);
                        setCorrectAnswers({});
                        setUserAnswers({});
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
