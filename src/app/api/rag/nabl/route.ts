import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch('http://localhost:8000/query/smart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error('RAG service error');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('NABL API error:', error);
        return NextResponse.json(
            { error: 'Failed to get response from NABL assistant' },
            { status: 500 }
        );
    }
}
