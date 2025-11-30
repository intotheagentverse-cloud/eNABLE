"use client";

interface Equipment {
    id: string;
    name: string;
    healthScore: number;
    calibrationStatus: string;
    qcViolations: number;
    integrationStatus: string;
}

export default function EquipmentHealthScore() {
    const equipment: Equipment[] = [
        { id: '1', name: 'Analyzer A', healthScore: 92, calibrationStatus: 'Current', qcViolations: 1, integrationStatus: 'Integrated' },
        { id: '2', name: 'Analyzer B', healthScore: 68, calibrationStatus: 'Due Soon', qcViolations: 5, integrationStatus: 'Integrated' },
        { id: '3', name: 'Analyzer C', healthScore: 85, calibrationStatus: 'Current', qcViolations: 2, integrationStatus: 'Manual Entry' },
    ];

    const getHealthColor = (score: number) => {
        if (score >= 85) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    const getRecommendation = (eq: Equipment) => {
        if (eq.healthScore < 70) return '⚠️ Schedule preventive maintenance';
        if (eq.qcViolations > 3) return '🔍 Investigate QC patterns';
        if (eq.calibrationStatus === 'Due Soon') return '📅 Plan calibration';
        return '✓ Equipment performing well';
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">AI Equipment Health Scoring</h3>
                    <p className="text-sm text-gray-500 mt-1">Predictive maintenance & performance analysis</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {equipment.map((eq) => (
                    <div key={eq.id} className={`border-2 rounded-lg p-4 ${getHealthColor(eq.healthScore)}`}>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">{eq.name}</h4>
                            <div className="text-center">
                                <div className="text-2xl font-bold">{eq.healthScore}</div>
                                <div className="text-xs text-gray-600">Health Score</div>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Calibration:</span>
                                <span className="font-medium">{eq.calibrationStatus}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">QC Violations:</span>
                                <span className="font-medium">{eq.qcViolations}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Integration:</span>
                                <span className="font-medium">{eq.integrationStatus}</span>
                            </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-300">
                            <p className="text-xs font-medium">{getRecommendation(eq)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
