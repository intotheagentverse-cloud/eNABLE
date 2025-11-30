import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedTier1User() {
    console.log('🌱 Seeding Tier 1 Solo Lab User...\n');

    // 1. Create User Account
    console.log('Creating user account...');
    const timestamp = Date.now();
    const email = `james.tendulkar.${timestamp}@gmail.com`;
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: 'password123',
    });

    if (authError) {
        console.error('❌ Error creating auth user:', authError.message);
        return;
    }

    const userId = authData.user!.id;
    console.log('✅ User created:', userId);

    // 2. Create User Profile
    const { error: profileError } = await supabase.from('users').insert({
        id: userId,
        full_name: 'Dr. James Tendulkar',
        email: email,
        role: 'LAB_MANAGER',
        phone: '+91-98765-43210',
    });

    if (profileError) {
        console.error('❌ Error creating profile:', profileError.message);
        return;
    }
    console.log('✅ User profile created');

    // 3. Create Lab
    console.log('\nCreating lab...');
    const { data: lab, error: labError } = await supabase
        .from('labs')
        .insert({
            lab_name: 'PathLab Diagnostics',
            lab_code: `PLD${timestamp}`,
            lab_tier: 'TIER_1',
            address: '123 Medical Street, Ground Floor',
            city: 'Pune',
            state: 'Maharashtra',
            postal_code: '411001',
            phone: '+91-20-1234-5678',
            email: 'info@pathlab.com',
            nabl_certificate_number: 'TC-1234',
            nabl_valid_until: '2025-12-31',
            status: 'ACTIVE',
        })
        .select()
        .single();

    if (labError) {
        console.error('❌ Error creating lab:', labError.message);
        return;
    }
    const labId = lab.id;
    console.log('✅ Lab created:', lab.lab_name);

    // 4. Link User to Lab
    const { error: linkError } = await supabase.from('user_labs').insert({
        user_id: userId,
        lab_id: labId,
        role: 'OWNER',
        is_primary: true,
    });

    if (linkError) {
        console.error('❌ Error linking user to lab:', linkError.message);
        return;
    }
    console.log('✅ User linked to lab');

    // 5. Create Equipment
    console.log('\nCreating equipment...');
    const equipment = [
        {
            lab_id: labId,
            equipment_name: 'Hematology Analyzer - Main Lab',
            // equipment_category: 'hematology', // Column missing in DB
            equipment_type: 'Automated Hematology Analyzer (Mid-Range)',
            manufacturer: 'Sysmex',
            model: 'XN-550',
            serial_number: 'SYS-XN550-2023-001',
            location: 'Main Lab - Station 1',
            status: 'ACTIVE',
            // integration_method: 'Network (TCP/IP)', // Column missing in DB
            // integration_status: 'Integrated', // Column missing in DB
        },
        {
            lab_id: labId,
            equipment_name: 'Chemistry Analyzer - Main Lab',
            // equipment_category: 'clinical_chemistry', // Column missing in DB
            equipment_type: 'Chemistry Analyzer (Mid-Range)',
            manufacturer: 'Roche',
            model: 'Cobas c111',
            serial_number: 'ROC-C111-2023-045',
            location: 'Main Lab - Station 2',
            status: 'ACTIVE',
            // integration_method: 'Serial (RS-232)', // Column missing in DB
            // integration_status: 'Integrated', // Column missing in DB
        },
        {
            lab_id: labId,
            equipment_name: 'Microscope - Pathology',
            // equipment_category: 'basic_lab', // Column missing in DB
            equipment_type: 'Microscope (Binocular)',
            manufacturer: 'Olympus',
            model: 'CX23',
            serial_number: 'OLY-CX23-2022-112',
            location: 'Pathology Section',
            status: 'ACTIVE',
            // integration_method: 'Manual Entry', // Column missing in DB
            // integration_status: 'Manual Entry', // Column missing in DB
        },
    ];

    const { data: equipmentData, error: equipmentError } = await supabase
        .from('equipment')
        .insert(equipment)
        .select();

    if (equipmentError) {
        console.error('❌ Error creating equipment:', equipmentError.message);
        return;
    }
    console.log(`✅ Created ${equipmentData.length} equipment items`);

    // 6. Create Calibration Records
    console.log('\nCreating calibration records...');
    const calibrations = [
        {
            equipment_id: equipmentData[0].id,
            calibration_date: '2024-10-15',
            next_due_date: '2025-10-15',
            calibration_provider: 'Sysmex India Pvt Ltd',
            certificate_number: 'CAL-2024-SYS-001',
            si_traceability_chain: 'NABL → NPL India → BIPM',
            measurement_uncertainty: 0.02,
            performed_by: 'Sysmex Engineer',
            status: 'PASS',
        },
        {
            equipment_id: equipmentData[1].id,
            calibration_date: '2024-09-20',
            next_due_date: '2025-03-20',
            calibration_provider: 'Roche Diagnostics India',
            certificate_number: 'CAL-2024-ROC-045',
            si_traceability_chain: 'NABL → NPL India → BIPM',
            measurement_uncertainty: 0.015,
            performed_by: 'Roche Service Team',
            status: 'PASS',
        },
    ];

    const { error: calibrationError } = await supabase
        .from('calibrations')
        .insert(calibrations);

    if (calibrationError) {
        console.error('❌ Error creating calibrations:', calibrationError.message);
        return;
    }
    console.log(`✅ Created ${calibrations.length} calibration records`);

    // 7. Create Staff Members
    console.log('\nCreating staff members...');
    const staff = [
        {
            lab_id: labId,
            employee_id: 'PLD-001',
            full_name: 'Dr. James Tendulkar',
            role: 'Lab Manager',
            department: 'Administration',
            email: 'james.tendulkar@pathlab.com',
            phone: '+91-98765-43210',
            hire_date: '2020-01-15',
            status: 'ACTIVE',
        },
        {
            lab_id: labId,
            employee_id: 'PLD-002',
            full_name: 'Amit Patel',
            role: 'Senior Technician',
            department: 'Hematology',
            email: 'amit.patel@pathlab.com',
            phone: '+91-98765-43211',
            hire_date: '2021-06-01',
            status: 'ACTIVE',
        },
        {
            lab_id: labId,
            employee_id: 'PLD-003',
            full_name: 'Sneha Desai',
            role: 'Lab Technician',
            department: 'Clinical Chemistry',
            email: 'sneha.desai@pathlab.com',
            phone: '+91-98765-43212',
            hire_date: '2022-03-15',
            status: 'ACTIVE',
        },
    ];

    const { error: staffError } = await supabase.from('staff_members').insert(staff);

    if (staffError) {
        console.error('❌ Error creating staff:', staffError.message);
        return;
    }
    console.log(`✅ Created ${staff.length} staff members`);

    // 8. Create QC Data (30 days)
    console.log('\nCreating QC test data...');
    const qcTests = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
        const testDate = new Date(today);
        testDate.setDate(testDate.getDate() - i);

        // Hematology QC
        qcTests.push({
            lab_id: labId,
            equipment_id: equipmentData[0].id,
            test_date: testDate.toISOString().split('T')[0],
            test_time: '08:30:00',
            parameter_name: 'WBC',
            control_level: 'L1',
            control_value: 7.5,
            result_obtained: 7.5 + (Math.random() - 0.5) * 0.3,
            expected_range_low: 7.0,
            expected_range_high: 8.0,
            unit: '10^9/L',
            status: 'PASS',
            created_by: 'Amit Patel',
        });

        // Chemistry QC
        qcTests.push({
            lab_id: labId,
            equipment_id: equipmentData[1].id,
            test_date: testDate.toISOString().split('T')[0],
            test_time: '09:00:00',
            parameter_name: 'Glucose',
            control_level: 'L1',
            control_value: 100,
            result_obtained: 100 + (Math.random() - 0.5) * 5,
            expected_range_low: 95,
            expected_range_high: 105,
            unit: 'mg/dL',
            status: 'PASS',
            created_by: 'Sneha Desai',
        });
    }

    const { error: qcError } = await supabase.from('qc_tests').insert(qcTests);

    if (qcError) {
        console.error('❌ Error creating QC tests:', qcError.message);
        return;
    }
    console.log(`✅ Created ${qcTests.length} QC test records`);

    console.log('\n✨ Tier 1 user seeding completed successfully!');
    console.log('\n📧 Login credentials:');
    console.log(`   Email: ${email}`);
    console.log('   Password: password123');
    console.log(`\n🔑 LAB ID: ${labId}`);
}

seedTier1User()
    .then(() => {
        console.log('\n✅ Seeding complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Seeding failed:', error);
        process.exit(1);
    });
