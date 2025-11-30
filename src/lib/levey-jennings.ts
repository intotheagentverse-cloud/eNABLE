import { QCResult } from '@/app/actions/qc-import';

export interface ControlLimits {
    mean: number;
    sd: number;
    cv: number;
    plus1sd: number;
    minus1sd: number;
    plus2sd: number;
    minus2sd: number;
    plus3sd: number;
    minus3sd: number;
}

export interface QCStatistics {
    controlName: string;
    testName: string;
    lotNumber: string;
    limits: ControlLimits;
    totalRuns: number;
    passRate: number;
    warningRate: number;
    failRate: number;
}

export interface ChartDataPoint {
    date: string;
    value: number;
    status: 'Pass' | 'Warning' | 'Fail';
    zScore: number;
    operator?: string;
    time: string;
}

/**
 * Calculate control limits (mean, SD, CV) from QC data
 */
export function calculateControlLimits(data: QCResult[]): ControlLimits {
    if (data.length === 0) {
        throw new Error('No data provided for control limit calculation');
    }

    const values = data.map(d => d.result_value);
    const n = values.length;

    // Calculate mean
    const mean = values.reduce((sum, val) => sum + val, 0) / n;

    // Calculate standard deviation
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
    const sd = Math.sqrt(variance);

    // Calculate coefficient of variation
    const cv = (sd / mean) * 100;

    return {
        mean,
        sd,
        cv,
        plus1sd: mean + sd,
        minus1sd: mean - sd,
        plus2sd: mean + (2 * sd),
        minus2sd: mean - (2 * sd),
        plus3sd: mean + (3 * sd),
        minus3sd: mean - (3 * sd),
    };
}

/**
 * Group QC data by test name and control name
 */
export function groupQCDataByTest(data: QCResult[]): Map<string, QCResult[]> {
    const grouped = new Map<string, QCResult[]>();

    data.forEach(record => {
        const key = `${record.test_name}|${record.control_name}|${record.lot_number}`;
        if (!grouped.has(key)) {
            grouped.set(key, []);
        }
        grouped.get(key)!.push(record);
    });

    return grouped;
}

/**
 * Prepare data for Levey-Jennings chart
 */
export function prepareChartData(
    data: QCResult[],
    limits: ControlLimits
): ChartDataPoint[] {
    return data
        .sort((a, b) => {
            const dateA = new Date(`${a.measurement_date}T${a.measurement_time}`);
            const dateB = new Date(`${b.measurement_date}T${b.measurement_time}`);
            return dateA.getTime() - dateB.getTime();
        })
        .map(record => {
            const zScore = (record.result_value - limits.mean) / limits.sd;
            const absZ = Math.abs(zScore);

            let status: 'Pass' | 'Warning' | 'Fail' = 'Pass';
            if (absZ > 3) {
                status = 'Fail';
            } else if (absZ > 2) {
                status = 'Warning';
            }

            return {
                date: record.measurement_date,
                value: record.result_value,
                status,
                zScore,
                operator: record.operator_id,
                time: record.measurement_time,
            };
        });
}

/**
 * Detect trends in QC data
 */
export function detectTrends(data: ChartDataPoint[]): 'increasing' | 'decreasing' | 'stable' {
    if (data.length < 5) return 'stable';

    // Simple linear regression
    const n = data.length;
    const xValues = data.map((_, i) => i);
    const yValues = data.map(d => d.value);

    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = yValues.reduce((a, b) => a + b, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
    const sumX2 = xValues.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

    // Threshold for detecting significant trend
    const threshold = 0.01;

    if (slope > threshold) return 'increasing';
    if (slope < -threshold) return 'decreasing';
    return 'stable';
}

/**
 * Calculate comprehensive QC statistics
 */
export function calculateQCStatistics(data: QCResult[]): QCStatistics {
    if (data.length === 0) {
        throw new Error('No data provided');
    }

    const limits = calculateControlLimits(data);
    const chartData = prepareChartData(data, limits);

    const passCount = chartData.filter(d => d.status === 'Pass').length;
    const warningCount = chartData.filter(d => d.status === 'Warning').length;
    const failCount = chartData.filter(d => d.status === 'Fail').length;

    return {
        controlName: data[0].control_name,
        testName: data[0].test_name,
        lotNumber: data[0].lot_number,
        limits,
        totalRuns: data.length,
        passRate: (passCount / data.length) * 100,
        warningRate: (warningCount / data.length) * 100,
        failRate: (failCount / data.length) * 100,
    };
}

/**
 * Calculate moving average for smoothing
 */
export function calculateMovingAverage(data: ChartDataPoint[], windowSize: number): number[] {
    const result: number[] = [];

    for (let i = 0; i < data.length; i++) {
        const start = Math.max(0, i - Math.floor(windowSize / 2));
        const end = Math.min(data.length, i + Math.ceil(windowSize / 2));
        const window = data.slice(start, end);
        const avg = window.reduce((sum, d) => sum + d.value, 0) / window.length;
        result.push(avg);
    }

    return result;
}
