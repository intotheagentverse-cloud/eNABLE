'use server'

import { supabase } from '@/lib/supabase';

export type User = {
    id: string;
    full_name: string;
    email: string;
    role: string;
    phone?: string;
};

export type Lab = {
    id: string;
    lab_name: string;
    lab_code: string;
    lab_tier: string;
    address?: string;
    city?: string;
    state?: string;
    phone?: string;
    email?: string;
    nabl_certificate_number?: string;
    status: string;
};

export type UserLab = {
    id: string;
    user_id: string;
    lab_id: string;
    role: string;
    is_primary: boolean;
    lab?: Lab;
};

/**
 * Sign up a new user
 */
export async function signUp(email: string, password: string, fullName: string) {
    try {
        // Create auth user in Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) {
            return { success: false, message: authError.message };
        }

        if (!authData.user) {
            return { success: false, message: 'Failed to create user' };
        }

        // Create user profile
        const { error: profileError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                full_name: fullName,
                email: email,
                role: 'LAB_MANAGER',
            });

        if (profileError) {
            return { success: false, message: profileError.message };
        }

        return { success: true, user: authData.user };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

/**
 * Sign in an existing user
 */
export async function signIn(email: string, password: string) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { success: false, message: error.message };
        }

        return { success: true, user: data.user };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

/**
 * Sign out the current user
 */
export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            return { success: false, message: error.message };
        }

        return { success: true };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return { success: false, user: null };
        }

        // Get user profile
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError) {
            return { success: false, user: null };
        }

        return { success: true, user: profile as User };
    } catch (error: any) {
        return { success: false, user: null };
    }
}

/**
 * Get all labs for a user
 */
export async function getUserLabs(userId: string) {
    try {
        const { data, error } = await supabase
            .from('user_labs')
            .select(`
                *,
                lab:labs(*)
            `)
            .eq('user_id', userId)
            .order('is_primary', { ascending: false });

        if (error) {
            return { success: false, labs: [], message: error.message };
        }

        return { success: true, labs: data as UserLab[] };
    } catch (error: any) {
        return { success: false, labs: [], message: error.message };
    }
}

/**
 * Get primary lab for a user
 */
export async function getPrimaryLab(userId: string) {
    try {
        const { data, error } = await supabase
            .from('user_labs')
            .select(`
                *,
                lab:labs(*)
            `)
            .eq('user_id', userId)
            .eq('is_primary', true)
            .single();

        if (error) {
            // If no primary lab, get the first lab
            const { data: firstLab, error: firstLabError } = await supabase
                .from('user_labs')
                .select(`
                    *,
                    lab:labs(*)
                `)
                .eq('user_id', userId)
                .limit(1)
                .single();

            if (firstLabError) {
                return { success: false, lab: null, message: firstLabError.message };
            }

            return { success: true, lab: firstLab as UserLab };
        }

        return { success: true, lab: data as UserLab };
    } catch (error: any) {
        return { success: false, lab: null, message: error.message };
    }
}

/**
 * Create a new lab
 */
export async function createLab(labData: Partial<Lab>) {
    try {
        const { data, error } = await supabase
            .from('labs')
            .insert(labData)
            .select()
            .single();

        if (error) {
            return { success: false, message: error.message };
        }

        return { success: true, lab: data as Lab };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

/**
 * Link a user to a lab
 */
export async function linkUserToLab(userId: string, labId: string, role: string, isPrimary: boolean = false) {
    try {
        const { data, error } = await supabase
            .from('user_labs')
            .insert({
                user_id: userId,
                lab_id: labId,
                role,
                is_primary: isPrimary,
            })
            .select()
            .single();

        if (error) {
            return { success: false, message: error.message };
        }

        return { success: true, userLab: data };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
