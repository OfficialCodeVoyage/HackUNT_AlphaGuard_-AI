import React from "react";

interface EnhancedSpinnerProps {
    size?: number;
    color?: string;
    backgroundColor?: string;
}

export default function EnhancedSpinner({
    size = 50,
    color = "hsl(var(--primary))",
    backgroundColor = "hsl(var(--muted))",
}: EnhancedSpinnerProps) {
    return (
        <div
            className="relative flex items-center justify-center"
            aria-label="Loading"
            role="status"
        >
            <svg
                className="animate-spin"
                width={size}
                height={size}
                viewBox="0 0 50 50"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    className="animate-pulse"
                    cx="25"
                    cy="25"
                    r="20"
                    stroke={backgroundColor}
                    strokeWidth="5"
                    fill="none"
                />
                <circle
                    cx="25"
                    cy="25"
                    r="20"
                    stroke={color}
                    strokeWidth="5"
                    strokeDasharray="31.4 31.4"
                    strokeLinecap="round"
                    fill="none"
                    transform="rotate(-90 25 25)"
                >
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 25 25"
                        to="360 25 25"
                        dur="1s"
                        repeatCount="indefinite"
                    />
                </circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <div
                    className={`w-[${size * 0.4}px] h-[${
                        size * 0.4
                    }px] bg-primary rounded-full animate-ping`}
                />
            </div>
        </div>
    );
}
