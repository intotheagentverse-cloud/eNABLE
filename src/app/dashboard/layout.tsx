import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[var(--background-secondary)] flex">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <DashboardHeader />
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
