"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { marked } from 'marked';

// Add type for chatHistory
interface ChatMessage { sender: string; text: string; timestamp: number; }
interface ChatSession { id: number; subject: string; messages: ChatMessage[]; }
type ChatHistory = { [subject: string]: ChatSession[] };

const App = () => {
    // State Management
    const [currentSubject, setCurrentSubject] = useState<string | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatHistory>({}); // { subject: [{ id: timestamp, messages: [{sender, text, timestamp}] }] }
    const [activeChat, setActiveChat] = useState<ChatSession | null>(null); // The currently viewed chat session
    const [quizModalOpen, setQuizModalOpen] = useState(false);
    const [revisionModalOpen, setRevisionModalOpen] = useState(false);
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [messageInput, setMessageInput] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [isStatusError, setIsStatusError] = useState(false);
    const [isSending, setIsSending] = useState(false); // To disable input while AI is typing
    const [currentChatId, setCurrentChatId] = useState(null); // Server-side LLM session ID
    const [showLoadingScreen, setShowLoadingScreen] = useState(true);
    const [showConfirmClearModal, setShowConfirmClearModal] = useState(false);
    const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(false);


    // Refs for DOM elements
    const chatContainerRef = useRef(null);
    const messageInputRef = useRef(null);
    const sidebarMenuRef = useRef(null);
    const recognitionRef = useRef(null); // For webkitSpeechRecognition

    // --- Local Storage Management ---
    // Load chat history from localStorage on initial mount
    useEffect(() => {
        // Ensure localStorage is available before accessing it
        if (typeof window !== 'undefined' && window.localStorage) {
            const savedHistory = localStorage.getItem('eduai-chat-history');
            if (savedHistory) {
                try {
                    setChatHistory(JSON.parse(savedHistory));
                } catch (e) {
                    console.error('Error parsing chat history:', e);
                    setChatHistory({});
                }
            }
        }

        // Hide loading screen after a delay
        const timer = setTimeout(() => {
            setShowLoadingScreen(false);
            // Set default subject and load its history or welcome message
            const defaultSubject = 'biology';
            changeSubject(defaultSubject);
            // Start new chat session with the backend LLM (conceptual)
            startNewChat();
        }, 2000);

        return () => clearTimeout(timer); // Cleanup timer
    }, []);

    // Save chat history to localStorage whenever it changes
    useEffect(() => {
        // Ensure localStorage is available before accessing it
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('eduai-chat-history', JSON.stringify(chatHistory));
        }
    }, [chatHistory]);

    // --- Dynamically load Font Awesome CSS ---
    useEffect(() => {
        // Ensure document is available before manipulating it
        if (typeof document !== 'undefined') {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            document.head.appendChild(link);

            return () => {
                // Cleanup: remove the link when the component unmounts
                if (document.head.contains(link)) {
                    document.head.removeChild(link);
                }
            };
        }
    }, []); // Empty dependency array ensures this runs once on mount

    // --- Speech Recognition ---
    const initSpeechRecognition = useCallback(() => {
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            setSpeechRecognitionSupported(true);
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;

            recognition.onstart = () => {
                setIsRecording(true);
                setMessageInput(''); // Clear input when starting to listen
                if (messageInputRef.current) {
                    messageInputRef.current.placeholder = "Listening...";
                }
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setMessageInput(transcript);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                stopRecording();
            };

            recognition.onend = () => {
                stopRecording();
            };
            recognitionRef.current = recognition;
        } else {
            setSpeechRecognitionSupported(false);
        }
    }, []);

    useEffect(() => {
        initSpeechRecognition();
    }, [initSpeechRecognition]);

    const startRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.start();
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsRecording(false);
            if (messageInputRef.current) {
                messageInputRef.current.placeholder = "Ask anything about your subject...";
            }
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    // --- API Interaction (Conceptual) ---
    const startNewChat = useCallback(async () => {
        try {
            const response = await fetch('https://server-ef04.onrender.com/api/chat/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success) {
                setCurrentChatId(data.chatId); // Store server-side chat ID
                updateStatus('Connected to chat session');
            } else {
                throw new Error(data.error || 'Failed to start chat session');
            }
        } catch (error) {
            updateStatus('Error: ' + error.message, true);
        }
    }, []);

    const sendMessage = async (message: string) => {
        if (!currentChatId) {
            updateStatus('No active chat session. Please wait for initialization.', true);
            return;
        }

        if (!currentSubject || typeof currentSubject !== 'string') return;
        const subjectKey = currentSubject;
        let currentSubjectHistory = chatHistory[subjectKey] || [];
        let currentActiveChat = activeChat as ChatSession | null;

        if (!currentActiveChat || currentActiveChat.subject !== subjectKey) {
            // If no active chat or subject changed, create a new local chat session
            currentActiveChat = {
                id: Date.now(), // Unique ID for this local chat session
                subject: subjectKey,
                messages: []
            };
            // Add new chat to the beginning of the subject's history list
            currentSubjectHistory = [currentActiveChat, ...currentSubjectHistory];
        }

        const newUserMessage = { sender: 'user', text: message, timestamp: Date.now() };
        currentActiveChat.messages.push(newUserMessage);

        setActiveChat(currentActiveChat); // Update active chat to include user message
        setChatHistory(prevHistory => ({
            ...prevHistory,
            [subjectKey]: currentSubjectHistory
        }));

        setIsSending(true); // Disable input while AI is typing

        try {
            const response = await fetch('https://server-ef04.onrender.com/api/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chatId: currentChatId, // Use server-side chat ID for API
                    message: message
                })
            });

            const data = await response.json();

            if (data.success) {
                // Save AI response to local history
                const newAiMessage = { sender: 'ai', text: data.response, timestamp: Date.now() };
                currentActiveChat.messages.push(newAiMessage);

                setActiveChat({ ...currentActiveChat }); // Force update to trigger re-render
                setChatHistory(prevHistory => ({
                    ...prevHistory,
                    [subjectKey]: currentSubjectHistory
                }));
            } else {
                throw new Error(data.error || 'Failed to get response');
            }
        } catch (error) {
            console.error("Error sending message:", error);
            updateStatus('Error: ' + error.message, true);
            // Append an error message from AI if the call fails
            const errorAiMessage = { sender: 'ai', text: "Sorry, I encountered an error. Please try again.", timestamp: Date.now() };
            currentActiveChat.messages.push(errorAiMessage);
            setActiveChat({ ...currentActiveChat });
            setChatHistory(prevHistory => ({
                ...prevHistory,
                [subjectKey]: currentSubjectHistory
            }));
        } finally {
            setIsSending(false); // Re-enable input
            if (chatContainerRef.current && 'scrollTop' in chatContainerRef.current && 'scrollHeight' in chatContainerRef.current) {
                (chatContainerRef.current as HTMLElement).scrollTop = (chatContainerRef.current as HTMLElement).scrollHeight;
            }
        }
    };

    // --- UI Helper Functions ---
    const copyToClipboard = (text: string, buttonElement: HTMLElement) => {
        // Ensure document is available before manipulating it
        if (typeof document !== 'undefined') {
            try {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);

                const successMessage = document.createElement('div');
                successMessage.classList.add('copy-success-message');
                successMessage.textContent = 'Copied!';
                if (buttonElement.parentNode) {
                    buttonElement.parentNode.appendChild(successMessage);
                }
                successMessage.classList.add('visible');

                setTimeout(() => {
                    successMessage.classList.remove('visible');
                    successMessage.addEventListener('transitionend', () => {
                        if (successMessage.parentNode) {
                            successMessage.parentNode.removeChild(successMessage);
                        }
                    }, { once: true });
                }, 1500);
            } catch (err) {
                console.error('Failed to copy text: ', err);
                updateStatus('Failed to copy text.', true);
            }
        }
    };

    const MessageBubble = ({ message, sender }: { message: string; sender: string }) => {
        const contentRef = useRef<HTMLDivElement>(null);
        const handleCopy = () => {
            if (contentRef.current) {
                const copyButton = (contentRef.current as HTMLElement).closest('.message')?.querySelector('.copy-button') as HTMLElement | null;
                if (copyButton) {
                    copyToClipboard((contentRef.current as HTMLElement).textContent || '', copyButton);
                }
            }
        };
        return (
            <div className={`message ${sender}-message p-3 rounded-lg break-words mb-2 relative flex flex-col`}>
                <div className="message-content" ref={contentRef} dangerouslySetInnerHTML={{ __html: sender === 'ai' ? marked.parse(message) : message }}></div>
                <div
                    className={`copy-button-container absolute top-2 ${sender === 'ai' ? 'right-2 justify-end' : 'left-2 justify-start'} flex`}
                    style={{ zIndex: 2 }}
                >
                    <button onClick={handleCopy} className={`copy-button text-xs px-2 py-1 rounded-md ${sender === 'ai' ? 'ai-message' : ''}`}> <i className="fas fa-copy"></i> Copy </button>
                </div>
            </div>
        );
    };

    const updateStatus = (message, isError = false) => {
        setStatusMessage(message);
        setIsStatusError(isError);
        setTimeout(() => {
            setStatusMessage('');
        }, 3000);
    };

    const getSubjectDisplayName = (subject: string) => {
        const subjectMap: { [key: string]: string } = {
            'biology': 'Biology (Edexcel IAL)',
            'chemistry': 'Chemistry (Edexcel IAL)',
            'physics': 'Physics (Edexcel IAL)',
            'math': 'Mathematics (Edexcel IAL)',
            'chinese': 'Chinese (Edexcel IGCSE)',
            'ielts-speaking': 'IELTS Speaking',
            'ielts-writing': 'IELTS Writing',
            'ielts-reading': 'IELTS Reading',
            'ielts-listening': 'IELTS Listening',
            'General': 'General',
            'general': 'General',
        };
        return subjectMap[subject] || subject;
    };

    const getWelcomeMessage = (subject: string) => {
        const welcomeMessages: { [key: string]: string } = {
            'biology': "👋 Welcome to Biology! I'm your Edexcel IAL Biology tutor. I can help with topics like biological molecules, cells, genetics, ecology, and more. What would you like to learn about today?",
            'chemistry': "👋 Welcome to Chemistry! I'm your Edexcel IAL Chemistry tutor. I can help with topics like atomic structure, bonding, energetics, organic chemistry, and more. What would you like to learn about today?",
            'physics': "👋 Welcome to Physics! I'm your Edexcel IAL Physics tutor. I can help with topics like mechanics, electricity, waves, fields, nuclear physics, and more. What would you like to learn about today?",
            'math': "👋 Welcome to Mathematics! I'm your Edexcel IAL Mathematics tutor. I can help with topics like pure mathematics, statistics, mechanics, and more. What would you like to learn about today?",
            'chinese': "👋 Welcome to Chinese! I'm your Edexcel IGCSE Chinese tutor. I can help with topics like pure reading, writing, translating, Chinese topics and more. What would you like to learn about today?",
            'ielts-speaking': "👋 Welcome to IELTS Speaking! I can help you prepare for your speaking test with practice questions, vocabulary, strategies, and feedback. How would you like to practice today?",
            'ielts-writing': "👋 Welcome to IELTS Writing! I can help you improve your writing skills for both Task 1 and Task 2, including essay structure, vocabulary, grammar, and more. What aspect of IELTS writing would you like help with?",
            'ielts-reading': "👋 Welcome to IELTS Reading! I can help you with reading strategies, practice questions, vocabulary building, and more to improve your reading skills. What aspect of IELTS reading would you like to work on?",
            'ielts-listening': "👋 Welcome to IELTS Listening! I can help you with listening strategies, practice questions, note-taking skills, and more. How would you like to improve your listening skills today?",
            'General': "👋 Welcome! How can I help you today?",
            'general': "👋 Welcome! How can I help you today?",
        };
        return welcomeMessages[subject] || "👋 Welcome! How can I help you today?";
    };

    const changeSubject = (subject: string) => {
        setCurrentSubject(subject);
        let chatForSubject: ChatSession;
        if (chatHistory[subject] && chatHistory[subject].length > 0) {
            chatForSubject = chatHistory[subject][0];
        } else {
            chatForSubject = {
                id: Date.now(),
                subject: subject,
                messages: [{ sender: 'ai', text: getWelcomeMessage(subject), timestamp: Date.now() }]
            };
            setChatHistory(prev => ({
                ...prev,
                [subject]: [chatForSubject, ...(prev[subject] || []) as ChatSession[]]
            }));
        }
        setActiveChat(chatForSubject);
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            toggleSidebar(false as null | boolean);
        }
    };

    const toggleSidebar = (forceState: boolean | null | undefined = null) => {
        if (typeof window !== 'undefined' && window.innerWidth < 768 && sidebarMenuRef.current) {
            const isOpen = sidebarMenuRef.current.classList.contains('translate-x-0');
            const newState = forceState !== null && forceState !== undefined ? forceState : !isOpen;
            if (newState) {
                sidebarMenuRef.current.classList.remove('-translate-x-full');
                sidebarMenuRef.current.classList.add('translate-x-0');
            } else {
                sidebarMenuRef.current.classList.remove('translate-x-0');
                sidebarMenuRef.current.classList.add('-translate-x-full');
            }
        }
    };

    const loadChat = (subject: string, chatId: number) => {
        if (currentSubject !== subject) {
            setCurrentSubject(subject);
        }

        const chat = chatHistory[subject]?.find(c => c.id === chatId);
        if (chat) {
            setActiveChat(chat);
            setHistoryModalOpen(false); // Close modal after loading chat
        } else {
            console.warn(`Chat with ID ${chatId} not found for subject ${subject}.`);
        }
    };

    const clearHistory = () => {
        setShowConfirmClearModal(true);
    };

    const handleConfirmClear = (confirm: boolean) => {
        setShowConfirmClearModal(false);
        if (confirm) {
            setChatHistory({});
            setActiveChat(null);
            // Re-initialize current subject with welcome message after clearing all history
            const defaultSubject = currentSubject || 'biology'; // Keep current subject or default
            changeSubject(defaultSubject);
        }
    };

    // --- Quiz Generation ---
    const generateQuiz = async (numQuestions: string, difficulty: string, topic: string) => {
        // Ensure document is available before manipulating it
        if (typeof document === 'undefined') return;

        const quizContentEl = document.getElementById('quiz-content');
        if (quizContentEl) {
            quizContentEl.innerHTML = `
                <div class="text-center py-8">
                    <div class="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <i class="fas fa-spinner fa-spin text-2xl text-primary-500"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Generating Quiz</h3>
                    <p class="text-gray-600">Please wait while we create your quiz...</p>
                </div>
            `;
        }

        let prompt = `Generate a ${numQuestions}-question ${difficulty} difficulty quiz about ${getSubjectDisplayName(currentSubject)}`;
        if (topic) {
            prompt += ` focusing on ${topic}`;
        }
        prompt += `. Format: numbered questions with multiple choice options (A, B, C, D) and correct answer marked. Include explanation for each answer.`;

        try {
            const response = await fetch('https://server-ef04.onrender.com/api/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chatId: currentChatId,
                    message: prompt
                })
            });
            const data = await response.json();

            if (data.success) {
                displayQuiz(data.response, numQuestions, difficulty, topic);
            } else {
                throw new Error(data.error || 'Failed to generate quiz');
            }
        } catch (error) {
            if (quizContentEl) {
                quizContentEl.innerHTML = `
                    <div class="text-center py-8">
                        <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-exclamation-triangle text-2xl text-red-500"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">Error</h3>
                        <p class="text-gray-600">${error.message}</p>
                        <button id="retry-quiz-btn" class="mt-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition">
                            Try Again
                        </button>
                    </div>
                `;
                if (document.getElementById('retry-quiz-btn')) {
                    document.getElementById('retry-quiz-btn').onclick = () => {
                        setQuizModalOpen(false);
                        setTimeout(() => setQuizModalOpen(true), 300);
                    };
                }
            }
        }
    };

    const displayQuiz = (quizText: string, numQuestions: string, difficulty: string, topic: string) => {
        // Ensure document is available before manipulating it
        if (typeof document === 'undefined') return;

        const quizContentEl = document.getElementById('quiz-content');
        if (quizContentEl) {
            quizContentEl.innerHTML = `
                <div class="p-4">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-semibold text-gray-800">Quiz: ${getSubjectDisplayName(currentSubject)}</h3>
                        <div class="text-sm text-gray-500">${difficulty} · ${numQuestions} questions</div>
                    </div>
                    
                    <div class="prose prose-sm md:prose-base max-w-none">
                        ${marked.parse(quizText)}
                    </div>
                    
                    <div class="mt-8 flex justify-between">
                        <button id="new-quiz-btn" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition text-gray-800">
                            New Quiz
                        </button>
                        <button id="save-quiz-btn" class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition">
                            Save to Chat
                        </button>
                    </div>
                </div>
            `;
            if (document.getElementById('new-quiz-btn')) {
                document.getElementById('new-quiz-btn').onclick = () => {
                    // Reset quiz form and show it again
                    if (document.getElementById('quiz-num-questions')) document.getElementById('quiz-num-questions').value = '10';
                    if (document.getElementById('quiz-difficulty')) document.getElementById('quiz-difficulty').value = 'medium';
                    if (document.getElementById('quiz-topic')) document.getElementById('quiz-topic').value = '';
                    setQuizModalOpen(false);
                    setTimeout(() => setQuizModalOpen(true), 300);
                };
            }
            if (document.getElementById('save-quiz-btn')) {
                document.getElementById('save-quiz-btn').onclick = () => {
                    const userPrompt = `Generate a ${numQuestions}-question ${difficulty} difficulty quiz${topic ? ` focusing on ${topic}` : ''}.`;
                    // Add to history
                    const subjectKey = typeof currentSubject === 'string' ? currentSubject : '';
                    let currentSubjectHistory = chatHistory[subjectKey] || [];
                    let currentActiveChat = activeChat;

                    if (!currentActiveChat || currentActiveChat.subject !== subjectKey) {
                        currentActiveChat = {
                            id: Date.now(),
                            subject: subjectKey,
                            messages: []
                        };
                        currentSubjectHistory = [currentActiveChat, ...currentSubjectHistory];
                    }

                    currentActiveChat.messages.push({ sender: 'user', text: userPrompt, timestamp: Date.now() });
                    currentActiveChat.messages.push({ sender: 'ai', text: quizText, timestamp: Date.now() });

                    setActiveChat(currentActiveChat);
                    setChatHistory(prevHistory => ({
                        ...prevHistory,
                        [subjectKey]: currentSubjectHistory
                    }));

                    setQuizModalOpen(false);
                };
            }
        }
    };

    // --- Revision Plan Generation ---
    const generateRevisionPlan = async (examDate: string, studyHours: string, focusAreas: string) => {
        // Ensure document is available before manipulating it
        if (typeof document === 'undefined') return;

        if (!examDate) {
            updateStatus('Please select an exam date to create a revision plan.', true);
            return;
        }

        const revisionContentEl = document.getElementById('revision-content');
        if (revisionContentEl) {
            revisionContentEl.innerHTML = `
                <div class="text-center py-8">
                    <div class="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <i class="fas fa-spinner fa-spin text-2xl text-purple-500"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Creating Your Plan</h3>
                    <p class="text-gray-600">Please wait while we design your personalized revision plan...</p>
                </div>
            `;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const examDay = new Date(examDate);
        examDay.setHours(0, 0, 0, 0);

        const diffTime = Math.abs(examDay - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const weeksUntilExam = Math.max(1, Math.ceil(diffDays / 7));

        let prompt = `Create a ${weeksUntilExam}-week revision plan for ${getSubjectDisplayName(currentSubject)} with approximately ${studyHours} study hours per week`;
        if (focusAreas) {
            prompt += `, focusing on these areas: ${focusAreas}`;
        }
        prompt += `. The exam is on ${examDate}. Include specific topics to study each week, recommended resources, and practice questions. Format as a week-by-week schedule.`;

        try {
            const response = await fetch('https://server-ef04.onrender.com/api/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chatId: currentChatId,
                    message: prompt
                })
            });
            const data = await response.json();

            if (data.success) {
                displayRevisionPlan(data.response, examDate, studyHours, focusAreas);
            } else {
                throw new Error(data.error || 'Failed to generate revision plan');
            }
        } catch (error) {
            if (revisionContentEl) {
                revisionContentEl.innerHTML = `
                    <div class="text-center py-8">
                        <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-exclamation-triangle text-2xl text-red-500"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">Error</h3>
                        <p class="text-gray-600">${error.message}</p>
                        <button id="retry-plan-btn" class="mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition">
                            Try Again
                        </button>
                    </div>
                `;
                if (document.getElementById('retry-plan-btn')) {
                    document.getElementById('retry-plan-btn').onclick = () => {
                        setRevisionModalOpen(false);
                        setTimeout(() => setRevisionModalOpen(true), 300);
                    };
                }
            }
        }
    };

    const displayRevisionPlan = (planText: string, examDate: string, studyHours: string, focusAreas: string) => {
        // Ensure document is available before manipulating it
        if (typeof document === 'undefined') return;

        const revisionContentEl = document.getElementById('revision-content');
        if (revisionContentEl) {
            revisionContentEl.innerHTML = `
                <div class="p-4">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-semibold text-gray-800">Revision Plan: ${getSubjectDisplayName(currentSubject)}</h3>
                        <div class="text-sm text-gray-500">Exam date: ${new Date(examDate).toLocaleDateString()}</div>
                    </div>
                    
                    <div class="prose prose-sm md:prose-base max-w-none">
                        ${marked.parse(planText)}
                    </div>
                    
                    <div class="mt-8 flex justify-between">
                        <button id="new-plan-btn" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition text-gray-800">
                            New Plan
                        </button>
                        <button id="save-plan-btn" class="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition">
                            Save to Chat
                        </button>
                    </div>
                </div>
            `;
            if (document.getElementById('new-plan-btn')) {
                document.getElementById('new-plan-btn').onclick = () => {
                    const defaultDate = new Date();
                    defaultDate.setDate(defaultDate.getDate() + 30);
                    if (document.getElementById('revision-exam-date')) document.getElementById('revision-exam-date').valueAsDate = defaultDate;
                    if (document.getElementById('revision-hours')) document.getElementById('revision-hours').value = '10';
                    if (document.getElementById('revision-focus')) document.getElementById('revision-focus').value = '';
                    setRevisionModalOpen(false);
                    setTimeout(() => setRevisionModalOpen(true), 300);
                };
            }
            if (document.getElementById('save-plan-btn')) {
                document.getElementById('save-plan-btn').onclick = () => {
                    const userPrompt = `Generate a revision plan for ${getSubjectDisplayName(currentSubject)} (Exam: ${new Date(examDate).toLocaleDateString()}, ${studyHours} hours/week${focusAreas ? `, Focus: ${focusAreas}` : ''})`;

                    const subjectKey = typeof currentSubject === 'string' ? currentSubject : '';
                    let currentSubjectHistory = chatHistory[subjectKey] || [];
                    let currentActiveChat = activeChat;

                    if (!currentActiveChat || currentActiveChat.subject !== subjectKey) {
                        currentActiveChat = {
                            id: Date.now(),
                            subject: subjectKey,
                            messages: []
                        };
                        currentSubjectHistory = [currentActiveChat, ...currentSubjectHistory];
                    }

                    currentActiveChat.messages.push({ sender: 'user', text: userPrompt, timestamp: Date.now() });
                    currentActiveChat.messages.push({ sender: 'ai', text: planText, timestamp: Date.now() });

                    setActiveChat(currentActiveChat);
                    setChatHistory(prevHistory => ({
                        ...prevHistory,
                        [subjectKey]: currentSubjectHistory
                    }));

                    setRevisionModalOpen(false);
                };
            }
        }
    };

    // Auto-expanding textarea logic
    useEffect(() => {
        const textarea = messageInputRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 300) + 'px';
            const container = textarea.parentElement;
            if (container) {
                container.style.height = textarea.style.height;
            }
        }
    }, [messageInput]);

    // Scroll to bottom of chat container when messages update
    useEffect(() => {
        if (chatContainerRef.current && 'scrollTop' in chatContainerRef.current && 'scrollHeight' in chatContainerRef.current) {
            (chatContainerRef.current as HTMLElement).scrollTop = (chatContainerRef.current as HTMLElement).scrollHeight;
        }
    }, [activeChat]);

    return (
        <div className="flex h-full items-center justify-center p-0 transition-colors duration-300">
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                
                :root {
                    --primary-color: #1E90FF;
                    --primary-light: #60a5fa;
                    --primary-dark: #0369a1;
                    --bg-blur: rgba(255, 255, 255, 0.8);
                    --card-bg: rgba(255, 255, 255, 0.7);
                    --card-border: rgba(255, 255, 255, 0.4);
                    --shadow-color: rgba(0, 0, 0, 0.05);
                    --text-primary: #1a202c;
                    --text-secondary: #4a5568;
                }

                body {
                    font-family: 'Inter', sans-serif;
                    margin: 0;
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #f0f0f0;
                }

                #eduai-container {
                    width: 90vw;
                    max-width: 1000px;
                    height: 90vh;
                    margin: 0 auto;
                }

                .blur-container {
                    backdrop-filter: blur(15px);
                    -webkit-backdrop-filter: blur(15px);
                }

                .glass-card {
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    box-shadow: 0 4px 6px var(--shadow-color);
                    transition: all 0.3s ease;
                }

                .glass-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px -3px var(--shadow-color);
                }

                ::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }

                ::-webkit-scrollbar-track {
                    background: transparent;
                }

                ::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 3px;
                }

                .user-message {
                    animation: slideIn 0.3s ease-out;
                    align-self: flex-end;
                    background-color: #1E90FF;
                    color: white;
                    max-width: 80%;
                    margin-left: auto;
                    width: fit-content;
                }

                .ai-message {
                    animation: slideIn 0.3s ease-out;
                    align-self: flex-start;
                    background-color: var(--card-bg);
                    color: var(--text-primary);
                    max-width: 80%;
                    margin-right: auto;
                    width: fit-content;
                }

                .typing-indicator {
                    display: flex;
                    align-items: center;
                    padding: 0.5rem 1rem;
                    align-self: flex-start;
                    margin-right: auto;
                }

                .typing-indicator span {
                    height: 8px;
                    width: 8px;
                    background-color: var(--primary-color);
                    border-radius: 50%;
                    display: inline-block;
                    margin-right: 3px;
                    opacity: 0.7;
                }

                .typing-indicator span:nth-child(1) {
                    animation: pulse 1s infinite;
                }

                .typing-indicator span:nth-child(2) {
                    animation: pulse 1s infinite 0.2s;
                }

                .typing-indicator span:nth-child(3) {
                    animation: pulse 1s infinite 0.4s;
                }

                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 0.7;
                    }
                    50% {
                        transform: scale(1.2);
                        opacity: 1;
                    }
                }
                
                .message-content {
                    width: 100%;
                    overflow-wrap: break-word;
                }
                
                .message-content p {
                    margin-bottom: 0.5rem;
                }
                
                .message-content ul, .message-content ol {
                    margin-left: 1.5rem;
                    margin-bottom: 0.5rem;
                }
                
                .message-content ul {
                    list-style-type: disc;
                }
                
                .message-content ol {
                    list-style-type: decimal;
                }
                
                .message-content code {
                    font-family: monospace;
                    background-color: rgba(0, 0, 0, 0.1);
                    padding: 0.1rem 0.2rem;
                    border-radius: 3px;
                    color: var(--text-primary);
                }
                
                .message-content pre {
                    background-color: rgba(0, 0, 0, 0.1);
                    padding: 0.5rem;
                    border-radius: 5px;
                    margin-bottom: 0.5rem;
                    overflow-x: auto;
                }
                
                .message-content a {
                    color: #2563eb;
                    text-decoration: underline;
                }
                
                .user-message .message-content a,
                .user-message .message-content code,
                .user-message .message-content pre {
                    color: white;
                    background-color: rgba(255, 255, 255, 0.2);
                }

                h1,h2,h3,h4,h5,h6 {
                    margin-bottom: 0px; padding-bottom: 0px;
                }

                textarea, select {
                    border: none;
                }

                .textarea-container {
                    min-height: 40px;
                    height: 40px;
                    display: flex;
                    align-items: flex-end;
                }

                #message-input {
                    min-height: 40px;
                    max-height: 300px;
                    padding: 5px 15px;
                    border-radius: 20px;
                    background-color: #f5f5f5;
                    transition: background 0.2s;
                    resize: none;
                    line-height: 30px;
                    box-sizing: border-box;
                }
                #message-input:disabled {
                    background-color: #f5f5f5;
                    color: #b0b0b0;
                    opacity: 1;
                }
                .flex-grow.relative.textarea-container {
                    min-height: 40px;
                    height: 40px;
                }
                textarea:focus {
                    border-color: #1E90ff;
                }
                button:hover {
                    color: none;
                }

                .copy-button-container {
                    position: absolute;
                    top: 0.5rem;
                    z-index: 2;
                }
                .message.ai-message .copy-button-container {
                    right: 0.5rem;
                    left: auto;
                    justify-content: flex-end;
                }
                .message.user-message .copy-button-container {
                    left: 0.5rem;
                    right: auto;
                    justify-content: flex-start;
                }

                .copy-button {
                    background-color: rgba(0, 0, 0, 0.1);
                    color: rgba(255, 255, 255, 0.8);
                    border: none;
                    border-radius: 0.375rem;
                    padding: 0.25rem 0.5rem;
                    font-size: 0.75rem;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                    display: flex;
                    align-items: center;
                }

                .ai-message .copy-button {
                    background-color: rgba(0, 0, 0, 0.05);
                    color: var(--text-secondary);
                }

                .copy-button:hover {
                    background-color: rgba(0, 0, 0, 0.2);
                }

                .ai-message .copy-button:hover {
                    background-color: rgba(0, 0, 0, 0.1);
                }

                .copy-button i {
                    margin-right: 0.25rem;
                }

                .copy-success-message {
                    position: absolute;
                    right: 0;
                    top: -2rem;
                    background-color: #4CAF50;
                    color: white;
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.375rem;
                    font-size: 0.75rem;
                    opacity: 0;
                    transition: opacity 0.3s ease-out;
                    pointer-events: none;
                }

                .copy-success-message.visible {
                    opacity: 1;
                }

                #sidebar-menu {
                    will-change: transform;
                }
                `}
            </style>
            <div id="eduai-container" className="w-full h-[90vh] rounded-xl overflow-hidden shadow-xl border m-0 border-gray-200 relative transition-all duration-300 ease-in-out flex flex-col md:flex-row">
                {/* Loading Screen */}
                {showLoadingScreen && (
                    <div id="loading-screen" className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 z-50 animate-fade-in">
                        <div className="w-24 h-24 mb-8 relative">
                            <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-transparent animate-spin"></div>
                            <div className="absolute inset-2 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                                <i className="fas fa-graduation-cap text-white text-3xl"></i>
                            </div>
                        </div>
                        <h1 className="text-white text-3xl font-bold mb-2 animate-pulse-slow">AI Teacher Pro</h1>
                        <p className="text-blue-100">Loading your educational experience...</p>
                    </div>
                )}

                {/* Sidebar Menu */}
                <div ref={sidebarMenuRef} id="sidebar-menu" className="absolute left-0 top-0 h-full w-64 bg-white/50 blur-container transform -translate-x-full z-40 border-r border-gray-200 overflow-y-auto transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:bg-white md:shadow-md md:z-auto md:flex-shrink-0 md:flex-grow-0 md:rounded-l-xl">
                    <div className="p-4 h-[60px] border-b border-b-[#00000020]">
                        <h3 className="font-bold text-xl text-primary-500" style={{ marginBottom: 0, paddingBottom: 0 }}>AI Teacher <span className="text-gray-300 font-medium">Pro</span></h3>
                    </div>
                    <div className="py-4">
                        {/* General subject on top */}
                        <button
                            onClick={() => changeSubject('General')}
                            className={`