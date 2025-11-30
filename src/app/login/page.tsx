'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client outside component
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                console.error('Sign in error:', signInError);
                setError(signInError.message);
                setLoading(false);
                return;
            }

            if (data.user) {
                // Force a full page reload to ensure session is set
                window.location.href = '/dashboard';
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'An unexpected error occurred');
            setLoading(false);
        }
    }

    async function handleQuickLogin() {
        setError('');
        setLoading(true);

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email: 'maxine.mustermann@gmail.com',
                password: 'password123',
            });

            if (signInError) {
                console.error('Quick login error:', signInError);
                setError(signInError.message);
                setLoading(false);
                return;
            }

            if (data.user) {
                console.log('Login successful, redirecting...');
                // Force a full page reload
                window.location.href = '/dashboard';
            }
        } catch (err: any) {
            console.error('Quick login error:', err);
            setError(err.message || 'An unexpected error occurred');
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[var(--background-secondary)] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[var(--color-brand-purple)] mb-2">
                        eNABLE Quality
                    </h1>
                    <p className="text-[var(--foreground-muted)]">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-purple)] focus:border-transparent disabled:opacity-50"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-purple)] focus:border-transparent disabled:opacity-50"
                            placeholder="••••••••"
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-[var(--foreground-muted)]">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-[var(--color-brand-purple)] hover:underline font-medium">
                            Sign up
                        </Link>
                    </p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-xs text-center text-[var(--foreground-muted)] mb-3">
                        🚀 Quick Login:
                    </p>
                    <button
                        type="button"
                        onClick={handleQuickLogin}
                        disabled={loading}
                        className="w-full px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition disabled:opacity-50 font-medium"
                    >
                        {loading ? 'Logging in...' : '🏢 Magnum Life Sciences (Tier 2)'}
                    </button>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        maxine.mustermann@gmail.com
                    </p>
                </div>
            </div>
        </div>
    );
}
