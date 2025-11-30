'use client'

import { useState } from 'react';

type Deviation = {
    id: string;
    equipmentName: string;
    parameter: string;
    rule: string;
    value: number;
    date: string;
    status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';
    rootCause?: string;
    correctiveAction?: string;
};

export default function DeviationManagement() {
    const [deviations, setDeviations] = useState<Deviation[]>([
        {
            id: '1',
            equipmentName: 'Analyzer A',
            parameter: 'Glucose',
            rule: '1-3s',
            value: 185,
            date: new Date().toISOString(),
            status: 'OPEN'
        },
        {
            id: '2',
            equipmentName: 'Analyzer B',
            parameter: 'Cholesterol',
            rule: '2-2s',
            value: 220,
            date: new Date(Date.now() - 86400000).toISOString(),
            status: 'INVESTIGATING',
            rootCause: 'Reagent lot issue'
        }
    ]);

    const [selectedDeviation, setSelectedDeviation] = useState<Deviation | null>(null);

    const statusColors = {
        OPEN: 'bg-red-100 text-red-800',
        INVESTIGATING: 'bg-yellow-100 text-yellow-800',
        RESOLVED: 'bg-blue-100 text-blue-800',
        CLOSED: 'bg-green-100 text-green-800'
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Deviation Management</h3>
                <p className="text-sm text-gray-500 mt-1">Track and resolve QC violations</p>
            </div>
            <div className="p-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rule</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {deviations.map((dev) => (
                                <tr key={dev.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-900">{dev.equipmentName}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{dev.parameter}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-800">
                                            {dev.rule}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{dev.value}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {new Date(dev.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[dev.status]}`}>
                                            {dev.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <button
                                            onClick={() => setSelectedDeviation(dev)}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Investigate
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {deviations.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No deviations to manage</p>
                    </div>
                )}
            </div>
        </div>
    );
}
