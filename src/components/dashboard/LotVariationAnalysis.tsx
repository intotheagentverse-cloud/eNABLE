"use client";

export default function LotVariationAnalysis() {
    const lotComparison = [
        { reagent: 'Glucose Reagent', currentLot: '2024B', previousLot: '2024A', meanShift: '+8%', status: 'Monitor' },
        { reagent: 'Creatinine Reagent', currentLot: '2024C', previousLot: '2024B', meanShift: '+2%', status: 'Normal' },
        { reagent: 'HbA1c Reagent', currentLot: '2024D', previousLot: '2024C', meanShift: '-12%', status: 'Alert' },
    ];

    const getStatusColor = (status: string) => {
        if (status === 'Normal') return 'bg-green-100 text-green-700';
        if (status === 'Monitor') return 'bg-yellow-100 text-yellow-700';
        return 'bg-red-100 text-red-700';
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Lot-to-Lot Variation Analysis</h3>
                    <p className="text-sm text-gray-500 mt-1">AI-powered QC shift detection</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reagent</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Current Lot</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Previous Lot</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mean Shift</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">AI Recommendation</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {lotComparison.map((lot, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{lot.reagent}</td>
                                <td className="px-4 py-3 text-sm text-gray-700 font-mono">{lot.currentLot}</td>
                                <td className="px-4 py-3 text-sm text-gray-500 font-mono">{lot.previousLot}</td>
                                <td className="px-4 py-3 text-sm font-semibold">{lot.meanShift}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(lot.status)}`}>
                                        {lot.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-600">
                                    {lot.status === 'Alert' ? 'Investigate immediately - significant shift' :
                                        lot.status === 'Monitor' ? 'Monitor closely for 7 days' :
                                            'Continue normal QC'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs text-purple-800">
                    <strong>AI Analysis:</strong> Compares QC mean values between lots. Shifts &gt;10% trigger alerts for investigation.
                </p>
            </div>
        </div>
    );
}
