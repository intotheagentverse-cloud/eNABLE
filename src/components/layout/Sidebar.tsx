"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const modules = [
    {
        name: "Overview", href: "/dashboard", icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
        )
    },
    {
        name: "Equipment", href: "/dashboard/equipment", icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
        )
    },

    {
        name: "Quality Control", href: "/dashboard/qc", icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
        )
    },
    {
        name: "CAPA", href: "/dashboard/capa", icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
        )
    },
    {
        name: "NABL Assistant", href: "/dashboard/assistant", icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        )
    },
    {
        name: "Learning & Knowledge", href: "/dashboard/learning", icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        )
    },
];

export const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    return (
        <aside
            className={`bg-white border-r border-[var(--color-border)] transition-all duration-300 flex flex-col ${isCollapsed ? "w-16" : "w-64"
                }`}
        >
            <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between h-16">
                {!isCollapsed && (
                    <span className="text-xl font-bold text-[var(--color-brand-purple)] truncate">
                        eNABLE Quality
                    </span>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1 rounded hover:bg-[var(--background-secondary)] text-[var(--foreground-muted)]"
                >
                    {isCollapsed ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                    )}
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-2">
                    {modules.map((module) => {
                        const isActive = pathname === module.href;
                        return (
                            <li key={module.name}>
                                <Link
                                    href={module.href}
                                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${isActive
                                        ? "bg-[var(--color-brand-purple)] text-white"
                                        : "text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--color-brand-purple)]"
                                        }`}
                                    title={isCollapsed ? module.name : ""}
                                >
                                    <span className={`${isActive ? "text-white" : "text-current"}`}>
                                        {module.icon}
                                    </span>
                                    {!isCollapsed && (
                                        <span className="ml-3 font-medium">{module.name}</span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-[var(--color-border)]">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-brand-green)] flex items-center justify-center text-white font-bold">
                        U
                    </div>
                    {!isCollapsed && (
                        <div className="ml-3">
                            <p className="text-sm font-medium text-[var(--foreground)]">User Name</p>
                            <p className="text-xs text-[var(--foreground-muted)]">Lab Manager</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};
