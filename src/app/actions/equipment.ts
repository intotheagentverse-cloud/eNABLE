'use server'

import { supabase } from '@/lib/supabase';
import { Equipment } from '@/types/database';
import { revalidatePath } from 'next/cache';

export async function getEquipmentList(labId: string): Promise<Equipment[]> {
    // Return static data matching user request
    return [
        {
            id: 'eq-1',
            lab_id: labId,
            equipment_name: 'Hematology Analyzer - Central',
            equipment_category: 'Hematology',
            equipment_type: 'Analyzer',
            equipment_brand: 'Sysmex',
            manufacturer: 'Sysmex',
            model: 'XN-1000',
            serial_number: 'SYS-XN1000-2023-101',
            status: 'ACTIVE',
            integration_status: 'Active',
            integration_method: 'Network (TCP/IP)',
            location: 'Central Lab',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            nabl_risk_level: 'High',
            calibration_interval_days: 90,
            last_calibration_date: new Date().toISOString(),
            next_calibration_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            lab_tier: 'Tier 1'
        },
        {
            id: 'eq-2',
            lab_id: labId,
            equipment_name: 'Chemistry Analyzer - Central',
            equipment_category: 'Chemistry',
            equipment_type: 'Analyzer',
            equipment_brand: 'Roche',
            manufacturer: 'Roche',
            model: 'Cobas c6000',
            serial_number: 'ROC-C6000-2023-201',
            status: 'ACTIVE',
            integration_status: 'Active',
            integration_method: 'Network (TCP/IP)',
            location: 'Central Lab',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            nabl_risk_level: 'High',
            calibration_interval_days: 30,
            last_calibration_date: new Date().toISOString(),
            next_calibration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            lab_tier: 'Tier 1'
        },
        {
            id: 'eq-3',
            lab_id: labId,
            equipment_name: 'Immunoassay Analyzer - Central',
            equipment_category: 'Immunoassay',
            equipment_type: 'Analyzer',
            equipment_brand: 'Abbott',
            manufacturer: 'Abbott',
            model: 'Architect i2000',
            serial_number: 'ABT-i2000-2023-301',
            status: 'ACTIVE',
            integration_status: 'Active',
            integration_method: 'Network (TCP/IP)',
            location: 'Central Lab',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            nabl_risk_level: 'High',
            calibration_interval_days: 30,
            last_calibration_date: new Date().toISOString(),
            next_calibration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            lab_tier: 'Tier 1'
        }
    ] as any[];
}

export async function addEquipment(formData: FormData) {
    const rawData = {
        lab_id: formData.get('lab_id') as string,
        equipment_name: formData.get('equipment_name') as string,
        equipment_category: formData.get('equipment_category') as string,
        equipment_type: formData.get('equipment_type') as string,
        equipment_brand: formData.get('equipment_brand') as string,
        manufacturer: formData.get('equipment_brand') as string, // Use brand as manufacturer
        model: formData.get('model') as string,
        serial_number: formData.get('serial_number') as string,
        nabl_risk_level: formData.get('nabl_risk_level') as string,
        calibration_interval_days: parseInt(formData.get('calibration_interval_days') as string),
        location: formData.get('location') as string,
        status: 'ACTIVE',
        lab_tier: formData.get('lab_tier') as string,
        integration_method: formData.get('integration_method') as string,
        integration_status: formData.get('integration_status') as string || 'Pending Setup',
    };

    const { error } = await supabase
        .from('equipment')
        .insert(rawData);

    if (error) {
        console.error('Error adding equipment:', error);
        return { success: false, message: 'Failed to add equipment' };
    }

    revalidatePath('/dashboard/equipment');
    return { success: true, message: 'Equipment added successfully' };
}

export async function updateEquipmentStatus(id: string, status: string) {
    const { error } = await supabase
        .from('equipment')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

    if (error) {
        console.error('Error updating equipment status:', error);
        return { success: false, message: 'Failed to update status' };
    }

    revalidatePath('/dashboard/equipment');
    return { success: true, message: 'Status updated successfully' };
}
