'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { Equipment } from '@/types/database';

export default function QCFilters({ equipmentList }: { equipmentList: Equipment[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const equipmentId = searchParams.get('equipment_id') || (equipmentList.length > 0 ? equipmentList[0].id : '');
    const parameter = searchParams.get('parameter') || 'Glucose';
    const level = searchParams.get('level') || 'L2';

    function handleFilterChange(key: string, value: string) {
        const params = new URLSearchParams(searchParams.toString());
        params.set(key, value);

        // If equipment changes, we might want to reset other filters or keep them. 
        // For now, just update the URL.
        router.push(`/dashboard/qc?${params.toString()}`);
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4 items-end">
            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Equipment</label>
                <select
                    value={equipmentId}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                    onChange={(e) => handleFilterChange('equipment_id', e.target.value)}
                >
                    {equipmentList.map(eq => (
                        <option key={eq.id} value={eq.id}>{eq.equipment_name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Parameter</label>
                <select
                    value={parameter}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                    onChange={(e) => handleFilterChange('parameter', e.target.value)}
                >
                    <option value="Glucose">Glucose</option>
                    <option value="Hemoglobin">Hemoglobin</option>
                    <option value="TSH">TSH</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Level</label>
                <select
                    value={level}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                    onChange={(e) => handleFilterChange('level', e.target.value)}
                >
                    <option value="L1">Level 1</option>
                    <option value="L2">Level 2</option>
                    <option value="L3">Level 3</option>
                </select>
            </div>
        </div>
    );
}
