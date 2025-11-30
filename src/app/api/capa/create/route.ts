import { NextRequest, NextResponse } from 'next/server';
import { createCAPA } from '@/app/actions/audits';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const result = await createCAPA(formData);

        if (!result.success) {
            return NextResponse.json(
                { error: result.message },
                { status: 500 }
            );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('CAPA API Error:', error);
        return NextResponse.json(
            { error: 'Failed to create CAPA' },
            { status: 500 }
        );
    }
}
