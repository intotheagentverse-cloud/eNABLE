import { QCTest, ControlLimit } from '@/types/database';

export type WestgardResult = {
    status: 'PASS' | 'WARNING' | 'REJECT';
    rule: string | null;
    message: string | null;
};

export function checkWestgardRules(
    currentTest: number,
    history: number[], // Previous results, most recent first
    mean: number,
    sd: number
): WestgardResult {
    const zScore = (currentTest - mean) / sd;
    const zScoreAbs = Math.abs(zScore);

    // Rule 1-3s: One point outside 3SD (Rejection)
    if (zScoreAbs > 3) {
        return {
            status: 'REJECT',
            rule: '1-3s',
            message: 'Result exceeds 3SD limit. Random error likely.'
        };
    }

    // Rule 2-2s: Two consecutive points outside 2SD on the same side (Rejection)
    if (history.length >= 1) {
        const prevZ = (history[0] - mean) / sd;
        if (zScoreAbs > 2 && Math.abs(prevZ) > 2 && Math.sign(zScore) === Math.sign(prevZ)) {
            return {
                status: 'REJECT',
                rule: '2-2s',
                message: 'Two consecutive points exceed 2SD on the same side. Systematic error likely.'
            };
        }
    }

    // Rule R-4s: Range between two consecutive points exceeds 4SD (Rejection)
    if (history.length >= 1) {
        const prevZ = (history[0] - mean) / sd;
        if (Math.abs(zScore - prevZ) > 4) {
            return {
                status: 'REJECT',
                rule: 'R-4s',
                message: 'Range between consecutive points exceeds 4SD. Random error likely.'
            };
        }
    }

    // Rule 4-1s: Four consecutive points outside 1SD on the same side (Rejection)
    if (history.length >= 3) {
        const last3 = history.slice(0, 3);
        const allOutside1SD = last3.every(val => {
            const z = (val - mean) / sd;
            return Math.abs(z) > 1 && Math.sign(z) === Math.sign(zScore);
        });

        if (zScoreAbs > 1 && allOutside1SD) {
            return {
                status: 'REJECT',
                rule: '4-1s',
                message: 'Four consecutive points exceed 1SD on the same side. Systematic error likely.'
            };
        }
    }

    // Rule 10x: Ten consecutive points on the same side of the mean (Rejection)
    if (history.length >= 9) {
        const last9 = history.slice(0, 9);
        const allSameSide = last9.every(val => Math.sign(val - mean) === Math.sign(currentTest - mean));

        if (allSameSide) {
            return {
                status: 'REJECT',
                rule: '10x',
                message: 'Ten consecutive points on the same side of the mean. Systematic error likely.'
            };
        }
    }

    // Rule 1-2s: One point outside 2SD (Warning)
    if (zScoreAbs > 2) {
        return {
            status: 'WARNING',
            rule: '1-2s',
            message: 'Result exceeds 2SD limit. Warning only.'
        };
    }

    return {
        status: 'PASS',
        rule: null,
        message: null
    };
}
