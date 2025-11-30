'use client'

import { useEffect, useState } from 'react';
import { QCDeviation, QCTest } from '@/types/database';

type DeviationWithTest = QCDeviation & {
    qc_tests: QCTest & {
        equipment: {
            equipment_name: string;
        };
    };
};

export default function ViolationLog() {
    const [deviations, setDeviations] = useState<DeviationWithTest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDeviations();
    }, []);

    const fetchDeviations = async () => {
        try {
            const res = await fetch('/api/qc/deviations');
            const data = await res.json();
            if (Array.isArray(data)) {
                setDeviations(data);
            }
        } catch (error) {
            console.error('Failed to fetch deviations', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-4">Loading violations...</div>;

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">Violation Log</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {deviations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No violations recorded.</div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {deviations.map((dev) => (
                            <li key={dev.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${dev.status === 'OPEN' ? 'bg-red-100 text-red-800' :
                                                    dev.status === 'INVESTIGATING' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-green-100 text-green-800'
                                                }`}>
                                                {dev.status}
                                            </span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {dev.qc_tests.equipment.equipment_name}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {dev.qc_tests.parameter_name}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Rule: <span className="font-medium text-red-600">{dev.qc_tests.violation_rule}</span>
                                            {' • '}
                                            Value: {dev.qc_tests.result_obtained}
                                        </p>
                                        {dev.root_cause && (
                                            <p className="mt-1 text-xs text-gray-500">
                                                Root Cause: {dev.root_cause}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">
                                            {new Date(dev.created_at).toLocaleDateString()}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(dev.created_at).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
