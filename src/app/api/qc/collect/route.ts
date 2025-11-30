import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkWestgardRules } from '@/lib/westgard';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { equipment_id, parameter_name, result, test_date, control_level, unit } = body;

        if (!equipment_id || !parameter_name || result === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Fetch Control Limits
        const { data: limits, error: limitsError } = await supabase
            .from('control_limits')
            .select('*')
            .eq('equipment_id', equipment_id)
            .eq('parameter_name', parameter_name)
            .eq('control_level', control_level)
            .single();

        if (limitsError || !limits) {
            return NextResponse.json({ error: 'Control limits not found' }, { status: 404 });
        }

        // 2. Fetch History (last 10 results)
        const { data: historyData, error: historyError } = await supabase
            .from('qc_tests')
            .select('result_obtained')
            .eq('equipment_id', equipment_id)
            .eq('parameter_name', parameter_name)
            .eq('control_level', control_level)
            .order('test_date', { ascending: false })
            .limit(10);

        const history = historyData?.map(d => d.result_obtained as number) || [];

        // 3. Run Westgard Rules
        const westgardResult = checkWestgardRules(
            result,
            history,
            limits.mean_value,
            limits.sd_value
        );

        // 4. Insert Test Result
        const { data: testResult, error: insertError } = await supabase
            .from('qc_tests')
            .insert({
                equipment_id,
                parameter_name,
                control_level,
                test_date,
                result_obtained: result,
                unit: unit || 'mg/dL',
                control_value: limits.mean_value,
                expected_range_low: limits.mean_value - (2 * limits.sd_value),
                expected_range_high: limits.mean_value + (2 * limits.sd_value),
                status: westgardResult.status === 'PASS' ? 'PASS' : 'FAIL',
                validation_status: westgardResult.status === 'PASS' ? 'VALID' : (westgardResult.status === 'WARNING' ? 'VALID' : 'VIOLATION'),
                violation_rule: westgardResult.rule
            })
            .select()
            .single();

        if (insertError) {
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }

        // 5. Create Deviation if Violation
        if (westgardResult.status === 'REJECT') {
            const { error: deviationError } = await supabase
                .from('qc_deviations')
                .insert({
                    test_id: testResult.id,
                    status: 'OPEN',
                    created_at: new Date().toISOString()
                });

            if (deviationError) {
                console.error('Failed to create deviation:', deviationError);
            }
        }

        return NextResponse.json({
            success: true,
            test: testResult,
            westgard: westgardResult
        });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
