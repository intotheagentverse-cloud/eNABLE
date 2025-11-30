"use client";

import { useState } from "react";
import Link from "next/link";
import iqcpData from "@/data/learning/iqcp-module.json";
import cdcData from "@/data/learning/cdc-qms-module.json";
import westgardData from "@/data/learning/westgard-module.json";

export default async function ModuleDetailPage({
    params,
}: {
    params: Promise<{ moduleId: string }>;
}) {
    const { moduleId } = await params;

    // Load module data (this will be dynamic based on moduleId)
    let moduleData: any = null;
    if (moduleId === "iqcp") {
        moduleData = iqcpData;
    } else if (moduleId === "cdc-qms") {
        moduleData = cdcData;
    } else if (moduleId === "westgard") {
        moduleData = westgardData;
    }

    if (!moduleData) {
        return (
            <div className="p-6">
                <p className="text-gray-600">Module not found</p>
                <Link href="/dashboard/learning" className="text-blue-600 hover:text-blue-800">
                    ← Back to Learning Center
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link
                    href="/dashboard/learning"
                    className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block"
                >
                    ← Back to Learning Center
                </Link>
                <div className="flex items-start gap-4">
                    <span className="text-6xl">{moduleData.icon}</span>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{moduleData.title}</h1>
                        <p className="text-gray-600 mb-4">{moduleData.description}</p>
                        <div className="flex gap-4 text-sm text-gray-600">
                            <span>⏱️ {moduleData.estimatedTime}</span>
                            <span>📚 {moduleData.lessons?.length || moduleData.articles?.length || moduleData.essentials?.length} lessons</span>
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                                {moduleData.difficulty}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* IQCP Specific CTA */}
            {moduleId === 'iqcp' && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 mb-2">Need help building your IQCP?</h2>
                            <p className="text-gray-700">
                                Our experts can guide you through the Risk Assessment, Quality Control Plan, and Quality Assessment steps to ensure full compliance.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 min-w-max">
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium shadow-sm">
                                Build your IQCP
                            </button>
                            <button className="bg-white text-blue-600 border border-blue-600 px-6 py-2 rounded-md hover:bg-blue-50 font-medium">
                                Book an appointment now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CDC QMS Specific CTA */}
            {moduleId === 'cdc-qms' && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 mb-2">Implement a World-Class QMS</h2>
                            <p className="text-gray-700">
                                Struggling to implement all 12 essentials? Our consultants can help you gap-assess and build a robust Quality Management System.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 min-w-max">
                            <button className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 font-medium shadow-sm">
                                Start QMS Audit
                            </button>
                            <button className="bg-white text-purple-600 border border-purple-600 px-6 py-2 rounded-md hover:bg-purple-50 font-medium">
                                Book Consultation
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Lessons/Articles List */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Content</h2>
                    <div className="space-y-3">
                        {(moduleData.lessons || moduleData.articles || moduleData.essentials || []).map(
                            (item: any, idx: number) => (
                                <ModuleLessonCard key={item.id || idx} lesson={item} index={idx} />
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Reference */}
            {moduleData.quickReference && (
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <h3 className="font-semibold text-gray-900 mb-3">📋 Quick Reference</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {Object.entries(moduleData.quickReference).map(([key, value]: [string, any]) => (
                            <div key={key}>
                                <p className="font-medium text-gray-700 mb-1 capitalize">
                                    {key.replace(/([A-Z])/g, " $1").trim()}:
                                </p>
                                {Array.isArray(value) ? (
                                    <ul className="space-y-1 text-gray-600">
                                        {value.map((item, idx) => (
                                            <li key={idx}>• {item}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-600">{value}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function ModuleLessonCard({ lesson, index }: { lesson: any; index: number }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                        {index + 1}
                    </span>
                    <div className="text-left">
                        <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                        {lesson.order && (
                            <p className="text-xs text-gray-500">Lesson {lesson.order}</p>
                        )}
                    </div>
                </div>
                <span className="text-gray-400">{isExpanded ? "▼" : "▶"}</span>
            </button>

            {isExpanded && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                    {lesson.content?.overview && (
                        <div className="mb-4">
                            <h5 className="font-semibold text-gray-900 mb-2">Overview</h5>
                            <p className="text-sm text-gray-700 leading-relaxed">{lesson.content.overview}</p>
                        </div>
                    )}

                    {lesson.content?.keyPoints && (
                        <div className="mb-4">
                            <h5 className="font-semibold text-gray-900 mb-2">Key Points</h5>
                            <ul className="space-y-1 text-sm text-gray-700">
                                {lesson.content.keyPoints.map((point: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="text-blue-600">•</span>
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {lesson.examples && lesson.examples.length > 0 && (
                        <div className="mb-4">
                            <h5 className="font-semibold text-gray-900 mb-2">💡 Examples</h5>
                            {lesson.examples.map((example: any, idx: number) => (
                                <div key={idx} className="bg-white p-3 rounded border border-gray-200 mb-2">
                                    <p className="text-sm font-medium text-gray-900 mb-1">{example.scenario}</p>
                                    <p className="text-sm text-gray-600">{example.description}</p>
                                    {example.outcome && (
                                        <p className="text-xs text-green-600 mt-2">✓ {example.outcome}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {lesson.content?.steps && (
                        <div className="mb-4">
                            <h5 className="font-semibold text-gray-900 mb-3">Steps</h5>
                            {lesson.content.steps.map((step: any, idx: number) => (
                                <div key={idx} className="mb-3 bg-white p-3 rounded border-l-4 border-blue-500">
                                    <p className="font-medium text-gray-900 text-sm mb-1">
                                        {step.number}. {step.title}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                                    {step.activities && (
                                        <ul className="text-xs text-gray-600 space-y-1">
                                            {step.activities.map((activity: string, i: number) => (
                                                <li key={i}>→ {activity}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {lesson.keyRequirements && (
                        <div className="mb-4">
                            <h5 className="font-semibold text-gray-900 mb-2">Requirements</h5>
                            <ul className="space-y-1 text-sm text-gray-700">
                                {lesson.keyRequirements.map((req: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="text-green-600">✓</span>
                                        <span>{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {lesson.selfAssessment && (
                        <div className="mt-4 p-4 bg-yellow-50 rounded border border-yellow-200">
                            <p className="font-semibold text-gray-900 text-sm mb-2">🤔 Self-Assessment</p>
                            <ul className="space-y-1 text-sm text-gray-700">
                                {lesson.selfAssessment.map((question: string, idx: number) => (
                                    <li key={idx}>• {question}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {lesson.assistance && (
                        <div className="mt-4 p-4 bg-purple-50 rounded border border-purple-200">
                            <p className="font-semibold text-purple-900 text-sm mb-2">🤝 {lesson.assistance.title}</p>
                            <p className="text-sm text-purple-800 mb-2">{lesson.assistance.description}</p>
                            {lesson.assistance.features && (
                                <ul className="space-y-1 text-sm text-purple-800">
                                    {lesson.assistance.features.map((feature: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <span className="text-purple-600">★</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
