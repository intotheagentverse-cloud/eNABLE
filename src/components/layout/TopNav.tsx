"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const TopNav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: "Products", href: "#" },
        { name: "Solutions", href: "#" },
        { name: "Resources", href: "#" },
        { name: "Company", href: "#" },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-[var(--color-border)] shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-[var(--color-brand-purple)]">eNABLE</span>
                        </Link>
                        <div className="hidden md:ml-10 md:flex md:space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-[var(--foreground-muted)] hover:text-[var(--color-brand-purple)] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <Link href="/dashboard" className="text-[var(--foreground-muted)] hover:text-[var(--color-brand-purple)] text-sm font-medium">
                            Log In
                        </Link>
                        <Button variant="primary" size="md">
                            Book a Demo
                        </Button>
                    </div>
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-[var(--foreground-muted)] hover:text-[var(--color-brand-purple)] focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-[var(--color-border)]">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="block px-3 py-2 rounded-md text-base font-medium text-[var(--foreground-muted)] hover:text-[var(--color-brand-purple)] hover:bg-[var(--background-secondary)]"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/dashboard"
                            className="block px-3 py-2 rounded-md text-base font-medium text-[var(--foreground-muted)] hover:text-[var(--color-brand-purple)] hover:bg-[var(--background-secondary)]"
                        >
                            Log In
                        </Link>
                        <div className="px-3 py-2">
                            <Button variant="primary" className="w-full">
                                Book a Demo
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};
