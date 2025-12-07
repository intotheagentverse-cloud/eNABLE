import { checkWestgardRules, QCDataPoint } from '../src/lib/westgard';

function runTest(name: string, current: number, history: number[], mean: number, sd: number, expectedRule: string | null) {
    // Convert to QCDataPoint array format
    const dataPoints: QCDataPoint[] = [
        ...history.map((value, idx) => ({
            value,
            mean,
            sd,
            date: new Date(Date.now() - (history.length - idx) * 86400000).toISOString()
        })),
        {
            value: current,
            mean,
            sd,
            date: new Date().toISOString()
        }
    ];

    const violations = checkWestgardRules(dataPoints);
    const latestViolation = violations.length > 0 ? violations[violations.length - 1] : null;
    const result = latestViolation ? latestViolation.rule : null;

    const passed = result === expectedRule;
    console.log(`${passed ? '✅' : '❌'} ${name}: Expected ${expectedRule}, Got ${result}`);
    if (!passed) {
        console.log('   Violations:', violations);
    }
}

const MEAN = 100;
const SD = 5;

console.log('--- Testing Westgard Rules ---');

// 1. Normal
runTest('Normal Value', 102, [101, 99, 100], MEAN, SD, null);

// 2. 1-3s (Rejection) - > 3SD (115)
runTest('1-3s Violation', 116, [100, 100], MEAN, SD, '1_3s');

// 3. 2-2s (Rejection) - Two > 2SD (110)
runTest('2-2s Violation', 111, [111, 100], MEAN, SD, '2_2s');

// 4. Warning 1-2s
runTest('1-2s Warning', 111, [100, 100], MEAN, SD, '1_2s');

// 5. R-4s
runTest('R-4s Violation', 111, [89, 100], MEAN, SD, 'R_4s');

console.log('--- Test Complete ---');
