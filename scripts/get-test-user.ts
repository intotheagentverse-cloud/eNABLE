import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { TEST_LAB_ID } from '../src/lib/constants';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function getTestUser() {
    const { data, error } = await supabase
        .from('user_labs')
        .select('user_id')
        .eq('lab_id', TEST_LAB_ID)
        .single();

    if (error) {
        console.error('Error fetching user:', error);
        return;
    }

    console.log(`User ID for Lab ${TEST_LAB_ID}: ${data.user_id}`);
}

getTestUser();
