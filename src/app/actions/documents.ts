'use server'

import { supabase } from '@/lib/supabase';
import { Document, DocumentVersion } from '@/types/database';
import { revalidatePath } from 'next/cache';

export async function getDocuments(labId: string): Promise<Document[]> {
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('lab_id', labId)
        .order('document_number', { ascending: true });

    if (error) {
        console.error('Error fetching documents:', error);
        return [];
    }

    return data || [];
}

export async function getDocument(id: string): Promise<Document | null> {
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching document:', error);
        return null;
    }

    return data;
}

export async function getDocumentVersions(documentId: string): Promise<DocumentVersion[]> {
    const { data, error } = await supabase
        .from('document_versions')
        .select('*')
        .eq('document_id', documentId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching document versions:', error);
        return [];
    }

    return data || [];
}

export async function addDocument(formData: FormData) {
    const rawData: any = {
        lab_id: formData.get('lab_id') as string,
        document_number: formData.get('document_number') as string,
        document_title: formData.get('document_title') as string,
        document_type: formData.get('document_type') as string,
        department: formData.get('department') as string,
        current_version: '1.0',
        status: 'DRAFT',
        review_frequency_days: parseInt(formData.get('review_frequency_days') as string) || 365,
        owner: formData.get('owner') as string,
    };

    // Calculate next review date
    const reviewDate = new Date();
    reviewDate.setDate(reviewDate.getDate() + (rawData.review_frequency_days || 365));
    rawData.next_review_date = reviewDate.toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('documents')
        .insert(rawData)
        .select()
        .single();

    if (error) {
        console.error('Error adding document:', error);
        return { success: false, message: 'Failed to add document', document: null };
    }

    // Create initial version
    const versionData = {
        document_id: data.id,
        version_number: '1.0',
        change_summary: 'Initial version',
        created_by: formData.get('owner') as string,
    };

    await supabase.from('document_versions').insert(versionData);

    revalidatePath('/dashboard/documents');
    return { success: true, message: 'Document added successfully', document: data };
}

export async function addDocumentVersion(formData: FormData) {
    const documentId = formData.get('document_id') as string;
    const versionNumber = formData.get('version_number') as string;

    const versionData = {
        document_id: documentId,
        version_number: versionNumber,
        file_url: formData.get('file_url') as string,
        change_summary: formData.get('change_summary') as string,
        created_by: formData.get('created_by') as string,
    };

    const { error } = await supabase
        .from('document_versions')
        .insert(versionData);

    if (error) {
        console.error('Error adding version:', error);
        return { success: false, message: 'Failed to add version' };
    }

    // Update document current version
    await supabase
        .from('documents')
        .update({ current_version: versionNumber })
        .eq('id', documentId);

    revalidatePath(`/dashboard/documents/${documentId}`);
    return { success: true, message: 'Version added successfully' };
}

export async function approveDocument(documentId: string, approvedBy: string) {
    const { error } = await supabase
        .from('documents')
        .update({ status: 'APPROVED' })
        .eq('id', documentId);

    if (error) {
        console.error('Error approving document:', error);
        return { success: false, message: 'Failed to approve document' };
    }

    revalidatePath(`/dashboard/documents/${documentId}`);
    return { success: true, message: 'Document approved successfully' };
}
