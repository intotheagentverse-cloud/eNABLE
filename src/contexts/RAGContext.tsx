"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface RAGContextType {
    askRAG: (query: string, context?: string) => Promise<RAGResponse>;
    isLoading: boolean;
    error: string | null;
}

interface RAGResponse {
    answer: string;
    reasoning?: string | null;
    sources: string[];
}

const RAGContext = createContext<RAGContextType | undefined>(undefined);

export function RAGProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const askRAG = async (query: string, context?: string): Promise<RAGResponse> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/rag', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, context }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get RAG response');
            }

            const data = await response.json();
            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <RAGContext.Provider value={{ askRAG, isLoading, error }}>
            {children}
        </RAGContext.Provider>
    );
}

export function useRAG() {
    const context = useContext(RAGContext);
    if (context === undefined) {
        throw new Error('useRAG must be used within a RAGProvider');
    }
    return context;
}
