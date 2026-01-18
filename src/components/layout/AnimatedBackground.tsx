'use client'

import { useEffect, useState } from 'react'

export function AnimatedBackground() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="fixed inset-0 min-h-screen w-full -z-50 overflow-hidden pointer-events-none bg-white">
            {/* Simple static gradient - no animations for performance */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,82,0,0.06),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,180,100,0.05),transparent_50%)]" />

            {/* Light grid overlay - static, no animation */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,82,0,0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,82,0,0.02) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Simple floating orbs - CSS only, minimal blur for performance */}
            <div
                className="absolute top-[10%] right-[15%] w-64 h-64 rounded-full bg-gradient-to-br from-orange-100/30 to-transparent blur-2xl"
                style={{ animation: 'float-slow 20s ease-in-out infinite' }}
            />
            <div
                className="absolute bottom-[20%] left-[10%] w-80 h-80 rounded-full bg-gradient-to-tr from-amber-100/20 to-transparent blur-2xl"
                style={{ animation: 'float-slow 25s ease-in-out infinite reverse' }}
            />
        </div>
    )
}
