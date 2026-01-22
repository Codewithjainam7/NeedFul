'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { GroupedStories, BusinessStory, useRecordStoryView } from '@/hooks/useBusinessStories'

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
}

interface StoryViewerProps {
    storyGroup: GroupedStories
    onClose: () => void
}

export function StoryViewer({ storyGroup, onClose }: StoryViewerProps) {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
    const [progress, setProgress] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [isMuted, setIsMuted] = useState(true)
    const videoRef = useRef<HTMLVideoElement>(null)
    const progressIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)
    const recordView = useRecordStoryView()

    const currentStory = storyGroup.stories[currentStoryIndex]
    const storyDuration = currentStory?.media_type === 'video' ? 15000 : 5000 // 15s for video, 5s for image

    // Record view when story is shown
    useEffect(() => {
        if (currentStory) {
            recordView.mutate({ storyId: currentStory.id })
        }
    }, [currentStory?.id])

    // Progress bar logic
    useEffect(() => {
        if (isPaused) return

        const increment = 100 / (storyDuration / 50)

        progressIntervalRef.current = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    goToNext()
                    return 0
                }
                return prev + increment
            })
        }, 50)

        return () => {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current)
            }
        }
    }, [currentStoryIndex, isPaused, storyDuration])

    // Video handling
    useEffect(() => {
        if (currentStory?.media_type === 'video' && videoRef.current) {
            videoRef.current.play()
        }
    }, [currentStoryIndex, currentStory])

    const goToNext = useCallback(() => {
        if (currentStoryIndex < storyGroup.stories.length - 1) {
            setCurrentStoryIndex((prev) => prev + 1)
            setProgress(0)
        } else {
            onClose()
        }
    }, [currentStoryIndex, storyGroup.stories.length, onClose])

    const goToPrev = useCallback(() => {
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex((prev) => prev - 1)
            setProgress(0)
        }
    }, [currentStoryIndex])

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    onClose()
                    break
                case 'ArrowRight':
                    goToNext()
                    break
                case 'ArrowLeft':
                    goToPrev()
                    break
                case ' ':
                    setIsPaused((prev) => !prev)
                    break
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [goToNext, goToPrev, onClose])

    // Touch/Click navigation
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, currentTarget } = e
        const { width } = currentTarget.getBoundingClientRect()
        const clickPosition = clientX / width

        if (clickPosition < 0.3) {
            goToPrev()
        } else if (clickPosition > 0.7) {
            goToNext()
        }
    }

    // Pause on visibility change
    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsPaused(document.hidden)
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
    }, [])

    if (!currentStory) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black"
                onClick={handleClick}
            >
                {/* Progress Bars */}
                <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2">
                    {storyGroup.stories.map((_, index) => (
                        <div
                            key={index}
                            className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
                        >
                            <motion.div
                                className="h-full bg-white rounded-full"
                                initial={{ width: '0%' }}
                                animate={{
                                    width:
                                        index < currentStoryIndex
                                            ? '100%'
                                            : index === currentStoryIndex
                                                ? `${progress}%`
                                                : '0%',
                                }}
                                transition={{ duration: 0.05, ease: 'linear' }}
                            />
                        </div>
                    ))}
                </div>

                {/* Header */}
                <div className="absolute top-4 left-0 right-0 z-20 px-4 pt-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {/* Business Logo */}
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg">
                                {storyGroup.provider_logo ? (
                                    <Image
                                        src={storyGroup.provider_logo}
                                        alt={storyGroup.provider_name}
                                        width={40}
                                        height={40}
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                                        <span className="text-sm font-bold text-[#FF5200]">
                                            {storyGroup.provider_name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Business Info */}
                            <div>
                                <p className="text-white font-semibold text-sm drop-shadow-lg">
                                    {storyGroup.provider_name}
                                </p>
                                <p className="text-white/80 text-xs drop-shadow-lg">
                                    {formatTimeAgo(new Date(currentStory.created_at))}
                                </p>
                            </div>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onClose()
                            }}
                            className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors backdrop-blur-sm"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Story Content */}
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                    {currentStory.media_type === 'image' ? (
                        <Image
                            src={currentStory.media_url}
                            alt={currentStory.caption || 'Story'}
                            fill
                            unoptimized
                            className="object-contain"
                            priority
                        />
                    ) : (
                        <video
                            ref={videoRef}
                            src={currentStory.media_url}
                            className="w-full h-full object-contain"
                            muted={isMuted}
                            loop={false}
                            playsInline
                            onEnded={goToNext}
                        />
                    )}
                </div>

                {/* Caption */}
                {currentStory.caption && (
                    <div className="absolute bottom-20 left-0 right-0 z-20 px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-black/50 backdrop-blur-md rounded-2xl p-4"
                        >
                            <p className="text-white text-sm leading-relaxed">
                                {currentStory.caption}
                            </p>
                        </motion.div>
                    </div>
                )}

                {/* Bottom Actions */}
                <div className="absolute bottom-6 left-0 right-0 z-20 px-6">
                    <Link
                        href={`/business/${storyGroup.provider_slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-gradient-to-r from-[#FF5200] via-[#FF6B2C] to-[#FF8F50] hover:from-[#E04800] hover:via-[#FF5200] hover:to-[#FF6B2C] text-white py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 transition-all active:scale-95"
                    >
                        <span>View Business</span>
                        <ExternalLink className="w-4 h-4" />
                    </Link>
                </div>

                {/* Navigation Hints (Desktop) */}
                <div className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    {currentStoryIndex > 0 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                goToPrev()
                            }}
                            className="w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center transition-colors backdrop-blur-sm"
                            aria-label="Previous story"
                        >
                            <ChevronLeft className="w-6 h-6 text-white" />
                        </button>
                    )}
                </div>

                <div className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 z-10">
                    {currentStoryIndex < storyGroup.stories.length - 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                goToNext()
                            }}
                            className="w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center transition-colors backdrop-blur-sm"
                            aria-label="Next story"
                        >
                            <ChevronRight className="w-6 h-6 text-white" />
                        </button>
                    )}
                </div>

                {/* View Count */}
                <div className="absolute bottom-24 right-6 z-20">
                    <div className="bg-black/50 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5">
                        <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                        </svg>
                        <span className="text-white text-xs font-medium">
                            {currentStory.view_count}
                        </span>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
