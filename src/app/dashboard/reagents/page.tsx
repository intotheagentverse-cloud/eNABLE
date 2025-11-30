import { getReagents, getExpiringReagents } from '@/app/actions/reagents';
import { TEST_LAB_ID } from '@/lib/constants';
import Link from 'next/link';
import LotVariationAnalysis from '@/components/dashboard/LotVariationAnalysis';

export const dynamic = 'force-dynamic';

export default async function ReagentsPage() {
    const reagents = await getReagents(TEST_LAB_ID);
    const expiring = await getExpiringReagents(TEST_LAB_ID, 30);

    // Calculate stats for key features
    const lowStockReagents = reagents.filter((r: any) =>
        r.reorder_level && (r.quantity_remaining || 0) < r.reorder_level
    );
    const needsVerification = reagents.filter((r: any) =>
        r.verification_status === 'PENDING'
    );
    const needsValidation = reagents.filter((r: any) =>
        r.validation_status === 'NOT_STARTED' || r.validation_status === 'IN_PROGRESS'
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reagent & Inventory Management</h1>
                    <p className="text-sm text-gray-500 mt-1">ISO 15189:2022 Compliant Reagent Lifecycle Management</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/dashboard/reagents/lots"
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                    >
                        📦 Manage Lots
                    </Link>
                    <Link
                        href="/dashboard/reagents/add"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        + Add Reagent
                    </Link>
                </div>
            </div>

            {/* Lot Variation Analysis */}
            <LotVariationAnalysis />

            {/* Key Features Alert Banner */}
            {(lowStockReagents.length > 0 || needsVerification.length > 0 || needsValidation.length > 0) && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">⚠️</span>
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-yellow-900 mb-2">Action Required</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                {lowStockReagents.length > 0 && (
                                    <div className="bg-white/50 rounded px-3 py-2">
                                        <span className="font-medium text-red-700">{lowStockReagents.length}</span>
                                        <span className="text-gray-700"> reagent(s) below ROL - Reorder needed</span>
                                    </div>
                                )}
                                {needsVerification.length > 0 && (
                                    <div className="bg-white/50 rounded px-3 py-2">
                                        <span className="font-medium text-orange-700">{needsVerification.length}</span>
                                        <span className="text-gray-700"> lot(s) pending verification</span>
                                    </div>
                                )}
                                {needsValidation.length > 0 && (
                                    <div className="bg-white/50 rounded px-3 py-2">
                                        <span className="font-medium text-yellow-700">{needsValidation.length}</span>
                                        <span className="text-gray-700"> lot(s) need validation testing</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Key Features Stats - 8 Features */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Feature 1: ROL - Reorder Level */}
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xs font-medium text-gray-500 uppercase">Below ROL</h3>
                            <p className="mt-1 text-2xl font-bold text-red-600">{lowStockReagents.length}</p>
                            <p className="mt-1 text-xs text-gray-500">Reorder needed</p>
                        </div>
                        <span className="text-3xl">🔴</span>
                    </div>
                </div>

                {/* Feature 2: ROQ - Reorder Quantity */}
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xs font-medium text-gray-500 uppercase">Total Reagents</h3>
                            <p className="mt-1 text-2xl font-bold text-blue-600">{reagents.length}</p>
                            <p className="mt-1 text-xs text-gray-500">Active inventory</p>
                        </div>
                        <span className="text-3xl">📊</span>
                    </div>
                </div>

                {/* Feature 3 & 4: Lot Verification & Validation */}
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xs font-medium text-gray-500 uppercase">Pending Verification</h3>
                            <p className="mt-1 text-2xl font-bold text-orange-600">{needsVerification.length}</p>
                            <p className="mt-1 text-xs text-gray-500">Lots to verify</p>
                        </div>
                        <span className="text-3xl">✅</span>
                    </div>
                </div>

                {/* Feature 5: Expiry Tracking */}
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xs font-medium text-gray-500 uppercase">Expiring Soon</h3>
                            <p className="mt-1 text-2xl font-bold text-yellow-600">{expiring.length}</p>
                            <p className="mt-1 text-xs text-gray-500">Next 30 days</p>
                        </div>
                        <span className="text-3xl">⏰</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions - Key Features */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">🚀 Key Features & Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <Link
                        href="/dashboard/reagents/verification"
                        className="bg-white hover:bg-gray-50 rounded-lg p-4 border border-gray-200 transition group"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">✅</span>
                            <div>
                                <div className="font-medium text-gray-900 group-hover:text-blue-600">Lot Verification</div>
                                <div className="text-xs text-gray-500">Verify received lots</div>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/reagents/validation"
                        className="bg-white hover:bg-gray-50 rounded-lg p-4 border border-gray-200 transition group"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🧪</span>
                            <div>
                                <div className="font-medium text-gray-900 group-hover:text-blue-600">Lot Validation</div>
                                <div className="text-xs text-gray-500">Test new lots</div>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/reagents/qc-linkage"
                        className="bg-white hover:bg-gray-50 rounded-lg p-4 border border-gray-200 transition group"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🔗</span>
                            <div>
                                <div className="font-medium text-gray-900 group-hover:text-blue-600">QC Data Linkage</div>
                                <div className="text-xs text-gray-500">Link results to lots</div>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/reagents/traceability"
                        className="bg-white hover:bg-gray-50 rounded-lg p-4 border border-gray-200 transition group"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📋</span>
                            <div>
                                <div className="font-medium text-gray-900 group-hover:text-blue-600">Traceability Reports</div>
                                <div className="text-xs text-gray-500">Which results used this lot?</div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Reagent List with Enhanced Columns */}
            <div className="bg-white shadow rounded-lg">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Reagent Inventory</h3>
                        <div className="flex gap-2 text-xs">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded">🟢 In Stock</span>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">🟡 Low Stock</span>
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded">🔴 Reorder</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reagent Name</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stock Status</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ROL / ROQ</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Verification</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {reagents.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                            No reagents found. <Link href="/dashboard/reagents/add" className="text-blue-600 hover:text-blue-800">Add your first reagent →</Link>
                                        </td>
                                    </tr>
                                ) : (
                                    reagents.map((reagent: any) => {
                                        const qty = reagent.quantity_remaining || 0;
                                        const rol = reagent.reorder_level || 0;
                                        const roq = reagent.reorder_quantity || 0;
                                        const stockStatus = qty < rol ? '🔴' : qty < (rol * 1.5) ? '🟡' : '🟢';

                                        return (
                                            <tr key={reagent.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm font-medium text-blue-600">
                                                    <Link href={`/dashboard/reagents/${reagent.id}`}>{reagent.reagent_name}</Link>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                                        {reagent.reagent_type || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span>{stockStatus}</span>
                                                        <span className="text-gray-700">{qty} {reagent.unit || 'units'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {rol > 0 ? (
                                                        <div className="text-xs">
                                                            <div>ROL: {rol}</div>
                                                            <div className="text-gray-400">ROQ: {roq}</div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">Not set</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    {reagent.verification_status === 'VERIFIED' ? (
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">✓ Verified</span>
                                                    ) : reagent.verification_status === 'PENDING' ? (
                                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">⏳ Pending</span>
                                                    ) : (
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">— N/A</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-500">{reagent.supplier || 'N/A'}</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Expiring Lots with Enhanced Info */}
            {expiring.length > 0 && (
                <div className="bg-white shadow rounded-lg">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">⏰ Expiring Lots (Next 30 Days)</h3>
                            <span className="text-xs text-gray-500">Feature 5: Automated Expiry Tracking</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reagent</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Lot #</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Alert Level</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Remaining Qty</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {expiring.map((lot: any) => {
                                        const daysToExpiry = Math.ceil((new Date(lot.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                                        const alertLevel = daysToExpiry <= 1 ? '🔴 Critical' : daysToExpiry <= 7 ? '🟠 Urgent' : '🟡 Warning';
                                        const alertColor = daysToExpiry <= 1 ? 'bg-red-100 text-red-700' : daysToExpiry <= 7 ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700';

                                        return (
                                            <tr key={lot.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{lot.reagent?.reagent_name}</td>
                                                <td className="px-4 py-3 text-sm text-gray-700 font-mono">{lot.lot_number}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <div className={`${daysToExpiry <= 7 ? 'font-semibold' : ''}`}>
                                                        <div className={daysToExpiry <= 7 ? 'text-red-600' : 'text-yellow-600'}>
                                                            {lot.expiry_date}
                                                        </div>
                                                        <div className="text-xs text-gray-500">{daysToExpiry} days remaining</div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${alertColor}`}>
                                                        {alertLevel}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-700">{lot.quantity_remaining} {lot.unit || 'units'}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <Link
                                                        href={`/dashboard/reagents/lots/${lot.id}`}
                                                        className="text-blue-600 hover:text-blue-800 text-xs"
                                                    >
                                                        View Details →
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Feature Summary Footer */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-xs text-gray-600">
                    <strong>ISO 15189:2022 Compliance Features:</strong>
                    <span className="ml-2">
                        ✅ ROL/ROQ Management • ✅ Lot Verification • ✅ Lot Validation •
                        ✅ Expiry Tracking • ✅ QC Data Linkage • ✅ Recall Management •
                        ✅ Traceability Reports • ✅ Automated Alerts
                    </span>
                </div>
            </div>
        </div>
    );
}
