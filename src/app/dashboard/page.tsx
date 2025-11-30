import { getDashboardStats, getQCAnalytics } from '@/app/actions/dashboard';
import ReagentManagementKPIs from '@/components/dashboard/ReagentManagementKPIs';
import { TEST_LAB_ID } from '@/lib/constants';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default async function DashboardOverviewPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedSearchParams = await searchParams;
    const labId = (resolvedSearchParams.labId as string) || 'mock'; // Default to mock for demo

    const stats = await getDashboardStats(labId);
    const qcData = await getQCAnalytics(labId);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard Overview</h1>
                    <p className="text-sm text-[var(--foreground-muted)]">
                        {labId === 'all' ? 'All Labs View' : `Lab ID: ${labId}`}
                    </p>
                </div>
                <div className="flex space-x-3">
                    <Link href="/dashboard/qc/import">
                        <Button variant="secondary" size="sm">+ Add Data</Button>
                    </Link>
                    <Link href="/dashboard/equipment/add">
                        <Button variant="secondary" size="sm">+ Add Equipment</Button>
                    </Link>
                    <Link href="/dashboard/qc">
                        <Button variant="primary" size="sm">QC Analytics</Button>
                    </Link>
                </div>
            </div>

            {/* Quick Actions & System Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <Link href="/dashboard/qc/import" className="block">
                            <Button variant="outline" className="w-full justify-center">
                                + Add Data
                            </Button>
                        </Link>
                        <Link href="/dashboard/equipment/add" className="block">
                            <Button variant="outline" className="w-full justify-center">
                                + Add New Equipment
                            </Button>
                        </Link>
                        <Link href="/dashboard/qc" className="block">
                            <Button variant="outline" className="w-full justify-center">
                                View QC Analytics
                            </Button>
                        </Link>
                    </div>
                </Card>

                <Card>
                    <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">System Status</h3>
                    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors">
                        <span className="h-3 w-3 bg-[var(--color-brand-green)] rounded-full shadow-sm"></span>
                        <span className="text-sm font-medium text-[var(--foreground)]">Database Connected</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors mt-1">
                        <span className="h-3 w-3 bg-[var(--color-brand-green)] rounded-full shadow-sm"></span>
                        <span className="text-sm font-medium text-[var(--foreground)]">Compliance Modules Active</span>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Reagent Management KPIs */}
                <Card>
                    <ReagentManagementKPIs />
                </Card>

                {/* Westgard Intelligence Placeholder (replacing Recent Violations) */}
                <Card>
                    <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">Westgard Intelligence</h3>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-sm text-blue-800">
                            AI-driven Westgard rule analysis and predictive insights will appear here.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
