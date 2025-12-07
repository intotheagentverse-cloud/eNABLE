import { useState } from 'react';
import Link from 'next/link';
import EquipmentRegistryView from '@/components/dashboard/EquipmentRegistryView';
import CalibrationView from '@/components/dashboard/CalibrationView';
import ImportDataView from '@/components/dashboard/ImportDataView';
import ValidationView from '@/components/dashboard/ValidationView';

interface EquipmentTabsProps {
    equipmentData: any[];
    calibrationData: any;
    validationData: any;
}

export default function EquipmentTabs({ equipmentData, calibrationData, validationData }: EquipmentTabsProps) {
    const [activeTab, setActiveTab] = useState<'registry' | 'calibration' | 'validation' | 'import'>('registry');

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Equipment Management</h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => setActiveTab('import')}
                        className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Add Data
                    </button>
                    <Link href="/dashboard/equipment/add" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Add Equipment
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('registry')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'registry'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Equipment Registry
                    </button>
                    <button
                        onClick={() => setActiveTab('calibration')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'calibration'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Calibration Management
                    </button>
                    <button
                        onClick={() => setActiveTab('validation')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'validation'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Validation (IQ/OQ/PQ)
                    </button>
                    <button
                        onClick={() => setActiveTab('import')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'import'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Import Data
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'registry' ? (
                <EquipmentRegistryView equipment={equipmentData} />
            ) : activeTab === 'calibration' ? (
                <CalibrationView data={calibrationData} />
            ) : activeTab === 'validation' ? (
                <ValidationView equipment={equipmentData} data={validationData} />
            ) : (
                <ImportDataView equipment={equipmentData} />
            )}
        </div>
    );
}
