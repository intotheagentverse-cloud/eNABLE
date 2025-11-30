'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Area,
    ComposedChart,
} from 'recharts';
import { ChartDataPoint } from '@/lib/levey-jennings';

interface ZScoreTrendChartProps {
    data: ChartDataPoint[];
    testName: string;
}

export default function ZScoreTrendChart({ data, testName }: ZScoreTrendChartProps) {
    const chartData = data.map((point, index) => ({
        ...point,
        index: index + 1,
        displayDate: new Date(point.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        }),
    }));

    // Detect outliers (|z-score| > 2)
    const outliers = chartData.filter(d => Math.abs(d.zScore) > 2);

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Z-Score Trend Analysis: {testName}
                </h3>
                <p className="text-sm text-gray-500">
                    Statistical deviation tracking and outlier detection
                </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                    <XAxis
                        dataKey="displayDate"
                        tick={{ fontSize: 12 }}
                        label={{ value: 'Date', position: 'insideBottom', offset: -10 }}
                    />

                    <YAxis
                        tick={{ fontSize: 12 }}
                        label={{ value: 'Z-Score', angle: -90, position: 'insideLeft' }}
                        domain={[-4, 4]}
                    />

                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                    <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                                        <p className="font-medium text-gray-900">{data.displayDate}</p>
                                        <p className="text-sm">
                                            <span className="font-medium">Z-Score:</span> {data.zScore.toFixed(2)}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Value:</span> {data.value.toFixed(2)}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Status:</span>{' '}
                                            <span
                                                className={`font-medium ${data.status === 'Pass'
                                                        ? 'text-green-600'
                                                        : data.status === 'Warning'
                                                            ? 'text-yellow-600'
                                                            : 'text-red-600'
                                                    }`}
                                            >
                                                {data.status}
                                            </span>
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />

                    {/* Control zones */}
                    <Area
                        type="monotone"
                        dataKey={() => 2}
                        fill="#fef3c7"
                        fillOpacity={0.3}
                        stroke="none"
                    />
                    <Area
                        type="monotone"
                        dataKey={() => -2}
                        fill="#fef3c7"
                        fillOpacity={0.3}
                        stroke="none"
                    />

                    {/* Reference lines */}
                    <ReferenceLine y={0} stroke="#3b82f6" strokeWidth={2} label="Mean" />
                    <ReferenceLine y={2} stroke="#f59e0b" strokeDasharray="5 5" label="+2SD" />
                    <ReferenceLine y={-2} stroke="#f59e0b" strokeDasharray="5 5" label="-2SD" />
                    <ReferenceLine y={3} stroke="#ef4444" strokeDasharray="5 5" label="+3SD" />
                    <ReferenceLine y={-3} stroke="#ef4444" strokeDasharray="5 5" label="-3SD" />

                    {/* Z-Score line */}
                    <Line
                        type="monotone"
                        dataKey="zScore"
                        stroke="#6366f1"
                        strokeWidth={2}
                        dot={(props: any) => {
                            const { cx, cy, payload } = props;
                            const isOutlier = Math.abs(payload.zScore) > 2;
                            return (
                                <circle
                                    cx={cx}
                                    cy={cy}
                                    r={isOutlier ? 6 : 4}
                                    fill={isOutlier ? '#ef4444' : '#6366f1'}
                                    stroke="#fff"
                                    strokeWidth={2}
                                />
                            );
                        }}
                    />
                </ComposedChart>
            </ResponsiveContainer>

            {/* Outlier Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <p className="text-xs text-gray-500 uppercase">Total Points</p>
                        <p className="text-lg font-semibold text-gray-900">{data.length}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase">Outliers (&gt;2SD)</p>
                        <p className="text-lg font-semibold text-red-600">{outliers.length}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase">Outlier Rate</p>
                        <p className="text-lg font-semibold text-gray-900">
                            {((outliers.length / data.length) * 100).toFixed(1)}%
                        </p>
                    </div>
                </div>
            </div>

            {/* Outlier List */}
            {outliers.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Detected Outliers</h4>
                    <div className="space-y-2">
                        {outliers.slice(0, 5).map((outlier, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded"
                            >
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {new Date(outlier.date).toLocaleDateString()}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        Value: {outlier.value.toFixed(2)} | Z-Score: {outlier.zScore.toFixed(2)}
                                    </p>
                                </div>
                                <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                                    {outlier.status}
                                </span>
                            </div>
                        ))}
                        {outliers.length > 5 && (
                            <p className="text-xs text-gray-500 text-center">
                                +{outliers.length - 5} more outliers
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
