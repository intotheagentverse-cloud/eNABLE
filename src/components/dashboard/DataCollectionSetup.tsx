'use client'

import { useState } from 'react';

type DataCollectionConfig = {
    equipmentId: string;
    equipmentName: string;
    method: 'API' | 'SFTP' | 'MANUAL';
    status: 'ACTIVE' | 'INACTIVE' | 'ERROR';
    lastSync?: string;
    manufacturer: string;
};

export default function DataCollectionSetup() {
    const [configs, setConfigs] = useState<DataCollectionConfig[]>([
        {
            equipmentId: '1',
            equipmentName: 'Analyzer A',
            manufacturer: 'Siemens Atellica',
            method: 'API',
            status: 'ACTIVE',
            lastSync: new Date().toISOString()
        },
        {
            equipmentId: '2',
            equipmentName: 'Analyzer B',
            manufacturer: 'Roche Cobas',
            method: 'SFTP',
            status: 'ACTIVE',
            lastSync: new Date(Date.now() - 3600000).toISOString()
        },
        {
            equipmentId: '3',
            equipmentName: 'Analyzer C',
            manufacturer: 'Abbott Alinity',
            method: 'MANUAL',
            status: 'INACTIVE'
        }
    ]);

    const statusColors = {
        ACTIVE: 'bg-green-100 text-green-800',
        INACTIVE: 'bg-gray-100 text-gray-800',
        ERROR: 'bg-red-100 text-red-800'
    };

    const methodBadges = {
        API: 'bg-blue-100 text-blue-800',
        SFTP: 'bg-purple-100 text-purple-800',
        MANUAL: 'bg-gray-100 text-gray-800'
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Automated Data Collection</h3>
                <p className="text-sm text-gray-500 mt-1">Configure API/SFTP integration with analyzers</p>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {configs.map((config) => (
                        <div key={config.equipmentId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h4 className="font-medium text-gray-900">{config.equipmentName}</h4>
                                    <p className="text-xs text-gray-500 mt-1">{config.manufacturer}</p>
                                </div>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[config.status]}`}>
                                    {config.status}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Method:</span>
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${methodBadges[config.method]}`}>
                                        {config.method}
                                    </span>
                                </div>

                                {config.lastSync && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Last Sync:</span>
                                        <span className="text-xs text-gray-500" suppressHydrationWarning>
                                            {new Date(config.lastSync).toLocaleTimeString()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium">
                                    Configure
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="ml-3">
                            <h4 className="text-sm font-medium text-blue-900">Auto-Collection Benefits</h4>
                            <p className="text-sm text-blue-700 mt-1">
                                Real-time data collection eliminates manual entry errors and enables immediate Westgard rule validation.
                                Supports API integration for modern analyzers and SFTP for legacy systems.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
