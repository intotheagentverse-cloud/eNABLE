"use client";

import { useState } from 'react';
import Link from 'next/link';

interface AskAIButtonProps {
    context: string;
    defaultQuestions?: string[];
}

export default function AskAIButton({ context, defaultQuestions = [] }: AskAIButtonProps) {
    const [showQuickMenu, setShowQuickMenu] = useState(false);

    const contextQuestions = {
        qc: [
            'What are the Westgard multi-rules?',
            'How do I handle a QC violation?',
            'What is IQCP and do I need it?',
        ],
        equipment: [
            'How often should I calibrate my analyzer?',
            'What causes equipment drift?',
            'Equipment integration best practices?',
        ],
        calibration: [
            'NABL calibration requirements?',
            'How to validate calibration results?',
            'Risk-based calibration intervals?',
        ],
        reagents: [
            'How to validate a new reagent lot?',
            'What is ROL and ROQ?',
            'Reagent expiry management best practices?',
        ],
    };

    const questions = defaultQuestions.length > 0
        ? defaultQuestions
        : contextQuestions[context as keyof typeof contextQuestions] || [];

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Quick Questions Menu */}
            {showQuickMenu && (
                <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-72 mb-2">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-sm text-gray-900">Quick Questions</h4>
                        <button
                            onClick={() => setShowQuickMenu(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="space-y-2">
                        {questions.map((q, idx) => (
                            <Link
                                key={idx}
                                href={`/dashboard/quality-assistant?q=${encodeURIComponent(q)}`}
                                className="block text-sm text-gray-700 hover:text-purple-600 hover:bg-purple-50 p-2 rounded transition-colors"
                            >
                                💬 {q}
                            </Link>
                        ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                        <Link
                            href="/dashboard/quality-assistant"
                            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                            Open Quality Assistant →
                        </Link>
                    </div>
                </div>
            )}

            {/* Main Button */}
            <button
                onClick={() => setShowQuickMenu(!showQuickMenu)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 group"
                title="Ask AI about compliance"
            >
                <div className="flex items-center gap-2">
                    <span className="text-2xl group-hover:animate-pulse">🤖</span>
                    <span className="font-semibold">Ask AI</span>
                </div>
            </button>
        </div>
    );
}
