'use server';

import { supabase } from '@/lib/supabase';
import { checkWestgardRules, QCDataPoint, WestgardViolation } from '@/lib/westgard';
import { QCResult } from './qc-import';

/**
 * Evaluates QC data for a specific test series (test + control + lot)
 * and updates the database with any Westgard rule violations.
 */
export async function evaluateQCSeries(
    testName: string,
    controlName: string,
    lotNumber: string, // qc_tests doesn't have lot_number directly in schema shown, might be in JSON or ignored for now. 
    // If lot_number is critical for Westgard (it is), we assume it's either not in schema or we filter by date/equipment.
    // For now, let's ignore lotNumber in query if column doesn't exist, or assume it's added.
    // Given the schema in database.ts, there is NO lot_number in qc_tests.
    // This is a gap. But let's proceed with equipment + parameter + level.
    labId: string,
    equipmentId?: string
) {
    // 1. Fetch data for this series, sorted by date
    let query = supabase
        .from('qc_tests')
        .select('*')
        .eq('parameter_name', testName)
        .eq('control_level', controlName)
        .order('test_date', { ascending: true })
        .order('test_time', { ascending: true });

    if (equipmentId) {
        query = query.eq('equipment_id', equipmentId);
    }

    const { data: results, error } = await query;

    if (error) {
        console.error('Error fetching QC data for evaluation:', error);
        return { success: false, message: error.message };
    }

    if (!results || results.length === 0) {
        return { success: true, message: 'No data to evaluate' };
    }

    // 2. Map to QCDataPoint
    // We need mean and SD. qc_tests doesn't have them. 
    // They are in equipment_control_limits.
    // We should fetch them once.

    // Fetch limits
    const { data: limits } = await supabase
        .from('equipment_control_limits')
        .select('*')
        .eq('equipment_id', equipmentId || results[0].equipment_id)
        .eq('parameter_name', testName)
        .eq('control_level', controlName)
        .single();

    if (!limits) {
        // Cannot evaluate without limits
        return { success: false, message: 'No control limits found for evaluation' };
    }

    const points: QCDataPoint[] = results.map((r: any) => ({
        value: r.result_obtained,
        mean: limits.mean_value,
        sd: limits.sd_value,
        date: r.test_date
    }));

    // 3. Run Westgard Rules
    const violations = checkWestgardRules(points);

    // 4. Update database with violations
    const resultsWithStatus = results.map((r, index) => ({
        id: r.id,
        status: 'PASS', // Default to PASS
        violation: null as string | null
    }));

    for (const v of violations) {
        if (resultsWithStatus[v.index]) {
            resultsWithStatus[v.index].status = v.rule === '1_2s' ? 'WARNING' : 'FAIL'; // Map to DB enum if needed
            resultsWithStatus[v.index].violation = v.rule;
        }
    }

    // Perform updates
    let updateCount = 0;
    for (const r of resultsWithStatus) {
        const original = results.find((or: any) => or.id === r.id);
        // Map status to match DB case if needed. DB uses uppercase often? 
        // database.ts says status: string | null. qc-import uses uppercase.
        const newStatus = r.status === 'WARNING' ? 'WARNING' : (r.status === 'FAIL' ? 'VIOLATION' : 'PASS');
        // database.ts QCTest validation_status: 'PENDING' | 'VALID' | 'INVALID' | 'VIOLATION'
        // But there is also `status` field.
        // Let's update `status` and `violation_rule`.

        if (original.status !== newStatus || original.violation_rule !== r.violation) {
            const { error: updateError } = await supabase
                .from('qc_tests')
                .update({
                    status: newStatus,
                    violation_rule: r.violation,
                    validation_status: newStatus === 'PASS' ? 'VALID' : 'VIOLATION'
                })
                .eq('id', r.id);

            if (!updateError) updateCount++;
        }
    }

    return {
        success: true,
        message: `Evaluated ${results.length} records. Updated ${updateCount} records with violations.`
    };
}
