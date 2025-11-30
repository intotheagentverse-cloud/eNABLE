'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LeveyJenningsChart from './qc-analytics/LeveyJenningsChart';
import ZScoreTrendChart from './qc-analytics/ZScoreTrendChart';
import { ChartDataPoint, ControlLimits } from '@/lib/levey-jennings';
import { Equipment } from '@/types/database';

interface QCChartsViewProps {
    equipment: Equipment[];
    selectedEquipmentId: string;
    selectedParameter: string;
    selectedLevel: string;
    initialData: ChartDataPoint[];
    initialLimits: ControlLimits | null;
}

export default function QCChartsView({
    equipment,
    selectedEquipmentId,
    selectedParameter,
    selectedLevel,
    initialData,
    initialLimits
}: QCChartsViewProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleEquipmentChange = (equipmentId: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('equipment', equipmentId);
        router.push(`/dashboard/qc?${params.toString()}`);
    };

    const handleParameterChange = (parameter: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('parameter', parameter);
        router.push(`/dashboard/qc?${params.toString()}`);
    };

    if (!initialLimits || initialData.length === 0) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-yellow-800">
                    No QC data or control limits available for the selected equipment and parameter.
                    Please set control limits and log QC data to view charts.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Equipment Selector */}
            <div className="bg-white p-4 rounded-lg shadow flex gap-4 items-center">
                <div className="w-64">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Equipment</label>
                    <select
                        value={selectedEquipmentId}
                        onChange={(e) => handleEquipmentChange(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                        {equipment.map(eq => (
                            <option key={eq.id} value={eq.id}>
                                {eq.equipment_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="w-64">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Test</label>
                    <select
                        value={selectedParameter}
                        onChange={(e) => handleParameterChange(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                        <option>Glucose</option>
                        <option>Cholesterol</option>
                        <option>TSH</option>
                        <option>HbA1c</option>
                    </select>
                </div>
            </div>

            {/* Levey-Jennings Chart */}
            <LeveyJenningsChart
                data={initialData}
                limits={initialLimits}
                testName={selectedParameter}
                controlName={selectedLevel}
                unit="mg/dL"
            />

            {/* Z-Score Trend Analysis */}
            <ZScoreTrendChart
                data={initialData}
                testName={selectedParameter}
            />
        </div>
    );
}
