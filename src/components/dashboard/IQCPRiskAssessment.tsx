"use client";

export default function IQCPRiskAssessment() {
    const iqcpStatus = {
        riskAssessment: { status: 'COMPLETE', lastReview: '2025-11-15', score: 85 },
        qualityControlPlan: { status: 'ACTIVE', coverage: 95 },
        qualityAssessment: { status: 'ONGOING', nextReview: '2025-12-15' },
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">IQCP Compliance Framework</h3>
                    <p className="text-sm text-gray-500 mt-1">Individualized Quality Control Plan (CLIA)</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    ✓ CLIA Compliant
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Risk Assessment */}
                <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">📊</span>
                        <h4 className="font-medium text-gray-900">Risk Assessment</h4>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Status:</span>
                            <span className="font-medium text-green-600">{iqcpStatus.riskAssessment.status}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Risk Score:</span>
                            <span className="font-medium">{iqcpStatus.riskAssessment.score}/100</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Last Review:</span>
                            <span className="text-gray-700">{iqcpStatus.riskAssessment.lastReview}</span>
                        </div>
                    </div>
                </div>

                {/* Quality Control Plan */}
                <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">📋</span>
                        <h4 className="font-medium text-gray-900">QC Plan</h4>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Status:</span>
                            <span className="font-medium text-blue-600">{iqcpStatus.qualityControlPlan.status}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Coverage:</span>
                            <span className="font-medium">{iqcpStatus.qualityControlPlan.coverage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${iqcpStatus.qualityControlPlan.coverage}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Quality Assessment */}
                <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">🔍</span>
                        <h4 className="font-medium text-gray-900">Quality Assessment</h4>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Status:</span>
                            <span className="font-medium text-yellow-600">{iqcpStatus.qualityAssessment.status}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Next Review:</span>
                            <span className="text-gray-700">{iqcpStatus.qualityAssessment.nextReview}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-800">
                    <strong>IQCP Framework:</strong> Risk-based quality control approach per CLIA regulations.
                    Includes Risk Assessment, Quality Control Plan, and ongoing Quality Assessment.
                </p>
            </div>
        </div>
    );
}
