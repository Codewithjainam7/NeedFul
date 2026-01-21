'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Check, ChevronDown, ChevronUp, Star, X,
    Zap, Wrench, AirVent, UtensilsCrossed, Sparkles, Stethoscope, HardHat, Hotel,
    Plane, Car, GraduationCap, Film, HeartHandshake, IndianRupee, Shield, ShoppingBag, Gift,
    // Additional icons for all categories
    Droplets, Hammer, Scissors, SprayCan, Utensils, Truck, Paintbrush, Activity,
    Scale, Calculator, PartyPopper, Camera, Dumbbell, Dog, Layout, Laptop, ThermometerSnowflake
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { Category } from '@/types/database'

// Comprehensive icon mapping for all categories (synced with SuperGrid)
const iconMap: Record<string, any> = {
    // Home Services
    'electricians': Zap,
    'electrician': Zap,
    'plumbers': Wrench,
    'plumber': Droplets,
    'ac-repair': AirVent,
    'carpenter': Hammer,
    'repairs': Hammer,

    // Lifestyle & Beauty
    'restaurants': UtensilsCrossed,
    'beauty-spa': Sparkles,
    'beauty': Sparkles,
    'salon': Scissors,
    'salons': Scissors,
    'doctors': Stethoscope,
    'mechanics': Wrench,
    'cleaning': SprayCan,

    // Construction & Trade
    'contractors': HardHat,
    'painters': Paintbrush,
    'interior-designers': Layout,
    'home-decor': Layout,

    // Travel & Hospitality
    'hotels': Hotel,
    'travel': Plane,

    // Auto & Transport
    'auto-care': Car,
    'movers': Truck,

    // Education & Wellness
    'education': GraduationCap,
    'yoga': Activity,
    'gym': Dumbbell,
    'jobs': Activity, // Briefcase not imported, using Activity

    // Entertainment & Events
    'movies': Film,
    'wedding': HeartHandshake,
    'events': PartyPopper,
    'photographers': Camera,

    // Finance & Legal
    'loans': IndianRupee,
    'insurance': Shield,
    'lawyers': Scale,
    'ca': Calculator,

    // Shopping & Services
    'shopping': ShoppingBag,
    'gifts': Gift,
    'tiffin-service': Utensils,
    'pet-grooming': Dog,
    'laptop-repair': Laptop,
}

function CategoryIcon({ slug, className }: { slug: string, className?: string }) {
    const Icon = iconMap[slug] || Sparkles // Fallback
    return <Icon className={className} />
}

interface FilterSidebarProps {
    categories: Category[]
    selectedCategories: string[]
    selectedCity: string
    selectedRating: number | null
    isVerifiedOnly: boolean
    isResponsiveOnly: boolean
    sortBy?: string
    // Distance filter
    distanceKm?: number
    onDistanceChange?: (km: number) => void
    userLocation?: { lat: number; lon: number } | null
    onRequestLocation?: () => void
    // Cost filter
    selectedCostTiers?: string[]
    onCostChange?: (tiers: string[]) => void
    // Callbacks
    onCategoryChange: (categories: string[]) => void
    onCityChange: (city: string) => void
    onRatingChange: (rating: number | null) => void
    onVerifiedChange: (verified: boolean) => void
    onResponsiveChange: (responsive: boolean) => void
    onSortChange?: (sort: string) => void
    onClearAll: () => void
    resultCount?: number
    onCollapseChange?: (isCollapsed: boolean) => void
    isMobile?: boolean
}

const cities = [
    { name: 'Mumbai', available: true },
    { name: 'Delhi', available: false },
    { name: 'Bangalore', available: false },
    { name: 'Hyderabad', available: false },
    { name: 'Chennai', available: false },
    { name: 'Kolkata', available: false },
    { name: 'Pune', available: false },
    { name: 'Ahmedabad', available: false }
]

const ratingOptions = [
    { value: 4, label: '4★ & above' },
    { value: 3, label: '3★ & above' },
    { value: 2, label: '2★ & above' },
]

export function FilterSidebar({
    categories,
    selectedCategories,
    selectedCity,
    selectedRating,
    isVerifiedOnly,
    isResponsiveOnly,
    sortBy = 'default',
    distanceKm = 5,
    onDistanceChange,
    userLocation,
    onRequestLocation,
    selectedCostTiers = [],
    onCostChange,
    onCategoryChange,
    onCityChange,
    onRatingChange,
    onVerifiedChange,
    onResponsiveChange,
    onSortChange,
    onClearAll,
    resultCount,
    onCollapseChange,
    isMobile = false
}: FilterSidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [gridView, setGridView] = useState(false)
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        sortBy: true,
        category: true,
        location: true,
        distance: true,
        cost: true,
        rating: true,
        filters: true
    })

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    const toggleCategory = (slug: string) => {
        const newCategories = selectedCategories.includes(slug)
            ? selectedCategories.filter(c => c !== slug)
            : [...selectedCategories, slug]
        onCategoryChange(newCategories)
    }

    const ratingOptions = [
        { value: 4.5, label: '4.5 & above' },
        { value: 4.0, label: '4.0 & above' },
        { value: 3.5, label: '3.5 & above' },
        { value: 3.0, label: '3.0 & above' },
    ]

    return (
        <div
            className={cn(
                "h-full flex flex-col bg-gradient-to-b from-orange-50/80 to-white relative shadow-sm",
                !isMobile && "rounded-2xl transition-[width] duration-300 ease-out will-change-[width]",
                isMobile ? "w-full" : (isCollapsed ? "w-16" : "w-64 lg:w-72")
            )}
            style={{ overflow: 'visible' }}
        >
            {/* Minimize Toggle Button - Hide on mobile */}
            {!isMobile && (
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 z-50 w-6 h-6 rounded-full bg-[#FF5200] hover:bg-[#E04800] text-white hidden md:flex items-center justify-center shadow-lg transition-all duration-300"
                    aria-label={isCollapsed ? "Expand filters" : "Collapse filters"}
                >
                    <svg
                        className={cn("h-3.5 w-3.5 transition-transform duration-300", isCollapsed && "rotate-180")}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}

            {/* Header */}
            <div className={cn(
                "px-5 py-4 border-b border-gray-100 bg-gradient-to-b from-orange-50/60 to-transparent backdrop-blur-sm",
                isMobile && "pt-6 pr-14" // Extra right padding to avoid close button overlap
            )}>
                <div className={cn(
                    "flex items-center justify-between transition-opacity duration-300",
                    isCollapsed && !isMobile && "opacity-0"
                )}>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 whitespace-nowrap relative inline-block">
                            Filters
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF5200]/60 rounded-full"></span>
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">{resultCount} results</p>
                    </div>
                    <button
                        onClick={onClearAll}
                        className="text-sm font-bold text-[#FF5200] hover:text-[#E04800] transition-all duration-200 whitespace-nowrap px-3 py-1.5 rounded-lg hover:bg-orange-50 active:scale-95"
                    >
                        Clear All
                    </button>
                </div>
            </div>

            {/* Collapsed State Visual */}
            {isCollapsed && !isMobile && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                    <div className="flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105">
                        <svg className="w-6 h-6 text-[#FF5200]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        <div className="-rotate-90 whitespace-nowrap text-xs font-black font-sans text-gray-900 tracking-[0.2em] uppercase mt-8">
                            FILTERS
                        </div>
                    </div>
                </div>
            )}

            <ScrollArea className={cn("h-full", isMobile ? "h-[calc(100vh-140px)]" : "h-[calc(100vh-240px)]")}>
                <div className={cn(
                    "p-6 space-y-6 transition-opacity duration-300",
                    isCollapsed && "opacity-0 pointer-events-none"
                )}>
                    {/* Sort By Section - Drodown */}
                    <motion.div
                        initial={isMobile ? { opacity: 0, x: -50 } : {}}
                        animate={isMobile ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0, duration: 0.2 }}
                    >
                        <button
                            onClick={() => toggleSection('sortBy')}
                            className="flex items-center justify-between w-full py-2 group"
                        >
                            <span className="font-black text-base text-gray-900 relative">
                                Sort By
                                <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-[#FF5200]/40 rounded-full"></span>
                            </span>
                            <ChevronDown className={cn("h-5 w-5 text-gray-600 transition-transform duration-300", expandedSections.sortBy && "rotate-180")} />
                        </button>
                        {expandedSections.sortBy && (
                            <div className="space-y-3 mt-3">
                                {[
                                    { value: 'default', label: 'Relevance' },
                                    { value: 'rating', label: 'Top Rated' },
                                    { value: 'reviews', label: 'Most Reviews' }
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => onSortChange?.(option.value)}
                                        className={cn(
                                            "w-full text-left px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200",
                                            sortBy === option.value
                                                ? "bg-[#FF5200] text-white shadow-md"
                                                : "hover:bg-orange-50 text-gray-700 active:scale-[0.98]"
                                        )}
                                    >
                                        <span className="flex items-center justify-between">
                                            <span>{option.label}</span>
                                            {sortBy === option.value && <Check className="h-4 w-4" />}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    <div className="h-px bg-gray-200"></div>

                    {/* Category Section */}
                    <motion.div
                        initial={isMobile ? { opacity: 0, x: -50 } : {}}
                        animate={isMobile ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0, duration: 0.2 }}
                    >
                        <div className="flex items-center justify-between w-full py-2">
                            <span className="font-black text-base text-gray-900 relative">
                                Category
                                <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-[#FF5200]/40 rounded-full"></span>
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setGridView(prev => !prev)}
                                    className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-colors"
                                    title={gridView ? "List View" : "Grid View"}
                                >
                                    {gridView ? (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                    )}
                                </button>
                                <button
                                    onClick={() => toggleSection('category')}
                                    className="p-1"
                                >
                                    <ChevronDown className={cn("h-5 w-5 text-gray-600 transition-transform duration-300", expandedSections.category && "rotate-180")} />
                                </button>
                            </div>
                        </div>

                        {expandedSections.category && (
                            <div className={cn("mt-3 max-h-96 overflow-y-auto custom-scrollbar", gridView ? "grid grid-cols-3 gap-2" : "space-y-1")}>
                                {categories.map((category) => {
                                    // Lucide icon dynamic lookup (fallback to generic if string)
                                    // Ideally we map these in parent, but simple check here
                                    return (
                                        <button
                                            key={category.id}
                                            onClick={() => toggleCategory(category.slug)}
                                            className={cn(
                                                "transition-all duration-200 group flex flex-col items-center justify-center text-center",
                                                gridView
                                                    ? "aspect-square rounded-xl p-2 border border-transparent hover:border-gray-200 hover:shadow-sm"
                                                    : "w-full text-left px-3 py-2.5 rounded-lg flex-row justify-start gap-3",
                                                selectedCategories.includes(category.slug)
                                                    ? (gridView ? "bg-orange-50 border-orange-200 shadow-inner" : "bg-[#FF5200] text-white shadow-md")
                                                    : "bg-transparent hover:bg-white"
                                            )}
                                        >
                                            {/* Icon Placeholder - In real app map string to Lucide Icon */}
                                            <div className={cn(
                                                "rounded-full flex items-center justify-center transition-colors",
                                                gridView ? "w-8 h-8 mb-1" : "w-5 h-5",
                                                selectedCategories.includes(category.slug)
                                                    ? (gridView ? "bg-[#FF5200] text-white shadow-sm" : "text-white")
                                                    : "bg-orange-50 text-orange-600 group-hover:bg-orange-100 group-hover:text-orange-700"
                                            )}>
                                                <CategoryIcon slug={category.slug} className={gridView ? "w-5 h-5" : "w-3.5 h-3.5"} />
                                            </div>

                                            <span className={cn(
                                                "font-medium leading-tight",
                                                gridView ? "text-[10px] text-gray-700" : "text-sm",
                                                selectedCategories.includes(category.slug) && !gridView ? "text-white" : "text-gray-700"
                                            )}>
                                                {category.name}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </motion.div>

                    <div className="h-px bg-gray-200"></div>

                    {/* Location Section */}
                    <motion.div
                        initial={isMobile ? { opacity: 0, x: -50 } : {}}
                        animate={isMobile ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.05, duration: 0.2 }}
                    >
                        <button
                            onClick={() => toggleSection('location')}
                            className="flex items-center justify-between w-full py-2 group"
                        >
                            <span className="font-black text-base text-gray-900 relative">
                                Location
                                <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-[#FF5200]/40 rounded-full"></span>
                            </span>
                            <ChevronDown className={cn("h-5 w-5 text-gray-600 transition-transform duration-300", expandedSections.location && "rotate-180")} />
                        </button>
                        {expandedSections.location && (
                            <div className="space-y-2 mt-3">
                                {cities.map((city) => (
                                    <button
                                        key={city.name}
                                        onClick={() => city.available && onCityChange(city.name)}
                                        disabled={!city.available}
                                        className={cn(
                                            'flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm transition-all font-semibold',
                                            selectedCity === city.name
                                                ? 'bg-[#FF5200] text-white shadow-md'
                                                : city.available
                                                    ? 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                        )}
                                    >
                                        <span>
                                            {city.name}
                                            {!city.available && <span className="text-xs ml-2">(Coming Soon)</span>}
                                        </span>
                                        {selectedCity === city.name && <Check className="h-5 w-5" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    <div className="h-px bg-gray-200"></div>

                    <div className="h-px bg-gray-200"></div>

                    {/* Distance Section */}
                    <motion.div
                        initial={isMobile ? { opacity: 0, x: -50 } : {}}
                        animate={isMobile ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.1, duration: 0.2 }}
                    >
                        <button
                            onClick={() => toggleSection('distance' as any)}
                            className="flex items-center justify-between w-full py-2 group"
                        >
                            <span className="font-black text-base text-gray-900 relative">
                                Distance
                                <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-[#FF5200]/40 rounded-full"></span>
                            </span>
                            <ChevronDown className={cn("h-5 w-5 text-gray-600 transition-transform duration-300", (expandedSections as any).distance && "rotate-180")} />
                        </button>
                        {(expandedSections as any).distance && (
                            <div className="space-y-4 mt-3 px-1">
                                {/* Location Status */}
                                {!userLocation ? (
                                    <button
                                        onClick={onRequestLocation}
                                        className="w-full py-2 px-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-[#FF5200] font-semibold hover:bg-orange-100 transition-colors flex items-center justify-center gap-2"
                                    >
                                        📍 Enable Location
                                    </button>
                                ) : (
                                    <p className="text-xs text-green-600 text-center font-medium">
                                        ✓ Location enabled
                                    </p>
                                )}

                                <div className="flex justify-between text-sm text-gray-600 font-medium">
                                    <span>1 km</span>
                                    <span className="text-[#FF5200] font-bold">{distanceKm} km</span>
                                    <span>20 km</span>
                                </div>
                                <Slider
                                    value={[distanceKm]}
                                    onValueChange={(val) => onDistanceChange?.(val[0])}
                                    min={1}
                                    max={20}
                                    step={1}
                                    className="py-2"
                                    disabled={!userLocation}
                                />
                                <p className="text-xs text-center text-gray-400">
                                    {userLocation ? 'Drag to adjust search radius' : 'Enable location first'}
                                </p>
                            </div>
                        )}
                    </motion.div>

                    <div className="h-px bg-gray-200"></div>

                    {/* Cost Section */}
                    <motion.div
                        initial={isMobile ? { opacity: 0, x: -50 } : {}}
                        animate={isMobile ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.25, duration: 0.3 }}
                    >
                        <button
                            onClick={() => toggleSection('cost' as any)}
                            className="flex items-center justify-between w-full py-2 group"
                        >
                            <span className="font-black text-base text-gray-900 relative">
                                Cost
                                <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-[#FF5200]/40 rounded-full"></span>
                            </span>
                            <ChevronDown className={cn("h-5 w-5 text-gray-600 transition-transform duration-300", (expandedSections as any).cost && "rotate-180")} />
                        </button>
                        {(expandedSections as any).cost && (
                            <div className="space-y-2 mt-3">
                                {[
                                    { id: 'budget', label: 'Budget', desc: '₹ Under ₹500' },
                                    { id: 'standard', label: 'Standard', desc: '₹₹ ₹500 - ₹2000' },
                                    { id: 'premium', label: 'Premium', desc: '₹₹₹ ₹2000 - ₹5000' },
                                    { id: 'luxury', label: 'Luxury', desc: '₹₹₹₹ ₹5000+' },
                                ].map((cost) => {
                                    const isSelected = selectedCostTiers.includes(cost.id)
                                    return (
                                        <button
                                            key={cost.id}
                                            onClick={() => {
                                                if (isSelected) {
                                                    onCostChange?.(selectedCostTiers.filter(t => t !== cost.id))
                                                } else {
                                                    onCostChange?.([...selectedCostTiers, cost.id])
                                                }
                                            }}
                                            className={cn(
                                                "w-full text-left px-4 py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-between",
                                                isSelected
                                                    ? "bg-[#FF5200] text-white shadow-md"
                                                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                            )}
                                        >
                                            <div>
                                                <span className="block">{cost.label}</span>
                                                <span className={cn("text-xs", isSelected ? "text-orange-100" : "text-gray-400")}>{cost.desc}</span>
                                            </div>
                                            {isSelected && <Check className="h-5 w-5" />}
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </motion.div>

                    <div className="h-px bg-gray-200"></div>

                    {/* Rating Section */}
                    <motion.div
                        initial={isMobile ? { opacity: 0, x: -50 } : {}}
                        animate={isMobile ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.3, duration: 0.3 }}
                    >
                        <button
                            onClick={() => toggleSection('rating')}
                            className="flex items-center justify-between w-full py-2 group"
                        >
                            <span className="font-black text-base text-gray-900 relative">
                                Rating
                                <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-[#FF5200]/40 rounded-full"></span>
                            </span>
                            <ChevronDown className={cn("h-5 w-5 text-gray-600 transition-transform duration-300", expandedSections.rating && "rotate-180")} />
                        </button>
                        {expandedSections.rating && (
                            <div className="space-y-2 mt-3">
                                {ratingOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => onRatingChange(selectedRating === option.value ? null : option.value)}
                                        className={cn(
                                            'flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm transition-all font-semibold',
                                            selectedRating === option.value
                                                ? 'bg-[#FF5200] text-white shadow-md'
                                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                        )}
                                    >
                                        <Star className={cn(
                                            'h-5 w-5',
                                            selectedRating === option.value ? 'fill-white text-white' : 'fill-gray-400 text-gray-400'
                                        )} />
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    <div className="h-px bg-gray-200"></div>

                    {/* Additional Filters */}
                    <motion.div
                        initial={isMobile ? { opacity: 0, x: -50 } : {}}
                        animate={isMobile ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.35, duration: 0.3 }}
                    >
                        <button
                            onClick={() => toggleSection('filters')}
                            className="flex items-center justify-between w-full py-2 group"
                        >
                            <span className="font-black text-base text-gray-900 relative">
                                More Filters
                                <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-[#FF5200]/40 rounded-full"></span>
                            </span>
                            <ChevronDown className={cn("h-5 w-5 text-gray-600 transition-transform duration-300", expandedSections.filters && "rotate-180")} />
                        </button>
                        {expandedSections.filters && (
                            <div className="space-y-3 mt-3">
                                <button
                                    onClick={() => onVerifiedChange(!isVerifiedOnly)}
                                    className={cn(
                                        "w-full text-left px-4 py-3 rounded-lg font-semibold text-sm transition-all flex items-center gap-3",
                                        isVerifiedOnly
                                            ? "bg-[#FF5200] text-white shadow-md"
                                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                    )}
                                >
                                    <div className={cn(
                                        "h-5 w-5 rounded flex items-center justify-center",
                                        isVerifiedOnly ? "bg-white" : "bg-white border-2 border-gray-300"
                                    )}>
                                        {isVerifiedOnly && <Check className="h-4 w-4 text-[#FF5200]" />}
                                    </div>
                                    Verified Only
                                </button>
                                <button
                                    onClick={() => onResponsiveChange(!isResponsiveOnly)}
                                    className={cn(
                                        "w-full text-left px-4 py-3 rounded-lg font-semibold text-sm transition-all flex items-center gap-3",
                                        isResponsiveOnly
                                            ? "bg-[#FF5200] text-white shadow-md"
                                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                    )}
                                >
                                    <div className={cn(
                                        "h-5 w-5 rounded flex items-center justify-center",
                                        isResponsiveOnly ? "bg-white" : "bg-white border-2 border-gray-300"
                                    )}>
                                        {isResponsiveOnly && <Check className="h-4 w-4 text-[#FF5200]" />}
                                    </div>
                                    Quick Response
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </ScrollArea >
        </div >
    )
}

// Active filter chips component
interface ActiveFiltersProps {
    selectedCategories: string[]
    categories: Category[]
    selectedRating: number | null
    isVerifiedOnly: boolean
    isResponsiveOnly: boolean
    onRemoveCategory: (slug: string) => void
    onRemoveRating: () => void
    onRemoveVerified: () => void
    onRemoveResponsive: () => void
    onClearAll: () => void
}

export function ActiveFilters({
    selectedCategories,
    categories,
    selectedRating,
    isVerifiedOnly,
    isResponsiveOnly,
    onRemoveCategory,
    onRemoveRating,
    onRemoveVerified,
    onRemoveResponsive,
    onClearAll
}: ActiveFiltersProps) {
    const hasFilters = selectedCategories.length > 0 ||
        selectedRating !== null ||
        isVerifiedOnly ||
        isResponsiveOnly

    if (!hasFilters) return null

    return (
        <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm text-gray-500">Active Filters:</span>

            {selectedCategories.map((slug) => {
                const category = categories.find(c => c.slug === slug)
                return (
                    <button
                        key={slug}
                        onClick={() => onRemoveCategory(slug)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm hover:bg-primary/20 transition-colors"
                    >
                        {category?.name || slug}
                        <X className="h-3 w-3" />
                    </button>
                )
            })}

            {selectedRating && (
                <button
                    onClick={onRemoveRating}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm hover:bg-primary/20 transition-colors"
                >
                    {selectedRating}★ & above
                    <X className="h-3 w-3" />
                </button>
            )}

            {isVerifiedOnly && (
                <button
                    onClick={onRemoveVerified}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm hover:bg-primary/20 transition-colors"
                >
                    Verified
                    <X className="h-3 w-3" />
                </button>
            )}

            {isResponsiveOnly && (
                <button
                    onClick={onRemoveResponsive}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm hover:bg-primary/20 transition-colors"
                >
                    Quick Response
                    <X className="h-3 w-3" />
                </button>
            )}

            <button
                onClick={onClearAll}
                className="text-sm text-gray-500 hover:text-gray-700 underline ml-2"
            >
                Clear all
            </button>
        </div>
    )
}
