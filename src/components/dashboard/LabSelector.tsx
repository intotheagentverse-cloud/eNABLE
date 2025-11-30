'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

type Lab = {
    id: string;
    name: string;
    code: string;
    is_primary: boolean;
};

export default function LabSelector({ labs }: { labs: Lab[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentLabId = searchParams.get('labId') || 'all'; // Default to 'all' if not specified

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLabId = e.target.value;
        const params = new URLSearchParams(searchParams);

        if (selectedLabId === 'all') {
            params.delete('labId'); // Remove param for 'all' view (or set to 'all' explicitly if preferred)
            // Let's keep it explicit for clarity in this implementation, or remove to default. 
            // Implementation plan said "Read labId from search params". 
            // Let's set it to 'all' explicitly in URL for clarity, or remove it. 
            // Removing it is cleaner URL.
            params.delete('labId');
        } else {
            params.set('labId', selectedLabId);
        }

        router.push(`/dashboard?${params.toString()}`);
    };

    return (
        <div className="flex items-center space-x-2">
            <label htmlFor="lab-select" className="text-sm font-medium text-gray-700">
                Select Lab:
            </label>
            <select
                id="lab-select"
                value={currentLabId}
                onChange={handleChange}
                className="block w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
                <option value="all">All Labs (Aggregate View)</option>
                <optgroup label="My Labs">
                    {labs.map((lab) => (
                        <option key={lab.id} value={lab.id}>
                            {lab.name} ({lab.code})
                        </option>
                    ))}
                </optgroup>
            </select>
        </div>
    );
}
