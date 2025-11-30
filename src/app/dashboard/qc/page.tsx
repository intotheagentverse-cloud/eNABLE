import { getQCAnalytics } from '@/app/actions/dashboard';
import WestgardViolationsByEquipment from '@/components/dashboard/WestgardViolationsByEquipment';
import QCChartsView from '@/components/dashboard/QCChartsView';
import { generateMockQCData } from '@/lib/mock-qc-data';
import { calculateControlLimits, prepareChartData } from '@/lib/levey-jennings';

export default async function QCPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const labId = (params.labId as string) || 'mock'; // use mock data

    const { violations, chartData } = await getQCAnalytics(labId);

    // Generate mock QC data for demonstration
    const mockQCData = generateMockQCData('Glucose', 'PreciControl ClinChem L1', 30);
    const limits = calculateControlLimits(mockQCData);
    const leveyJenningsData = prepareChartData(mockQCData, limits);

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
                initialData={leveyJenningsData}
                initialLimits={limits}
            />
        </div>
    );
}
