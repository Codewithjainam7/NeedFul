'use client'

import { ReactNode } from 'react'

interface SectionHeadingProps {
    children: ReactNode
    subtitle?: string
    className?: string
    align?: 'left' | 'center'
}

export function SectionHeading({
    children,
    subtitle,
    className = '',
    align = 'left'
}: SectionHeadingProps) {
    return (
        <div className={`mb-6 ${align === 'center' ? 'text-center' : ''} ${className}`}>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 relative inline-block">
                {children}
                {/* Orange underline - bold and visible */}
                <svg
                    className="absolute w-full h-2 -bottom-1 left-0 text-[#FF5200]/80"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                >
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="6" fill="none" />
                </svg>
            </h2>
            {subtitle && (
                <p className="text-gray-500 mt-2">{subtitle}</p>
            )}
        </div>
    )
}
