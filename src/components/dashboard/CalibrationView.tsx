"use client";

import Link from 'next/link';

interface CalibrationViewProps {
    data: {
        total: number;
        compliant: number;
        overdue: number;
        upcoming: any[];
        recent: any[];
    };
}

export default function CalibrationView({ data }: CalibrationViewProps) {
    const complianceRate = data.total > 0 ? Math.round((data.compliant / data.total) * 100) : 0;

    // Mock data for maintenance forecast (migrated from PredictiveMaintenanceView)
    const maintenanceSchedule = [
        { id: 1, equipment: "Analyzer A", task: "Monthly Cleaning", due: "2 days", status: "Pending" },
        { id: 2, equipment: "Analyzer B", task: "Filter Replacement", due: "5 days", status: "Scheduled" },
        { id: 3, equipment: "Centrifuge C", task: "Annual Calibration", due: "12 days", status: "Scheduled" },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent History (Moved from Right to Left) */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
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
                                {data.recent.map((cal: any) => (
                                    <tr key={cal.id}>
                                        <td className="px-4 py-2 text-sm text-gray-900">{cal.equipment?.equipment_name}</td>
                                        <td className="px-4 py-2 text-sm text-gray-500">{cal.calibration_date}</td>
                                        <td className="px-4 py-2">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {cal.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Predictive Maintenance (Migrated from Predictive Maintenance) */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Predictive Maintenance</h3>
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Due In</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {maintenanceSchedule.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.equipment}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{item.task}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                                                {item.due}
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
