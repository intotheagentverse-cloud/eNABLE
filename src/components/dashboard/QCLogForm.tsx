'use client'

import { logQCResult, setControlLimits } from '@/app/actions/qc';
import { useRef, useState } from 'react';

export default function QCLogForm({ equipmentId, labId }: { equipmentId: string, labId: string }) {
    const formRef = useRef<HTMLFormElement>(null);
    const [mode, setMode] = useState<'LOG' | 'SETUP'>('LOG');

    async function handleLog(formData: FormData) {
        const result = await logQCResult(formData);
        if (result.success) {
            alert(result.message);
            formRef.current?.reset();
        } else {
            alert('Error: ' + result.message);
        }
    }

    async function handleSetup(formData: FormData) {
        const result = await setControlLimits(formData);
        if (result.success) {
            alert(result.message);
            setMode('LOG');
        } else {
            alert('Error: ' + result.message);
        }
    }

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                    {mode === 'LOG' ? 'Log Daily QC' : 'Setup Control Limits'}
                </h3>
                <button
                    onClick={() => setMode(mode === 'LOG' ? 'SETUP' : 'LOG')}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                    {mode === 'LOG' ? 'Switch to Setup Mode' : 'Back to Logging'}
                </button>
            </div>

            {mode === 'LOG' ? (
                <form ref={formRef} action={handleLog} className="space-y-4">
                    <input type="hidden" name="equipment_id" value={equipmentId} />
                    <input type="hidden" name="lab_id" value={labId} />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input type="date" name="test_date" required defaultValue={new Date().toISOString().split('T')[0]} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Parameter</label>
                            <select name="parameter_name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                                <option value="Glucose">Glucose</option>
                                <option value="Hemoglobin">Hemoglobin</option>
                                <option value="TSH">TSH</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Control Level</label>
                            <select name="control_level" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                                <option value="L1">Level 1 (Low)</option>
                                <option value="L2">Level 2 (Normal)</option>
                                <option value="L3">Level 3 (High)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Result</label>
                            <input type="number" step="0.01" name="result_obtained" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Log Result
                    </button>
                </form>
            ) : (
                <form action={handleSetup} className="space-y-4">
                    <input type="hidden" name="equipment_id" value={equipmentId} />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Parameter</label>
                            <select name="parameter_name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                                <option value="Glucose">Glucose</option>
                                <option value="Hemoglobin">Hemoglobin</option>
                                <option value="TSH">TSH</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Control Level</label>
                            <select name="control_level" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                                <option value="L1">Level 1 (Low)</option>
                                <option value="L2">Level 2 (Normal)</option>
                                <option value="L3">Level 3 (High)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mean</label>
                            <input type="number" step="0.01" name="mean_value" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">SD</label>
                            <input type="number" step="0.01" name="sd_value" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                        Save Limits
                    </button>
                </form>
            )}
        </div>
    );
}
