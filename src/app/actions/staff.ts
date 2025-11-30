'use server'

import { supabase } from '@/lib/supabase';
import { StaffMember, TrainingRecord, Certificate } from '@/types/database';
import { revalidatePath } from 'next/cache';

export async function getStaffMembers(labId: string): Promise<StaffMember[]> {
    const { data, error } = await supabase
        .from('staff_members')
        .select('*')
        .eq('lab_id', labId)
        .order('full_name', { ascending: true });

    if (error) {
        console.error('Error fetching staff:', error);
        return [];
    }

    return data || [];
}

export async function getStaffMember(id: string): Promise<StaffMember | null> {
    const { data, error } = await supabase
        .from('staff_members')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching staff member:', error);
        return null;
    }

    return data;
}

export async function getTrainingRecords(staffId: string): Promise<any[]> {
    const { data, error } = await supabase
        .from('training_records')
        .select('*, program:training_programs(program_name, program_type)')
        .eq('staff_id', staffId)
        .order('training_date', { ascending: false });

    if (error) {
        console.error('Error fetching training records:', error);
        return [];
    }

    return data || [];
}

export async function getExpiringTraining(labId: string, daysAhead: number = 30) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);

    const { data, error } = await supabase
        .from('training_records')
        .select('*, staff:staff_members!inner(full_name, lab_id), program:training_programs(program_name)')
        .eq('staff.lab_id', labId)
        .not('expiry_date', 'is', null)
        .lte('expiry_date', targetDate.toISOString().split('T')[0])
        .order('expiry_date', { ascending: true });

    if (error) {
        console.error('Error fetching expiring training:', error);
        return [];
    }

    return data || [];
}

export async function getCertificates(staffId: string): Promise<Certificate[]> {
    const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('staff_id', staffId)
        .order('expiry_date', { ascending: true });

    if (error) {
        console.error('Error fetching certificates:', error);
        return [];
    }

    return data || [];
}

export async function getExpiringCertificates(labId: string, daysAhead: number = 60) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);

    const { data, error } = await supabase
        .from('certificates')
        .select('*, staff:staff_members!inner(full_name, lab_id)')
        .eq('staff.lab_id', labId)
        .not('expiry_date', 'is', null)
        .lte('expiry_date', targetDate.toISOString().split('T')[0])
        .eq('status', 'VALID')
        .order('expiry_date', { ascending: true });

    if (error) {
        console.error('Error fetching expiring certificates:', error);
        return [];
    }

    return data || [];
}

export async function addStaffMember(formData: FormData) {
    const rawData = {
        lab_id: formData.get('lab_id') as string,
        employee_id: formData.get('employee_id') as string,
        full_name: formData.get('full_name') as string,
        role: formData.get('role') as string,
        department: formData.get('department') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        hire_date: formData.get('hire_date') as string,
        status: 'ACTIVE',
    };

    const { error } = await supabase
        .from('staff_members')
        .insert(rawData);

    if (error) {
        console.error('Error adding staff member:', error);
        return { success: false, message: 'Failed to add staff member' };
    }

    revalidatePath('/dashboard/staff');
    return { success: true, message: 'Staff member added successfully' };
}

export async function addTrainingRecord(formData: FormData) {
    const trainingData: any = {
        staff_id: formData.get('staff_id') as string,
        program_id: formData.get('program_id') as string,
        training_date: formData.get('training_date') as string,
        trainer: formData.get('trainer') as string,
        score: formData.get('score') ? parseFloat(formData.get('score') as string) : null,
        pass_fail: formData.get('pass_fail') as string,
        certificate_issued: formData.get('certificate_issued') === 'true',
        notes: formData.get('notes') as string,
    };

    // Calculate expiry date if validity months provided
    const validityMonths = formData.get('validity_months');
    if (validityMonths) {
        const expiryDate = new Date(trainingData.training_date);
        expiryDate.setMonth(expiryDate.getMonth() + parseInt(validityMonths as string));
        trainingData.expiry_date = expiryDate.toISOString().split('T')[0];
    }

    const { error } = await supabase
        .from('training_records')
        .insert(trainingData);

    if (error) {
        console.error('Error adding training record:', error);
        return { success: false, message: 'Failed to add training record' };
    }

    revalidatePath(`/dashboard/staff/${trainingData.staff_id}`);
    return { success: true, message: 'Training record added successfully' };
}
