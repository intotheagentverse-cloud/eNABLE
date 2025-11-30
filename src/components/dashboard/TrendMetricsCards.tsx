'use client'

import { useEffect, useState } from 'react';

type TrendCard = {
    parameter: string;
    score: number;
    status: 'STABLE' | 'DRIFTING' | 'CRITICAL';
    trend: 'up' | 'down' | 'flat';
    period: string;
};

export default function TrendMetricsCards() {
    const [trends, setTrends] = useState<TrendCard[]>([
        {
            parameter: 'Glucose',
            score: 98,
            status: 'STABLE',
            trend: 'flat',
            period: '30d'
        },
        {
            parameter: 'Cholesterol',
            score: 92,
            status: 'DRIFTING',
            trend: 'down',
            period: '30d'
        },
        {
            parameter: 'Hgb',
            score: 99,
            status: 'STABLE',
            trend: 'flat',
            period: '30d'
        }
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'STABLE':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'DRIFTING':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case 'CRITICAL':
                return 'bg-red-50 border-red-200 text-red-800';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'STABLE':
                return (
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'DRIFTING':
                return (
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                );
            case 'CRITICAL':
                return (
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up':
                return '↗';
            case 'down':
                return '↘';
            case 'flat':
                return '→';
            default:
                return '→';
        }
    };

    return (
        <div className="grid grid-cols-1 gap-4">
            {trends.map((trend) => (
                <div
                    key={trend.parameter}
                    className={`border-2 rounded-lg p-4 ${getStatusColor(trend.status)} transition-all hover:shadow-md`}
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                            {getStatusIcon(trend.status)}
                            <div>
                                <h4 className="font-semibold text-gray-900">{trend.parameter}</h4>
                                <p className="text-xs text-gray-600">Last {trend.period}</p>
                            </div>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${trend.status === 'STABLE' ? 'bg-green-100 text-green-800' :
                                trend.status === 'DRIFTING' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                            }`}>
                            {trend.status}
                        </span>
                    </div>

                    <div className="flex items-end justify-between">
                        <div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-gray-900">{trend.score}</span>
                                <span className="text-sm text-gray-600">/ 100</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">Stability Score</p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-gray-700">{getTrendIcon(trend.trend)}</div>
                            <p className="text-xs text-gray-600 capitalize">{trend.trend}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
