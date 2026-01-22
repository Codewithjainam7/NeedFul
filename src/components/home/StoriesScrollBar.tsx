'use client'

import { useBusinessStories, GroupedStories } from '@/hooks/useBusinessStories'
import { BusinessStoryRing, BusinessStoryRingSkeleton } from './BusinessStoryRing'
import { StoryViewer } from './StoryViewer'
import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface StoriesScrollBarProps {
    userCity?: string
    userLat?: number
    userLon?: number
    currentProviderId?: string
}

export function StoriesScrollBar({
    userCity,
    userLat,
    userLon,
    currentProviderId,
}: StoriesScrollBarProps) {
    const { data: groupedStories, isLoading, error } = useBusinessStories(
        userCity,
        userLat,
        userLon
    )

    const [selectedStoryGroup, setSelectedStoryGroup] = useState<GroupedStories | null>(null)
    const [showLeftArrow, setShowLeftArrow] = useState(false)
    const [showRightArrow, setShowRightArrow] = useState(false)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    // Check scroll position to show/hide arrows
    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
            setShowLeftArrow(scrollLeft > 0)
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
        }
    }

    useEffect(() => {
        checkScroll()
        const scrollContainer = scrollContainerRef.current
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', checkScroll)
            window.addEventListener('resize', checkScroll)
            return () => {
                scrollContainer.removeEventListener('scroll', checkScroll)
                window.removeEventListener('resize', checkScroll)
            }
        }
    }, [groupedStories])

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300
            const newScrollLeft =
                scrollContainerRef.current.scrollLeft +
                (direction === 'left' ? -scrollAmount : scrollAmount)

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth',
            })
        }
    }

    // Don't render if no stories or error
    if (error || (!isLoading && (!groupedStories || groupedStories.length === 0))) {
        return null
    }

    return (
        <>
            <section className="relative w-full py-4 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Section Header */}
                    <div className="mb-4">
                        <h2 className="text-lg md:text-xl font-bold text-gray-900">
                            Local Business Stories
                        </h2>
                        <p className="text-sm text-gray-500">
                            Discover exclusive offers and updates from businesses near you
                        </p>
                    </div>

                    {/* Stories Container */}
                    <div className="relative">
                        {/* Left Scroll Arrow */}
                        <AnimatePresence>
                            {showLeftArrow && (
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => scroll('left')}
                                    className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                    aria-label="Scroll left"
                                >
                                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {/* Right Scroll Arrow */}
                        <AnimatePresence>
                            {showRightArrow && (
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => scroll('right')}
                                    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                    aria-label="Scroll right"
                                >
                                    <ChevronRight className="w-5 h-5 text-gray-600" />
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {/* Scrollable Stories */}
                        <div
                            ref={scrollContainerRef}
                            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 scroll-smooth"
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                            }}
                        >
                            {isLoading ? (
                                // Loading Skeletons
                                Array.from({ length: 8 }).map((_, i) => (
                                    <BusinessStoryRingSkeleton key={i} />
                                ))
                            ) : (
                                // Actual Stories
                                groupedStories?.map((group) => (
                                    <BusinessStoryRing
                                        key={group.provider_id}
                                        providerId={group.provider_id}
                                        providerName={group.provider_name}
                                        providerLogo={group.provider_logo}
                                        storyCount={group.stories.length}
                                        hasUnviewed={group.has_unviewed}
                                        onClick={() => setSelectedStoryGroup(group)}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Story Viewer Modal */}
            {selectedStoryGroup && (
                <StoryViewer
                    storyGroup={selectedStoryGroup}
                    onClose={() => setSelectedStoryGroup(null)}
                    isOwner={currentProviderId === selectedStoryGroup.provider_id}
                />
            )}
        </>
    )
}
