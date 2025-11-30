import { QCResult } from '@/app/actions/qc-import';

/**
 * Generate mock QC data for demonstration purposes
 */
export function generateMockQCData(
    testName: string,
    controlName: string,
    days: number = 30
): QCResult[] {
    const mockData: QCResult[] = [];
    const today = new Date();

    // Base parameters
    const targetMean = 100;
    const targetSD = 3.5;

    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (days - i - 1));

        // Generate realistic QC values with some variation
        // Most values within ±2SD, occasional warning/fail
        let value: number;
        const rand = Math.random();

        if (rand < 0.85) {
            // 85% within ±2SD (Pass)
            value = targetMean + (Math.random() - 0.5) * 2 * targetSD;
        } else if (rand < 0.95) {
            // 10% between ±2SD and ±3SD (Warning)
            const direction = Math.random() < 0.5 ? 1 : -1;
            value = targetMean + direction * (2 + Math.random()) * targetSD;
        } else {
            // 5% beyond ±3SD (Fail)
            const direction = Math.random() < 0.5 ? 1 : -1;
            value = targetMean + direction * (3 + Math.random() * 0.5) * targetSD;
        }

        // Determine status based on value
        const zScore = (value - targetMean) / targetSD;
        const absZ = Math.abs(zScore);
        let qcStatus: 'Pass' | 'Warning' | 'Fail' = 'Pass';

        if (absZ > 3) {
            qcStatus = 'Fail';
        } else if (absZ > 2) {
            qcStatus = 'Warning';
        }

        mockData.push({
            control_name: controlName,
            lot_number: 'LOT-2024-001',
            test_name: testName,
            result_value: parseFloat(value.toFixed(2)),
            unit: 'mg/dL',
            target_mean: targetMean,
            target_sd: targetSD,
            measurement_date: date.toISOString().split('T')[0],
            measurement_time: '08:00:00',
            analyzer_id: 'ANALYZER-001',
            qc_status: qcStatus,
            z_score: parseFloat(zScore.toFixed(2)),
        });
    }

    return mockData;
}

/**
 * Generate multiple test datasets
 */
export function generateMultipleTestData(): Map<string, QCResult[]> {
    const datasets = new Map<string, QCResult[]>();

    const tests = [
        { test: 'Glucose', control: 'PreciControl ClinChem L1' },
        { test: 'Cholesterol', control: 'PreciControl ClinChem L1' },
        { test: 'Creatinine', control: 'PreciControl ClinChem L2' },
    ];

    tests.forEach(({ test, control }) => {
        const key = `${test}|${control}`;
        datasets.set(key, generateMockQCData(test, control, 30));
    });

    return datasets;
}
