'use server'

import { supabase } from '@/lib/supabase';
import { ControlLimit, QCTest } from '@/types/database';
import { checkWestgardRules, QCDataPoint } from '@/lib/westgard';
import { revalidatePath } from 'next/cache';

export async function getQCData(equipmentId: string, parameter: string, level: string): Promise<QCTest[]> {
    const { data, error } = await supabase
        .from('qc_tests')
        .select('*')
        .eq('equipment_id', equipmentId)
        .eq('parameter_name', parameter)
        .eq('control_level', level)
        .order('test_date', { ascending: true });

    if (error) {
        console.error('Error fetching QC data:', error);
        return [];
    }

    return data || [];
}

export async function getControlLimits(equipmentId: string, parameter: string, level: string): Promise<ControlLimit | null> {
    const { data, error } = await supabase
        .from('equipment_control_limits')
        .select('*')
        .eq('equipment_id', equipmentId)
        .eq('parameter_name', parameter)
        .eq('control_level', level)
        .single();

    if (error && error.code !== 'PGRST116') { // Ignore not found error
        console.error('Error fetching control limits:', error);
    }

    return data;
}

export async function setControlLimits(formData: FormData) {
    const rawData = {
        equipment_id: formData.get('equipment_id') as string,
        parameter_name: formData.get('parameter_name') as string,
        control_level: formData.get('control_level') as string,
        mean_value: parseFloat(formData.get('mean_value') as string),
        sd_value: parseFloat(formData.get('sd_value') as string),
    };

    const { error } = await supabase
        .from('equipment_control_limits')
        .upsert(rawData, { onConflict: 'equipment_id, parameter_name, control_level' });

    if (error) {
        console.error('Error setting limits:', error);
        return { success: false, message: 'Failed to set limits' };
    }

    revalidatePath('/dashboard/qc');
    return { success: true, message: 'Limits saved successfully' };
}

export async function logQCResult(formData: FormData) {
    const equipmentId = formData.get('equipment_id') as string;
    const parameter = formData.get('parameter_name') as string;
    const level = formData.get('control_level') as string;
    const result = parseFloat(formData.get('result_obtained') as string);
    const labId = formData.get('lab_id') as string;

    // Fetch limits to check rules
    const limits = await getControlLimits(equipmentId, parameter, level);
    let status = 'PASS';
    let violationRule = null;

    if (limits) {
        // Fetch recent history for Westgard check
        const history = await getQCData(equipmentId, parameter, level);

        // Build QCDataPoint array
        const dataPoints: QCDataPoint[] = [
            ...history.map(h => ({
                value: h.result_obtained || 0,
                mean: limits.mean_value,
                sd: limits.sd_value,
                date: h.test_date
            })),
            {
                value: result,
                mean: limits.mean_value,
                sd: limits.sd_value,
                date: formData.get('test_date') as string || new Date().toISOString()
            }
        ];

        // Check Westgard rules
        const violations = checkWestgardRules(dataPoints);
        const latestViolation = violations.length > 0 ? violations[violations.length - 1] : null;

        if (latestViolation) {
            status = latestViolation.rule === '1_2s' ? 'WARNING: 1-2s' : `REJECT: ${latestViolation.rule}`;
            violationRule = latestViolation.rule;
        }
    }

    const rawData = {
        lab_id: labId,
        equipment_id: equipmentId,
        test_date: formData.get('test_date') as string,
        test_time: new Date().toLocaleTimeString(),
        parameter_name: parameter,
        control_level: level,
        result_obtained: result,
        status: status,
        violation_rule: violationRule,
        // Optional: Store expected ranges if needed for other reports
        expected_range_low: limits ? limits.mean_value - (2 * limits.sd_value) : null,
        expected_range_high: limits ? limits.mean_value + (2 * limits.sd_value) : null,
    };

    const { error } = await supabase
        .from('qc_tests')
        .insert(rawData);

    if (error) {
        console.error('Error logging QC result:', error);
        return { success: false, message: 'Failed to log result' };
    }

    revalidatePath('/dashboard/qc');
    return { success: true, message: 'QC result logged successfully' };
}
