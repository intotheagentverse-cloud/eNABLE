"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Message {
    role: "user" | "assistant";
    content: string;
    sources?: string[];
    agents_consulted?: string[];
}

import { Suspense } from "react";

function AssistantContent() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const exampleQuestions = [
        "What are the NABL requirements for internal quality control?",
        "Explain ISO 15189:2022 requirements for calibration verification",
        "What documentation is mandatory for NABL accreditation?",
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: query };
        setMessages((prev) => [...prev, userMessage]);
        setQuery("");
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/rag/nabl", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: userMessage.content }),
            });

            if (!response.ok) {
                throw new Error("Failed to get response from assistant");
            }

            const data = await response.json();
            const assistantMessage: Message = {
                role: "assistant",
                content: data.answer,
                sources: data.sources,
                agents_consulted: data.agents_consulted,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (err) {
            console.error("Error:", err);
            setError("Failed to get response. Please try again.");
            const errorMessage: Message = {
                role: "assistant",
                content: "I apologize, but I'm having trouble connecting to the service. Please try again later.",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExampleClick = (question: string) => {
        setQuery(question);
    };

    const handleCreateCAPA = async (message: Message) => {
        try {
            // Create a FormData object with the message content
            const formData = new FormData();
            formData.append('capa_type', 'PREVENTIVE'); // Default to preventive
            formData.append('issue_description', `AI Assistant Recommendation: ${message.content.substring(0, 200)}...`);
            formData.append('root_cause', 'Identified through NABL Assistant analysis');
            formData.append('action_plan', message.content);
            formData.append('responsible_person', '');
            formData.append('target_date', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // 30 days from now

            const response = await fetch('/api/capa/create', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to create CAPA');
            }

            const data = await response.json();

            // Navigate to CAPA page
            window.location.href = '/dashboard/capa';
        } catch (err) {
            console.error("Error creating CAPA:", err);
            alert("Failed to create CAPA. Please try again.");
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#FCFCF9]" style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-[rgba(94,82,64,0.12)] bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <h1 className="text-2xl font-semibold text-gray-900">NABL Assistant</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Expert guidance on NABL accreditation and ISO 15189 compliance
                </p>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Example Questions */}
                    {messages.length === 0 && (
                        <div className="mb-8">
                            <p className="text-sm font-medium text-gray-600 mb-3">
                                Try asking:
                            </p>
                            <div className="grid grid-cols-1 gap-2">
                                {exampleQuestions.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleExampleClick(q)}
                                        className="text-left p-4 rounded-xl border border-[rgba(94,82,64,0.12)] hover:border-[#218D8D] hover:bg-white/60 transition-all duration-250 text-sm bg-white/40"
                                        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[70%] rounded-2xl p-4 transition-all duration-250`}
                                style={{
                                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                                    ...(msg.role === "user"
                                        ? {
                                            background: "linear-gradient(135deg, #E8DCC4 0%, #D4C4A8 100%)",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                        }
                                        : {
                                            backgroundColor: "#FFFFFF",
                                            border: "1px solid rgba(94,82,64,0.12)",
                                        })
                                }}
                            >
                                {msg.role === "assistant" && (
                                    <div className="flex flex-col gap-2 mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-[#218D8D] flex items-center justify-center text-white text-xs font-bold">
                                                AI
                                            </div>
                                            <span className="text-xs font-medium text-gray-700">
                                                NABL Assistant
                                            </span>
                                        </div>
                                        {msg.agents_consulted && msg.agents_consulted.length > 0 && (
                                            <div className="flex gap-1.5 ml-9">
                                                {msg.agents_consulted.map((agent, i) => (
                                                    <span
                                                        key={i}
                                                        className="text-[10px] px-2 py-0.5 bg-teal-50 text-teal-700 rounded-full border border-teal-200 capitalize font-medium"
                                                    >
                                                        {agent}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Markdown Content */}
                                <div className={`prose prose-sm max-w-none ${msg.role === "user" ? "text-gray-800" : "text-gray-900"}`}>
                                    <ReactMarkdown
                                        components={{
                                            code({ node, inline, className, children, ...props }: any) {
                                                const match = /language-(\w+)/.exec(className || '');
                                                return !inline && match ? (
                                                    <SyntaxHighlighter
                                                        style={vscDarkPlus}
                                                        language={match[1]}
                                                        PreTag="div"
                                                        className="rounded-lg !mt-2 !mb-2"
                                                        {...props}
                                                    >
                                                        {String(children).replace(/\n$/, '')}
                                                    </SyntaxHighlighter>
                                                ) : (
                                                    <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-xs" {...props}>
                                                        {children}
                                                    </code>
                                                );
                                            },
                                            p({ children }) {
                                                return <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>;
                                            },
                                            ul({ children }) {
                                                return <ul className="list-disc list-inside space-y-1 mb-3">{children}</ul>;
                                            },
                                            ol({ children }) {
                                                return <ol className="list-decimal list-inside space-y-1 mb-3">{children}</ol>;
                                            },
                                            strong({ children }) {
                                                return <strong className="font-semibold text-gray-900">{children}</strong>;
                                            },
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>

                                {/* Sources */}
                                {msg.sources && msg.sources.length > 0 && (
                                    <div className="mt-4 pt-3 border-t border-gray-100">
                                        <p className="text-xs font-medium text-gray-500 mb-2">
                                            Sources:
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {msg.sources.map((source, i) => (
                                                <span
                                                    key={i}
                                                    className="text-[10px] px-2 py-1 bg-gray-50 text-gray-600 rounded-md border border-gray-200"
                                                >
                                                    {source.split("/").pop()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Create CAPA Button */}
                                {msg.role === "assistant" && (
                                    <div className="mt-4 pt-3 border-t border-gray-100">
                                        <button
                                            onClick={() => handleCreateCAPA(msg)}
                                            className="px-4 py-2 bg-[#218D8D] text-white text-sm font-medium rounded-lg hover:bg-[#1a7070] transition-all duration-250"
                                            style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                                        >
                                            Create CAPA
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Loading Animation */}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-[rgba(94,82,64,0.12)] rounded-2xl p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-full bg-[#218D8D] flex items-center justify-center text-white text-xs font-bold">
                                        AI
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm text-gray-600">Thinking</span>
                                        <div className="flex gap-1">
                                            {[0, 1, 2].map((i) => (
                                                <div
                                                    key={i}
                                                    className="w-1.5 h-1.5 bg-[#218D8D] rounded-full animate-bounce"
                                                    style={{
                                                        animationDelay: `${i * 0.15}s`,
                                                        animationDuration: "0.8s",
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800">
                            <p className="font-medium text-sm">Error:</p>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Form */}
            <div className="border-t border-[rgba(94,82,64,0.12)] bg-white/80 backdrop-blur-sm px-4 py-4 sticky bottom-0">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="flex gap-3">
                        <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            placeholder="Ask about equipment, compliance, or quality control..."
                            className="flex-1 px-4 py-3 border border-[rgba(94,82,64,0.12)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#218D8D] focus:border-transparent resize-none bg-white transition-all duration-250"
                            style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                            rows={1}
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!query.trim() || isLoading}
                            className="px-6 py-3 bg-[#218D8D] text-white rounded-xl hover:bg-[#1a7070] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-250 font-medium"
                            style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                        >
                            Send
                        </button>
                    </form>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        Press Cmd+Enter to send
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function NABLAssistantPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AssistantContent />
        </Suspense>
    );
}
