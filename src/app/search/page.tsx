'use client'

import { useState, useEffect, useCallback, Suspense, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, SlidersHorizontal, ArrowUpDown, Search, CheckCircle, Check, Star, ChevronDown } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { cn } from '@/lib/utils'
import { Footer } from '@/components/layout/Footer'
import { ServiceCard, ServiceCardSkeleton } from '@/components/listing/ServiceCard'
import { WorkerCard } from '@/components/listing/WorkerCard'
import { FilterSidebar, ActiveFilters } from '@/components/listing/FilterSidebar'
import { EnquiryForm, RelatedSearches, LocationChips } from '@/components/listing/SidebarWidgets'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'
import type { Category, Provider, Service } from '@/types/database'


type ProviderWithDetails = Provider & {
    categories: Category
    services: Service[]
    provider_images: { url: string; is_primary: boolean }[]
}

// Default categories for client-side
const defaultCategories: Category[] = [
    { id: 'c1', name: 'Electricians', slug: 'electricians', icon: 'Zap', display_order: 1 },
    { id: 'c2', name: 'Plumbers', slug: 'plumbers', icon: 'Wrench', display_order: 2 },
    { id: 'c3', name: 'AC Repair', slug: 'ac-repair', icon: 'AirVent', display_order: 3 },
    { id: 'c4', name: 'Restaurants', slug: 'restaurants', icon: 'UtensilsCrossed', display_order: 4 },
    { id: 'c5', name: 'Beauty & Spa', slug: 'beauty-spa', icon: 'Sparkles', display_order: 5 },
    { id: 'c6', name: 'Doctors', slug: 'doctors', icon: 'Stethoscope', display_order: 6 },
    { id: 'c7', name: 'Contractors', slug: 'contractors', icon: 'HardHat', display_order: 7 },
    { id: 'c8', name: 'Hotels', slug: 'hotels', icon: 'Hotel', display_order: 8 },
]

const sortOptions = [
    { value: 'rating', label: 'Top Rated' },
    { value: 'reviews', label: 'Most Reviewed' },
    { value: 'distance', label: 'Nearest First' },
    { value: 'cost_low_high', label: 'Cost: Low to High' },
    { value: 'cost_high_low', label: 'Cost: High to Low' },
    { value: 'name', label: 'Name A-Z' },
]

function SearchPageContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [providers, setProviders] = useState<ProviderWithDetails[]>([])
    const [categories, setCategories] = useState<Category[]>(defaultCategories)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

    // Filter states
    const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
        const cat = searchParams.get('category')
        return cat ? cat.split(',') : [] // Support multiple comma-separated
    })
    const [selectedCity, setSelectedCity] = useState(() => searchParams.get('city') || 'Mumbai')
    const [selectedArea, setSelectedArea] = useState(() => searchParams.get('area') || '')

    // Sync state with URL params
    useEffect(() => {
        const area = searchParams.get('area')
        if (area !== selectedArea) {
            setSelectedArea(area || '')
        }
    }, [searchParams])
    const [selectedRating, setSelectedRating] = useState<number | null>(null)
    const [isVerifiedOnly, setIsVerifiedOnly] = useState(false)
    const [isResponsiveOnly, setIsResponsiveOnly] = useState(false)
    const [sortBy, setSortBy] = useState('rating')
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    // Distance filter state
    const [distanceKm, setDistanceKm] = useState(5)
    const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)

    // Cost filter state
    const [selectedCostTiers, setSelectedCostTiers] = useState<string[]>([])

    // Request user location
    const requestLocation = useCallback(() => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser')
            return
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                })
            },
            (error) => {
                console.error('Geolocation error:', error)
                alert('Unable to get your location. Please enable location permissions.')
            },
            { enableHighAccuracy: true, timeout: 10000 }
        )
    }, [])

    // Haversine formula for distance calculation (returns km)
    const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371 // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180
        const dLon = (lon2 - lon1) * Math.PI / 180
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return R * c
    }, [])

    // Parse price_range to determine cost tier
    const getCostTier = useCallback((priceRange: string | null): string => {
        if (!priceRange) return 'standard'
        // Extract numbers from strings like "₹500-2000", "₹12-25/sqft", "₹5000+"
        const numbers = priceRange.match(/\d+/g)
        if (!numbers || numbers.length === 0) return 'standard'
        const firstNum = parseInt(numbers[0])
        if (firstNum < 500) return 'budget'
        if (firstNum < 2000) return 'standard'
        if (firstNum < 5000) return 'premium'
        return 'luxury'
    }, [])

    // Client-side filtering for distance and cost (applied after DB query)
    const filteredProviders = useMemo(() => {
        let result = [...providers]

        // Distance filter (only if user location is available)
        if (userLocation && distanceKm < 20) {
            result = result.filter(p => {
                const provider = p as any
                if (provider.latitude && provider.longitude) {
                    const dist = calculateDistance(
                        userLocation.lat, userLocation.lon,
                        provider.latitude, provider.longitude
                    )
                    return dist <= distanceKm
                }
                return true // Include providers without coordinates
            })
        }

        // Cost tier filter
        if (selectedCostTiers.length > 0) {
            result = result.filter(p => {
                const tier = getCostTier((p as any).price_range)
                return selectedCostTiers.includes(tier)
            })
        }

        return result
    }, [providers, userLocation, distanceKm, selectedCostTiers, calculateDistance, getCostTier])

    const searchQuery = searchParams.get('q') || ''

    // Fetch categories
    useEffect(() => {
        async function fetchCategories() {
            const supabase = createClient()
            const { data } = await supabase
                .from('categories')
                .select('*')
                .order('display_order')

            if (data && data.length > 0) {
                setCategories(data)
            }
        }
        fetchCategories()
    }, [])

    // Fetch providers
    const fetchProviders = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const supabase = createClient()
            let query = supabase
                .from('providers')
                .select(`
                    *,
                    categories!category_id(*),
                    provider_images(*)
                `)
                .eq('status', 'approved')

            // Filter by City
            if (selectedCity && selectedCity !== 'All Mumbai') {
                // Note: Our mock data uses 'Mumbai' as city, but areas distinguish location. 
                // If we want exact city match: query = query.eq('city', selectedCity)
                // For now, let's assuming 'Mumbai' covers all.
            }

            // Filter by Area
            if (selectedArea) {
                query = query.ilike('address', `%${selectedArea}%`)
            }

            // Filter by Category (Two-step robust filtering)
            if (selectedCategories.length > 0) {
                console.log('Filtering by categories:', selectedCategories)

                // 1. Get IDs for selected slugs
                const { data: catData, error: catError } = await supabase
                    .from('categories')
                    .select('id')
                    .in('slug', selectedCategories)

                if (catError) {
                    console.error('Error feching category IDs:', catError)
                }

                const catDataTyped = catData as any[] | null;
                if (catDataTyped && catDataTyped.length > 0) {
                    const ids = catDataTyped.map(c => c.id)
                    query = query.in('category_id', ids)
                } else {
                    // Selected categories exist in URL but not in DB? Return empty.
                    console.warn('Categories not found for slugs:', selectedCategories)
                    setProviders([])
                    setLoading(false)
                    return
                }
            }

            // Filter by Rating
            if (selectedRating) {
                query = query.gte('rating', selectedRating)
            }

            // Filter by Verified
            if (isVerifiedOnly) {
                query = query.eq('is_verified', true)
            }

            // Filter by Responsive
            if (isResponsiveOnly) {
                query = query.eq('is_responsive', true)
            }

            // Search Query (Business Name or Description)
            if (searchQuery) {
                query = query.or(`business_name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
            }

            // Sort
            if (sortBy === 'rating') {
                query = query.order('rating', { ascending: false })
            } else if (sortBy === 'reviews') {
                query = query.order('review_count', { ascending: false })
            } else if (sortBy === 'name') {
                query = query.order('business_name', { ascending: true })
            } else if (sortBy === 'distance') {
                // Mock distance sort - in real app use PostGIS or client side sort if small data
                // For now, we unfortunately can't true distance sort without user lat/lon in DB query easily
                // So we'll mock by sorting by ID or random to change order
                // query = query.order('id', { ascending: true }) 
                // Creating a spatial query is complex here without user location context passed to DB function.
                console.warn('Distance sort requires geospatial query. Defaulting to rating.')
                query = query.order('rating', { ascending: false })
            } else if (sortBy === 'cost_low_high') {
                // Assuming 'price_range' or similar column exists, simplified:
                // If no price column, we can't sort.
                query = query.order('rating', { ascending: true }) // Placeholder
            } else if (sortBy === 'cost_high_low') {
                query = query.order('rating', { ascending: false }) // Placeholder
            }

            console.log('Executing Supabase query for providers...')
            const { data, error } = await query

            if (error) {
                console.error('Error fetching providers:', error)
                // Show actual error message for debugging
                setError(`Failed to load services: ${error.message || JSON.stringify(error)}`)
            } else {
                console.log('Providers fetched successfully:', data?.length)

                // Transform data to ensure 'categories' is singular object if array returned 
                setProviders(data as unknown as ProviderWithDetails[])
            }
        } catch (err) {
            console.error('Unexpected error:', err)
            setError('An unexpected error occurred.')
        } finally {
            setLoading(false)
        }
    }, [selectedCity, selectedArea, selectedCategories, selectedRating, isVerifiedOnly, isResponsiveOnly, searchQuery, sortBy])

    useEffect(() => {
        fetchProviders()
    }, [fetchProviders])

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams()
        if (searchQuery) params.set('q', searchQuery)
        if (selectedCity && selectedCity !== 'Mumbai') params.set('city', selectedCity) // Fix city check
        if (selectedCategories.length > 0) params.set('category', selectedCategories.join(',')) // Join with commas

        const newUrl = `/search${params.toString() ? '?' + params.toString() : ''}`
        router.replace(newUrl, { scroll: false })
    }, [selectedCity, selectedCategories, searchQuery, router])

    const clearAllFilters = () => {
        setSelectedCategories([])
        setSelectedRating(null)
        setIsVerifiedOnly(false)
        setIsResponsiveOnly(false)
        setDistanceKm(5)
        setSelectedCostTiers([])
    }

    const getCategoryName = () => {
        if (selectedCategories.length === 1) {
            const cat = categories.find(c => c.slug === selectedCategories[0])
            return cat?.name || selectedCategories[0]
        }
        return searchQuery || 'Services'
    }

    const pageTitle = `Popular ${getCategoryName()} in ${selectedCity}`

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 pt-28">
                <div className="bg-card">
                    <div className="container mx-auto px-4 md:px-6 py-3">
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                            <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
                            {selectedCategories.length === 1 && (
                                <>
                                    <span className="text-foreground">{getCategoryName()}</span>
                                    <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
                                </>
                            )}
                            <span className="text-foreground font-medium">{selectedCity}</span>
                            {providers.length > 0 && (
                                <span className="ml-2 text-muted-foreground">
                                    • {providers.length.toLocaleString()} listings
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
                    <div className="flex gap-6 lg:gap-8">
                        {/* Sidebar Filters - Desktop Only */}
                        <aside className={cn(
                            "hidden md:block flex-shrink-0 transition-all duration-300",
                            sidebarCollapsed ? "w-16" : "w-64 lg:w-72"
                        )}>
                            <div className="sticky top-20">
                                <FilterSidebar
                                    categories={categories}
                                    selectedCategories={selectedCategories}
                                    selectedCity={selectedCity}
                                    selectedRating={selectedRating}
                                    isVerifiedOnly={isVerifiedOnly}
                                    isResponsiveOnly={isResponsiveOnly}
                                    sortBy={sortBy}
                                    distanceKm={distanceKm}
                                    onDistanceChange={setDistanceKm}
                                    userLocation={userLocation}
                                    onRequestLocation={requestLocation}
                                    selectedCostTiers={selectedCostTiers}
                                    onCostChange={setSelectedCostTiers}
                                    onCategoryChange={setSelectedCategories}
                                    onCityChange={setSelectedCity}
                                    onRatingChange={setSelectedRating}
                                    onVerifiedChange={setIsVerifiedOnly}
                                    onResponsiveChange={setIsResponsiveOnly}
                                    onSortChange={setSortBy}
                                    onClearAll={clearAllFilters}
                                    resultCount={filteredProviders.length}
                                    isCollapsed={sidebarCollapsed}
                                    onCollapseChange={setSidebarCollapsed}
                                />
                            </div>
                        </aside>

                        {/* Results Section */}
                        <div className="flex-1 min-w-0">
                            {/* Location Chips - At Top */}
                            <div className="mb-4 bg-orange-50/30 p-4 rounded-lg border border-orange-100">
                                <LocationChips
                                    currentCity={selectedCity}
                                    currentArea={selectedArea || ''}
                                    onAreaSelect={(area) => {
                                        const searchParams = new URLSearchParams(window.location.search)
                                        searchParams.set('area', area)
                                        router.push(`?${searchParams.toString()}`)
                                    }}
                                    onNearbyClick={(location) => {
                                        const searchParams = new URLSearchParams(window.location.search)
                                        if (location) {
                                            searchParams.set('area', location)
                                        } else {
                                            searchParams.delete('area')
                                        }
                                        router.push(`?${searchParams.toString()}`)
                                    }}
                                />
                            </div>

                            {/* Loading State - Skeleton */}
                            {loading && (
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="bg-gray-50/50 rounded-xl p-3 animate-pulse">
                                            <div className="flex flex-col md:flex-row gap-3">
                                                {/* Image Skeleton */}
                                                <div className="w-full md:w-[180px] h-28 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg bg-[length:200%_100%] animate-shimmer"></div>

                                                {/* Content Skeleton */}
                                                <div className="flex-1 space-y-3">
                                                    {/* Title */}
                                                    <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4 bg-[length:200%_100%] animate-shimmer"></div>

                                                    {/* Rating */}
                                                    <div className="flex gap-2">
                                                        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-16 bg-[length:200%_100%] animate-shimmer"></div>
                                                        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-20 bg-[length:200%_100%] animate-shimmer"></div>
                                                    </div>

                                                    {/* Address */}
                                                    <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-full bg-[length:200%_100%] animate-shimmer"></div>

                                                    {/* Tags */}
                                                    <div className="flex gap-2">
                                                        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-20 bg-[length:200%_100%] animate-shimmer"></div>
                                                        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-24 bg-[length:200%_100%] animate-shimmer"></div>
                                                    </div>
                                                </div>

                                                {/* Buttons Skeleton - Desktop */}
                                                <div className="hidden md:flex md:flex-col gap-2 md:w-auto">
                                                    <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-28 bg-[length:200%_100%] animate-shimmer"></div>
                                                    <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-28 bg-[length:200%_100%] animate-shimmer"></div>
                                                    <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-28 bg-[length:200%_100%] animate-shimmer"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Error State */}
                            {error && (
                                <div className="text-center py-12">
                                    <p className="text-red-500 mb-4">{error}</p>
                                    <Button onClick={() => fetchProviders()}>Try Again</Button>
                                </div>
                            )}

                            {/* Results */}
                            {!loading && !error && (
                                <>
                                    {filteredProviders.length > 0 ? (
                                        <div className={cn(
                                            "grid gap-4 transition-all duration-300",
                                            (() => {
                                                const workerCategories = ['plumbers', 'electricians', 'carpenters', 'painters', 'ac-repair', 'cleaning', 'salon', 'massage']

                                                // Determine if we are showing worker cards (compact) or service cards
                                                let isWorkerContext = false
                                                if (filteredProviders.length > 0) {
                                                    const firstSlug = filteredProviders[0].categories?.slug || ''
                                                    isWorkerContext = workerCategories.includes(firstSlug)
                                                }

                                                if (sidebarCollapsed) {
                                                    // Extended layout when sidebar is collapsed
                                                    return isWorkerContext
                                                        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                                                        : "grid-cols-1 lg:grid-cols-2"
                                                } else {
                                                    // Standard layout - Limit to 2 columns max for service cards to ensure button space
                                                    return isWorkerContext
                                                        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                                                        : "grid-cols-1 lg:grid-cols-2"
                                                }
                                            })()
                                        )}>
                                            {filteredProviders.map((provider) => {
                                                // Check if category is a "Worker" type
                                                const workerCategories = ['plumbers', 'electricians', 'carpenters', 'painters', 'ac-repair', 'cleaning', 'salon', 'massage']
                                                const isWorker = workerCategories.includes(provider.categories?.slug || '')

                                                // Generate mock jobs done count (stable per provider ID)
                                                const jobsDone = 50 + (provider.id.charCodeAt(0) % 450)

                                                if (isWorker) {
                                                    return (
                                                        <WorkerCard
                                                            key={provider.id}
                                                            provider={provider}
                                                            jobsDone={jobsDone}
                                                        />
                                                    )
                                                }
                                                return (
                                                    <ServiceCard
                                                        key={provider.id}
                                                        provider={provider}
                                                    />
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16">
                                            <div className="mb-6">
                                                <div className="flex justify-center mb-4">
                                                    <Search className="h-16 w-16 text-muted-foreground opacity-20" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-foreground mb-2">No services found</h3>
                                                <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms</p>
                                            </div>
                                            <Button
                                                onClick={clearAllFilters}
                                                className="bg-[#FF5200] hover:bg-[#E04800] text-white font-bold h-10 px-6 rounded-lg border-0"
                                            >
                                                Clear All Filters
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {/* Mobile Filter Button - Floating */}
                <div className="md:hidden fixed bottom-24 right-6 z-50">
                    <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                        <SheetTrigger asChild>
                            <Button className="h-14 w-14 rounded-full bg-[#FF5200] hover:bg-[#E04800] text-white shadow-2xl shadow-orange-500/30 border-0 transition-all duration-300 active:scale-90 hover:scale-110 relative group">
                                <SlidersHorizontal className="h-6 w-6 transition-transform group-active:rotate-12" />
                                {/* Active Filter Count Badge */}
                                {(selectedCategories.length > 0 || selectedRating || isVerifiedOnly || isResponsiveOnly || selectedCostTiers.length > 0) && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-[#FF5200] text-xs font-black rounded-full flex items-center justify-center shadow-md animate-bounce">
                                        {selectedCategories.length + (selectedRating ? 1 : 0) + (isVerifiedOnly ? 1 : 0) + (isResponsiveOnly ? 1 : 0) + selectedCostTiers.length}
                                    </span>
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 overflow-y-auto">
                            <SheetTitle className="hidden">Filters</SheetTitle>
                            <FilterSidebar
                                categories={categories}
                                selectedCategories={selectedCategories}
                                selectedCity={selectedCity}
                                selectedRating={selectedRating}
                                isVerifiedOnly={isVerifiedOnly}
                                isResponsiveOnly={isResponsiveOnly}
                                sortBy={sortBy}
                                distanceKm={distanceKm}
                                onDistanceChange={setDistanceKm}
                                userLocation={userLocation}
                                onRequestLocation={requestLocation}
                                selectedCostTiers={selectedCostTiers}
                                onCostChange={setSelectedCostTiers}
                                onCategoryChange={setSelectedCategories}
                                onCityChange={(city) => {
                                    setSelectedCity(city)
                                    setMobileFiltersOpen(false)
                                }}
                                onRatingChange={setSelectedRating}
                                onVerifiedChange={setIsVerifiedOnly}
                                onResponsiveChange={setIsResponsiveOnly}
                                onSortChange={setSortBy}
                                onClearAll={clearAllFilters}
                                resultCount={filteredProviders.length}
                                isMobile={true}
                            />
                        </SheetContent>
                    </Sheet>
                </div>
            </main>

            <Footer />
        </div >
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        }>
            <SearchPageContent />
        </Suspense>
    )
}
