'use client'

import { Equipment } from '@/types/database';
import Link from 'next/link';

export default function EquipmentTable({ equipment }: { equipment: Equipment[] }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Integration</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {equipment.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-800">
                                <Link href={`/dashboard/equipment/${item.id}`}>
                                    {item.equipment_name}
                                </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item.equipment_category ? (
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        {item.equipment_category.replace(/_/g, ' ')}
                                    </span>
                                ) : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.equipment_brand || item.manufacturer || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.serial_number || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {item.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {item.integration_status ? (
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.integration_status === 'Integrated' ? 'bg-green-100 text-green-800' :
                                            item.integration_status === 'Pending Setup' ? 'bg-yellow-100 text-yellow-800' :
                                                item.integration_status === 'Connection Failed' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                        }`}>
                                        {item.integration_status}
                                    </span>
                                ) : (
                                    <span className="text-xs text-gray-400">Not set</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
