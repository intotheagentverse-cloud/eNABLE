'use server'

import { supabase } from '@/lib/supabase';
import { getUserLabs } from './labs';
import { TEST_USER_ID } from '@/lib/constants';

export async function getDashboardStats(labId: string) {
    let targetLabIds: string[] = [];

    if (labId === 'all') {
        const userLabs = await getUserLabs(TEST_USER_ID);
        targetLabIds = userLabs.map((lab: any) => lab.id);
    } else {
        targetLabIds = [labId];
    }

    // 1. Total Equipment Count
    const { count: equipmentCount } = await supabase
        .from('equipment')
        .select('*', { count: 'exact', head: true })
        .in('lab_id', targetLabIds);

    // 2. Breakdown Count
    const { count: breakdownCount } = await supabase
        .from('equipment')
        .select('*', { count: 'exact', head: true })
        .in('lab_id', targetLabIds)
        .eq('status', 'BREAKDOWN');

    // 3. QC Violations Today
    const today = new Date().toISOString().split('T')[0];
    const { count: qcViolations } = await supabase
        .from('qc_tests')
        .select('*', { count: 'exact', head: true })
        .in('lab_id', targetLabIds)
        .eq('test_date', today)
        .neq('status', 'PASS');

    return {
        equipmentCount: equipmentCount || 0,
        breakdownCount: breakdownCount || 0,
        qcViolations: qcViolations || 0,
    };
}

export async function getQCAnalytics(labId: string) {
    // If called with mock identifier OR 'all' (for demo purposes), generate simulated data
    if (labId === 'mock' || labId === 'all') {
        // Simulated equipment names
        const equipments = ['Analyzer A', 'Analyzer B', 'Analyzer C'];
        // Generate recent violations (last 5)
        const violations = equipments.map((eq, idx) => ({
            id: `violation-${idx}`,
            status: 'OPEN',
            created_at: new Date().toISOString(),
            qc_tests: {
                equipment: { equipment_name: eq },
                parameter_name: 'Glucose',
                control_level: 'L2',
                test_date: new Date().toISOString().split('T')[0],
                result_obtained: 180 + idx * 5,
                violation_rule: '1-3s',
                status: 'FAIL'
            }
        }));

        // Generate chart data for last 7 days with random pass/fail counts
        const today = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(today.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const chartData = last7Days.map(date => {
            const pass = Math.floor(Math.random() * 10) + 5; // 5-14 passes
            const fail = Math.floor(Math.random() * 3); // 0-2 fails
            return {
                date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
                pass,
                fail,
            };
        });

        return { violations, chartData };
    }

    // Real implementation (fallback)
    let targetLabIds: string[] = [];
    targetLabIds = [labId];

    // 1. Recent Deviations (Last 5)
    const { data: violations } = await supabase
        .from('qc_deviations')
        .select(`
            *,
            qc_tests (
                *,
                equipment (equipment_name)
            )
        `)
        .in('qc_tests.lab_id', targetLabIds) // Note: This might need a join filter, but Supabase handles nested filters differently. 
        // For simplicity, we'll fetch deviations and filter in app if needed, or rely on RLS.
        // Actually, let's just fetch deviations sorted by created_at.
        .order('created_at', { ascending: false })
        .limit(5);

    // 2. Last 7 Days Analytics
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(today.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const { data: recentTests } = await supabase
        .from('qc_tests')
        .select('test_date, status')
        .in('lab_id', targetLabIds)
        .gte('test_date', last7Days[0]);

    const chartData = last7Days.map(date => {
        const dayTests = recentTests?.filter(t => t.test_date === date) || [];
        const passCount = dayTests.filter(t => t.status === 'PASS').length;
        const failCount = dayTests.filter(t => t.status !== 'PASS').length;
        return {
            date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
            pass: passCount,
            fail: failCount,
        };
    });

    return { violations: violations || [], chartData };
}
