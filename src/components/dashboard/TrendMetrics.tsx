'use client'

import { useEffect, useState } from 'react';

type Trend = {
    parameter: string;
    period: string;
    score: number;
    status: 'STABLE' | 'DRIFTING' | 'CRITICAL';
    trend: 'up' | 'down' | 'flat';
};

export default function TrendMetrics() {
    const [trends, setTrends] = useState<Trend[]>([]);

    useEffect(() => {
        fetch('/api/qc/trends')
            .then(res => res.json())
            .then(data => setTrends(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Stability Metrics (30d)</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {trends.map((trend) => (
                    <div key={trend.parameter} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-600">{trend.parameter}</span>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.status === 'STABLE' ? 'bg-green-100 text-green-800' :
                                    trend.status === 'DRIFTING' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                }`}>
                                {trend.status}
                            </span>
                        </div>
                        <div className="flex items-end justify-between">
                            <div>
                                <span className="text-2xl font-bold text-gray-900">{trend.score}%</span>
                                <span className="text-xs text-gray-500 ml-1">score</span>
                            </div>
                            <div className="text-sm text-gray-500">
                                {trend.trend === 'flat' && '→ Stable'}
                                {trend.trend === 'up' && '↗ Improving'}
                                {trend.trend === 'down' && '↘ Declining'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
