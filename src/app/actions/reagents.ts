'use server'

import { supabase } from '@/lib/supabase';
import { Reagent, ReagentLot } from '@/types/database';
import { revalidatePath } from 'next/cache';

export async function getReagents(labId: string): Promise<Reagent[]> {
    const { data, error } = await supabase
        .from('reagents')
        .select('*')
        .eq('lab_id', labId)
        .order('reagent_name', { ascending: true });

    if (error) {
        console.error('Error fetching reagents:', error);
        return [];
    }

    return data || [];
}

export async function getReagentLots(reagentId?: string): Promise<any[]> {
    let query = supabase
        .from('reagent_lots')
        .select('*, reagent:reagents(reagent_name, supplier)');

    if (reagentId) {
        query = query.eq('reagent_id', reagentId);
    }

    const { data, error } = await query.order('expiry_date', { ascending: true });

    if (error) {
        console.error('Error fetching reagent lots:', error);
        return [];
    }

    return data || [];
}

export async function getExpiringReagents(labId: string, daysAhead: number = 30) {
    // Get all lots expiring within daysAhead
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);

    const { data, error } = await supabase
        .from('reagent_lots')
        .select('*, reagent:reagents!inner(reagent_name, lab_id)')
        .eq('reagent.lab_id', labId)
        .lte('expiry_date', targetDate.toISOString().split('T')[0])
        .eq('status', 'IN_USE')
        .order('expiry_date', { ascending: true });

    if (error) {
        console.error('Error fetching expiring reagents:', error);
        return [];
    }

    return data || [];
}

export async function addReagent(formData: FormData) {
    const rawData = {
        lab_id: formData.get('lab_id') as string,
        reagent_name: formData.get('reagent_name') as string,
        reagent_type: formData.get('reagent_type') as string,
        catalog_number: formData.get('catalog_number') as string,
        supplier: formData.get('supplier') as string,
        storage_condition: formData.get('storage_condition') as string,
        unit: formData.get('unit') as string,
        reorder_level: parseInt(formData.get('reorder_level') as string) || null,
    };

    const { error } = await supabase
        .from('reagents')
        .insert(rawData);

    if (error) {
        console.error('Error adding reagent:', error);
        return { success: false, message: 'Failed to add reagent' };
    }

    revalidatePath('/dashboard/reagents');
    return { success: true, message: 'Reagent added successfully' };
}

export async function receiveReagentLot(formData: FormData) {
    const lotData = {
        reagent_id: formData.get('reagent_id') as string,
        lot_number: formData.get('lot_number') as string,
        quantity_received: parseInt(formData.get('quantity') as string),
        quantity_remaining: parseInt(formData.get('quantity') as string),
        expiry_date: formData.get('expiry_date') as string,
        received_date: formData.get('received_date') as string || new Date().toISOString().split('T')[0],
        location: formData.get('location') as string,
        status: 'IN_USE',
    };

    const { data, error } = await supabase
        .from('reagent_lots')
        .insert(lotData)
        .select()
        .single();

    if (error) {
        console.error('Error receiving reagent lot:', error);
        return { success: false, message: 'Failed to receive reagent lot' };
    }

    // Log transaction
    await supabase.from('inventory_transactions').insert({
        reagent_lot_id: data.id,
        transaction_type: 'RECEIVE',
        quantity: lotData.quantity_received,
        performed_by: formData.get('performed_by') as string,
        notes: `Received lot ${lotData.lot_number}`,
    });

    revalidatePath('/dashboard/reagents');
    return { success: true, message: 'Reagent lot received successfully' };
}

export async function useReagent(lotId: string, quantity: number, performedBy: string) {
    // Get current lot
    const { data: lot, error: fetchError } = await supabase
        .from('reagent_lots')
        .select('*')
        .eq('id', lotId)
        .single();

    if (fetchError || !lot) {
        return { success: false, message: 'Lot not found' };
    }

    const newQuantity = (lot.quantity_remaining || 0) - quantity;

    if (newQuantity < 0) {
        return { success: false, message: 'Insufficient quantity' };
    }

    // Update lot quantity
    const { error: updateError } = await supabase
        .from('reagent_lots')
        .update({ quantity_remaining: newQuantity })
        .eq('id', lotId);

    if (updateError) {
        return { success: false, message: 'Failed to update quantity' };
    }

    // Log transaction
    await supabase.from('inventory_transactions').insert({
        reagent_lot_id: lotId,
        transaction_type: 'USE',
        quantity: -quantity,
        performed_by: performedBy,
    });

    revalidatePath('/dashboard/reagents');
    return { success: true, message: 'Reagent usage logged' };
}
