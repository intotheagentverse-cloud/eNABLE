import Link from 'next/link';
import { TopNav } from '@/components/layout/TopNav';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function Home() {
    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col">
            <TopNav />

            <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
                <div className="max-w-5xl w-full text-center space-y-12 py-12">
                    <div className="space-y-6">
                        <h1 className="text-5xl md:text-6xl font-bold text-[var(--color-brand-purple)] tracking-tight">
                            ComplianceOS
                        </h1>
                        <p className="text-xl text-[var(--foreground-muted)] max-w-3xl mx-auto leading-relaxed">
                            The all-in-one NABL compliance automation platform for diagnostic labs.
                            Automate calibration, QC, and audits with precision and ease.
                        </p>
                        <div className="flex items-center justify-center gap-x-6 pt-4">
                            <Link href="/dashboard">
                                <Button variant="primary" size="lg">
                                    Go to Dashboard
                                </Button>
                            </Link>
                            <Link href="#">
                                <Button variant="ghost" size="lg">
                                    Learn more <span aria-hidden="true" className="ml-2">→</span>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        <Card hoverable className="border-t-4 border-t-[var(--color-brand-purple)]">
                            <h3 className="text-xl font-bold text-[var(--color-brand-purple)] mb-3">Calibration</h3>
                            <p className="text-[var(--foreground-muted)]">
                                Track equipment calibration schedules and SI traceability automatically. Never miss a due date again.
                            </p>
                        </Card>
                        <Card hoverable className="border-t-4 border-t-[var(--color-brand-green)]">
                            <h3 className="text-xl font-bold text-[var(--color-brand-green)] mb-3">QC Automation</h3>
                            <p className="text-[var(--foreground-muted)]">
                                Real-time Levy-Jennings charts and Westgard rule violation alerts. Ensure data integrity effortlessly.
                            </p>
                        </Card>
                        <Card hoverable className="border-t-4 border-t-[var(--color-accent-blue)]">
                            <h3 className="text-xl font-bold text-[var(--color-accent-blue)] mb-3">Audit Ready</h3>
                            <p className="text-[var(--foreground-muted)]">
                                Generate ISO 15189 compliant reports with a single click. Be ready for audits at any moment.
                            </p>
                        </Card>
                    </div>
                </div>
            </main>

            <footer className="bg-[var(--background-secondary)] border-t border-[var(--color-border)] py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[var(--foreground-muted)]">
                    <p>&copy; 2025 eNABLE Quality MS. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
