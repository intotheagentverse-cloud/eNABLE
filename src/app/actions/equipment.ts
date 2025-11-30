'use server'

import { supabase } from '@/lib/supabase';
import { Equipment } from '@/types/database';
import { revalidatePath } from 'next/cache';

export async function getEquipmentList(labId: string): Promise<Equipment[]> {
    const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('lab_id', labId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching equipment:', error);
        return [];
    }

    return (data || []) as Equipment[];
}

export async function getEquipmentById(id: string): Promise<Equipment | null> {
    const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching equipment:', error);
        return null;
    }

    return data as Equipment;
}

export async function addEquipment(formData: FormData) {
    const rawData = {
        lab_id: formData.get('lab_id') as string,
        equipment_name: formData.get('equipment_name') as string,
        manufacturer: formData.get('manufacturer') as string,
        model: formData.get('model') as string,
        serial_number: formData.get('serial_number') as string || null,
        location: formData.get('location') as string || null,
        status: 'ACTIVE',
        // Set defaults for other fields
        equipment_category: null,
        equipment_type: null,
        nabl_risk_level: 'MEDIUM',
        calibration_interval_days: 365,
        lab_tier: 'TIER_1',
        integration_method: null,
        integration_status: 'Pending Setup',
    };

    const { error } = await supabase
        .from('equipment')
        .insert(rawData);

    if (error) {
        console.error('Error adding equipment:', error);
        return { success: false, message: `Failed to add equipment: ${error.message}` };
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

export async function updateEquipment(id: string, formData: FormData) {
    const rawData = {
        equipment_name: formData.get('equipment_name') as string,
        equipment_category: formData.get('equipment_category') as string,
        equipment_type: formData.get('equipment_type') as string,
        equipment_brand: formData.get('equipment_brand') as string,
        manufacturer: formData.get('equipment_brand') as string,
        model: formData.get('model') as string,
        serial_number: formData.get('serial_number') as string,
        nabl_risk_level: formData.get('nabl_risk_level') as string,
        calibration_interval_days: parseInt(formData.get('calibration_interval_days') as string),
        location: formData.get('location') as string,
        integration_method: formData.get('integration_method') as string,
        integration_status: formData.get('integration_status') as string,
        updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
        .from('equipment')
        .update(rawData)
        .eq('id', id);

    if (error) {
        console.error('Error updating equipment:', error);
        return { success: false, message: 'Failed to update equipment' };
    }

    revalidatePath('/dashboard/equipment');
    revalidatePath(`/dashboard/equipment/${id}`);
    return { success: true, message: 'Equipment updated successfully' };
}

export async function deleteEquipment(id: string) {
    // Soft delete by setting status to ARCHIVED
    const { error } = await supabase
        .from('equipment')
        .update({ status: 'ARCHIVED', updated_at: new Date().toISOString() })
        .eq('id', id);

    if (error) {
        console.error('Error deleting equipment:', error);
        return { success: false, message: 'Failed to delete equipment' };
    }

    revalidatePath('/dashboard/equipment');
    return { success: true, message: 'Equipment deleted successfully' };
}
