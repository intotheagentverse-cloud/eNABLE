'use server'

import { supabase } from '@/lib/supabase';
import { Calibration, Equipment } from '@/types/database';
import { revalidatePath } from 'next/cache';

export async function getCalibrationOverview(labId: string) {
    // Fetch all equipment to check status
    const { data: equipment } = await supabase
        .from('equipment')
        .select('*')
        .eq('lab_id', labId)
        .neq('status', 'ARCHIVED');

    // Fetch recent calibrations
    const { data: recentCalibrations } = await supabase
        .from('calibrations')
        .select('*, equipment(equipment_name)')
        .order('calibration_date', { ascending: false })
        .limit(10);

    if (!equipment) return {
        total: 0,
        compliant: 0,
        overdue: 0,
        upcoming: [],
        recent: []
    };

    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    let compliantCount = 0;
    let overdueCount = 0;
    const upcoming: any[] = [];

    // We need to calculate status based on latest calibration for each equipment
    // For MVP, we'll assume the 'status' field on equipment is kept up to date or we check 'next_due_date' from the last calibration
    // But wait, the equipment table doesn't have 'next_due_date'. It's in the calibrations table.
    // We should probably fetch the latest calibration for each equipment.
    // To keep it simple and performant for MVP, let's rely on a join or just iterate if list is small.
    // Actually, let's just fetch all calibrations and process in memory (fine for small scale) or use a better query.

    // Better approach: Let's just look at the 'calibrations' table for "Next Due Date"
    // But we need the *latest* one for each equipment.

    // Alternative: We can just return the raw list of equipment and let the frontend/helper calculate status if we had the data.
    // Let's try to get "Upcoming" by querying calibrations where next_due_date is soon.
    // This might return old records though.

    // Let's stick to a simpler heuristic for now:
    // 1. Get all equipment.
    // 2. For each, get its latest calibration (N+1 query problem, but okay for MVP demo).

    const equipmentWithStatus = await Promise.all(equipment.map(async (eq) => {
        const { data: lastCal } = await supabase
            .from('calibrations')
            .select('*')
            .eq('equipment_id', eq.id)
            .order('calibration_date', { ascending: false })
            .limit(1)
            .single();

        let status = 'UNKNOWN';
        let nextDue = null;

        if (lastCal) {
            nextDue = new Date(lastCal.next_due_date);
            if (nextDue < today) {
                status = 'OVERDUE';
                overdueCount++;
            } else {
                status = 'COMPLIANT';
                compliantCount++;
                if (nextDue <= thirtyDaysFromNow) {
                    upcoming.push({
                        equipment_name: eq.equipment_name,
                        next_due_date: lastCal.next_due_date,
                        id: eq.id
                    });
                }
            }
        } else {
            // No calibration found
            status = 'PENDING'; // Treated as overdue/non-compliant usually
        }

        return { ...eq, calibrationStatus: status, nextDue: nextDue };
    }));

    // Fetch scheduled maintenance
    const { data: maintenance } = await supabase
        .from('maintenance_logs')
        .select('*, equipment(equipment_name)')
        .eq('status', 'SCHEDULED')
        .order('next_due_date', { ascending: true })
        .limit(5);

    return {
        total: equipment.length,
        compliant: compliantCount,
        overdue: overdueCount,
        upcoming: upcoming,
        recent: recentCalibrations || [],
        maintenance: maintenance || []
    };
}

export async function getCalibrationHistory(equipmentId: string): Promise<Calibration[]> {
    const { data, error } = await supabase
        .from('calibrations')
        .select('*')
        .eq('equipment_id', equipmentId)
        .order('calibration_date', { ascending: false });

    if (error) {
        console.error('Error fetching calibration history:', error);
        return [];
    }

    return data || [];
}

export async function logCalibration(formData: FormData) {
    const equipmentId = formData.get('equipment_id') as string;
    const calibrationDate = formData.get('calibration_date') as string;
    const intervalDays = parseInt(formData.get('interval_days') as string);

    // Calculate next due date
    const date = new Date(calibrationDate);
    date.setDate(date.getDate() + intervalDays);
    const nextDueDate = date.toISOString().split('T')[0];

    const rawData = {
        equipment_id: equipmentId,
        calibration_date: calibrationDate,
        next_due_date: nextDueDate,
        calibration_provider: formData.get('calibration_provider') as string,
        certificate_number: formData.get('certificate_number') as string,
        performed_by: formData.get('performed_by') as string,
        status: 'PASS',
    };

    const { error } = await supabase
        .from('calibrations')
        .insert(rawData);

    if (error) {
        console.error('Error logging calibration:', error);
        return { success: false, message: 'Failed to log calibration' };
    }

    revalidatePath(`/dashboard/equipment/${equipmentId}`);
    return { success: true, message: 'Calibration logged successfully' };
}

export async function getMaintenanceHistory(equipmentId: string) {
    const { data, error } = await supabase
        .from('maintenance_logs')
        .select('*')
        .eq('equipment_id', equipmentId)
        .order('maintenance_date', { ascending: false });

    if (error) {
        console.error('Error fetching maintenance history:', error);
        return [];
    }

    return data || [];
}

export async function addMaintenanceLog(formData: FormData) {
    const equipmentId = formData.get('equipment_id') as string;

    const rawData = {
        equipment_id: equipmentId,
        maintenance_date: formData.get('maintenance_date') as string,
        maintenance_type: formData.get('maintenance_type') as string,
        description: formData.get('description') as string,
        performed_by: formData.get('performed_by') as string,
        cost: formData.get('cost') ? parseFloat(formData.get('cost') as string) : null,
        next_due_date: formData.get('next_due_date') as string || null,
        status: 'COMPLETED' // Default to completed for now
    };

    const { error } = await supabase
        .from('maintenance_logs')
        .insert(rawData);

    if (error) {
        console.error('Error logging maintenance:', error);
        return { success: false, message: 'Failed to log maintenance' };
    }

    revalidatePath(`/dashboard/equipment/${equipmentId}`);
    return { success: true, message: 'Maintenance logged successfully' };
}
