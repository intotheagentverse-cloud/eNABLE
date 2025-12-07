"use client";

import { useState, useEffect } from 'react';
import { parseQCFile, processQCImport, QCResult, ValidationError } from '@/app/actions/qc-import';
import { Equipment } from '@/types/database';

interface ImportDataViewProps {
    equipment: Equipment[];
}

export default function ImportDataView({ equipment }: ImportDataViewProps) {
    const [selectedEquipment, setSelectedEquipment] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<QCResult[] | null>(null);
    const [errors, setErrors] = useState<ValidationError[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [importResult, setImportResult] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.name.endsWith('.csv')) {
                setFile(droppedFile);
                setPreviewData(null);
                setErrors(null);
                setImportResult(null);
            } else {
                alert('Please upload a CSV file');
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setPreviewData(null);
            setErrors(null);
            setImportResult(null);
        }
    };

    const handleUploadAndPreview = async () => {
        if (!file || !selectedEquipment) {
            alert('Please select equipment and a file');
            return;
        }

        setIsLoading(true);
        setPreviewData(null);
        setErrors(null);
        setImportResult(null);

        const formData = new FormData();
        formData.append('file', file);

        // Get equipment details
        const eq = equipment.find(e => e.id === selectedEquipment);
        const analyzerType = eq ? `${eq.manufacturer} ${eq.model}` : 'Generic';

        const result = await parseQCFile(formData, analyzerType);

        setIsLoading(false);

        if (result.status === 'error') {
            setErrors(result.errors || []);
            alert(result.message);
        } else {
            setPreviewData(result.data || []);
        }
    };

    const handleImport = async () => {
        if (!previewData || !file) return;

        setIsLoading(true);
        const eq = equipment.find(e => e.id === selectedEquipment);
        const labId = eq?.lab_id || '';
        const result = await processQCImport(previewData, file.name, selectedEquipment, labId);
        setIsLoading(false);

        if (result.status === 'success') {
            setImportResult(`✓ Successfully imported ${result.imported_count} QC records${result.duplicate_count ? ` (${result.duplicate_count} duplicates skipped)` : ''}`);
            setPreviewData(null);
            setFile(null);
            setSelectedEquipment('');
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="space-y-6">
            {/* Equipment Selection */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Step 1: Select Equipment</h3>
                <div className="max-w-md">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Equipment</label>
                    <select
                        value={selectedEquipment}
                        onChange={(e) => setSelectedEquipment(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">-- Select Equipment --</option>
                        {equipment.map((eq) => (
                            <option key={eq.id} value={eq.id}>
                                {eq.equipment_name} ({eq.manufacturer} {eq.model})
                            </option>
                        ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                        Select the equipment this QC data is from
                    </p>
                </div>
            </div>

            {/* File Upload */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Step 2: Upload QC Data CSV</h3>
                <p className="text-sm text-gray-500 mb-6">
                    Upload CSV files exported from your analyzers. Example: <code>abbott_i2000_qc_20231122.csv</code>
                </p>

                <div
                    className={`border-2 border-dashed rounded-lg p-12 text-center ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <div className="flex flex-col items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <label className="cursor-pointer">
                            <span className="font-medium text-blue-600 hover:text-blue-500">Click to upload</span>
                            <span className="text-gray-600"> or drag and drop</span>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                        <p className="text-xs text-gray-500 mt-2">CSV files only (max 10MB)</p>
                    </div>
                </div>

                {file && (
                    <div className="mt-4">
                        <p className="text-sm text-gray-600">Selected: {file.name}</p>
                        <button
                            onClick={handleUploadAndPreview}
                            disabled={!selectedEquipment || isLoading}
                            className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Processing...' : 'Upload & Preview'}
                        </button>
                    </div>
                )}
            </div>

            {/* Errors Display */}
            {errors && errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-red-900 mb-4">❌ Validation Errors</h3>
                    <ul className="space-y-2">
                        {errors.map((err, idx) => (
                            <li key={idx} className="text-sm text-red-700">
                                Row {err.row}, Field "{err.field}": {err.error}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Preview Data */}
            {previewData && previewData.length > 0 && (
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Step 3: Preview Data (First 10 rows)
                    </h3>
                    <div className="overflow-x-auto mb-6">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Control</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Test</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Result</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {previewData.slice(0, 10).map((row, idx) => (
                                    <tr key={idx}>
                                        <td className="px-4 py-2 text-sm text-gray-900">{row.control_name}</td>
                                        <td className="px-4 py-2 text-sm text-gray-900">{row.test_name}</td>
                                        <td className="px-4 py-2 text-sm text-gray-900">{row.result_value}</td>
                                        <td className="px-4 py-2 text-sm text-gray-500">{row.unit}</td>
                                        <td className="px-4 py-2">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${row.qc_status === 'Pass'
                                                    ? 'bg-green-100 text-green-800'
                                                    : row.qc_status === 'Warning'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {row.qc_status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-500">{row.measurement_date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mb-6">
                        <p className="text-sm text-green-700">
                            ✓ Found {previewData.length} valid QC record(s)
                        </p>
                    </div>

                    <button
                        onClick={handleImport}
                        disabled={isLoading}
                        className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Importing...' : '✓ Import Data'}
                    </button>
                </div>
            )}

            {/* Success Message */}
            {importResult && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <p className="text-green-800 font-medium">{importResult}</p>
                </div>
            )}
        </div>
    );
}
