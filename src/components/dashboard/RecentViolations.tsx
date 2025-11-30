import Link from 'next/link';

export default function RecentViolations({ violations }: { violations: any[] }) {
    if (violations.length === 0) {
        return <p className="text-sm text-gray-500">No recent QC violations reported.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Parameter</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Issue</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {violations.map((v) => {
                        const test = v.qc_tests || v; // Handle both deviation and raw test for backward compatibility
                        const equipmentName = test.equipment?.equipment_name || 'Unknown';
                        const paramName = test.parameter_name || 'Unknown';
                        const level = test.control_level || '';

                        return (
                            <tr key={v.id}>
                                <td className="px-4 py-2 text-sm text-gray-900">
                                    {test.test_date ? new Date(test.test_date).toLocaleDateString() : '-'}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-900">{equipmentName}</td>
                                <td className="px-4 py-2 text-sm text-gray-500">{paramName} {level ? `(${level})` : ''}</td>
                                <td className="px-4 py-2">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${v.status === 'OPEN' ? 'bg-red-100 text-red-800' :
                                            v.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                                                'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {v.status || test.status}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="mt-4 text-right">
                <Link href="/dashboard/qc" className="text-sm text-blue-600 hover:text-blue-800">
                    View All Logs &rarr;
                </Link>
            </div>
        </div>
    );
}
