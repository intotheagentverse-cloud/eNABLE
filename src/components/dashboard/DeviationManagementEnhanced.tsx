'use client'

import { useState } from 'react';

type Deviation = {
    id: string;
    equipmentName: string;
    parameter: string;
    rule: string;
    value: number;
    date: string;
    status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';
    rootCause?: string;
    correctiveAction?: string;
};

type InvestigationStep = {
    step: number;
    title: string;
    description: string;
    action: string;
};

export default function DeviationManagementEnhanced() {
    const [deviations, setDeviations] = useState<Deviation[]>([
        {
            id: '1',
            equipmentName: 'Analyzer A',
            parameter: 'Glucose',
            rule: '1-3s',
            value: 185,
            date: new Date().toISOString(),
            status: 'OPEN'
        },
        {
            id: '2',
            equipmentName: 'Analyzer B',
            parameter: 'Cholesterol',
            rule: '2-2s',
            value: 220,
            date: new Date(Date.now() - 86400000).toISOString(),
            status: 'INVESTIGATING',
            rootCause: 'Reagent lot issue'
        },
        {
            id: '3',
            equipmentName: 'Analyzer C',
            parameter: 'Hgb',
            rule: 'R-4s',
            value: 145,
            date: new Date(Date.now() - 172800000).toISOString(),
            status: 'OPEN'
        }
    ]);

    const [selectedDeviation, setSelectedDeviation] = useState<Deviation | null>(null);
    const [showInvestigation, setShowInvestigation] = useState(false);

    const statusColors = {
        OPEN: 'bg-red-100 text-red-800',
        INVESTIGATING: 'bg-yellow-100 text-yellow-800',
        RESOLVED: 'bg-blue-100 text-blue-800',
        CLOSED: 'bg-green-100 text-green-800'
    };

    // Detailed investigation workflows for each Westgard rule
    const getInvestigationWorkflow = (rule: string): InvestigationStep[] => {
        const workflows: Record<string, InvestigationStep[]> = {
            '1-3s': [
                {
                    step: 1,
                    title: 'Immediate Action',
                    description: 'Single point exceeds 3SD - indicates random error',
                    action: 'Stop testing immediately. Do not report patient results.'
                },
                {
                    step: 2,
                    title: 'Verify QC Material',
                    description: 'Check control material integrity',
                    action: 'Inspect vial for contamination, check expiry date, verify storage temperature (2-8°C). If compromised, open new vial and re-test.'
                },
                {
                    step: 3,
                    title: 'Check Instrument',
                    description: 'Investigate potential instrument malfunction',
                    action: 'Review maintenance logs, check for error codes, verify reagent levels, inspect sample probe for clots/debris.'
                },
                {
                    step: 4,
                    title: 'Re-run Controls',
                    description: 'Repeat QC testing with fresh material',
                    action: 'Run new QC from different lot if available. If pass, resume testing. If fail, escalate to biomedical engineering.'
                },
                {
                    step: 5,
                    title: 'Document & Report',
                    description: 'Complete investigation documentation',
                    action: 'Record findings in deviation log, update CAPA if needed, notify lab manager if downtime >2 hours.'
                }
            ],
            '2-2s': [
                {
                    step: 1,
                    title: 'Identify Systematic Error',
                    description: 'Two consecutive points >2SD on same side - systematic shift detected',
                    action: 'Stop testing. Review last 10 QC results for trending pattern.'
                },
                {
                    step: 2,
                    title: 'Check Calibration',
                    description: 'Verify calibration status and stability',
                    action: 'Review calibration date (should be <30 days). Check calibrator storage conditions. Run calibration verification if >14 days old.'
                },
                {
                    step: 3,
                    title: 'Investigate Reagent Lot',
                    description: 'New reagent lot may cause systematic shift',
                    action: 'Check if reagent lot changed recently. Compare current lot QC data vs. previous lot. If new lot, perform method verification per ISO 15189.'
                },
                {
                    step: 4,
                    title: 'Environmental Factors',
                    description: 'Temperature/humidity fluctuations affect results',
                    action: 'Verify lab temperature (18-25°C) and humidity (30-60%). Check HVAC logs for recent changes.'
                },
                {
                    step: 5,
                    title: 'Recalibrate & Validate',
                    description: 'Perform full recalibration',
                    action: 'Run 2-point calibration, verify with 3rd-party controls, run patient sample comparison (n=20) if available.'
                }
            ],
            'R-4s': [
                {
                    step: 1,
                    title: 'Detect Random Error',
                    description: 'Range between consecutive points >4SD - high imprecision',
                    action: 'Stop testing. Indicates severe random error or mixing issue.'
                },
                {
                    step: 2,
                    title: 'Check Sample Handling',
                    description: 'Verify QC material mixing and handling',
                    action: 'Ensure QC vial was gently inverted 10 times before use. Check for settling/stratification. Remix and re-test.'
                },
                {
                    step: 3,
                    title: 'Inspect Pipetting System',
                    description: 'Probe/pipette malfunction causes imprecision',
                    action: 'Run precision check with water (CV should be <1%). Clean sample probe with enzymatic cleaner. Check for air bubbles in tubing.'
                },
                {
                    step: 4,
                    title: 'Reagent Stability',
                    description: 'Degraded reagent causes variable results',
                    action: 'Check reagent on-board time (should be <8 hours for most). Replace with fresh reagent and re-test.'
                },
                {
                    step: 5,
                    title: 'Precision Study',
                    description: 'Perform within-run precision study',
                    action: 'Run same QC material 20 times. Calculate CV. If CV >manufacturer spec, contact service engineer.'
                }
            ],
            '4-1s': [
                {
                    step: 1,
                    title: 'Identify Systematic Drift',
                    description: 'Four consecutive points >1SD same side - gradual shift',
                    action: 'Continue testing with caution. Monitor next 2 QC runs closely.'
                },
                {
                    step: 2,
                    title: 'Review Reagent Stability',
                    description: 'Reagent degradation over time',
                    action: 'Check reagent open-date. Most reagents stable 30 days on-board. If >21 days, replace and re-test.'
                },
                {
                    step: 3,
                    title: 'Lamp/Optics Check',
                    description: 'Photometer lamp aging causes drift',
                    action: 'Check lamp hours (typical life 2000-5000 hours). Run blank absorbance check. If >0.1 AU, replace lamp.'
                },
                {
                    step: 4,
                    title: 'Temperature Monitoring',
                    description: 'Incubator temperature drift affects enzymatic assays',
                    action: 'Verify incubator temperature with calibrated thermometer. Should be 37.0±0.5°C. Adjust if needed.'
                },
                {
                    step: 5,
                    title: 'Preventive Calibration',
                    description: 'Recalibrate before rejection occurs',
                    action: 'Perform calibration now to prevent future 2-2s violation. Document as preventive maintenance.'
                }
            ],
            '10x': [
                {
                    step: 1,
                    title: 'Detect Systematic Bias',
                    description: 'Ten consecutive points same side of mean - significant bias',
                    action: 'Stop testing immediately. Indicates major systematic error.'
                },
                {
                    step: 2,
                    title: 'Calibrator Investigation',
                    description: 'Wrong calibrator or calibrator degradation',
                    action: 'Verify correct calibrator lot loaded. Check calibrator expiry and storage. Run calibrator as unknown - should match assigned value ±5%.'
                },
                {
                    step: 3,
                    title: 'Method Comparison',
                    description: 'Compare with reference method',
                    action: 'Run 10 patient samples on backup analyzer or send to reference lab. Calculate bias. If >10%, method failure.'
                },
                {
                    step: 4,
                    title: 'Reagent Lot Change',
                    description: 'New lot may have different matrix',
                    action: 'If reagent lot changed, perform full method validation: linearity, precision, accuracy, comparison study per CLSI EP15.'
                },
                {
                    step: 5,
                    title: 'Escalate to Manufacturer',
                    description: 'Contact technical support',
                    action: 'Open service ticket with analyzer manufacturer. Provide QC data, reagent lot numbers, calibration records. May require field service visit.'
                }
            ],
            '1-2s': [
                {
                    step: 1,
                    title: 'Warning Level',
                    description: 'Single point >2SD - warning only, not rejection',
                    action: 'Continue testing. Monitor next QC run for 2-2s rule.'
                },
                {
                    step: 2,
                    title: 'Document Observation',
                    description: 'Record warning in QC log',
                    action: 'Note in daily QC log. If 1-2s occurs >3 times in 10 runs, investigate as per 4-1s workflow.'
                },
                {
                    step: 3,
                    title: 'Trend Analysis',
                    description: 'Review Levy-Jennings chart for patterns',
                    action: 'Check for upward/downward trends. Calculate CV for last 20 runs. If CV increasing, investigate precision.'
                },
                {
                    step: 4,
                    title: 'Preventive Check',
                    description: 'Optional preventive maintenance',
                    action: 'Consider running duplicate QC to verify. Check reagent/calibrator expiry dates proactively.'
                },
                {
                    step: 5,
                    title: 'Continue Monitoring',
                    description: 'No immediate action required',
                    action: 'Resume normal testing. Flag for review in weekly QC meeting if pattern continues.'
                }
            ]
        };

        return workflows[rule] || [];
    };

    const handleInvestigate = (deviation: Deviation) => {
        setSelectedDeviation(deviation);
        setShowInvestigation(true);
    };

    const closeInvestigation = () => {
        setShowInvestigation(false);
        setSelectedDeviation(null);
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Deviation Management</h3>
                <p className="text-sm text-gray-500 mt-1">Track and resolve QC violations with guided workflows</p>
            </div>
            <div className="p-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rule</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {deviations.map((dev) => (
                                <tr key={dev.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-900">{dev.equipmentName}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{dev.parameter}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-800">
                                            {dev.rule}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{dev.value}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {new Date(dev.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[dev.status]}`}>
                                            {dev.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <button
                                            onClick={() => handleInvestigate(dev)}
                                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                                        >
                                            Investigate
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {deviations.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No deviations to manage</p>
                    </div>
                )}
            </div>

            {/* Investigation Workflow Modal */}
            {showInvestigation && selectedDeviation && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-white">
                                        Investigation Workflow: {selectedDeviation.rule} Rule
                                    </h3>
                                    <p className="text-blue-100 text-sm mt-1">
                                        {selectedDeviation.equipmentName} • {selectedDeviation.parameter} • Value: {selectedDeviation.value}
                                    </p>
                                </div>
                                <button
                                    onClick={closeInvestigation}
                                    className="text-white hover:text-gray-200 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="space-y-6">
                                {getInvestigationWorkflow(selectedDeviation.rule).map((step, index) => (
                                    <div key={index} className="relative">
                                        {/* Connector Line */}
                                        {index < getInvestigationWorkflow(selectedDeviation.rule).length - 1 && (
                                            <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-blue-200" />
                                        )}

                                        <div className="flex gap-4">
                                            {/* Step Number */}
                                            <div className="flex-shrink-0">
                                                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg relative z-10">
                                                    {step.step}
                                                </div>
                                            </div>

                                            {/* Step Content */}
                                            <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                <h4 className="font-semibold text-gray-900 text-lg mb-2">{step.title}</h4>
                                                <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                                                <div className="bg-white border-l-4 border-blue-600 p-3 rounded">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        <span className="text-blue-600 font-semibold">Action: </span>
                                                        {step.action}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Additional Notes */}
                            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <div className="ml-3">
                                        <h4 className="text-sm font-semibold text-amber-900">ISO 15189:2022 Compliance</h4>
                                        <p className="text-sm text-amber-800 mt-1">
                                            All investigations must be documented per ISO 15189 clause 7.10. Record findings, actions taken, and verification of effectiveness.
                                            Link to CAPA system if root cause requires process improvement.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={closeInvestigation}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Close
                            </button>
                            <button
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                                Mark as Investigating
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
