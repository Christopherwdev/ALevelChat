'use client'; // Add this directive at the very top

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { marked } from 'marked'; // Assuming marked is available globally or imported

// Define types for chat messages and sessions
interface Message {
    id: string; // Added unique ID for each message
    sender: 'user' | 'ai';
    text: string;
    timestamp: number;
}

interface ChatSession {
    id: number;
    subject: string;
    messages: Message[];
}

interface ChatHistory {
    [subject: string]: ChatSession[];
}

// Global type for SpeechRecognition
declare global {
    interface Window {
        webkitSpeechRecognition: any;
    }
}

const App: React.FC = () => {
    // State Management
    const [currentSubject, setCurrentSubject] = useState<string | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatHistory>({});
    const [activeChat, setActiveChat] = useState<ChatSession | null>(null);
    const [messageInput, setMessageInput] = useState<string>('');
    const [statusMessage, setStatusMessage] = useState<string>('');
    const [isErrorStatus, setIsErrorStatus] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [isQuizModalOpen, setIsQuizModalOpen] = useState<boolean>(false);
    const [isRevisionModalOpen, setIsRevisionModalIsOpen] = useState<boolean>(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [quizNumQuestions, setQuizNumQuestions] = useState<string>('10');
    const [quizDifficulty, setQuizDifficulty] = useState<string>('medium');
    const [quizTopic, setQuizTopic] = useState<string>('');
    const [revisionExamDate, setRevisionExamDate] = useState<string>('');
    const [revisionHours, setRevisionHours] = useState<string>('10');
    const [revisionFocus, setRevisionFocus] = useState<string>('');
    const [quizContentHtml, setQuizContentHtml] = useState<string>('');
    const [revisionContentHtml, setRevisionContentHtml] = useState<string>('');
    const [currentChatId, setCurrentChatId] = useState<string | null>(null); // Server-side chat ID

    // Refs for DOM elements
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const messageInputRef = useRef<HTMLTextAreaElement>(null);
    const recognitionRef = useRef<any | null>(null);

    // --- Utility Functions ---

    const getSubjectDisplayName = useCallback((subject: string): string => {
        const subjectMap: { [key: string]: string } = {
            'biology': 'Biology (Edexcel IAL)',
            'chemistry': 'Chemistry (Edexcel IAL)',
            'physics': 'Physics (Edexcel IAL)',
            'math': 'Mathematics (Edexcel IAL)',
            'chinese': 'Chinese (Edexcel IGCSE)',
            'ielts-speaking': 'IELTS Speaking',
            'ielts-writing': 'IELTS Writing',
            'ielts-reading': 'IELTS Reading',
            'ielts-listening': 'IELTS Listening'
        };
        return subjectMap[subject] || subject;
    }, []);

    const getWelcomeMessage = useCallback((subject: string): string => {
        const welcomeMessages: { [key: string]: string } = {
            'biology': "👋 Welcome to Biology! I'm your Edexcel IAL Biology tutor. I can help with topics like biological molecules, cells, genetics, ecology, and more. What would you like to learn about today?",
            'chemistry': "👋 Welcome to Chemistry! I'm your Edexcel IAL Chemistry tutor. I can help with topics like atomic structure, bonding, energetics, organic chemistry, and more. What would you like to learn about today?",
            'physics': "👋 Welcome to Physics! I'm your Edexcel IAL Physics tutor. I can help with topics like mechanics, electricity, waves, fields, nuclear physics, and more. What would you like to learn about today?",
            'math': "👋 Welcome to Mathematics! I'm your Edexcel IAL Mathematics tutor. I can help with topics like pure mathematics, statistics, mechanics, and more. What would you like to learn about today?",
            'chinese': "👋 Welcome to Chinese! I'm your Edexcel IGCSE Chinese tutor. I can help with topics like pure reading, writing, translating, Chinese topics and more. What would you like to learn about today?",
            'ielts-speaking': "👋 Welcome to IELTS Speaking! I can help you prepare for your speaking test with practice questions, vocabulary, strategies, and feedback. How would you like to practice today?",
            'ielts-writing': "👋 Welcome to IELTS Writing! I can help you improve your writing skills for both Task 1 and Task 2, including essay structure, vocabulary, grammar, and more. What aspect of IELTS writing would you like help with?",
            'ielts-reading': "👋 Welcome to IELTS Reading! I can help you with reading strategies, practice questions, vocabulary building, and more to improve your reading skills. What aspect of IELTS reading would you work on?",
            'ielts-listening': "👋 Welcome to IELTS Listening! I can help you with listening strategies, practice questions, note-taking skills, and more. How would you like to improve your listening skills today?"
        };
        return welcomeMessages[subject] || "👋 Welcome! How can I help you today?";
    }, []);

    const updateStatus = useCallback((message: string, isError: boolean = false) => {
        setStatusMessage(message);
        setIsErrorStatus(isError);
        setTimeout(() => {
            setStatusMessage('');
        }, 3000);
    }, []);

    const scrollToBottom = useCallback(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, []);

    const copyToClipboard = useCallback((text: string, buttonElement: HTMLElement) => {
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
            buttonElement.parentNode?.appendChild(successMessage);
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
    }, [updateStatus]);

    // --- Local Storage Management ---
    const loadChatHistory = useCallback(() => {
        const savedHistory = localStorage.getItem('eduai-chat-history');
        if (savedHistory) {
            try {
                setChatHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error('Error parsing chat history:', e);
                setChatHistory({});
            }
        }
    }, []);

    const saveChatHistory = useCallback((history: ChatHistory) => {
        localStorage.setItem('eduai-chat-history', JSON.stringify(history));
    }, []);

    // --- Speech Recognition ---
    const initSpeechRecognition = useCallback(() => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;

            recognition.onstart = () => {
                setIsRecording(true);
                if (messageInputRef.current) {
                    messageInputRef.current.placeholder = "Listening...";
                }
            };

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setMessageInput(transcript);
            };

            recognition.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                stopRecording();
            };

            recognition.onend = () => {
                stopRecording();
            };
            recognitionRef.current = recognition;
        } else {
            // Disable voice button if not supported
            // This would typically be done by conditionally rendering the button or adding a disabled class
        }
    }, []);

    const startRecording = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.start();
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsRecording(false);
            if (messageInputRef.current) {
                messageInputRef.current.placeholder = "Ask anything about your subject...";
            }
        }
    }, []);

    const toggleRecording = useCallback(() => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    }, [isRecording, startRecording, stopRecording]);

    // --- API Interaction (Conceptual) ---
    const startNewChatSession = useCallback(async () => {
        try {
            const response = await fetch('https://server-ef04.onrender.com/api/chat/new', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            if (data.success) {
                setCurrentChatId(data.chatId);
                updateStatus('Connected to chat session');
            } else {
                throw new Error(data.error || 'Failed to start chat session');
            }
        } catch (error: any) {
            updateStatus('Error: ' + error.message, true);
        }
    }, [updateStatus]);

    const sendMessage = useCallback(async (message: string) => {
        if (!currentChatId) {
            updateStatus('No active chat session. Please wait for initialization.', true);
            return;
        }
        if (!currentSubject) {
            updateStatus('Please select a subject first.', true);
            return;
        }
        if (!message.trim()) { // Prevent sending empty messages
            return;
        }
        if (isTyping) { // Prevent multiple sends if already typing
            return;
        }

        setIsTyping(true);
        setMessageInput(''); // Clear input immediately
        if (messageInputRef.current) {
            messageInputRef.current.style.height = '40px'; // Reset textarea height
            messageInputRef.current.style.padding = '5px 15px';
        }

        const newUserMessage: Message = { id: crypto.randomUUID(), sender: 'user', text: message, timestamp: Date.now() };

        // Update chat history with user message
        setChatHistory(prevHistory => {
            const newHistory = { ...prevHistory };
            if (!newHistory[currentSubject]) {
                newHistory[currentSubject] = [];
            }
            let currentSession = newHistory[currentSubject].find(s => s.id === activeChat?.id);
            if (!currentSession) {
                // Create a new session if activeChat is null or doesn't match
                currentSession = { id: Date.now(), subject: currentSubject, messages: [] };
                newHistory[currentSubject].unshift(currentSession);
            }
            currentSession.messages.push(newUserMessage);
            saveChatHistory(newHistory);
            return newHistory;
        });

        // Update activeChat for immediate UI display
        setActiveChat(prevChat => {
            if (prevChat) {
                return { ...prevChat, messages: [...prevChat.messages, newUserMessage] };
            }
            // Fallback if prevChat was null (should be handled by initial subject load)
            return { id: Date.now(), subject: currentSubject, messages: [newUserMessage] };
        });

        scrollToBottom(); // Scroll to show user message immediately

        try {
            const response = await fetch('https://server-ef04.onrender.com/api/chat/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatId: currentChatId, message: message })
            });

            const data = await response.json();
            let aiMessageText: string;

            if (data.success) {
                aiMessageText = data.response;
            } else {
                aiMessageText = "Sorry, I encountered an error. Please try again.";
                // Do not throw here, handle error message addition in this block
            }

            const newAiMessage: Message = { id: crypto.randomUUID(), sender: 'ai', text: aiMessageText, timestamp: Date.now() };

            // Update chat history with AI message
            setChatHistory(prevHistory => {
                const newHistory = { ...prevHistory };
                const chatToUpdate = newHistory[currentSubject!]?.find(chat => chat.id === activeChat?.id); // Find the correct session
                if (chatToUpdate) {
                    chatToUpdate.messages.push(newAiMessage);
                }
                saveChatHistory(newHistory);
                return newHistory;
            });
            // Update activeChat for UI display
            setActiveChat(prevChat => {
                if (prevChat) {
                    return { ...prevChat, messages: [...prevChat.messages, newAiMessage] };
                }
                return null;
            });

        } catch (error: any) {
            console.error("Error sending message:", error);
            updateStatus('Error: ' + error.message, true);
            const errorMessage: Message = { id: crypto.randomUUID(), sender: 'ai', text: "Sorry, I encountered an error. Please try again.", timestamp: Date.now() };

            // Update chat history with error message
            setChatHistory(prevHistory => {
                const newHistory = { ...prevHistory };
                const chatToUpdate = newHistory[currentSubject!]?.find(chat => chat.id === activeChat?.id);
                if (chatToUpdate) {
                    chatToUpdate.messages.push(errorMessage);
                }
                saveChatHistory(newHistory);
                return newHistory;
            });
            // Update activeChat for UI display
            setActiveChat(prevChat => {
                if (prevChat) {
                    return { ...prevChat, messages: [...prevChat.messages, errorMessage] };
                }
                return null;
            });
        } finally {
            setIsTyping(false);
            scrollToBottom();
        }
    }, [currentChatId, currentSubject, activeChat, saveChatHistory, updateStatus, scrollToBottom, isTyping]); // Added isTyping to dependency array

    // --- Chat Management ---
    const changeSubject = useCallback((subject: string) => {
        setCurrentSubject(subject);
        setIsHistoryModalOpen(false); // Close sidebar if open on mobile

        // Load chat history for the selected subject
        const subjectChats = chatHistory[subject];
        if (subjectChats && subjectChats.length > 0) {
            setActiveChat(subjectChats[0]); // Load the most recent chat
        } else {
            // No history for this subject, set a new active chat with welcome message
            const newChat: ChatSession = {
                id: Date.now(),
                subject: subject,
                messages: [{ id: crypto.randomUUID(), sender: 'ai', text: getWelcomeMessage(subject), timestamp: Date.now() }]
            };
            setActiveChat(newChat);
            setChatHistory(prevHistory => {
                const updatedHistory = { ...prevHistory };
                updatedHistory[subject] = [newChat];
                saveChatHistory(updatedHistory);
                return updatedHistory;
            });
        }
        scrollToBottom();
    }, [chatHistory, getWelcomeMessage, saveChatHistory, scrollToBottom]);

    const loadChat = useCallback((subject: string, chatId: number) => {
        setCurrentSubject(subject);
        const chat = chatHistory[subject]?.find(c => c.id === chatId);
        if (chat) {
            setActiveChat(chat);
        } else {
            console.warn(`Chat with ID ${chatId} not found for subject ${subject}.`);
        }
        setIsHistoryModalOpen(false);
        scrollToBottom();
    }, [chatHistory, scrollToBottom]);

    const clearAllHistory = useCallback(() => {
        // Custom confirmation modal
        const confirmClear = document.createElement('div');
        confirmClear.classList.add('fixed', 'inset-0', 'bg-black/50', 'flex', 'items-center', 'justify-center', 'z-50');
        confirmClear.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-xl text-center">
                <p class="mb-4 text-gray-800">Are you sure you want to clear all chat history? This cannot be undone.</p>
                <button id="confirm-clear-yes" class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md mr-2">Yes, Clear</button>
                <button id="confirm-clear-no" class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md">No, Cancel</button>
            </div>
        `;
        document.body.appendChild(confirmClear);

        document.getElementById('confirm-clear-yes')?.addEventListener('click', () => {
            setChatHistory({});
            setActiveChat(null);
            saveChatHistory({});
            if (currentSubject) {
                const newChat: ChatSession = {
                    id: Date.now(),
                    subject: currentSubject,
                    messages: [{ id: crypto.randomUUID(), sender: 'ai', text: getWelcomeMessage(currentSubject), timestamp: Date.now() }]
                };
                setActiveChat(newChat);
                setChatHistory({ [currentSubject]: [newChat] });
                saveChatHistory({ [currentSubject]: [newChat] });
            }
            document.body.removeChild(confirmClear);
            setIsHistoryModalOpen(false); // Close history modal after clearing
        });

        document.getElementById('confirm-clear-no')?.addEventListener('click', () => {
            document.body.removeChild(confirmClear);
        });
    }, [currentSubject, getWelcomeMessage, saveChatHistory]);

    // --- Quiz & Revision Plan Generation ---
    const generateQuiz = useCallback(async () => {
        if (!currentSubject) {
            updateStatus('Please select a subject before generating a quiz.', true);
            return;
        }

        setQuizContentHtml(`
            <div class="text-center py-8">
                <div class="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <i class="fas fa-spinner fa-spin text-2xl text-primary-500"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">Generating Quiz</h3>
                <p class="text-gray-600">Please wait while we create your quiz...</p>
            </div>
        `);

        let prompt = `Generate a ${quizNumQuestions}-question ${quizDifficulty} difficulty quiz about ${getSubjectDisplayName(currentSubject)}`;
        if (quizTopic) {
            prompt += ` focusing on ${quizTopic}`;
        }
        prompt += `. Format: numbered questions with multiple choice options (A, B, C, D) and correct answer marked. Include explanation for each answer.`;

        try {
            const response = await fetch('https://server-ef04.onrender.com/api/chat/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatId: currentChatId, message: prompt })
            });
            const data = await response.json();

            if (data.success) {
                displayQuiz(data.response);
            } else {
                throw new Error(data.error || 'Failed to generate quiz');
            }
        } catch (error: any) {
            setQuizContentHtml(`
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
            `);
            // Add event listener for retry button
            setTimeout(() => {
                document.getElementById('retry-quiz-btn')?.addEventListener('click', () => {
                    setIsQuizModalOpen(false);
                    setTimeout(() => setIsQuizModalOpen(true), 300);
                });
            }, 0);
        }
    }, [currentSubject, quizNumQuestions, quizDifficulty, quizTopic, currentChatId, updateStatus, getSubjectDisplayName]);

    const displayQuiz = useCallback((quizText: string) => {
        setQuizContentHtml(`
            <div class="p-4">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-semibold text-gray-800">Quiz: ${getSubjectDisplayName(currentSubject || '')}</h3>
                    <div class="text-sm text-gray-500">${quizDifficulty} · ${quizNumQuestions} questions</div>
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
        `);

        setTimeout(() => {
            document.getElementById('new-quiz-btn')?.addEventListener('click', () => {
                setQuizNumQuestions('10');
                setQuizDifficulty('medium');
                setQuizTopic('');
                setIsQuizModalOpen(false);
                setTimeout(() => setIsQuizModalOpen(true), 300);
            });

            document.getElementById('save-quiz-btn')?.addEventListener('click', () => {
                const newAiMessage: Message = { id: crypto.randomUUID(), sender: 'ai', text: quizText, timestamp: Date.now() };

                setChatHistory(prevHistory => {
                    const newHistory = { ...prevHistory };
                    if (!newHistory[currentSubject!]) {
                        newHistory[currentSubject!] = [];
                    }
                    let currentChat = activeChat;
                    if (!currentChat || currentChat.subject !== currentSubject) {
                        currentChat = {
                            id: Date.now(),
                            subject: currentSubject!,
                            messages: []
                        };
                        newHistory[currentSubject!].unshift(currentChat);
                    }
                    currentChat.messages.push(newAiMessage);
                    setActiveChat(currentChat);
                    saveChatHistory(newHistory);
                    return newHistory;
                });
                setIsQuizModalOpen(false);
                scrollToBottom();
            });
        }, 0);
    }, [currentSubject, quizNumQuestions, quizDifficulty, quizTopic, getSubjectDisplayName, activeChat, saveChatHistory, scrollToBottom]);

    const generateRevisionPlan = useCallback(async () => {
        if (!currentSubject) {
            updateStatus('Please select a subject before generating a revision plan.', true);
            return;
        }
        if (!revisionExamDate) {
            updateStatus('Please select an exam date to create a revision plan.', true);
            return;
        }

        setRevisionContentHtml(`
            <div class="text-center py-8">
                <div class="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <i class="fas fa-spinner fa-spin text-2xl text-purple-500"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">Creating Your Plan</h3>
                <p class="text-gray-600">Please wait while we design your personalized revision plan...</p>
            </div>
        `);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const examDay = new Date(revisionExamDate);
        examDay.setHours(0, 0, 0, 0);

        const diffTime = Math.abs(examDay.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const weeksUntilExam = Math.max(1, Math.ceil(diffDays / 7));

        let prompt = `Create a ${weeksUntilExam}-week revision plan for ${getSubjectDisplayName(currentSubject)} with approximately ${revisionHours} study hours per week`;
        if (revisionFocus) {
            prompt += `, focusing on these areas: ${revisionFocus}`;
        }
        prompt += `. The exam is on ${revisionExamDate}. Include specific topics to study each week, recommended resources, and practice questions. Format as a week-by-week schedule.`;

        try {
            const response = await fetch('https://server-ef04.onrender.com/api/chat/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatId: currentChatId, message: prompt })
            });
            const data = await response.json();

            if (data.success) {
                displayRevisionPlan(data.response);
            } else {
                throw new Error(data.error || 'Failed to generate revision plan');
            }
        } catch (error: any) {
            setRevisionContentHtml(`
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
            `);
            // Add event listener for retry button
            setTimeout(() => {
                document.getElementById('retry-plan-btn')?.addEventListener('click', () => {
                    setIsRevisionModalIsOpen(false);
                    setTimeout(() => setIsRevisionModalIsOpen(true), 300);
                });
            }, 0);
        }
    }, [currentSubject, revisionExamDate, revisionHours, revisionFocus, currentChatId, updateStatus, getSubjectDisplayName]);

    const displayRevisionPlan = useCallback((planText: string) => {
        setRevisionContentHtml(`
            <div class="p-4">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-semibold text-gray-800">Revision Plan: ${getSubjectDisplayName(currentSubject || '')}</h3>
                    <div class="text-sm text-gray-500">Exam date: ${new Date(revisionExamDate).toLocaleDateString()}</div>
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
        `);

        setTimeout(() => {
            document.getElementById('new-plan-btn')?.addEventListener('click', () => {
                const defaultDate = new Date();
                defaultDate.setDate(defaultDate.getDate() + 30);
                setRevisionExamDate(defaultDate.toISOString().split('T')[0]);
                setRevisionHours('10');
                setRevisionFocus('');
                setIsRevisionModalIsOpen(false);
                setTimeout(() => setIsRevisionModalIsOpen(true), 300);
            });

            document.getElementById('save-plan-btn')?.addEventListener('click', () => {
                const newAiMessage: Message = { id: crypto.randomUUID(), sender: 'ai', text: planText, timestamp: Date.now() };

                setChatHistory(prevHistory => {
                    const newHistory = { ...prevHistory };
                    if (!newHistory[currentSubject!]) {
                        newHistory[currentSubject!] = [];
                    }
                    let currentChat = activeChat;
                    if (!currentChat || currentChat.subject !== currentSubject) {
                        currentChat = {
                            id: Date.now(),
                            subject: currentSubject!,
                            messages: []
                        };
                        newHistory[currentSubject!].unshift(currentChat);
                    }
                    currentChat.messages.push(newAiMessage);
                    setActiveChat(currentChat);
                    saveChatHistory(newHistory);
                    return newHistory;
                });
                setIsRevisionModalIsOpen(false);
                scrollToBottom();
            });
        }, 0);
    }, [currentSubject, revisionExamDate, revisionHours, revisionFocus, getSubjectDisplayName, activeChat, saveChatHistory, scrollToBottom]);

    // --- Effects ---

    // Initial load and setup
    useEffect(() => {
        loadChatHistory();
        initSpeechRecognition();
        startNewChatSession();

        // Set default exam date for revision plan
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 30);
        setRevisionExamDate(defaultDate.toISOString().split('T')[0]);

        setTimeout(() => {
            setIsLoading(false);
            // Set default subject after loading and initial setup
            setCurrentSubject('biology');
        }, 2000);
    }, [loadChatHistory, initSpeechRecognition, startNewChatSession]);

    // Effect to update active chat when currentSubject or chatHistory changes
    useEffect(() => {
        if (currentSubject && chatHistory[currentSubject] && chatHistory[currentSubject].length > 0) {
            setActiveChat(chatHistory[currentSubject][0]); // Load most recent chat
        } else if (currentSubject) {
            // If no history for subject, create a new chat with welcome message
            const newChat: ChatSession = {
                id: Date.now(),
                subject: currentSubject,
                messages: [{ id: crypto.randomUUID(), sender: 'ai', text: getWelcomeMessage(currentSubject), timestamp: Date.now() }]
            };
            setActiveChat(newChat);
            setChatHistory(prevHistory => {
                const updatedHistory = { ...prevHistory };
                updatedHistory[currentSubject] = [newChat];
                saveChatHistory(updatedHistory);
                return updatedHistory;
            });
        }
        scrollToBottom();
    }, [currentSubject, chatHistory, getWelcomeMessage, saveChatHistory, scrollToBottom]);

    // Effect for scrolling to bottom of chat
    useEffect(() => {
        scrollToBottom();
    }, [activeChat, scrollToBottom]); // Scroll when activeChat messages change

    // Effect for auto-expanding textarea
    useEffect(() => {
        const textarea = messageInputRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset height to get the correct scrollHeight
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`; // Set height, max 200px
        }
    }, [messageInput]); // Re-run when messageInput changes

    // --- Render Logic ---
    const renderMessages = (messages: Message[]) => {
        return messages.map((msg) => ( // Removed index, using msg.id for key
            <div key={msg.id} className={`message ${msg.sender}-message p-3 rounded-lg break-words mb-2 relative`}>
                <div className="message-content" dangerouslySetInnerHTML={{ __html: msg.sender === 'ai' ? marked.parse(msg.text) : msg.text }}></div>
                <div className="copy-button-container">
                    <button
                        className={`copy-button text-xs px-2 py-1 rounded-md ${msg.sender === 'ai' ? 'ai-message-copy-button' : 'user-message-copy-button'}`}
                        title="Copy to clipboard"
                        onClick={(e) => copyToClipboard(msg.text, e.currentTarget)}
                    >
                        <i className="fas fa-copy"></i> Copy
                    </button>
                </div>
            </div>
        ));
    };

    const renderSidebarSubjects = () => {
        const subjects = [
            { id: 'biology', name: 'Biology', icon: 'fas fa-dna', color: 'text-emerald-500', category: 'Edexcel IAL' },
            { id: 'chemistry', name: 'Chemistry', icon: 'fas fa-flask', color: 'text-red-400', category: 'Edexcel IAL' },
            { id: 'physics', name: 'Physics', icon: 'fas fa-atom', color: 'text-blue-500', category: 'Edexcel IAL' },
            { id: 'math', name: 'Mathematics', icon: 'fas fa-calculator', color: 'text-amber-500', category: 'Edexcel IAL' },
            { id: 'chinese', name: 'Chinese', icon: 'fas fa-language', color: 'text-purple-500', category: 'Edexcel IGCSE' },
            { id: 'ielts-speaking', name: 'Speaking', icon: 'fas fa-microphone', color: 'text-red-500', category: 'IELTS' },
            { id: 'ielts-writing', name: 'Writing', icon: 'fas fa-pen-fancy', color: 'text-red-500', category: 'IELTS' },
            { id: 'ielts-reading', name: 'Reading', icon: 'fas fa-book-open', color: 'text-red-500', category: 'IELTS' },
            { id: 'ielts-listening', name: 'Listening', icon: 'fas fa-headphones', color: 'text-red-500', category: 'IELTS' },
        ];

        const categories: { [key: string]: typeof subjects } = subjects.reduce((acc, subject) => {
            (acc[subject.category] = acc[subject.category] || []).push(subject);
            return acc;
        }, {} as { [key: string]: typeof subjects });

        return (
            <>
                {Object.entries(categories).map(([category, subjectsInCategory]) => (
                    <React.Fragment key={category}>
                        <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-[20px] mt-[10px] h-[30px]">{category}</h3>
                        {subjectsInCategory.map(subject => (
                            <button
                                key={subject.id}
                                data-sidebar-subject={subject.id}
                                className={`sidebar-subject-btn w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black transition-all duration-150 rounded-lg mb-1 flex items-center gap-2
                                    ${currentSubject === subject.id ? 'active-sidebar-subject bg-blue-100 text-blue-600 font-semibold shadow-sm' : ''}`}
                                onClick={() => changeSubject(subject.id)}
                            >
                                <i className={`${subject.icon} mr-2 ${subject.color} ${currentSubject === subject.id ? 'text-blue-600' : ''}`}></i> {subject.name}
                            </button>
                        ))}
                    </React.Fragment>
                ))}
            </>
        );
    };

    return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen p-4 transition-colors duration-300">
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                /* Import Font Awesome */
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
                
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

             

                #eduai-container {
                    width: 95vw;
                    max-width: 1000px;
                    
                    margin: auto;
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

                /* Custom scrollbar */
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

                /* Message animations */
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

                /* Typing indicator */
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
                
                /* Markdown styles for chat messages */
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
                    position: relative;
                    min-height: 40px; /* Changed from h-[40px] */
                    display: flex;
                    align-items: flex-end;
                }

                #message-input {
                    min-height: 40px;
                    max-height: 200px;
                    overflow-y: auto;
                    resize: none;
                    line-height: 1;
                    justify-content: center;
                    align-content: center;
                    padding: 10px 10px;
                }
                #message-input::-webkit-scrollbar {
                    display: none;
                }
                textarea:focus {
                    border-color: #1E90ff;
                }
                button:hover {
                    color: none;
                }

                /* Copy Button Styles */
                .copy-button-container {
                    position: relative;
                    margin-top: 0.5rem;
                    display: flex;
                    justify-content: flex-end;
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

                /* Sidebar specific styles */
                #sidebar-menu {
                    will-change: transform;
                }

                .sidebar-subject-btn.active-sidebar-subject {
                    background: #e0e7ff !important;
                    color: #2563eb !important;
                    font-weight: 600;
                    border-radius: 0.75rem;
                    box-shadow: 0 2px 8px 0 #2563eb10;
                }
                `}
            </style>
            <div id="eduai-container" className="w-full h-[90vh] rounded-xl overflow-hidden shadow-xl border border-gray-200 relative transition-all duration-300 ease-in-out flex flex-col md:flex-row">
                {/* Loading Screen */}
                {isLoading && (
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
                <div id="sidebar-menu" className={`absolute left-0 top-0 h-full w-64 bg-white/50 blur-container transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} z-40 border-r border-gray-200 overflow-y-auto transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:bg-white md:shadow-md md:z-auto md:flex-shrink-0 md:flex-grow-0 md:rounded-l-xl`}>
                    <div className="p-4 border-b">
                        <h3 className="font-bold text-xl text-primary-500" style={{ marginBottom: 0, paddingBottom: 0 }}>AI Teacher Pro</h3>
                    </div>
                    <div className="py-4">
                        {renderSidebarSubjects()}
                        <div className="border-t mt-4 pt-4">
                            <button id="clear-history-btn" className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700" onClick={clearAllHistory}>
                                <i className="fas fa-trash-alt mr-2 text-gray-500"></i> Clear History
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main App Interface */}
                <div id="app-interface" className={`h-full flex flex-col bg-gray-50 relative ${isLoading ? 'hidden' : 'flex'} flex-grow md:rounded-r-xl md:overflow-hidden`}>
                    {/* Header */}
                    <header className="flex justify-between items-center p-4 bg-white border-b h-[60px]">
                        <div className="flex items-center">
                            <button id="menu-toggle" className="p-2 rounded-full hover:bg-gray-100 transition mr-2 block md:hidden" style={{ width: 40, height: 40 }} onClick={() => { setIsHistoryModalOpen(false); setIsSidebarOpen(true); }}>
                                <i className="fas fa-bars text-gray-600"></i>
                            </button>
                            <div>
                                <h1 id="current-subject-header" className="text-xl font-bold text-gray-800" style={{ marginBottom: 0, paddingBottom: 0 }}>{currentSubject ? getSubjectDisplayName(currentSubject) : 'AI Teach'}</h1>
                                <p className="text-xs text-gray-500 mt-1">Gemini 2.5 Flash</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button id="quiz-btn" className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm bg-blue-100 text-primary-500 hover:bg-blue-200 hover:text-primary-500 transition" onClick={() => setIsQuizModalOpen(true)}>
                                <i className="fas fa-question-circle text-xs"></i>
                                <span>Quiz</span>
                            </button>
                            <button id="revision-btn" className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm bg-purple-100 text-purple-500 hover:text-purple-500 hover:bg-purple-200 transition" onClick={() => setIsRevisionModalIsOpen(true)}>
                                <i className="fas fa-book text-xs"></i>
                                <span>Plan</span>
                            </button>
                            <button id="chat-history-btn" className="p-0 rounded-full hover:bg-gray-100 transition justify-center" style={{ width: 40, height: 40 }} onClick={() => setIsHistoryModalOpen(true)}>
                                <i className="fas fa-history text-gray-600"></i>
                            </button>
                            {/* Settings / Tone Button - Placeholder for now */}
                            <button id="open-tone-modal-btn" className="p-0 rounded-full hover:bg-gray-100 transition text-gray-600 justify-center" style={{ width: 40, height: 40 }}>
                                <i className="fas fa-cog text-xl"></i>
                            </button>
                        </div>
                    </header>

                    {/* Chat Container */}
                    <div id="chat-container" ref={chatContainerRef} className="flex-grow overflow-y-auto text-[12px] p-4 space-y-4 bg-gray-50 pb-20 flex flex-col">
                        {activeChat?.messages && renderMessages(activeChat.messages)}
                        {isTyping && (
                            <div className="typing-indicator ai-message p-3 rounded-lg">
                                <span></span><span></span><span></span>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 blur-container flex justify-center z-10" style={{ borderTop: '1px solid rgba(0, 0, 0, 0.125)' }}>
                        <div className="flex gap-3 w-full max-w-xl p-0 min-h-[40px] align-content-flex-end justify-content-flex-end"> {/* Changed h-[40px] to min-h-[40px] */}
                            <button id="voice-btn" className={`p-2 rounded-full hover:bg-gray-100 transition ${isRecording ? 'text-primary-500' : 'text-gray-500'}`} title="Use voice input" style={{ width: 40, height: 40 }} onClick={toggleRecording}>
                                <i className={`fas ${isRecording ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
                            </button>
                            <div className="flex-grow relative textarea-container"> {/* Removed h-[40px] from here */}
                                <textarea
                                    id="message-input"
                                    ref={messageInputRef}
                                    rows={1}
                                    placeholder={isRecording ? "Listening..." : "Ask anything about your subject..."}
                                    className="w-full bg-gray-100 rounded-[25px] focus:outline-none blur-container focus:ring-2 focus:ring-primary-500 text-gray-800 resize-none"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage(messageInput);
                                        }
                                    }}
                                    disabled={isTyping}
                                ></textarea>
                                {statusMessage && (
                                    <div id="status" className={`absolute text-xs bottom-full right-1 m-0 px-2 py-1 rounded-md ${isErrorStatus ? 'bg-red-500' : 'bg-black'} text-white`}>
                                        {statusMessage}
                                    </div>
                                )}
                            </div>
                            <button id="send-button" className={`px-[10px] bg-primary-500 rounded-full hover:bg-primary-600 transition text-white ${isTyping ? 'opacity-50 cursor-not-allowed' : ''}`} style={{ width: 40, height: 40, backgroundColor: '#2563eb' }} onClick={() => sendMessage(messageInput)} disabled={isTyping}>
                                <i className="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quiz Modal */}
                {isQuizModalOpen && (
                    <div id="quiz-modal" className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col animate-fade-in">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="font-semibold text-xl text-gray-800">Quiz Mode</h2>
                            <button id="close-quiz-btn" className="p-2 rounded-full hover:bg-gray-100 transition" onClick={() => setIsQuizModalOpen(false)}>
                                <i className="fas fa-times text-gray-600"></i>
                            </button>
                        </div>
                        <div id="quiz-content" className="flex-grow p-6 overflow-y-auto">
                            {quizContentHtml ? (
                                <div dangerouslySetInnerHTML={{ __html: quizContentHtml }} />
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4 animate-pulse">
                                        <i className="fas fa-question-circle text-2xl text-primary-500"></i>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Start a Quiz</h3>
                                    <p className="text-gray-600 mb-6">Test your knowledge with a subject-specific quiz</p>

                                    <div className="max-w-md mx-auto">
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Number of questions</label>
                                            <select id="quiz-num-questions" className="w-full p-2 border rounded-lg bg-white text-gray-800" value={quizNumQuestions} onChange={(e) => setQuizNumQuestions(e.target.value)}>
                                                <option value="5">5 questions</option>
                                                <option value="10">10 questions</option>
                                                <option value="15">15 questions</option>
                                                <option value="20">20 questions</option>
                                            </select>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Difficulty</label>
                                            <select id="quiz-difficulty" className="w-full p-2 border rounded-lg bg-white text-gray-800" value={quizDifficulty} onChange={(e) => setQuizDifficulty(e.target.value)}>
                                                <option value="easy">Easy</option>
                                                <option value="medium">Medium</option>
                                                <option value="hard">Hard</option>
                                            </select>
                                        </div>

                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Topic (optional)</label>
                                            <input type="text" id="quiz-topic" placeholder="Leave blank for mixed topics" className="w-full p-2 border rounded-lg bg-white text-gray-800" value={quizTopic} onChange={(e) => setQuizTopic(e.target.value)} />
                                        </div>

                                        <button id="start-quiz-btn" className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition" onClick={generateQuiz}>
                                            Start Quiz
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Revision Plan Modal */}
                {isRevisionModalOpen && (
                    <div id="revision-modal" className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col animate-fade-in">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="font-semibold text-xl text-gray-800">Revision Plan</h2>
                            <button id="close-revision-btn" className="p-2 rounded-full hover:bg-gray-100 transition" onClick={() => setIsRevisionModalIsOpen(false)}>
                                <i className="fas fa-times text-gray-600"></i>
                            </button>
                        </div>
                        <div id="revision-content" className="flex-grow p-6 overflow-y-auto">
                            {revisionContentHtml ? (
                                <div dangerouslySetInnerHTML={{ __html: revisionContentHtml }} />
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                                        <i className="fas fa-calendar-alt text-2xl text-purple-500"></i>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Create a Revision Plan</h3>
                                    <p className="text-gray-600 mb-6">Let AI create a personalized study schedule</p>

                                    <div className="max-w-md mx-auto">
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Exam Date</label>
                                            <input type="date" id="revision-exam-date" className="w-full p-2 border rounded-lg bg-white text-gray-800" value={revisionExamDate} onChange={(e) => setRevisionExamDate(e.target.value)} />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Study hours per week</label>
                                            <select id="revision-hours" className="w-full p-2 border rounded-lg bg-white text-gray-800" value={revisionHours} onChange={(e) => setRevisionHours(e.target.value)}>
                                                <option value="5">~5 hours</option>
                                                <option value="10">10 hours</option>
                                                <option value="15">~15 hours</option>
                                                <option value="20">~20 hours</option>
                                                <option value="30">~30 hours</option>
                                            </select>
                                        </div>

                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Focus areas (optional)</label>
                                            <textarea id="revision-focus" rows={3} placeholder="Any specific topics you want to focus on?" className="w-full p-2 border rounded-lg bg-white text-gray-800 resize-none" value={revisionFocus} onChange={(e) => setRevisionFocus(e.target.value)}></textarea>
                                        </div>

                                        <button id="create-plan-btn" className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition" onClick={generateRevisionPlan}>
                                            Create Plan
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Chat History Modal */}
                {isHistoryModalOpen && (
                    <div id="history-modal" className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col animate-fade-in">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="font-semibold text-xl text-gray-800">Chat History</h2>
                            <button id="close-history-btn" className="p-2 rounded-full hover:bg-gray-100 transition" onClick={() => setIsHistoryModalOpen(false)}>
                                <i className="fas fa-times text-gray-600"></i>
                            </button>
                        </div>
                        <div id="history-content" className="flex-grow p-4 overflow-y-auto">
                            {Object.keys(chatHistory).length === 0 ? (
                                <div id="no-history" className="text-center py-8 text-gray-500">
                                    <i className="fas fa-history text-4xl mb-2"></i>
                                    <p>No chat history yet</p>
                                </div>
                            ) : (
                                <div id="history-list" className="space-y-3">
                                    {Object.entries(chatHistory).map(([subject, sessions]) => (
                                        <React.Fragment key={subject}>
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4">{getSubjectDisplayName(subject)}</h3>
                                            {sessions.map(chat => {
                                                const firstUserMsg = chat.messages.find(m => m.sender === 'user');
                                                let preview = firstUserMsg ? firstUserMsg.text : (chat.messages[0]?.text || 'No message preview');
                                                if (preview.length > 40) {
                                                    preview = preview.substring(0, 40) + '...';
                                                }
                                                const date = new Date(chat.id);
                                                const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                                return (
                                                    <div key={chat.id} className="glass-card p-3 rounded-lg cursor-pointer hover:bg-gray-100" onClick={() => loadChat(subject, chat.id)}>
                                                        <div className="flex justify-between items-start">
                                                            <div className="text-sm font-medium text-gray-800">{preview}</div>
                                                            <div className="text-xs text-gray-500">{dateStr}</div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </React.Fragment>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
