'use client'

import { useEffect, useState } from 'react';

type EquipmentViolation = {
    equipmentName: string;
    violations: {
        id: string;
        rule: string;
        parameter: string;
        value: number;
        date: string;
        status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
    }[];
};

export default function WestgardViolationsByEquipment() {
    const [equipmentViolations, setEquipmentViolations] = useState<EquipmentViolation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data for three equipment
        const mockData: EquipmentViolation[] = [
            {
                equipmentName: 'Analyzer A',
                violations: [
                    { id: '1', rule: '1-3s', parameter: 'Glucose', value: 185, date: new Date().toISOString(), status: 'OPEN' },
                    { id: '2', rule: '2-2s', parameter: 'Cholesterol', value: 220, date: new Date(Date.now() - 86400000).toISOString(), status: 'INVESTIGATING' }
                ]
            },
            {
                equipmentName: 'Analyzer B',
                violations: [
                    { id: '3', rule: '1-3s', parameter: 'Glucose', value: 190, date: new Date().toISOString(), status: 'OPEN' }
                ]
            },
            {
                equipmentName: 'Analyzer C',
                violations: [
                    { id: '4', rule: 'R-4s', parameter: 'Hgb', value: 145, date: new Date(Date.now() - 172800000).toISOString(), status: 'RESOLVED' }
                ]
            }
        ];
        setEquipmentViolations(mockData);
        setLoading(false);
    }, []);

    if (loading) return <div className="p-4">Loading violations...</div>;

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Westgard Violations by Equipment</h3>
                <p className="text-sm text-gray-500 mt-1">Real-time rule violations across all analyzers</p>
            </div>
            <div className="p-6 space-y-6">
                {equipmentViolations.map((eq) => (
                    <div key={eq.equipmentName} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">{eq.equipmentName}</h4>
                                <span className="text-sm text-gray-500">{eq.violations.length} violation{eq.violations.length !== 1 ? 's' : ''}</span>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {eq.violations.map((v) => (
                                <div key={v.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-800">
                                                    {v.rule}
                                                </span>
                                                <span className="text-sm font-medium text-gray-900">{v.parameter}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Value: <span className="font-medium">{v.value}</span> •
                                                {' '}{new Date(v.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${v.status === 'OPEN' ? 'bg-red-100 text-red-800' :
                                                v.status === 'INVESTIGATING' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-green-100 text-green-800'
                                            }`}>
                                            {v.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
