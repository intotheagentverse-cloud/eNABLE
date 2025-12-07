import { getEquipmentList } from '@/app/actions/equipment';
import { getCalibrationHistory, getMaintenanceHistory } from '@/app/actions/calibration';
import CalibrationHistory from '@/components/dashboard/CalibrationHistory';
import MaintenanceHistory from '@/components/dashboard/MaintenanceHistory';
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

    const [calibrations, maintenanceLogs] = await Promise.all([
        getCalibrationHistory(id),
        getMaintenanceHistory(id)
    ]);

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
                        <dt className="text-sm font-medium text-gray-500">Model / Serial</dt>
                        <dd className="mt-1 text-sm text-gray-900">{equipment.model || '-'} / {equipment.serial_number || '-'}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Manufacturer</dt>
                        <dd className="mt-1 text-sm text-gray-900">{equipment.manufacturer || '-'}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Location</dt>
                        <dd className="mt-1 text-sm text-gray-900">{equipment.location || '-'}</dd>
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

            {/* Calibration & Maintenance Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CalibrationHistory
                    equipmentId={equipment.id}
                    intervalDays={equipment.calibration_interval_days || 365}
                    history={calibrations}
                />

                <MaintenanceHistory
                    equipmentId={equipment.id}
                    history={maintenanceLogs}
                />
            </div>
        </div>
    );
}
