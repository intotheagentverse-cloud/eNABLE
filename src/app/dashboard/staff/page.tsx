import { getStaffMembers, getExpiringTraining, getExpiringCertificates } from '@/app/actions/staff';
import { TEST_LAB_ID } from '@/lib/constants';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function StaffPage() {
    const staff = await getStaffMembers(TEST_LAB_ID);
    const expiringTraining = await getExpiringTraining(TEST_LAB_ID, 30);
    const expiringCerts = await getExpiringCertificates(TEST_LAB_ID, 60);

    const byStatus = {
        active: staff.filter(s => s.status === 'ACTIVE').length,
        onLeave: staff.filter(s => s.status === 'ON_LEAVE').length,
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Staff Training & Competency</h1>
                <Link
                    href="/dashboard/staff/add"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    + Add Staff Member
                </Link>
            </div>

            {/* Alerts */}
            {(expiringTraining.length > 0 || expiringCerts.length > 0) && (
                <div className="space-y-3">
                    {expiringTraining.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <span className="text-2xl mr-3">⚠️</span>
                                <div>
                                    <h3 className="text-sm font-medium text-yellow-900">Training Expiring Soon</h3>
                                    <p className="text-sm text-yellow-800 mt-1">
                                        {expiringTraining.length} training record(s) expiring within 30 days.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    {expiringCerts.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <span className="text-2xl mr-3">🚨</span>
                                <div>
                                    <h3 className="text-sm font-medium text-red-900">Certificates Expiring</h3>
                                    <p className="text-sm text-red-800 mt-1">
                                        {expiringCerts.length} certificate(s) expiring within 60 days.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                    <h3 className="text-sm font-medium text-gray-500 uppercase">Active Staff</h3>
                    <p className="mt-2 text-3xl font-bold text-blue-600">{byStatus.active}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
                    <h3 className="text-sm font-medium text-gray-500 uppercase">Training Expiring</h3>
                    <p className="mt-2 text-3xl font-bold text-yellow-600">{expiringTraining.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
                    <h3 className="text-sm font-medium text-gray-500 uppercase">Certs Expiring</h3>
                    <p className="mt-2 text-3xl font-bold text-red-600">{expiringCerts.length}</p>
                </div>
            </div>

            {/* Staff Directory */}
            <div className="bg-white shadow rounded-lg">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Staff Directory</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {staff.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                            No staff members found. <Link href="/dashboard/staff/add" className="text-blue-600 hover:text-blue-800">Add your first staff member →</Link>
                                        </td>
                                    </tr>
                                ) : (
                                    staff.map(member => (
                                        <tr key={member.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-medium text-blue-600">
                                                <Link href={`/dashboard/staff/${member.id}`}>{member.employee_id || 'N/A'}</Link>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{member.full_name}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{member.role || 'N/A'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{member.department || 'N/A'}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                                    'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {member.status}
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
