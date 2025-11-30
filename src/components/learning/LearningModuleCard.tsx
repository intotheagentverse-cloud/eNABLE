"use client";

interface LearningModuleCardProps {
    id: string;
    title: string;
    description: string;
    icon: string;
    difficulty: string;
    estimatedTime: string;
    progress?: number;
    lessonCount?: number;
    onClick: () => void;
}

export default function LearningModuleCard({
    id,
    title,
    description,
    icon,
    difficulty,
    estimatedTime,
    progress = 0,
    lessonCount = 0,
    onClick,
}: LearningModuleCardProps) {
    const difficultyColors = {
        Beginner: "bg-green-100 text-green-700",
        Intermediate: "bg-yellow-100 text-yellow-700",
        Advanced: "bg-orange-100 text-orange-700",
        Comprehensive: "bg-purple-100 text-purple-700",
    };

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-200 overflow-hidden group"
        >
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <span className="text-5xl">{icon}</span>
                    <span
                        className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[difficulty as keyof typeof difficultyColors] ||
                            "bg-gray-100 text-gray-700"
                            }`}
                    >
                        {difficulty}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                        <span>📚</span>
                        <span>{lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>⏱️</span>
                        <span>{estimatedTime}</span>
                    </div>
                </div>

                {progress > 0 && (
                    <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium text-sm">
                    {progress > 0 ? "Continue Learning" : "Start Learning"}
                </button>
            </div>
        </div>
    );
}
