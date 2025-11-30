import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkData() {
    const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('email', 'maxine.mustermann@gmail.com')
        .single();

    console.log('User ID:', user?.id);

    const { data: userLabs } = await supabase
        .from('user_labs')
        .select('lab_id')
        .eq('user_id', user?.id);

    console.log('User has', userLabs?.length, 'labs');

    const labIds = userLabs?.map(l => l.lab_id) || [];

    const { data: labs } = await supabase
        .from('labs')
        .select('*')
        .in('id', labIds);

    console.log('\nLabs:');
    labs?.forEach(lab => console.log(' -', lab.lab_name));

    const { data: equipment } = await supabase
        .from('equipment')
        .select('*')
        .in('lab_id', labIds);

    console.log('\nEquipment count:', equipment?.length);
    console.log('\nFirst 5 equipment:');
    equipment?.slice(0, 5).forEach(eq => {
        console.log(' -', eq.equipment_name, '(lab_id:', eq.lab_id, ')');
    });
}

checkData().then(() => process.exit(0));
