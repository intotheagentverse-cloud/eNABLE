import { NextResponse } from 'next/server';

export async function GET() {
    // In a real implementation, this would calculate trends from qc_tests
    // or query a pre-aggregated qc_trends table.
    // For now, returning mock data as per prototype requirements.

    const trends = [
        {
            parameter: 'Glucose',
            period: '30d',
            score: 98,
            status: 'STABLE',
            trend: 'flat'
        },
        {
            parameter: 'Cholesterol',
            period: '30d',
            score: 92,
            status: 'DRIFTING',
            trend: 'down'
        },
        {
            parameter: 'Hgb',
            period: '30d',
            score: 99,
            status: 'STABLE',
            trend: 'flat'
        }
    ];

    return NextResponse.json(trends);
}
