'use client'

import { useState } from 'react';
import { QCDeviation } from '@/types/database';

interface DeviationModalProps {
    deviation: QCDeviation;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

export default function DeviationModal({ deviation, isOpen, onClose, onUpdate }: DeviationModalProps) {
    const [rootCause, setRootCause] = useState(deviation.root_cause || '');
    const [action, setAction] = useState(deviation.corrective_action || '');
    const [status, setStatus] = useState(deviation.status);
    const [saving, setSaving] = useState(false);

    if (!isOpen) return null;

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/qc/deviations/${deviation.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    root_cause: rootCause,
                    corrective_action: action,
                    status: status,
                    investigated_by: 'current-user-id' // Replace with actual user ID
                })
            });

            if (res.ok) {
                onUpdate();
                onClose();
            }
        } catch (error) {
            console.error('Failed to update deviation', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-medium mb-4">Investigate Deviation</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Root Cause</label>
                        <select
                            value={rootCause}
                            onChange={(e) => setRootCause(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                            <option value="">Select Root Cause...</option>
                            <option value="Random Error">Random Error</option>
                            <option value="Reagent Issue">Reagent Issue</option>
                            <option value="Calibration Issue">Calibration Issue</option>
                            <option value="Instrument Error">Instrument Error</option>
                            <option value="Operator Error">Operator Error</option>
                            <option value="Environmental">Environmental (Temp/Humidity)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Corrective Action</label>
                        <textarea
                            value={action}
                            onChange={(e) => setAction(e.target.value)}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="Describe action taken..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as any)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                            <option value="OPEN">Open</option>
                            <option value="INVESTIGATING">Investigating</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="CLOSED">Closed</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Investigation'}
                    </button>
                </div>
            </div>
        </div>
    );
}
