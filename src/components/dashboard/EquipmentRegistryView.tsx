"use client";

import Link from 'next/link';
import EquipmentTable from '@/components/dashboard/EquipmentTable';

interface EquipmentRegistryViewProps {
    equipment: any[];
}

export default function EquipmentRegistryView({ equipment }: EquipmentRegistryViewProps) {
    // Count by integration status (if field exists)
    const integrated = equipment.filter(e => e.integration_status === 'Integrated').length;
    const pending = equipment.filter(e => e.integration_status === 'Pending Setup').length;
    const manual = equipment.filter(e => e.integration_status === 'Manual Entry').length;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Equipment List */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Equipment Registry</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <th className="pb-3">Name</th>
                                    <th className="pb-3">Manufacturer</th>
                                    <th className="pb-3">Model</th>
                                    <th className="pb-3">Location</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {equipment.map((item) => (
                                    <tr key={item.id} className="text-sm">
                                        <td className="py-3">
                                            <Link href={`/dashboard/equipment/${item.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                                                {item.equipment_name}
                                            </Link>
                                        </td>
                                        <td className="py-3 text-gray-700">{item.manufacturer || '-'}</td>
                                        <td className="py-3 text-gray-700">{item.model || '-'}</td>
                                        <td className="py-3 text-gray-600 text-sm">{item.location || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Integration Status */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Integration Status</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                            <div>
                                <p className="text-sm font-medium text-green-900">Integrated</p>
                                <p className="text-xs text-green-700">Automatic data import</p>
                            </div>
                            <span className="text-2xl font-bold text-green-600">{integrated}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                            <div>
                                <p className="text-sm font-medium text-yellow-900">Pending Setup</p>
                                <p className="text-xs text-yellow-700">Awaiting integration</p>
                            </div>
                            <span className="text-2xl font-bold text-yellow-600">{pending}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Manual Entry</p>
                                <p className="text-xs text-gray-700">No automatic import</p>
                            </div>
                            <span className="text-2xl font-bold text-gray-600">{manual}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
