'use server'

import { supabase } from '@/lib/supabase';

export async function getUserLabs(userId: string) {
    const { data: userLabs, error } = await supabase
        .from('user_labs')
        .select(`
            lab_id,
            role,
            is_primary,
            labs (
                id,
                lab_name,
                lab_code,
                lab_tier
            )
        `)
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching user labs:', error);
        return [];
    }

    // Flatten the structure
    return userLabs.map((ul: any) => ({
        id: ul.labs.id,
        name: ul.labs.lab_name,
        code: ul.labs.lab_code,
        tier: ul.labs.lab_tier,
        role: ul.role,
        is_primary: ul.is_primary
    }));
}
