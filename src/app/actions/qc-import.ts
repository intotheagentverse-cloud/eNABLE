'use server';

import Papa from 'papaparse';
import { supabase } from '@/lib/supabase';

export interface QCResult {
    control_name: string;
    lot_number: string;
    test_name: string;
    result_value: number;
    unit: string;
    target_mean: number;
    target_sd: number;
    measurement_date: string;
    measurement_time: string;
    analyzer_id: string;
    qc_status: 'Pass' | 'Fail' | 'Warning';
    operator_id?: string;
    module?: string;
    reagent_lot?: string;
    cv_percent?: number;
    z_score?: number;
    westgard_rule_violation?: string;
}

export interface ValidationError {
    row: number;
    field: string;
    error: string;
}

export interface ParseResult {
    status: 'success' | 'error';
    data?: QCResult[];
    errors?: ValidationError[];
    message?: string;
}

// Column mapping for different analyzer types
const COLUMN_MAPPINGS: Record<string, Record<string, string[]>> = {
    'Abbott ARCHITECT': {
        control_name: ['Control Name', 'Control', 'QC Name'],
        lot_number: ['Lot Number', 'Lot', 'Lot #'],
        test_name: ['Test Name', 'Test', 'Analyte', 'Parameter'],
        result_value: ['Result', 'Value', 'Result Value', 'QC Result'],
        unit: ['Unit', 'Units'],
        target_mean: ['Target Mean', 'T.Mean', 'Mean', 'Expected Mean'],
        target_sd: ['Target SD', 'T.SD', 'SD', 'Expected SD'],
        measurement_date: ['Date', 'Measurement Date', 'Test Date'],
        measurement_time: ['Time', 'Measurement Time', 'Test Time'],
        analyzer_id: ['Analyzer ID', 'Module', 'Instrument', 'System ID'],
        qc_status: ['Status', 'QC Status', 'Result', 'Pass/Fail'],
    },
    'Roche cobas 6000': {
        control_name: ['Control Name', 'Control', 'QC Material'],
        lot_number: ['Lot Number', 'Lot'],
        test_name: ['Test', 'Test Name', 'Analyte'],
        result_value: ['Result', 'Value'],
        unit: ['Unit'],
        target_mean: ['Mean', 'Target'],
        target_sd: ['SD', 'Std Dev'],
        measurement_date: ['Date', 'Run Date'],
        measurement_time: ['Time', 'Run Time'],
        analyzer_id: ['Module', 'Analyzer'],
        qc_status: ['Status', 'Accept/Reject'],
    },
    'Beckman AU5800': {
        control_name: ['Control', 'QC Name'],
        lot_number: ['Lot', 'Lot Number'],
        test_name: ['Test', 'Parameter'],
        result_value: ['Result', 'Value'],
        unit: ['Unit'],
        target_mean: ['Mean', 'Target Mean'],
        target_sd: ['SD', 'Target SD'],
        measurement_date: ['Date'],
        measurement_time: ['Time'],
        analyzer_id: ['Analyzer', 'System'],
        qc_status: ['Status', 'Flag'],
    },
};

function findColumn(headers: string[], possibleNames: string[]): string | null {
    for (const candidate of possibleNames) {
        const match = headers.find(h => h.trim().toLowerCase() === candidate.toLowerCase());
        if (match) return match;
    }
    return null;
}

function parseDate(dateStr: string): string | null {
    // Try various date formats
    const formats = [
        /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
        /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY or MM/DD/YYYY
        /^\d{2}-\d{2}-\d{4}$/, // DD-MM-YYYY
    ];

    for (const format of formats) {
        if (format.test(dateStr)) {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
                return date.toISOString().split('T')[0];
            }
        }
    }
    return null;
}

function parseStatus(status: string): 'Pass' | 'Fail' | 'Warning' | null {
    const lower = status.toLowerCase().trim();
    if (['pass', 'ok', 'accept', 'accepted'].includes(lower)) return 'Pass';
    if (['fail', 'failed', 'reject', 'rejected'].includes(lower)) return 'Fail';
    if (['warning', 'warn', 'caution'].includes(lower)) return 'Warning';
    return null;
}

export async function parseQCFile(
    formData: FormData,
    analyzerType: string
): Promise<ParseResult> {
    try {
        const file = formData.get('file') as File;
        if (!file) {
            return {
                status: 'error',
                message: 'No file provided',
            };
        }

        const text = await file.text();
        const mapping = COLUMN_MAPPINGS[analyzerType];

        if (!mapping) {
            return {
                status: 'error',
                message: `Unsupported analyzer type: ${analyzerType}`,
            };
        }

        return new Promise((resolve) => {
            Papa.parse(text, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const headers = results.meta.fields || [];
                    const columnMap: Record<string, string> = {};
                    const errors: ValidationError[] = [];

                    // Find column mappings
                    for (const [field, candidates] of Object.entries(mapping)) {
                        const col = findColumn(headers, candidates);
                        if (col) {
                            columnMap[field] = col;
                        } else if (['control_name', 'lot_number', 'test_name', 'result_value', 'unit', 'target_mean', 'target_sd', 'measurement_date', 'measurement_time', 'analyzer_id', 'qc_status'].includes(field)) {
                            resolve({
                                status: 'error',
                                message: `Required column not found: ${field}`,
                            });
                            return;
                        }
                    }

                    // Parse and validate rows
                    const data: QCResult[] = [];
                    (results.data as Record<string, string>[]).forEach((row, idx) => {
                        try {
                            const result: any = {};

                            for (const [field, col] of Object.entries(columnMap)) {
                                const value = row[col];

                                if (field === 'result_value' || field === 'target_mean' || field === 'target_sd') {
                                    const num = parseFloat(value);
                                    if (isNaN(num)) {
                                        errors.push({ row: idx + 2, field, error: `Invalid number: '${value}'` });
                                        return;
                                    }
                                    result[field] = num;
                                } else if (field === 'measurement_date') {
                                    const date = parseDate(value);
                                    if (!date) {
                                        errors.push({ row: idx + 2, field, error: `Invalid date: '${value}'` });
                                        return;
                                    }
                                    result[field] = date;
                                } else if (field === 'qc_status') {
                                    const status = parseStatus(value);
                                    if (!status) {
                                        errors.push({ row: idx + 2, field, error: `Invalid status: '${value}'` });
                                        return;
                                    }
                                    result[field] = status;
                                } else {
                                    result[field] = value;
                                }
                            }

                            data.push(result as QCResult);
                        } catch (e) {
                            errors.push({ row: idx + 2, field: 'general', error: String(e) });
                        }
                    });

                    if (errors.length > 0) {
                        resolve({
                            status: 'error',
                            errors,
                            message: `CSV validation failed with ${errors.length} error(s)`,
                        });
                    } else {
                        resolve({
                            status: 'success',
                            data,
                        });
                    }
                },

            });
        });
    } catch (error) {
        return {
            status: 'error',
            message: `Error processing file: ${error}`,
        };
    }
}

export async function saveQCData(data: QCResult[], fileName: string): Promise<{
    status: 'success' | 'error';
    message: string;
    imported_count?: number;
    duplicate_count?: number;
}> {
    try {
        // Check for duplicates
        const duplicates: number[] = [];
        for (let i = 0; i < data.length; i++) {
            const record = data[i];
            const { data: existing } = await supabase
                .from('qc_results')
                .select('id')
                .eq('control_name', record.control_name)
                .eq('lot_number', record.lot_number)
                .eq('test_name', record.test_name)
                .eq('measurement_date', record.measurement_date)
                .eq('measurement_time', record.measurement_time);

            if (existing && existing.length > 0) {
                duplicates.push(i);
            }
        }

        // Filter out duplicates
        const newData = data.filter((_, i) => !duplicates.includes(i));

        if (newData.length === 0) {
            return {
                status: 'error',
                message: 'All records are duplicates',
            };
        }

        // Insert data
        const recordsToInsert = newData.map(record => ({
            ...record,
            source_file_name: fileName,
        }));

        const { error } = await supabase
            .from('qc_results')
            .insert(recordsToInsert);

        if (error) {
            throw error;
        }

        return {
            status: 'success',
            message: `Successfully imported ${newData.length} QC record(s)`,
            imported_count: newData.length,
            duplicate_count: duplicates.length,
        };
    } catch (error) {
        return {
            status: 'error',
            message: `Failed to save data: ${error}`,
        };
    }
}
