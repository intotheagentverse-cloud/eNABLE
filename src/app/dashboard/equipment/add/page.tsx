'use client'

import { addEquipment } from '@/app/actions/equipment';
import { TEST_LAB_ID } from '@/lib/constants';
import {
    EQUIPMENT_CATEGORIES,
    EQUIPMENT_TYPES,
    EQUIPMENT_BRANDS,
    LAB_TIERS,
    INTEGRATION_METHODS,
    DEFAULT_CALIBRATION_INTERVALS,
    EquipmentCategoryId
} from '@/lib/equipment-catalog';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AddEquipmentPage() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<EquipmentCategoryId>('hematology');
    const [selectedType, setSelectedType] = useState('');

    async function handleSubmit(formData: FormData) {
        formData.append('lab_id', TEST_LAB_ID);
        const result = await addEquipment(formData);
        if (result.success) {
            router.push('/dashboard/equipment');
        } else {
            alert(result.message);
        }
    }

    const types = EQUIPMENT_TYPES[selectedCategory] || [];
    const brands = EQUIPMENT_BRANDS[selectedCategory] || [];
    const defaultInterval = DEFAULT_CALIBRATION_INTERVALS[selectedCategory] || 365;

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
            <div className="mb-6">
                <h2 className="text-2xl font-bold">Add New Equipment</h2>
                <p className="text-sm text-gray-500 mt-1">Register new diagnostic laboratory equipment</p>
            </div>

            <form action={handleSubmit} className="space-y-6">
                {/* Equipment Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Equipment Category *</label>
                    <select
                        name="equipment_category"
                        value={selectedCategory}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value as EquipmentCategoryId);
                            setSelectedType('');
                        }}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    >
                        {EQUIPMENT_CATEGORIES.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.icon} {cat.name}
                            </option>
                        ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">Primary equipment classification</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {/* Equipment Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Equipment Type *</label>
                        <select
                            name="equipment_type"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        >
                            <option value="">Select type...</option>
                            {types.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* Equipment Brand */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Brand/Manufacturer *</label>
                        <select
                            name="equipment_brand"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        >
                            <option value="">Select brand...</option>
                            {brands.map(brand => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </select>
                    </div>
                </div>

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
                    {/* Model */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Model</label>
                        <input
                            type="text"
                            name="model"
                            placeholder="e.g., XN-1000"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        />
                    </div>

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
                </div>

                {/* Integration Method - Enhanced */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        🔌 Integration Method
                    </label>
                    <select
                        name="integration_method"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3 text-base"
                    >
                        <option value="">Select integration method...</option>
                        <option value="Serial (RS-232)">🔌 Serial (RS-232) - Traditional analyzer connection via COM port</option>
                        <option value="Network (TCP/IP)">🌐 Network (TCP/IP) - Modern LAN/Ethernet connection (Recommended)</option>
                        <option value="USB">💾 USB - Direct USB connection to analyzer</option>
                        <option value="File Export (CSV/XML)">📁 File Export (CSV/XML) - Import data files from analyzer</option>
                        <option value="API/Middleware">⚡ API/Middleware - Advanced integration via middleware software</option>
                        <option value="Manual Entry">✍️ Manual Entry - No integration, enter results manually</option>
                    </select>
                    <p className="mt-2 text-xs text-gray-600">
                        💡 <strong>Tip:</strong> Network (TCP/IP) integration is recommended for modern analyzers. It provides real-time data transfer and is easier to configure than serial connections.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
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

                {/* Hidden fields */}
                <input type="hidden" name="status" value="ACTIVE" />
                <input type="hidden" name="integration_status" value="Pending Setup" />

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
