"use client";

import Link from 'next/link';

interface CalibrationViewProps {
    data: {
        total: number;
        compliant: number;
        overdue: number;
        upcoming: any[];
        recent: any[];
        maintenance: any[];
    };
}

export default function CalibrationView({ data }: CalibrationViewProps) {
    const complianceRate = data.total > 0 ? Math.round((data.compliant / data.total) * 100) : 0;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                    <p className="text-sm text-gray-500">Equipment Tracked</p>
                    <p className="text-2xl font-bold">{data.total}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                    <p className="text-sm text-gray-500">Compliant</p>
                    <p className="text-2xl font-bold">{data.compliant}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
                    <p className="text-sm text-gray-500">Overdue</p>
                    <p className="text-2xl font-bold">{data.overdue}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
                    <p className="text-sm text-gray-500">Due Soon (30 Days)</p>
                    <p className="text-2xl font-bold">{data.upcoming.length}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent History (Moved from Right to Left) */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Calibrations</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.recent.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-4 text-center text-sm text-gray-500">No recent calibrations</td>
                                    </tr>
                                ) : (
                                    data.recent.map((cal: any) => (
                                        <tr key={cal.id}>
                                            <td className="px-4 py-2 text-sm text-gray-900">{cal.equipment?.equipment_name}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500">{new Date(cal.calibration_date).toLocaleDateString()}</td>
                                            <td className="px-4 py-2">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${cal.status === 'PASS' ? 'bg-green-100 text-green-800' :
                                                        cal.status === 'WARNING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                    {cal.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Scheduled Maintenance */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Scheduled Maintenance</h3>
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.maintenance.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-4 text-center text-sm text-gray-500">No scheduled maintenance</td>
                                    </tr>
                                ) : (
                                    data.maintenance.map((item: any) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.equipment?.equipment_name}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{item.maintenance_type}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                                                    {item.next_due_date ? new Date(item.next_due_date).toLocaleDateString() : 'N/A'}
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
