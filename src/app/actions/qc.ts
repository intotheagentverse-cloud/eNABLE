'use server'

import { supabase } from '@/lib/supabase';
import { ControlLimit, QCTest } from '@/types/database';
import { revalidatePath } from 'next/cache';

// Helper to check Westgard Rules
function checkWestgardRules(result: number, mean: number, sd: number, history: number[]): string {
    const zScore = (result - mean) / sd;
    const absZ = Math.abs(zScore);

    // 1-3s Rule (Rejection): Result outside 3SD
    if (absZ > 3) return 'REJECT: 1-3s';

    // 2-2s Rule (Rejection): Two consecutive results > 2SD on same side
    // (Simplified check against last result only for now)
    if (history.length > 0) {
        const lastZ = (history[0] - mean) / sd;
        if (absZ > 2 && Math.abs(lastZ) > 2 && Math.sign(zScore) === Math.sign(lastZ)) {
            return 'REJECT: 2-2s';
        }
    }

    // 1-2s Rule (Warning): Result outside 2SD
    if (absZ > 2) return 'WARNING: 1-2s';

    return 'PASS';
}

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

    if (limits) {
        // Fetch last result for history check
        const history = await getQCData(equipmentId, parameter, level);
        const lastResult = history.length > 0 ? history[history.length - 1].result_obtained : null;
        const historyValues = lastResult !== null ? [lastResult] : [];

        status = checkWestgardRules(result, limits.mean_value, limits.sd_value, historyValues);
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
        // Optional: Store expected ranges if needed for other reports
        expected_range_low: limits ? limits.mean_value - (2 * limits.sd_value) : null,
        expected_range_high: limits ? limits.mean_value + (2 * limits.sd_value) : null,
    };

    const { error } = await supabase
        .from('qc_tests')
        .insert(rawData);

    if (error) {
        console.error('Error logging QC:', error);
        return { success: false, message: 'Failed to log QC result' };
    }

    revalidatePath('/dashboard/qc');
    return { success: true, message: `QC Logged: ${status}` };
}
