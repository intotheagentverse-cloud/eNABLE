'use server'

import { supabase } from '@/lib/supabase';
import { ValidationLog } from '@/types/database';
import { revalidatePath } from 'next/cache';

export async function getValidationHistory(equipmentId: string): Promise<ValidationLog[]> {
    const { data, error } = await supabase
        .from('equipment_validations')
        .select('*')
        .eq('equipment_id', equipmentId)
        .order('validation_date', { ascending: false });

    if (error) {
        console.error('Error fetching validation history:', error);
        return [];
    }

    return data || [];
}

export async function getValidationOverview(labId: string) {
    // For overview, we want to know how many pending validations (PQ mainly as it's recurring)
    // and recent validations.

    // 1. Fetch all equipments for this lab to filter
    const { data: equipment } = await supabase
        .from('equipment')
        .select('id')
        .eq('lab_id', labId);

    if (!equipment || equipment.length === 0) {
        return {
            totalValidations: 0,
            recent: [],
            pendingIQ: 0,
            pendingOQ: 0,
            pendingPQ: 0
        };
    }

    const equipmentIds = equipment.map(e => e.id);

    // 2. Fetch stats
    const { data: validations, error } = await supabase
        .from('equipment_validations')
        .select('*')
        .in('equipment_id', equipmentIds)
        .order('validation_date', { ascending: false });

    if (error) {
        console.error('Error fetching validations:', error);
        return {
            totalValidations: 0,
            recent: [],
            pendingIQ: 0,
            pendingOQ: 0,
            pendingPQ: 0
        };
    }

    // Calculate stats
    // Ideally pending would be based on equipment status or missing validations, 
    // but here we just count "PENDING" status logs for simplicity for now.
    const pendingIQ = validations.filter(v => v.validation_type === 'IQ' && v.status === 'PENDING').length;
    const pendingOQ = validations.filter(v => v.validation_type === 'OQ' && v.status === 'PENDING').length;
    const pendingPQ = validations.filter(v => v.validation_type === 'PQ' && v.status === 'PENDING').length;

    return {
        totalValidations: validations.filter(v => v.status === 'PASS').length,
        recent: validations.slice(0, 5),
        pendingIQ,
        pendingOQ,
        pendingPQ
    };
}

export async function logValidation(formData: FormData) {
    const equipmentId = formData.get('equipment_id') as string;

    const rawData = {
        equipment_id: equipmentId,
        validation_type: formData.get('validation_type') as 'IQ' | 'OQ' | 'PQ',
        status: formData.get('status') as 'PASS' | 'FAIL' | 'PENDING',
        validation_date: formData.get('validation_date') as string,
        performed_by: formData.get('performed_by') as string,
        report_url: formData.get('report_url') as string,
        notes: formData.get('notes') as string,
        next_validation_due: formData.get('next_validation_due') as string || null,
    };

    const { error } = await supabase
        .from('equipment_validations')
        .insert(rawData);

    if (error) {
        console.error('Error logging validation:', error);
        return { success: false, message: 'Failed to log validation' };
    }

    revalidatePath(`/dashboard/equipment/${equipmentId}`);
    revalidatePath('/dashboard/equipment');
    return { success: true, message: 'Validation logged successfully' };
}
