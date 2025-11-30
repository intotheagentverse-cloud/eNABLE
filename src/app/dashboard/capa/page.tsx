import { getAllCAPA } from '@/app/actions/audits';
import { TEST_LAB_ID } from '@/lib/constants';

export const dynamic = 'force-dynamic';
import Link from 'next/link';
import DeviationManagementEnhanced from '@/components/dashboard/DeviationManagementEnhanced';

export default async function CAPAPage() {
    const capas = await getAllCAPA(TEST_LAB_ID);

    const byStatus = {
        open: capas.filter(c => c.status === 'OPEN').length,
        inProgress: capas.filter(c => c.status === 'IN_PROGRESS').length,
        completed: capas.filter(c => c.status === 'COMPLETED').length,
        assessed: capas.filter(c => c.status === 'VERIFIED').length,
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Corrective and Preventive Actions</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Track and manage quality improvement initiatives
                    </p>
                </div>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Start Scan
                </button>
            </div>



            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
                    <h3 className="text-sm font-medium text-gray-500 uppercase">Open</h3>
                    <p className="mt-2 text-3xl font-bold text-red-600">{byStatus.open}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
                    <h3 className="text-sm font-medium text-gray-500 uppercase">In Progress</h3>
                    <p className="mt-2 text-3xl font-bold text-yellow-600">{byStatus.inProgress}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                    <h3 className="text-sm font-medium text-gray-500 uppercase">Completed</h3>
                    <p className="mt-2 text-3xl font-bold text-blue-600">{byStatus.completed}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                    <h3 className="text-sm font-medium text-gray-500 uppercase">Assessed</h3>
                    <p className="mt-2 text-3xl font-bold text-green-600">{byStatus.assessed}</p>
                </div>
            </div>

            {/* Deviation Management */}
            <DeviationManagementEnhanced />

            {/* CAPA List */}
            <div className="bg-white shadow rounded-lg">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">All CAPA Records</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">CAPA #</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Issue</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Responsible</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Target Date</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {capas.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                            No CAPA records found.
                                        </td>
                                    </tr>
                                ) : (
                                    capas.map((capa: any) => (
                                        <tr key={capa.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-medium text-blue-600">
                                                {capa.capa_number}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{capa.capa_type}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">{capa.issue_description}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{capa.responsible_person || 'Not assigned'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{capa.target_date || 'N/A'}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${capa.status === 'VERIFIED' ? 'bg-green-100 text-green-800' :
                                                    capa.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                                                        capa.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                    }`}>
                                                    {capa.status}
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
