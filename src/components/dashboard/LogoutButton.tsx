'use client'

import { signOut } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export default function LogoutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleLogout() {
        setLoading(true);
        const result = await signOut();

        if (result.success) {
            router.push('/login');
            router.refresh();
        } else {
            setLoading(false);
            alert('Failed to log out. Please try again.');
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={loading}
        >
            {loading ? 'Logging out...' : 'Logout'}
        </Button>
    );
}
