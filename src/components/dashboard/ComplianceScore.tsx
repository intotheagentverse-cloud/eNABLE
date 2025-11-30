'use client'

interface ComplianceScoreProps {
    score?: number;
}

export default function ComplianceScore({ score = 85 }: ComplianceScoreProps) {
    // Determine color based on score
    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    const getScoreIcon = (score: number) => {
        if (score >= 90) return '✅';
        if (score >= 70) return '⚠️';
        return '❌';
    };

    return (
        <div className={`inline-flex items-center px-4 py-2 rounded-md border-2 ${getScoreColor(score)}`}>
            <span className="text-2xl mr-2">{getScoreIcon(score)}</span>
            <div>
                <div className="text-xs font-medium uppercase tracking-wide opacity-75">Compliance Score</div>
                <div className="text-2xl font-bold">{score}%</div>
            </div>
        </div>
    );
}
