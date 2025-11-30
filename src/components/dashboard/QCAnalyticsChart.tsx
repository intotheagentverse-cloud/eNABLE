'use client'

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

export default function QCAnalyticsChart({ data }: { data: any[] }) {
    return (
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pass" name="Pass" stackId="a" fill="#22c55e" />
                    <Bar dataKey="fail" name="Fail" stackId="a" fill="#ef4444" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
