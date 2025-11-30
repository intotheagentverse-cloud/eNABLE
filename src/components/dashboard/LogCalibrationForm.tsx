'use client'

import { logCalibration } from '@/app/actions/calibration';
import { useRef } from 'react';

export default function LogCalibrationForm({ equipmentId, intervalDays }: { equipmentId: string, intervalDays: number }) {
    const formRef = useRef<HTMLFormElement>(null);

    async function handleSubmit(formData: FormData) {
        const result = await logCalibration(formData);
        if (result.success) {
            alert('Calibration logged successfully');
            formRef.current?.reset();
        } else {
            alert('Failed to log calibration: ' + result.message);
        }
    }

    return (
        <form ref={formRef} action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="hidden" name="equipment_id" value={equipmentId} />
            <input type="hidden" name="interval_days" value={intervalDays} />

            <div>
                <label className="block text-sm font-medium text-gray-700">Calibration Date</label>
                <input type="date" name="calibration_date" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Provider</label>
                <input type="text" name="calibration_provider" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Certificate Number</label>
                <input type="text" name="certificate_number" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Performed By</label>
                <input type="text" name="performed_by" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
            </div>

            <div className="md:col-span-2">
                <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Log Calibration
                </button>
            </div>
        </form>
    );
}
