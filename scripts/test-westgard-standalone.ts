// Standalone Westgard Test
type WestgardResult = {
    status: 'PASS' | 'WARNING' | 'REJECT';
    rule: string | null;
    message: string | null;
};

function checkWestgardRules(
    currentTest: number,
    history: number[],
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

function runTest(name: string, current: number, history: number[], mean: number, sd: number, expectedRule: string | null) {
    const result = checkWestgardRules(current, history, mean, sd);
    const passed = result.rule === expectedRule;
    console.log(`${passed ? '✅' : '❌'} ${name}: Expected ${expectedRule}, Got ${result.rule}`);
    if (!passed) {
        console.log('   Result:', result);
    }
}

const MEAN = 100;
const SD = 5;

console.log('--- Testing Westgard Rules (Standalone) ---');

// 1. Normal
runTest('Normal Value', 102, [101, 99, 100], MEAN, SD, null);

// 2. 1-3s (Rejection) - > 3SD (115)
runTest('1-3s Violation', 116, [100, 100], MEAN, SD, '1-3s');

// 3. 2-2s (Rejection) - Two > 2SD (110)
runTest('2-2s Violation', 111, [111, 100], MEAN, SD, '2-2s');

// 4. Warning 1-2s
runTest('1-2s Warning', 111, [100, 100], MEAN, SD, '1-2s');

// 5. R-4s
runTest('R-4s Violation', 111, [89, 100], MEAN, SD, 'R-4s');

console.log('--- Test Complete ---');
