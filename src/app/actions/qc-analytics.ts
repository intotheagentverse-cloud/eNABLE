'use server';

import { supabase } from '@/lib/supabase';
import { QCResult } from './qc-import';

export interface QCTrendData {
    testName: string;
    controlName: string;
    lotNumber: string;
    data: QCResult[];
}

/**
 * Fetch QC trend data for a specific test and control
 */
export async function getQCTrendData(
    testName: string,
    controlName: string,
    days: number = 30
): Promise<QCResult[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
        .from('qc_results')
        .select('*')
        .eq('test_name', testName)
        .eq('control_name', controlName)
        .gte('measurement_date', startDate.toISOString().split('T')[0])
        .order('measurement_date', { ascending: true })
        .order('measurement_time', { ascending: true });

    if (error) {
        throw new Error(`Failed to fetch QC trend data: ${error.message}`);
    }

    return data as QCResult[];
}

/**
 * Fetch all unique test/control combinations
 */
export async function getQCTestList(): Promise<{ testName: string; controlName: string; lotNumber: string }[]> {
    const { data, error } = await supabase
        .from('qc_results')
        .select('test_name, control_name, lot_number')
        .order('test_name');

    if (error) {
        throw new Error(`Failed to fetch QC test list: ${error.message}`);
    }

    // Get unique combinations
    const unique = new Map<string, { testName: string; controlName: string; lotNumber: string }>();
    data.forEach((row: any) => {
        const key = `${row.test_name}|${row.control_name}|${row.lot_number}`;
        if (!unique.has(key)) {
            unique.set(key, {
                testName: row.test_name,
                controlName: row.control_name,
                lotNumber: row.lot_number,
            });
        }
    });

    return Array.from(unique.values());
}

/**
 * Fetch all QC data for a lab within a date range
 */
export async function getAllQCData(labId: string, days: number = 30): Promise<QCResult[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
        .from('qc_results')
        .select('*')
        .gte('measurement_date', startDate.toISOString().split('T')[0])
        .order('measurement_date', { ascending: true });

    if (error) {
        throw new Error(`Failed to fetch QC data: ${error.message}`);
    }

    return data as QCResult[];
}
