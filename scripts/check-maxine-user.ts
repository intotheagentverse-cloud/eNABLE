import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkUser() {
    // Check if user exists in users table
    const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('email', 'maxine.mustermann@gmail.com')
        .single();

    console.log('User in users table:', user);

    // Try to sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'maxine.mustermann@gmail.com',
        password: 'password123',
    });

    if (signInError) {
        console.log('\n❌ Sign in error:', signInError.message);
        console.log('Error details:', signInError);
    } else {
        console.log('\n✅ Sign in successful!');
        console.log('User ID:', signInData.user?.id);
    }
}

checkUser().then(() => process.exit(0));
