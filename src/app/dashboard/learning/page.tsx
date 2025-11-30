"use client";

import { useRouter } from "next/navigation";
import LearningModuleCard from "@/components/learning/LearningModuleCard";

export default function LearningCenterPage() {
    const router = useRouter();

    const modules = [
        {
            id: "iqcp",
            title: "Individualized Quality Control Plan (IQCP)",
            description: "Master the Individualized Quality Control Plan (IQCP) - a risk-management centered approach allowing labs to tailor QC based on unique environment, personnel, and test systems",
            icon: "📊",
            difficulty: "Intermediate",
            estimatedTime: "60 min",
            lessonCount: 4,
            progress: 0,
            details: [
                "Risk Assessment (RA): Identify pre-analytical, analytical, and post-analytical failures",
                "Quality Control Plan (QCP): Document practices, resources, and procedures",
                "Quality Assessment (QA): Monitor ongoing IQCP effectiveness",
                "Implementation: 4-phase roadmap from documentation to continuous improvement"
            ]
        },
        {
            id: "westgard",
            title: "Westgard Multi-Rules",
            description: "Evidence-based QC decision criteria to detect systematic and random errors. Master the multi-rule algorithm for maintaining first-pass accuracy while minimizing false rejections",
            icon: "📈",
            difficulty: "Advanced",
            estimatedTime: "75 min",
            lessonCount: 6,
            progress: 0,
            details: [
                "1₃ₛ Rule: Absolute limit at ±3σ (random error detection)",
                "2₂ₛ Rule: Two consecutive >2σ same side (systematic error)",
                "R₄ₛ Rule: Range between QC levels >4σ (random error/reagent issues)",
                "4₁ₛ & 10ₓ Rules: Trend detection for systematic drift",
                "Multi-rule decision trees and flowcharts",
                "Levey-Jennings charting and pattern recognition"
            ]
        },
        {
            id: "cdc-qms",
            title: "CDC QMS Essentials",
            description: "The 12 essential pillars of laboratory quality management as defined by CDC. Aligns with ISO 15189:2022 requirements for comprehensive lab quality systems",
            icon: "🏥",
            difficulty: "Comprehensive",
            estimatedTime: "90 min",
            lessonCount: 12,
            progress: 0,
            details: [
                "Organization, Personnel, Equipment, Purchasing & Inventory",
                "Process Control (Sample Management across all phases)",
                "QC & Assessment (Proficiency Testing, Internal Audits)",
                "Information Management, Occurrence Management",
                "Facilities & Safety, Customer Service",
                "Process Improvement (PDCA, Benchmarking, Quality Indicators)"
            ]
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Learning & Knowledge Center</h1>
                <p className="text-sm text-gray-600">
                    Master quality excellence best practices from Abbott IQCP, Westgard Statistical QC, and CDC Quality Management System frameworks
                </p>
            </div>

            {/* Learning Modules Grid */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Learning Modules</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((module) => (
                        <div
                            key={module.id}
                            onClick={() => router.push(`/dashboard/learning/${module.id}`)}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-purple-300 cursor-pointer transition-all"
                        >
                            <div className="flex items-start gap-3 mb-4">
                                <span className="text-4xl">{module.icon}</span>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 text-lg mb-1">{module.title}</h3>
                                    <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                        {module.difficulty}
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 mb-4">{module.description}</p>
                            {module.details && (
                                <ul className="text-xs text-gray-600 space-y-1 mb-4 pl-4">
                                    {module.details.map((detail, i) => (
                                        <li key={i} className="list-disc">{detail}</li>
                                    ))}
                                </ul>
                            )}
                            <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                                <span>📚 {module.lessonCount} lessons</span>
                                <span>⏱️ {module.estimatedTime}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
