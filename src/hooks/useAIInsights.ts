"use client";

import { useState, useEffect } from 'react';
import { useRAG } from '@/contexts/RAGContext';

interface AIInsight {
    type: 'risk' | 'recommendation' | 'compliance' | 'info';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    source?: string;
}

export function useAIInsights(context: string, data?: any) {
    const { askRAG } = useRAG();
    const [insights, setInsights] = useState<AIInsight[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchInsights = async () => {
            setIsLoading(true);
            try {
                // Generate context-specific questions
                const questions = generateQuestions(context, data);

                // Query RAG for each question
                const insightPromises = questions.map(async (q) => {
                    try {
                        const response = await askRAG(q.query, context);
                        return {
                            type: q.type,
                            title: q.title,
                            description: response.answer.substring(0, 200) + '...',
                            priority: q.priority,
                            source: response.sources[0],
                        } as AIInsight;
                    } catch (err) {
                        return null;
                    }
                });

                const results = await Promise.all(insightPromises);
                setInsights(results.filter((r): r is AIInsight => r !== null));
            } catch (err) {
                console.error('Failed to fetch AI insights:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInsights();
    }, [context, data, askRAG]);

    return { insights, isLoading };
}

function generateQuestions(context: string, data?: any) {
    const baseQuestions = {
        qc: [
            {
                query: 'What are the most common causes of Westgard rule violations?',
                type: 'risk' as const,
                title: 'QC Risk Factors',
                priority: 'high' as const,
            },
            {
                query: 'What are NABL requirements for handling QC failures?',
                type: 'compliance' as const,
                title: 'Compliance Requirements',
                priority: 'medium' as const,
            },
        ],
        equipment: [
            {
                query: 'What are signs of equipment calibration drift?',
                type: 'risk' as const,
                title: 'Calibration Monitoring',
                priority: 'high' as const,
            },
            {
                query: 'What are NABL equipment maintenance requirements?',
                type: 'compliance' as const,
                title: 'Maintenance Standards',
                priority: 'medium' as const,
            },
        ],
        calibration: [
            {
                query: 'How often should medical lab equipment be calibrated?',
                type: 'compliance' as const,
                title: 'Calibration Frequency',
                priority: 'high' as const,
            },
        ],
        reagents: [
            {
                query: 'What are best practices for reagent lot validation?',
                type: 'recommendation' as const,
                title: 'Lot Validation',
                priority: 'medium' as const,
            },
        ],
    };

    return baseQuestions[context as keyof typeof baseQuestions] || [];
}
