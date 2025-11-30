import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();
    const { root_cause, corrective_action, status, investigated_by } = body;

    const updates: any = {};
    if (root_cause !== undefined) updates.root_cause = root_cause;
    if (corrective_action !== undefined) updates.corrective_action = corrective_action;
    if (status !== undefined) updates.status = status;
    if (investigated_by !== undefined) updates.investigated_by = investigated_by;

    if (status === 'RESOLVED' || status === 'CLOSED') {
        updates.resolved_at = new Date().toISOString();
    }

    const { data, error } = await supabase
        .from('qc_deviations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
