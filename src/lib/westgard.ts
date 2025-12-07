
export type WestgardRule = '1_2s' | '1_3s' | '2_2s' | 'R_4s' | '4_1s' | '10_x';

export interface QCDataPoint {
    value: number;
    mean: number;
    sd: number;
    date: string;
}

export interface WestgardViolation {
    rule: WestgardRule;
    index: number; // Index of the data point that triggered the violation
    message: string;
}

/**
 * Checks for Westgard rule violations in a sequence of QC data.
 * The data should be sorted by date (oldest to newest).
 * 
 * Rules implemented:
 * - 1_2s: One point outside ±2SD (Warning)
 * - 1_3s: One point outside ±3SD (Reject)
 * - 2_2s: Two consecutive points outside ±2SD on the same side (Reject)
 * - R_4s: Range between two consecutive points exceeds 4SD (Reject)
 * - 4_1s: Four consecutive points outside ±1SD on the same side (Reject)
 * - 10_x: Ten consecutive points on the same side of the mean (Reject)
 */
export function checkWestgardRules(data: QCDataPoint[]): WestgardViolation[] {
    const violations: WestgardViolation[] = [];

    if (data.length === 0) return violations;

    // We iterate through the data, but we mainly check the last point for violations
    // However, some rules require looking back at previous points.
    // For a full analysis of historical data, we would iterate all points.
    // Here we assume we want to find all violations in the provided dataset.

    for (let i = 0; i < data.length; i++) {
        const current = data[i];
        const zScore = (current.value - current.mean) / current.sd;

        // 1_3s: One point outside ±3SD
        if (Math.abs(zScore) > 3) {
            violations.push({
                rule: '1_3s',
                index: i,
                message: `Result ${current.value} is outside ±3SD limit.`
            });
        }

        // 1_2s: One point outside ±2SD (Warning)
        // This is usually just a warning, but often triggers looking for other rules.
        if (Math.abs(zScore) > 2) {
            violations.push({
                rule: '1_2s',
                index: i,
                message: `Result ${current.value} is outside ±2SD limit.`
            });
        }

        // 2_2s: Two consecutive points outside ±2SD on the same side
        if (i > 0) {
            const prev = data[i - 1];
            const prevZ = (prev.value - prev.mean) / prev.sd;

            if (Math.abs(zScore) > 2 && Math.abs(prevZ) > 2) {
                if ((zScore > 0 && prevZ > 0) || (zScore < 0 && prevZ < 0)) {
                    violations.push({
                        rule: '2_2s',
                        index: i,
                        message: `Two consecutive points outside ±2SD on the same side.`
                    });
                }
            }
        }

        // R_4s: Range between two consecutive points exceeds 4SD
        // This typically applies when one is > +2SD and other is < -2SD
        if (i > 0) {
            const prev = data[i - 1];
            const prevZ = (prev.value - prev.mean) / prev.sd;

            if (Math.abs(zScore - prevZ) > 4) {
                violations.push({
                    rule: 'R_4s',
                    index: i,
                    message: `Range between consecutive points exceeds 4SD.`
                });
            }
        }

        // 4_1s: Four consecutive points outside ±1SD on the same side
        if (i >= 3) {
            const points = data.slice(i - 3, i + 1);
            const zScores = points.map(p => (p.value - p.mean) / p.sd);

            const allPositive = zScores.every(z => z > 1);
            const allNegative = zScores.every(z => z < -1);

            if (allPositive || allNegative) {
                violations.push({
                    rule: '4_1s',
                    index: i,
                    message: `Four consecutive points outside ±1SD on the same side.`
                });
            }
        }

        // 10_x: Ten consecutive points on the same side of the mean
        if (i >= 9) {
            const points = data.slice(i - 9, i + 1);
            const diffs = points.map(p => p.value - p.mean);

            const allPositive = diffs.every(d => d > 0);
            const allNegative = diffs.every(d => d < 0);

            if (allPositive || allNegative) {
                violations.push({
                    rule: '10_x',
                    index: i,
                    message: `Ten consecutive points on the same side of the mean.`
                });
            }
        }
    }

    return violations;
}
