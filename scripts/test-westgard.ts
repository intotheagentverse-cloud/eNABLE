import { checkWestgardRules } from '../src/lib/westgard';

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

console.log('--- Testing Westgard Rules ---');

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
