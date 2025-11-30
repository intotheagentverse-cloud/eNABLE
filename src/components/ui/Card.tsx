import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = "",
    hoverable = false,
}) => {
    return (
        <div
            className={`bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-[var(--color-border)] p-6 transition-all duration-300 ${hoverable ? "hover:shadow-lg hover:-translate-y-1 cursor-pointer" : ""
                } ${className}`}
        >
            {children}
        </div>
    );
};
