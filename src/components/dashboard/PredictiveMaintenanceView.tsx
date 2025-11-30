"use client";

import EquipmentHealthScore from './EquipmentHealthScore';

export default function PredictiveMaintenanceView() {
    // Mock data for predictive insights
    const insights = [
        {
            id: 1,
            equipment: "Chemistry Analyzer A",
            issue: "Photometer drift detected",
            probability: "High (85%)",
            impact: "Potential QC failure in < 48h",
            action: "Clean optical window",
            urgency: "high"
        },
        {
            id: 2,
            equipment: "Immunoassay System B",
            issue: "Reagent probe pressure fluctuation",
            probability: "Medium (60%)",
            impact: "Aspiration errors possible",
            action: "Check probe seal",
            urgency: "medium"
        },
        {
            id: 3,
            equipment: "Centrifuge C",
            issue: "Vibration pattern change",
            probability: "Low (30%)",
            impact: "Rotor imbalance risk",
            action: "Verify load balance",
            urgency: "low"
        }
    ];

    const maintenanceSchedule = [
        { id: 1, equipment: "Analyzer A", task: "Monthly Cleaning", due: "2 days", status: "Pending" },
        { id: 2, equipment: "Analyzer B", task: "Filter Replacement", due: "5 days", status: "Scheduled" },
        { id: 3, equipment: "Centrifuge C", task: "Annual Calibration", due: "12 days", status: "Scheduled" },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* AI Insights */}
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">🤖 AI Predictive Insights</h3>
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">Beta</span>
                    </div>
                    <div className="space-y-4">
                        {insights.map((insight) => (
                            <div key={insight.id} className={`p-4 rounded-lg border-l-4 ${insight.urgency === 'high' ? 'border-red-500 bg-red-50' :
                                insight.urgency === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                                    'border-blue-500 bg-blue-50'
                                }`}>
                                <div className="flex justify-between items-start">
                                    <h4 className="font-medium text-gray-900">{insight.equipment}</h4>
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${insight.urgency === 'high' ? 'bg-red-200 text-red-800' :
                                        insight.urgency === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                            'bg-blue-200 text-blue-800'
                                        }`}>
                                        {insight.probability}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-800 mt-1 font-medium">{insight.issue}</p>
                                <p className="text-xs text-gray-600 mt-1">Impact: {insight.impact}</p>
                                <div className="mt-2 pt-2 border-t border-gray-200/50 flex justify-between items-center">
                                    <span className="text-xs font-medium text-gray-700">Recommended Action:</span>
                                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                                        {insight.action} →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Maintenance Forecast */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">📅 Maintenance Forecast</h3>
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Due In</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {maintenanceSchedule.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.equipment}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{item.task}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                                                {item.due}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                        <p className="text-sm text-gray-500">
                            AI analysis suggests optimal maintenance windows to minimize downtime.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
