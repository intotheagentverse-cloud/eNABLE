'use client';

import { useState } from 'react';
import LeveyJenningsChart from './qc-analytics/LeveyJenningsChart';
import ZScoreTrendChart from './qc-analytics/ZScoreTrendChart';
import { ChartDataPoint, ControlLimits } from '@/lib/levey-jennings';

interface QCChartsViewProps {
    initialData: ChartDataPoint[];
    initialLimits: ControlLimits;
}

export default function QCChartsView({ initialData, initialLimits }: QCChartsViewProps) {
    const [selectedEquipment, setSelectedEquipment] = useState('Cobas c311');
    const [selectedTest, setSelectedTest] = useState('Glucose');

    // In a real app, this would fetch data based on selection.
    // For now, we use the passed initial data as mock data for all selections.

    return (
        <div className="space-y-6">
            {/* Equipment Selector */}
            <div className="bg-white p-4 rounded-lg shadow flex gap-4 items-center">
                <div className="w-64">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Equipment</label>
                    <select
                        value={selectedEquipment}
                        onChange={(e) => setSelectedEquipment(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                        <option>Cobas c311</option>
                        <option>Architect i2000</option>
                        <option>Alinity c</option>
                        <option>DxC 700 AU</option>
                    </select>
                </div>
                <div className="w-64">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Test</label>
                    <select
                        value={selectedTest}
                        onChange={(e) => setSelectedTest(e.target.value)}
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
                testName={selectedTest}
                controlName="PreciControl ClinChem L1"
                unit="mg/dL"
            />

            {/* Z-Score Trend Analysis */}
            <ZScoreTrendChart
                data={initialData}
                testName={selectedTest}
            />
        </div>
    );
}
