"use client";

export default function WestgardIntelligence() {
    const westgardInsights = [
        {
            rule: '1-3s',
            description: 'Single control exceeds 3 SD',
            frequency: 'Low',
            prediction: 'Stable - no pattern detected',
            color: 'green',
        },
        {
            rule: '2-2s',
            description: 'Two consecutive controls exceed 2 SD (same side)',
            frequency: 'Medium',
            prediction: 'Likely in next 3 days based on trend',
            color: 'yellow',
        },
        {
            rule: 'R-4s',
            description: 'Range between controls exceeds 4 SD',
            frequency: 'Low',
            prediction: 'Stable',
            color: 'green',
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Westgard Rules Intelligence</h3>
                    <p className="text-sm text-gray-500 mt-1">AI-powered multi-rule violation analysis</p>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View Westgard Guide →
                </button>
            </div>

            <div className="space-y-3">
                {westgardInsights.map((insight, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-mono font-bold text-purple-600">{insight.rule}</span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${insight.color === 'green' ? 'bg-green-100 text-green-700' :
                                            insight.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                        }`}>
                                        {insight.frequency} Frequency
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">AI Prediction:</span>
                                    <span className="text-xs font-medium text-gray-900">{insight.prediction}</span>
                                </div>
                            </div>
                            {insight.color === 'yellow' && (
                                <span className="text-2xl">⚠️</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs text-purple-800">
                    <strong>📚 Knowledge Base:</strong> Westgard multi-rules help detect systematic and random errors.
                    AI analyzes historical patterns to predict likely violations.
                </p>
            </div>
        </div>
    );
}
