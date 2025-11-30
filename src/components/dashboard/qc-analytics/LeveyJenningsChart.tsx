'use client';

import { useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
    Scatter,
    ComposedChart,
} from 'recharts';
import { ChartDataPoint, ControlLimits } from '@/lib/levey-jennings';

interface LeveyJenningsChartProps {
    data: ChartDataPoint[];
    limits: ControlLimits;
    testName: string;
    controlName: string;
    unit: string;
}

export default function LeveyJenningsChart({
    data,
    limits,
    testName,
    controlName,
    unit,
}: LeveyJenningsChartProps) {
    const chartData = useMemo(() => {
        return data.map((point, index) => ({
            ...point,
            index: index + 1,
            displayDate: new Date(point.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            }),
        }));
    }, [data]);

    const getPointColor = (status: string) => {
        switch (status) {
            case 'Pass':
                return '#10b981'; // green
            case 'Warning':
                return '#f59e0b'; // yellow
            case 'Fail':
                return '#ef4444'; // red
            default:
                return '#6b7280'; // gray
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Levey-Jennings Chart: {testName}
                </h3>
                <p className="text-sm text-gray-500">
                    Control: {controlName} | Unit: {unit}
                </p>
            </div>

            <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                    <XAxis
                        dataKey="displayDate"
                        tick={{ fontSize: 12 }}
                        label={{ value: 'Date', position: 'insideBottom', offset: -10 }}
                    />

                    <YAxis
                        tick={{ fontSize: 12 }}
                        label={{ value: `Result (${unit})`, angle: -90, position: 'insideLeft' }}
                        domain={[limits.minus3sd * 0.95, limits.plus3sd * 1.05]}
                    />

                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                    <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                                        <p className="font-medium text-gray-900">{data.displayDate}</p>
                                        <p className="text-sm text-gray-600">Time: {data.time}</p>
                                        <p className="text-sm">
                                            <span className="font-medium">Value:</span> {data.value.toFixed(2)} {unit}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Z-Score:</span> {data.zScore.toFixed(2)}
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
                                        {data.operator && (
                                            <p className="text-sm text-gray-600">Operator: {data.operator}</p>
                                        )}
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />

                    <Legend />

                    {/* Control Limit Lines */}
                    <ReferenceLine y={limits.mean} stroke="#3b82f6" strokeWidth={2} label="Mean" />
                    <ReferenceLine
                        y={limits.plus1sd}
                        stroke="#10b981"
                        strokeDasharray="5 5"
                        label="+1SD"
                    />
                    <ReferenceLine
                        y={limits.minus1sd}
                        stroke="#10b981"
                        strokeDasharray="5 5"
                        label="-1SD"
                    />
                    <ReferenceLine
                        y={limits.plus2sd}
                        stroke="#f59e0b"
                        strokeDasharray="5 5"
                        label="+2SD"
                    />
                    <ReferenceLine
                        y={limits.minus2sd}
                        stroke="#f59e0b"
                        strokeDasharray="5 5"
                        label="-2SD"
                    />
                    <ReferenceLine
                        y={limits.plus3sd}
                        stroke="#ef4444"
                        strokeDasharray="5 5"
                        label="+3SD"
                    />
                    <ReferenceLine
                        y={limits.minus3sd}
                        stroke="#ef4444"
                        strokeDasharray="5 5"
                        label="-3SD"
                    />

                    {/* Data Points */}
                    <Scatter
                        dataKey="value"
                        fill="#3b82f6"
                        shape={(props: any) => {
                            const { cx, cy, payload } = props;
                            return (
                                <circle
                                    cx={cx}
                                    cy={cy}
                                    r={5}
                                    fill={getPointColor(payload.status)}
                                    stroke="#fff"
                                    strokeWidth={2}
                                />
                            );
                        }}
                    />

                    {/* Connecting Line */}
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#94a3b8"
                        strokeWidth={1}
                        dot={false}
                    />
                </ComposedChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Pass (±2SD)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>Warning (±3SD)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>Fail (&gt;3SD)</span>
                </div>
            </div>

            {/* Statistics Summary */}
            <div className="mt-6 grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                    <p className="text-xs text-gray-500 uppercase">Mean</p>
                    <p className="text-lg font-semibold text-gray-900">{limits.mean.toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase">SD</p>
                    <p className="text-lg font-semibold text-gray-900">{limits.sd.toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase">CV%</p>
                    <p className="text-lg font-semibold text-gray-900">{limits.cv.toFixed(2)}%</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase">N</p>
                    <p className="text-lg font-semibold text-gray-900">{data.length}</p>
                </div>
            </div>
        </div>
    );
}
