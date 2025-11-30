"use client";

import { useState } from 'react';
import { useRAG } from '@/contexts/RAGContext';

interface AIDeviationRootCauseProps {
    deviationType?: string;
    equipment?: string;
}

export default function AIDeviationRootCause({
    deviationType = 'Westgard 2-2s',
    equipment = 'Analyzer A'
}: AIDeviationRootCauseProps) {
    const { askRAG, isLoading } = useRAG();
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const getSuggestions = async () => {
        setShowSuggestions(true);
        if (suggestions.length > 0) return;

        try {
            const response = await askRAG(
                `What are common root causes of ${deviationType} violations in ${equipment}? Provide investigation steps.`,
                'qc'
            );

            // Parse response into bullet points
            const points = response.answer
                .split('\n')
                .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•') || line.match(/^\d+\./))
                .map(line => line.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, '').trim())
                .filter(line => line.length > 10)
                .slice(0, 5);

            setSuggestions(points);
        } catch (err) {
            console.error('Failed to get AI suggestions:', err);
        }
    };

    return (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200 p-4">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h4 className="font-medium text-gray-900">AI Root Cause Analysis</h4>
                    <p className="text-xs text-gray-600 mt-1">Powered by NABL + Quality Excellence knowledge base</p>
                </div>
                <button
                    onClick={getSuggestions}
                    disabled={isLoading}
                    className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 disabled:opacity-50"
                >
                    {isLoading ? '...' : showSuggestions ? 'Refresh' : 'Get AI Suggestions'}
                </button>
            </div>

            {showSuggestions && (
                <div className="mt-3">
                    {isLoading ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="animate-spin h-4 w-4 border-2 border-orange-600 border-t-transparent rounded-full"></div>
                            <span>AI is analyzing root causes...</span>
                        </div>
                    ) : suggestions.length > 0 ? (
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-900">Possible Root Causes & Investigation Steps:</p>
                            <ul className="space-y-1.5">
                                {suggestions.map((suggestion, idx) => (
                                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                        <span className="text-orange-600 font-bold">•</span>
                                        <span>{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-600">No suggestions available. Try again.</p>
                    )}
                </div>
            )}
        </div>
    );
}
