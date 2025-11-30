'use client'

import { QCTest, ControlLimit } from '@/types/database';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    ResponsiveContainer,
    Legend
} from 'recharts';

interface QCChartProps {
    data: QCTest[];
    limits: ControlLimit;
}

export default function QCChart({ data, limits }: QCChartProps) {
    const { mean_value, sd_value } = limits;
    const plus1SD = mean_value + sd_value;
    const plus2SD = mean_value + (2 * sd_value);
    const plus3SD = mean_value + (3 * sd_value);
    const minus1SD = mean_value - sd_value;
    const minus2SD = mean_value - (2 * sd_value);
    const minus3SD = mean_value - (3 * sd_value);

    // Format data for chart
    const chartData = data.map(d => ({
        date: new Date(d.test_date).toLocaleDateString(),
        value: d.result_obtained,
        status: d.status,
        validation_status: d.validation_status,
        violation_rule: d.violation_rule,
        details: d
    }));

    const getPointColor = (status: string | null, validation: string | null) => {
        if (validation === 'VIOLATION') return '#ff0000'; // Red for violation
        if (validation === 'WARNING') return '#f59e0b'; // Amber for warning
        if (status === 'FAIL') return '#ef4444'; // Red for generic fail
        return '#2563eb'; // Blue for pass
    };

    return (
        <div className="h-96 w-full bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4 text-center">
                Levy-Jennings Chart ({limits.parameter_name} - {limits.control_level})
            </h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[minus3SD - sd_value, plus3SD + sd_value]} />
                    <Tooltip
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                    <div className="bg-white p-3 border border-gray-200 shadow-lg rounded z-10">
                                        <p className="font-bold mb-1">{label}</p>
                                        <p className="mb-1">Value: {data.value}</p>
                                        <p className={`font-medium ${data.validation_status === 'VIOLATION' ? 'text-red-600' :
                                                data.validation_status === 'WARNING' ? 'text-amber-600' : 'text-green-600'
                                            }`}>
                                            Status: {data.validation_status || data.status}
                                        </p>
                                        {data.violation_rule && (
                                            <p className="text-red-600 text-sm mt-1">
                                                Rule: {data.violation_rule}
                                            </p>
                                        )}
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Legend />

                    {/* Mean Line */}
                    <ReferenceLine y={mean_value} stroke="#666" strokeDasharray="3 3" label="Mean" />

                    {/* SD Lines */}
                    <ReferenceLine y={plus1SD} stroke="#e5e7eb" strokeDasharray="3 3" />
                    <ReferenceLine y={minus1SD} stroke="#e5e7eb" strokeDasharray="3 3" />

                    <ReferenceLine y={plus2SD} stroke="#fcd34d" label={{ value: '+2SD', fill: '#d97706', fontSize: 12 }} />
                    <ReferenceLine y={minus2SD} stroke="#fcd34d" label={{ value: '-2SD', fill: '#d97706', fontSize: 12 }} />

                    <ReferenceLine y={plus3SD} stroke="#ef4444" label={{ value: '+3SD', fill: '#ef4444', fontSize: 12 }} />
                    <ReferenceLine y={minus3SD} stroke="#ef4444" label={{ value: '-3SD', fill: '#ef4444', fontSize: 12 }} />

                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#2563eb"
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                        dot={(props: any) => {
                            const { cx, cy, payload } = props;
                            const color = getPointColor(payload.status, payload.validation_status);
                            const isViolation = payload.validation_status === 'VIOLATION';

                            return (
                                <circle
                                    cx={cx}
                                    cy={cy}
                                    r={isViolation ? 6 : 4}
                                    fill={color}
                                    stroke={isViolation ? "#fff" : "none"}
                                    strokeWidth={isViolation ? 2 : 0}
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => {
                                        if (isViolation) {
                                            // TODO: Open deviation modal
                                            console.log('Clicked violation:', payload);
                                        }
                                    }}
                                />
                            );
                        }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
