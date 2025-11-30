import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase
        .from('qc_deviations')
        .select(`
            *,
            qc_tests (
                equipment_id,
                parameter_name,
                test_date,
                result_obtained,
                violation_rule,
                equipment: equipment_id (
                    equipment_name
                )
            )
        `)
        .order('created_at', { ascending: false });

    if (status) {
        query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
