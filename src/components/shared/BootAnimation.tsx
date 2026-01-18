'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export function BootAnimation() {
    const [isBooting, setIsBooting] = useState(true)
    // Generate random particles only on client to prevent hydration mismatch
    const [particles, setParticles] = useState<Array<{ top: string, left: string }>>([])

    useEffect(() => {
        // Session check - enabled for production
        if (typeof window !== 'undefined' && sessionStorage.getItem('needful-booted-corporate-v4')) {
            setIsBooting(false)
            return
        }

        const timer = setTimeout(() => {
            setIsBooting(false)
            sessionStorage.setItem('needful-booted-corporate-v4', 'true')
        }, 2000) // Total duration

        return () => clearTimeout(timer)
    }, [])

    return (
        <AnimatePresence>
            {isBooting && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        scale: 1.05,
                        filter: "blur(10px)",
                        transition: { duration: 0.8, ease: "easeInOut" }
                    }}
                    className="fixed inset-0 z-[9999] bg-white flex items-center justify-center overflow-hidden"
                >
                    {/* Floating Particles */}
                    {particles.map((p, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-orange-400/30 rounded-full"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                                opacity: [0, 0.6, 0],
                                y: -40
                            }}
                            transition={{
                                duration: 2 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2
                            }}
                            style={{
                                top: p.top,
                                left: p.left
                            }}
                        />
                    ))}



                    <div className="relative flex flex-col items-center justify-center w-full max-w-[300px] mx-auto">
                        <div className="flex items-center justify-center gap-2 mb-8">
                            {/* 1. Icon Animation */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{
                                    scale: [0.8, 1.1, 1],
                                    opacity: 1
                                }}
                                transition={{
                                    duration: 0.5,
                                    times: [0, 0.6, 1],
                                    ease: "easeOut"
                                }}
                                className="relative z-10 w-20 h-20 flex-shrink-0"
                            >
                                <Image
                                    src="/assets/logo-icon.png"
                                    alt="NeedFul Icon"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </motion.div>

                            {/* 2. Text Reveal (Width Expansion) */}
                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: "auto", opacity: 1 }}
                                transition={{
                                    delay: 0.4,
                                    duration: 0.6,
                                    ease: "easeInOut"
                                }}
                                className="relative h-12 overflow-hidden flex items-center justify-start ml-2" // Reduced height slightly, added margin
                            >
                                <div className="relative w-40 h-full"> {/* Fixed width inner container for image */}
                                    <Image
                                        src="/assets/logo-text.png"
                                        alt="NeedFul Text"
                                        fill
                                        className="object-contain object-left" // Align left so it reveals from left
                                        priority
                                    />
                                    {/* Shimmer Overlay */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 z-20"
                                        initial={{ x: '-150%' }}
                                        animate={{ x: '150%' }}
                                        transition={{
                                            delay: 0.8,
                                            duration: 0.6,
                                            ease: "easeInOut"
                                        }}
                                    />
                                </div>
                            </motion.div>
                        </div>

                        {/* 3. Linear Progress Bar */}
                        <motion.div
                            className="h-1.5 bg-orange-100 rounded-full overflow-hidden w-64" // Centered by parent flex-col
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                        >
                            <motion.div
                                className="h-full bg-orange-500 rounded-full"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{
                                    duration: 1.8,
                                    ease: "linear"
                                }}
                            />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
