import { getAudits } from '@/app/actions/audits';
import { TEST_LAB_ID } from '@/lib/constants';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AuditsPage() {
    const audits = await getAudits(TEST_LAB_ID);

    const byStatus = {
        scheduled: audits.filter(a => a.status === 'SCHEDULED').length,
        inProgress: audits.filter(a => a.status === 'IN_PROGRESS').length,
        completed: audits.filter(a => a.status === 'COMPLETED').length,
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Internal Audit Reports</h1>
                <div className="space-x-3">
                    <Link
                        href="/dashboard/capa"
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                    >
                        View CAPA
                    </Link>
                    <Link
                        href="/dashboard/audits/add"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        + Schedule Audit
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
                    <h3 className="text-sm font-medium text-gray-500 uppercase">Scheduled</h3>
                    <p className="mt-2 text-3xl font-bold text-yellow-600">{byStatus.scheduled}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                    <h3 className="text-sm font-medium text-gray-500 uppercase">In Progress</h3>
                    <p className="mt-2 text-3xl font-bold text-blue-600">{byStatus.inProgress}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                    <h3 className="text-sm font-medium text-gray-500 uppercase">Completed</h3>
                    <p className="mt-2 text-3xl font-bold text-green-600">{byStatus.completed}</p>
                </div>
            </div>

            {/* Audit List */}
            <div className="bg-white shadow rounded-lg">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Audit Schedule</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Audit Title</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Lead Auditor</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {audits.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                            No audits scheduled. <Link href="/dashboard/audits/add" className="text-blue-600 hover:text-blue-800">Schedule your first audit →</Link>
                                        </td>
                                    </tr>
                                ) : (
                                    audits.map(audit => (
                                        <tr key={audit.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-medium text-blue-600">
                                                <Link href={`/dashboard/audits/${audit.id}`}>{audit.audit_title}</Link>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{audit.audit_type}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{audit.department || 'All'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{audit.audit_date}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{audit.lead_auditor || 'Not assigned'}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${audit.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                    audit.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {audit.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
