'use server'

import { supabase } from '@/lib/supabase';
import { Audit, AuditFinding, CAPA } from '@/types/database';
import { revalidatePath } from 'next/cache';

export async function getAudits(labId: string): Promise<Audit[]> {
    const { data, error } = await supabase
        .from('audits')
        .select('*')
        .eq('lab_id', labId)
        .order('audit_date', { ascending: false });

    if (error) {
        console.error('Error fetching audits:', error);
        return [];
    }

    return data || [];
}

export async function getAudit(id: string): Promise<Audit | null> {
    const { data, error } = await supabase
        .from('audits')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching audit:', error);
        return null;
    }

    return data;
}

export async function getAuditFindings(auditId: string): Promise<AuditFinding[]> {
    const { data, error } = await supabase
        .from('audit_findings')
        .select('*')
        .eq('audit_id', auditId)
        .order('finding_number', { ascending: true });

    if (error) {
        console.error('Error fetching findings:', error);
        return [];
    }

    return data || [];
}

export async function getAllCAPA(labId?: string): Promise<any[]> {
    let query = supabase
        .from('capa')
        .select('*, finding:audit_findings(id, audit:audits(audit_title, lab_id))')
        .order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching CAPA:', error);
        return [];
    }

    // Filter by lab_id if provided
    if (labId && data) {
        return data.filter((c: any) => c.finding?.audit?.lab_id === labId);
    }

    return data || [];
}

export async function addAudit(formData: FormData) {
    const rawData = {
        lab_id: formData.get('lab_id') as string,
        audit_title: formData.get('audit_title') as string,
        audit_type: formData.get('audit_type') as string,
        department: formData.get('department') as string,
        audit_date: formData.get('audit_date') as string,
        lead_auditor: formData.get('lead_auditor') as string,
        auditee: formData.get('auditee') as string,
        status: 'SCHEDULED',
    };

    const { error } = await supabase
        .from('audits')
        .insert(rawData);

    if (error) {
        console.error('Error adding audit:', error);
        return { success: false, message: 'Failed to schedule audit' };
    }

    revalidatePath('/dashboard/audits');
    return { success: true, message: 'Audit scheduled successfully' };
}

export async function addFinding(formData: FormData) {
    const auditId = formData.get('audit_id') as string;

    // Get existing findings count to generate finding number
    const { count } = await supabase
        .from('audit_findings')
        .select('*', { count: 'exact', head: true })
        .eq('audit_id', auditId);

    const findingData = {
        audit_id: auditId,
        finding_number: `F${(count || 0) + 1}`,
        category: formData.get('category') as string,
        clause_reference: formData.get('clause_reference') as string,
        description: formData.get('description') as string,
        evidence: formData.get('evidence') as string,
    };

    const { error } = await supabase
        .from('audit_findings')
        .insert(findingData);

    if (error) {
        console.error('Error adding finding:', error);
        return { success: false, message: 'Failed to add finding' };
    }

    revalidatePath(`/dashboard/audits/${auditId}`);
    return { success: true, message: 'Finding added successfully' };
}

export async function createCAPA(formData: FormData) {
    // Generate CAPA number
    const year = new Date().getFullYear();
    const { count } = await supabase
        .from('capa')
        .select('*', { count: 'exact', head: true });

    const capaNumber = `CAPA-${year}-${String((count || 0) + 1).padStart(3, '0')}`;

    const capaData = {
        finding_id: formData.get('finding_id') as string || null,
        capa_number: capaNumber,
        capa_type: formData.get('capa_type') as string,
        issue_description: formData.get('issue_description') as string,
        root_cause: formData.get('root_cause') as string,
        action_plan: formData.get('action_plan') as string,
        responsible_person: formData.get('responsible_person') as string,
        target_date: formData.get('target_date') as string,
        status: 'OPEN',
    };

    const { error } = await supabase
        .from('capa')
        .insert(capaData);

    if (error) {
        console.error('Error creating CAPA:', error);
        return { success: false, message: 'Failed to create CAPA' };
    }

    revalidatePath('/dashboard/capa');
    return { success: true, message: 'CAPA created successfully', capaNumber };
}

export async function updateCAPAStatus(id: string, status: string, completionDate?: string) {
    const updateData: any = { status };
    if (completionDate) {
        updateData.completion_date = completionDate;
    }

    const { error } = await supabase
        .from('capa')
        .update(updateData)
        .eq('id', id);

    if (error) {
        console.error('Error updating CAPA:', error);
        return { success: false, message: 'Failed to update CAPA status' };
    }

    revalidatePath('/dashboard/capa');
    return { success: true, message: 'CAPA status updated' };
}
