"use client";

import { useState } from "react";

export default function KnowledgeSearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const suggestedQuestions = [
        "What is IQCP and when should I use it?",
        "Explain Westgard 2-2s rule",
        "What are the CDC 12 QMS essentials?",
        "How do I perform a risk assessment?",
        "What causes systematic error in QC?",
    ];

    const handleSearch = async () => {
        if (!query.trim()) return;

        setIsLoading(true);
        try {
            const response = await fetch("/api/rag/quality", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: query.trim() }),
            });

            if (!response.ok) {
                throw new Error("Failed to get response");
            }

            const data = await response.json();
            setResults(data);
        } catch (err) {
            console.error("Search failed:", err);
            setResults({ answer: "Failed to get response. Please try again.", sources: [] });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🔍</span>
                <h3 className="text-lg font-semibold text-gray-900">Ask the Quality Expert</h3>
            </div>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Ask anything about quality excellence..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSearch}
                    disabled={isLoading || !query.trim()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {isLoading ? "..." : "Search"}
                </button>
            </div>

            {/* Suggested Questions */}
            {!results && (
                <div>
                    <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedQuestions.map((q, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSuggestionClick(q)}
                                className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Results */}
            {results && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2 mb-2">
                        <span className="text-xl">💡</span>
                        <div className="flex-1">
                            <p className="text-sm text-gray-900 leading-relaxed">{results.answer}</p>
                            {results.sources && results.sources.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-blue-200">
                                    <p className="text-xs font-medium text-gray-700 mb-1">Sources:</p>
                                    {results.sources.slice(0, 3).map((source: string, idx: number) => (
                                        <p key={idx} className="text-xs text-gray-600">
                                            • {source.split("/").pop()?.substring(0, 50)}...
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setResults(null);
                            setQuery("");
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-2"
                    >
                        Ask another question →
                    </button>
                </div>
            )}
        </div>
    );
}
