'use client'

import { useEffect, useState } from 'react';

type ReagentKPI = {
    expiringWithin30Days: number;
    lowStockItems: number;
    lotValidationPending: number;
};

export default function ReagentManagementKPIs() {
    const [kpis, setKpis] = useState<ReagentKPI>({
        expiringWithin30Days: 8,
        lowStockItems: 5,
        lotValidationPending: 3
    });

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Reagent Management</h3>
                <p className="text-sm text-gray-500 mt-1">Key inventory and compliance metrics</p>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 gap-4">
                    {/* Expiring Items */}
                    <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-amber-900">Expiring Soon</p>
                                <p className="text-xs text-amber-700">Within 30 days</p>
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-amber-900">{kpis.expiringWithin30Days}</div>
                    </div>

                    {/* Low Stock */}
                    <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-red-900">Low Stock Alert</p>
                                <p className="text-xs text-red-700">Below reorder level</p>
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-red-900">{kpis.lowStockItems}</div>
                    </div>

                    {/* Lot Validation Pending */}
                    <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-blue-900">Lot Validation</p>
                                <p className="text-xs text-blue-700">Pending verification</p>
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-blue-900">{kpis.lotValidationPending}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
