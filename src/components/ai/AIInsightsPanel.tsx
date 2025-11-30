"use client";

import { useAIInsights } from '@/hooks/useAIInsights';

interface AIInsightsPanelProps {
    context: 'qc' | 'equipment' | 'calibration' | 'reagents';
    data?: any;
}

export default function AIInsightsPanel({ context, data }: AIInsightsPanelProps) {
    const { insights, isLoading } = useAIInsights(context, data);

    const priorityColors = {
        high: 'border-red-500 bg-red-50',
        medium: 'border-yellow-500 bg-yellow-50',
        low: 'border-blue-500 bg-blue-50',
    };

    const typeIcons = {
        risk: '⚠️',
        recommendation: '💡',
        compliance: '✓',
        info: 'ℹ️',
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3">
                    <div className="animate-spin h-5 w-5 border-2 border-purple-600 border-t-transparent rounded-full"></div>
                    <span className="text-sm text-gray-600">AI is analyzing quality data...</span>
                </div>
            </div>
        );
    }

    if (insights.length === 0) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-lg p-6 border-2 border-purple-200">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🤖</span>
                    <h3 className="text-lg font-semibold text-gray-900">AI Quality Insights</h3>
                </div>
                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                    Powered by RAG
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {insights.map((insight, idx) => (
                    <div
                        key={idx}
                        className={`border-l-4 rounded-lg p-4 ${priorityColors[insight.priority]} shadow-sm hover:shadow-md transition-shadow`}
                    >
                        <div className="flex items-start gap-2 mb-2">
                            <span className="text-xl">{typeIcons[insight.type]}</span>
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900 text-sm">{insight.title}</h4>
                                {insight.priority === 'high' && (
                                    <span className="text-xs text-red-600 font-semibold">High Priority</span>
                                )}
                            </div>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed">{insight.description}</p>
                        {insight.source && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                                <span className="text-xs text-gray-500">
                                    Source: {insight.source.split('/').pop()?.substring(0, 20)}...
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-4 p-3 bg-white/70 rounded-lg border border-purple-200">
                <p className="text-xs text-gray-600">
                    💡 <strong>Tip:</strong> Click the "Ask AI" button for specific compliance questions or use the Quality Assistant for detailed guidance.
                </p>
            </div>
        </div>
    );
}
