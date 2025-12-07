'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ValidationViewProps {
    equipment: any[];
    data: {
        totalValidations: number;
        recent: any[];
        pendingIQ: number;
        pendingOQ: number;
        pendingPQ: number;
    };
}

export default function ValidationView({ equipment, data }: ValidationViewProps) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Equipment Validation (IQ/OQ/PQ)</h2>
                {/* 
                  Future enhancement: Add global "Add Validation" button if needed, 
                  but typically validations are added per equipment.
                */}
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Validated</dt>
                                    <dd>
                                        <div className="text-lg font-medium text-gray-900">{data.totalValidations}</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <span className="h-6 w-6 flex items-center justify-center text-orange-500 font-bold border-2 border-orange-500 rounded-full text-xs">IQ</span>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Pending IQ</dt>
                                    <dd>
                                        <div className="text-lg font-medium text-gray-900">{data.pendingIQ}</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <span className="h-6 w-6 flex items-center justify-center text-blue-500 font-bold border-2 border-blue-500 rounded-full text-xs">OQ</span>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Pending OQ</dt>
                                    <dd>
                                        <div className="text-lg font-medium text-gray-900">{data.pendingOQ}</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <span className="h-6 w-6 flex items-center justify-center text-purple-500 font-bold border-2 border-purple-500 rounded-full text-xs">PQ</span>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Pending PQ</dt>
                                    <dd>
                                        <div className="text-lg font-medium text-gray-900">{data.pendingPQ}</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Validations List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Validations</h3>
                </div>
                <ul className="divide-y divide-gray-200">
                    {data.recent.length === 0 ? (
                        <li className="px-4 py-4 sm:px-6 text-center text-gray-500">No recent validations found.</li>
                    ) : (
                        data.recent.map((validation) => (
                            <li key={validation.id}>
                                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${validation.validation_type === 'IQ' ? 'bg-orange-100 text-orange-800' :
                                                        validation.validation_type === 'OQ' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-purple-100 text-purple-800'}`}>
                                                    {validation.validation_type}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-blue-600 truncate">
                                                    <Link href={`/dashboard/equipment/${validation.equipment_id}`} className="hover:underline">
                                                        View Equipment
                                                    </Link>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Performed by {validation.performed_by}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="text-sm text-gray-900">
                                                {new Date(validation.validation_date).toLocaleDateString()}
                                            </div>
                                            <div className={`text-sm ${validation.status === 'PASS' ? 'text-green-600' : 'text-red-600'}`}>
                                                {validation.status}
                                            </div>
                                        </div>
                                    </div>
                                    {validation.report_url && (
                                        <div className="mt-2 text-sm text-gray-500 sm:ml-10">
                                            <a href={validation.report_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                                View Report
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3 flex-1 md:flex md:justify-between">
                        <p className="text-sm text-blue-700">
                            To log a new IQ, OQ, or PQ validation, please navigate to the specific equipment detail page.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
