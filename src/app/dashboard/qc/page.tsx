import { getQCAnalytics } from '@/app/actions/dashboard';
import { getEquipmentList } from '@/app/actions/equipment';
import { getQCData, getControlLimits } from '@/app/actions/qc';
import WestgardViolationsByEquipment from '@/components/dashboard/WestgardViolationsByEquipment';
import QCChartsView from '@/components/dashboard/QCChartsView';
import { calculateControlLimits, prepareChartData } from '@/lib/levey-jennings';
import { TEST_LAB_ID } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export default async function QCPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const labId = (params.labId as string) || TEST_LAB_ID;

    // Fetch real equipment from database
    const equipment = await getEquipmentList(labId);

    // Get selected equipment ID from query params, or use first equipment
    const selectedEquipmentId = (params.equipment as string) || equipment[0]?.id;
    const selectedParameter = (params.parameter as string) || 'Glucose';
    const selectedLevel = (params.level as string) || 'Level 1';

    // Fetch real QC data and control limits from database
    let qcData: any[] = [];
    let limits: any = null;
    let chartData: any[] = [];

    if (selectedEquipmentId) {
        qcData = await getQCData(selectedEquipmentId, selectedParameter, selectedLevel);
        limits = await getControlLimits(selectedEquipmentId, selectedParameter, selectedLevel);

        // If we have control limits and QC data, prepare chart data
        if (limits && qcData.length > 0) {
            // Transform database QCTest format to QCResult format for chart
            const qcResults = qcData.map(test => ({
                control_name: test.control_level || selectedLevel,
                lot_number: 'LOT001', // TODO: Add lot tracking
                test_name: test.parameter_name || selectedParameter,
                result_value: test.result_obtained || 0,
                unit: test.unit || 'mg/dL',
                target_mean: limits?.mean_value || 0,
                target_sd: limits?.sd_value || 1,
                measurement_date: test.test_date,
                measurement_time: test.test_time || '00:00',
                analyzer_id: selectedEquipmentId,
                operator_id: test.created_by || 'System',
                qc_status: test.status || 'Pass',
            })) as any[];

            chartData = prepareChartData(qcResults, {
                mean: limits.mean_value,
                sd: limits.sd_value,
                cv: 0, // TODO: Calculate CV
                plus1sd: limits.mean_value + limits.sd_value,
                minus1sd: limits.mean_value - limits.sd_value,
                plus2sd: limits.mean_value + (2 * limits.sd_value),
                minus2sd: limits.mean_value - (2 * limits.sd_value),
                plus3sd: limits.mean_value + (3 * limits.sd_value),
                minus3sd: limits.mean_value - (3 * limits.sd_value),
            });
        }
    }

    const { violations, chartData: analyticsChartData } = await getQCAnalytics(labId);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quality Control Analytics</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        AI-powered monitoring, Westgard rules validation, and deviation management
                    </p>
                </div>
            </div>

            {/* Westgard Violations by Equipment */}
            <WestgardViolationsByEquipment />

            {/* Interactive Charts with Equipment Selector */}
            <QCChartsView
                equipment={equipment}
                selectedEquipmentId={selectedEquipmentId}
                selectedParameter={selectedParameter}
                selectedLevel={selectedLevel}
                initialData={chartData}
                initialLimits={limits ? {
                    mean: limits.mean_value,
                    sd: limits.sd_value,
                    cv: 0,
                    plus1sd: limits.mean_value + limits.sd_value,
                    minus1sd: limits.mean_value - limits.sd_value,
                    plus2sd: limits.mean_value + (2 * limits.sd_value),
                    minus2sd: limits.mean_value - (2 * limits.sd_value),
                    plus3sd: limits.mean_value + (3 * limits.sd_value),
                    minus3sd: limits.mean_value - (3 * limits.sd_value),
                } : null}
            />
        </div>
    );
}
