import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateTier2WithMagnumData() {
    console.log('🔄 Updating Tier 2 User (maxine.mustermann@gmail.com) with Magnum Life Sciences Data...\n');

    // Load the Magnum Life Sciences JSON data
    const dataPath = path.join(process.cwd(), '..', 'magnum_life_sciences_compliance_data.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const magnumData = JSON.parse(rawData);

    // 1. Find the existing Tier 2 user
    console.log('Finding existing Tier 2 user...');
    const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', 'maxine.mustermann@gmail.com')
        .single();

    if (userError || !existingUser) {
        console.error('❌ Tier 2 user not found. Please run seed-tier1-user.ts and seed-tier2-user.ts first');
        return;
    }

    const userId = existingUser.id;
    console.log(`✅ Found user: ${userId}`);

    // 2. Find and delete existing labs for this user
    console.log('\nRemoving old lab data...');
    const { data: oldLabs } = await supabase
        .from('user_labs')
        .select('lab_id')
        .eq('user_id', userId);

    if (oldLabs && oldLabs.length > 0) {
        const oldLabIds = oldLabs.map(ul => ul.lab_id);

        // Delete in correct order to respect foreign keys
        await supabase.from('qc_tests').delete().in('lab_id', oldLabIds);
        await supabase.from('calibrations').delete().in('equipment_id',
            (await supabase.from('equipment').select('id').in('lab_id', oldLabIds)).data?.map(e => e.id) || []
        );
        await supabase.from('equipment').delete().in('lab_id', oldLabIds);
        await supabase.from('reagent_lots').delete().in('reagent_id',
            (await supabase.from('reagents').select('id').in('lab_id', oldLabIds)).data?.map(r => r.id) || []
        );
        await supabase.from('reagents').delete().in('lab_id', oldLabIds);
        await supabase.from('user_labs').delete().in('lab_id', oldLabIds);
        await supabase.from('labs').delete().in('id', oldLabIds);

        console.log(`✅ Deleted ${oldLabIds.length} old labs and associated data`);
    }

    // 3. Create Magnum Life Sciences labs
    console.log('\nCreating Magnum Life Sciences labs...');
    const timestamp = Date.now();
    const labsToCreate = [];

    // Headquarters
    labsToCreate.push({
        lab_name: magnumData.lab_network.lab_name,
        lab_code: `${magnumData.lab_network.lab_id}-${timestamp}`,
        lab_tier: 'TIER_2',
        address: magnumData.lab_network.headquarters.address,
        city: 'Nagpur',
        state: 'Maharashtra',
        postal_code: '440002',
        phone: magnumData.lab_network.headquarters.phone,
        email: magnumData.lab_network.headquarters.email,
        nabl_certificate_number: magnumData.lab_network.nabl_accreditation.certificate_number,
        nabl_valid_until: magnumData.lab_network.nabl_accreditation.validity_date,
        status: 'ACTIVE',
    });

    // Branches
    for (const branch of magnumData.lab_network.branches) {
        labsToCreate.push({
            lab_name: branch.name,
            lab_code: `${branch.location_id}-${timestamp}`,
            lab_tier: 'TIER_2',
            address: branch.address,
            city: branch.name.includes('Wardha') ? 'Wardha' : branch.name.includes('Chandrapur') ? 'Chandrapur' : 'Amravati',
            state: 'Maharashtra',
            postal_code: branch.name.includes('Wardha') ? '442001' : branch.name.includes('Chandrapur') ? '442401' : '444601',
            phone: magnumData.lab_network.headquarters.phone,
            email: `${branch.location_id.toLowerCase()}@magnumlifesciences.com`,
            status: 'ACTIVE',
        });
    }

    const { data: labsData, error: labsError } = await supabase
        .from('labs')
        .insert(labsToCreate)
        .select();

    if (labsError) {
        console.error('❌ Error creating labs:', labsError.message);
        return;
    }
    console.log(`✅ Created ${labsData.length} Magnum labs`);

    // Create location ID mapping
    const locationMap: Record<string, string> = {};
    locationMap['LOC001'] = labsData[0].id; // HQ
    for (let i = 0; i < magnumData.lab_network.branches.length; i++) {
        locationMap[magnumData.lab_network.branches[i].location_id] = labsData[i + 1].id;
    }

    // 4. Link User to All Labs
    console.log('\nLinking user to Magnum labs...');
    const userLabLinks = labsData.map((lab, index) => ({
        user_id: userId,
        lab_id: lab.id,
        role: index === 0 ? 'OWNER' : 'MANAGER',
        is_primary: index === 0,
    }));

    const { error: linkError } = await supabase.from('user_labs').insert(userLabLinks);
    if (linkError) {
        console.error('❌ Error linking user to labs:', linkError.message);
        return;
    }
    console.log('✅ User linked to all Magnum labs');

    // 5. Create Equipment from Magnum data with detailed logging
    console.log('\n📋 Creating equipment with detailed distribution...\n');
    const equipmentByLab: Record<string, any[]> = {};

    for (const eq of magnumData.equipment_inventory.equipment) {
        const locationName = eq.location_id === 'LOC001' ? 'Nagpur HQ' :
            eq.location_id === 'LOC002' ? 'Wardha Branch' :
                eq.location_id === 'LOC003' ? 'Chandrapur Branch' : 'Amravati Branch';

        if (!equipmentByLab[locationName]) {
            equipmentByLab[locationName] = [];
        }
        equipmentByLab[locationName].push(eq);
    }

    // Log equipment distribution
    for (const [location, equipment] of Object.entries(equipmentByLab)) {
        console.log(`\n${location}: ${equipment.length} equipment items`);
        equipment.forEach(eq => {
            console.log(`  - ${eq.name} (${eq.type})`);
        });
    }

    const equipmentToCreate = magnumData.equipment_inventory.equipment.map((eq: any) => ({
        lab_id: locationMap[eq.location_id],
        equipment_name: eq.name,
        equipment_type: eq.type,
        manufacturer: eq.manufacturer,
        model: eq.serial_number.split('-')[0], // Extract model from serial
        serial_number: eq.serial_number,
        nabl_risk_level: eq.nabl_risk_level,
        calibration_interval_days: eq.calibration_interval_days,
        location: `${eq.type} Section`,
        status: 'ACTIVE',
    }));

    const { data: equipmentData, error: equipmentError } = await supabase
        .from('equipment')
        .insert(equipmentToCreate)
        .select();

    if (equipmentError) {
        console.error('❌ Error creating equipment:', equipmentError.message);
        return;
    }
    console.log(`\n✅ Created ${equipmentData.length} equipment items total`);

    // Create equipment ID mapping
    const equipmentMap: Record<string, string> = {};
    for (let i = 0; i < magnumData.equipment_inventory.equipment.length; i++) {
        equipmentMap[magnumData.equipment_inventory.equipment[i].equipment_id] = equipmentData[i].id;
    }

    // 6. Create Calibration Records
    console.log('\nCreating calibration records...');
    const calibrationsToCreate = magnumData.calibration_compliance.calibration_records.map((cal: any) => ({
        equipment_id: equipmentMap[cal.equipment_id],
        calibration_date: cal.calibration_date,
        next_due_date: cal.next_due_date,
        calibration_provider: cal.calibrated_by,
        certificate_number: cal.certificate_number,
        si_traceability_chain: cal.si_traceability,
        document_url: cal.certificate_file_url,
        status: cal.compliance_status === 'OVERDUE' ? 'OVERDUE' :
            cal.compliance_status === 'DUE_SOON' ? 'PENDING' : 'COMPLETED',
    }));

    const { data: calibrationData, error: calibrationError } = await supabase
        .from('calibrations')
        .insert(calibrationsToCreate)
        .select();

    if (calibrationError) {
        console.error('❌ Error creating calibrations:', calibrationError.message);
        return;
    }
    console.log(`✅ Created ${calibrationData.length} calibration records`);

    // 7. Create QC Test Records
    console.log('\nCreating QC test records (200 most recent)...');
    const qcTestsToCreate = magnumData.qc_monitoring.qc_records.slice(0, 200).map((qc: any) => {
        const equipmentId = equipmentMap[qc.equipment_id];
        const labId = locationMap[qc.location_id];

        let status = 'PASS';
        if (qc.westgard_violations && qc.westgard_violations.length > 0) {
            status = 'FAIL';
        } else if (qc.status === 'VIOLATION') {
            status = 'FAIL';
        }

        return {
            lab_id: labId,
            equipment_id: equipmentId,
            test_date: qc.test_date,
            test_time: '08:00:00',
            parameter_name: qc.analyte,
            control_level: qc.level,
            control_value: qc.target_value,
            result_obtained: qc.measured_value,
            expected_range_low: qc.target_value - (qc.sd * 2),
            expected_range_high: qc.target_value + (qc.sd * 2),
            unit: qc.unit,
            status: status,
            created_by: qc.operator,
        };
    });

    const { data: qcData, error: qcError } = await supabase
        .from('qc_tests')
        .insert(qcTestsToCreate)
        .select();

    if (qcError) {
        console.error('❌ Error creating QC tests:', qcError.message);
        return;
    }
    console.log(`✅ Created ${qcData.length} QC test records`);

    // 8. Create Reagents
    console.log('\nCreating reagents and lots (100 most recent)...');

    const reagentMasterMap = new Map<string, any>();

    for (const reagent of magnumData.reagent_inventory.reagent_records.slice(0, 100)) {
        const key = `${reagent.reagent_name}-${reagent.manufacturer}`;
        if (!reagentMasterMap.has(key)) {
            reagentMasterMap.set(key, {
                lab_id: locationMap[reagent.location_id],
                reagent_name: reagent.reagent_name,
                reagent_type: 'REAGENT',
                catalog_number: reagent.catalog_number,
                supplier: reagent.manufacturer,
                storage_condition: reagent.storage_temp,
                unit: reagent.unit,
                reorder_level: Math.round(reagent.reorder_level),
            });
        }
    }

    const reagentMasters = Array.from(reagentMasterMap.values());
    const { data: reagentData, error: reagentError } = await supabase
        .from('reagents')
        .insert(reagentMasters)
        .select();

    if (reagentError) {
        console.error('❌ Error creating reagents:', reagentError.message);
        return;
    }
    console.log(`✅ Created ${reagentData.length} reagent master records`);

    // Create reagent lots
    const reagentIdMap = new Map<string, string>();
    for (let i = 0; i < reagentMasters.length; i++) {
        const key = `${reagentMasters[i].reagent_name}-${reagentMasters[i].supplier}`;
        reagentIdMap.set(key, reagentData[i].id);
    }

    const reagentLotsToCreate = [];
    for (const reagent of magnumData.reagent_inventory.reagent_records.slice(0, 100)) {
        const key = `${reagent.reagent_name}-${reagent.manufacturer}`;
        const reagentId = reagentIdMap.get(key);

        if (reagentId) {
            reagentLotsToCreate.push({
                reagent_id: reagentId,
                lot_number: reagent.lot_number,
                quantity_received: reagent.initial_quantity,
                quantity_remaining: reagent.current_quantity,
                expiry_date: reagent.expiry_date,
                received_date: reagent.manufacture_date,
                location: reagent.storage_location,
                status: reagent.status === 'IN_USE' ? 'IN_USE' :
                    reagent.status === 'IN_STOCK' ? 'RESERVED' : 'IN_USE',
            });
        }
    }

    const { data: lotData, error: lotError } = await supabase
        .from('reagent_lots')
        .insert(reagentLotsToCreate)
        .select();

    if (lotError) {
        console.error('❌ Error creating reagent lots:', lotError.message);
        return;
    }
    console.log(`✅ Created ${lotData.length} reagent lot records`);

    console.log('\n✨ Tier 2 user successfully updated with Magnum Life Sciences data!');
    console.log('\n📧 Login credentials (unchanged):');
    console.log('   Email: maxine.mustermann@gmail.com');
    console.log('   Password: password123');
    console.log(`\n🏥 Labs: ${labsData.length} (${magnumData.lab_network.lab_name} + ${magnumData.lab_network.branches.length} branches)`);
    console.log(`⚙️  Equipment: ${equipmentData.length} items across all locations`);
    console.log(`📊 Calibrations: ${calibrationData.length} records`);
    console.log(`🧪 QC Tests: ${qcData.length} records`);
    console.log(`💊 Reagents: ${reagentData.length} masters, ${lotData.length} lots`);
    console.log(`\n✅ Use "Login as Tier 2 (Multi-Lab)" button to access!`);
}

updateTier2WithMagnumData()
    .then(() => {
        console.log('\n✅ Update complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Update failed:', error);
        process.exit(1);
    });
