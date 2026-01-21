'use client'

import { motion } from 'framer-motion'

export function AdminBackground() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Main gradient base */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFF9F5] via-[#FFFBF7] to-[#F8F4F0]" />

            {/* Floating orbs with blur */}
            <motion.div
                className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-orange-200/30 to-orange-100/20 blur-3xl"
                animate={{
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{ top: '-10%', right: '-10%' }}
            />

            <motion.div
                className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-br from-blue-200/20 to-purple-100/15 blur-3xl"
                animate={{
                    x: [0, -30, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.15, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{ bottom: '10%', left: '-5%' }}
            />

            <motion.div
                className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-br from-amber-200/25 to-yellow-100/15 blur-3xl"
                animate={{
                    x: [0, 40, 0],
                    y: [0, -20, 0],
                    scale: [1, 1.05, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{ top: '40%', right: '20%' }}
            />

            <motion.div
                className="absolute w-[350px] h-[350px] rounded-full bg-gradient-to-br from-rose-200/20 to-pink-100/10 blur-3xl"
                animate={{
                    x: [0, -20, 0],
                    y: [0, -40, 0],
                    scale: [1, 1.08, 1],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{ bottom: '30%', right: '40%' }}
            />

            {/* Subtle grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                }}
            />
        </div>
    )
}
