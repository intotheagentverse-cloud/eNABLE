import { getEquipmentList } from '@/app/actions/equipment';
import { getCalibrationHistory } from '@/app/actions/calibration';
import LogCalibrationForm from '@/components/dashboard/LogCalibrationForm';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EquipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch equipment details
    const { data: equipment } = await supabase
        .from('equipment')
        .select('*')
        .eq('id', id)
        .single();

    if (!equipment) {
        notFound();
    }

    const calibrations = await getCalibrationHistory(id);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">{equipment.equipment_name}</h1>
                <Link href="/dashboard/equipment" className="text-blue-600 hover:text-blue-800">
                    &larr; Back to List
                </Link>
            </div>

            {/* Equipment Details Card */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Details</h3>
                <dl className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6">
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Serial Number</dt>
                        <dd className="mt-1 text-sm text-gray-900">{equipment.serial_number || '-'}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Type</dt>
                        <dd className="mt-1 text-sm text-gray-900">{equipment.equipment_type || '-'}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${equipment.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {equipment.status}
                            </span>
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Calibration Interval</dt>
                        <dd className="mt-1 text-sm text-gray-900">{equipment.calibration_interval_days} Days</dd>
                    </div>
                </dl>
            </div>

            {/* Calibration History */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Calibration History</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Due</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Certificate</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {calibrations.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No calibration records found.</td>
                                </tr>
                            ) : (
                                calibrations.map((cal) => (
                                    <tr key={cal.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cal.calibration_date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cal.next_due_date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cal.calibration_provider}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cal.certificate_number}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Log Calibration Form */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Log New Calibration</h3>
                <LogCalibrationForm equipmentId={equipment.id} intervalDays={equipment.calibration_interval_days || 365} />
            </div>
        </div>
    );
}
