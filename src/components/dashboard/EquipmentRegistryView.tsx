"use client";

import Link from 'next/link';
import EquipmentTable from '@/components/dashboard/EquipmentTable';
import { EQUIPMENT_CATEGORIES } from '@/lib/equipment-catalog';

interface EquipmentRegistryViewProps {
    equipment: any[];
}

export default function EquipmentRegistryView({ equipment }: EquipmentRegistryViewProps) {
    // Count by integration status
    const integrated = equipment.filter(e => e.integration_status === 'Integrated').length;
    const pending = equipment.filter(e => e.integration_status === 'Pending Setup').length;
    const failed = equipment.filter(e => e.integration_status === 'Connection Failed').length;

    // Count by category
    const byCategory = EQUIPMENT_CATEGORIES.map(cat => ({
        ...cat,
        count: equipment.filter(e => e.equipment_category === cat.id).length
    }));

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Equipment List */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Equipment List</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <th className="pb-3">Name</th>
                                    <th className="pb-3">Category</th>
                                    <th className="pb-3">Brand</th>
                                    <th className="pb-3">Serial</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3">Integration</th>
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
                                        <td className="py-3">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {item.equipment_category}
                                            </span>
                                        </td>
                                        <td className="py-3 text-gray-700">{item.equipment_brand}</td>
                                        <td className="py-3 text-gray-600 text-xs">{item.serial_number}</td>
                                        <td className="py-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-gray-600 text-sm">{item.integration_status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Data Import History */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Data Import History</h3>
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">File Name</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {[
                                    { name: 'roche_c6000_export_20231128.csv', date: '2023-11-28', status: 'Success' },
                                    { name: 'sysmex_xn_daily_20231128.csv', date: '2023-11-28', status: 'Success' },
                                    { name: 'abbott_i2000_qc_20231127.csv', date: '2023-11-27', status: 'Warning' },
                                ].map((file, idx) => (
                                    <tr key={idx}>
                                        <td className="px-4 py-2 text-sm text-gray-900">{file.name}</td>
                                        <td className="px-4 py-2 text-sm text-gray-500">{file.date}</td>
                                        <td className="px-4 py-2">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${file.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {file.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
