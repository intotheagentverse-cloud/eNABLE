import { NextRequest, NextResponse } from 'next/server';

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { query } = body;

        if (!query) {
            return NextResponse.json(
                { error: 'Query is required' },
                { status: 400 }
            );
        }

        // Forward request to RAG service
        const response = await fetch(`${RAG_SERVICE_URL}/query/smart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: errorData.detail || 'RAG service error' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('RAG API Error:', error);
        return NextResponse.json(
            {
                error: 'Failed to connect to RAG service. Make sure the service is running on port 8000.',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
