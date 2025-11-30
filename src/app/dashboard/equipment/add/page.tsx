'use client'

import { addEquipment } from '@/app/actions/equipment';
import { TEST_LAB_ID } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const ANALYZER_DATA: Record<string, string[]> = {
    'Abbott': ['ARCHITECT ci4100', 'ARCHITECT ci8200', 'Alinity c', 'Alinity i'],
    'Roche': ['cobas c311', 'cobas c501', 'cobas e411', 'cobas e601', 'cobas pro'],
    'Beckman Coulter': ['DxC 700 AU', 'AU480', 'AU680', 'DxI 9000'],
    'Siemens': ['Atellica Solution', 'Dimension EXL', 'Advia Centaur'],
    'Sysmex': ['XN-1000', 'XN-2000', 'XN-L Series'],
    'Bio-Rad': ['D-10', 'Variant II Turbo']
};

export default function AddEquipmentPage() {
    const router = useRouter();
    const [manufacturer, setManufacturer] = useState('');
    const [model, setModel] = useState('');

    async function handleSubmit(formData: FormData) {
        formData.append('lab_id', TEST_LAB_ID);
        const result = await addEquipment(formData);
        if (result.success) {
            router.push('/dashboard/equipment');
        } else {
            alert(result.message);
        }
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
            <div className="mb-6">
                <h2 className="text-2xl font-bold">Add New Equipment</h2>
                <p className="text-sm text-gray-500 mt-1">Register new diagnostic laboratory equipment</p>
            </div>

            <form action={handleSubmit} className="space-y-6">
                {/* Equipment Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Equipment Name *</label>
                    <input
                        type="text"
                        name="equipment_name"
                        required
                        placeholder="e.g., Hematology Analyzer - Lab 1"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    />
                    <p className="mt-1 text-xs text-gray-500">Unique identifier for this equipment</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {/* Manufacturer/Brand */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Brand/Manufacturer *</label>
                        <select
                            name="manufacturer"
                            value={manufacturer}
                            onChange={(e) => {
                                setManufacturer(e.target.value);
                                setModel('');
                            }}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        >
                            <option value="">Select brand...</option>
                            {Object.keys(ANALYZER_DATA).map(brand => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </select>
                    </div>

                    {/* Model */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Model *</label>
                        <select
                            name="model"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            disabled={!manufacturer}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 disabled:bg-gray-100"
                        >
                            <option value="">Select model...</option>
                            {manufacturer && ANALYZER_DATA[manufacturer].map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {/* Serial Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Serial Number</label>
                        <input
                            type="text"
                            name="serial_number"
                            placeholder="e.g., SN123456789"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input
                            type="text"
                            name="location"
                            placeholder="e.g., Lab Room 2"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        />
                    </div>
                </div>

                {/* Hidden status field */}
                <input type="hidden" name="status" value="ACTIVE" />

                <div className="flex justify-end space-x-4 pt-4 border-t">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Save Equipment
                    </button>
                </div>
            </form>
        </div>
    );
}
