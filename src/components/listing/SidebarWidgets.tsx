'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Send, User, Phone, Wrench, MapPin, Navigation } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface EnquiryFormProps {
    categoryName?: string
}

export function EnquiryForm({ categoryName = 'Electrician' }: EnquiryFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        requirements: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSent, setIsSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsSubmitting(false)
        setIsSent(true)
    }

    if (isSent) {
        return (
            <Card className="p-6 bg-green-50/50 border border-green-100 shadow-sm rounded-2xl text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600">
                    <Send className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900">Enquiry Sent!</h3>
                <p className="text-sm text-gray-600 mt-1">Providers will contact you shortly.</p>
                <Button
                    variant="ghost"
                    className="mt-4 text-green-700 hover:text-green-800 hover:bg-green-100"
                    onClick={() => setIsSent(false)}
                >
                    Send another
                </Button>
            </Card>
        )
    }

    return (
        <Card className="p-6 bg-white/90 backdrop-blur-xl border border-gray-100 shadow-2xl shadow-orange-500/10 rounded-2xl relative overflow-hidden">
            {/* Decorative gradient elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-blue-200/20 to-transparent rounded-full blur-2xl" />

            {/* Top accent bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#FF5200] via-orange-400 to-amber-400" />

            <div className="relative">
                <h3 className="font-bold text-gray-900 text-xl mb-1">
                    Get Best Quotes
                </h3>
                <p className="text-sm text-gray-500 mb-6 font-medium">
                    Connect with top {categoryName}s instantly
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-gradient-to-br from-gray-50 to-white p-1 rounded-xl border border-gray-100 shadow-inner">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <Label className="text-[11px] uppercase font-bold text-[#FF5200] tracking-wider">Name</Label>
                            <input
                                required
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-transparent border-none p-0 text-base font-semibold text-gray-900 focus:ring-0 placeholder:font-normal placeholder:text-gray-400 mt-1"
                            />
                        </div>
                        <div className="px-4 py-3">
                            <Label className="text-[11px] uppercase font-bold text-[#FF5200] tracking-wider">Mobile</Label>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-base font-semibold text-gray-400">+91</span>
                                <input
                                    required
                                    type="tel"
                                    placeholder="98765 43210"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                    className="w-full bg-transparent border-none p-0 text-base font-semibold text-gray-900 focus:ring-0 placeholder:font-normal placeholder:text-gray-400"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-gray-600 ml-1">Requirements (Optional)</Label>
                        <textarea
                            rows={3}
                            placeholder="Describe what you need..."
                            value={formData.requirements}
                            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                            className="w-full rounded-xl border-gray-200 bg-gray-50/50 text-sm focus:border-[#FF5200] focus:ring-[#FF5200]/20 resize-none p-3"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-[#FF5200] via-orange-500 to-amber-500 hover:from-orange-600 hover:via-[#FF5200] hover:to-orange-500 text-white font-bold gap-2 h-14 rounded-xl border-0 shadow-xl shadow-orange-500/25 text-base transition-all duration-300 hover:shadow-orange-500/40 hover:scale-[1.02]"
                    >
                        {isSubmitting ? 'Sending...' : 'Get Free Quotes'}
                        {!isSubmitting && <Send className="h-5 w-5" />}
                    </Button>

                    <p className="text-[11px] text-center text-gray-400">
                        By submitting, you agree to our Terms of Use
                    </p>
                </form>
            </div>
        </Card>
    )
}

interface RelatedSearchesProps {
    currentCategory?: string
}

const relatedSearches = [
    { name: 'AC Repair & Services', count: '13563+', slug: 'ac-repair' },
    { name: 'Plumbers', count: '5229+', slug: 'plumbers' },
    { name: 'Carpenters', count: '8395+', slug: 'carpenters' },
    { name: 'Electrical Shops', count: '6403+', slug: 'electrical-shops' },
    { name: 'Electrical Contractors', count: '12055+', slug: 'contractors' },
]

export function RelatedSearches({ currentCategory }: RelatedSearchesProps) {
    return (
        <Card className="p-5 bg-white border-0 shadow-md rounded-2xl">
            <h3 className="font-bold text-gray-900 mb-4 text-base">
                People Also Search For
            </h3>
            <div className="space-y-3">
                {relatedSearches.map((item) => (
                    <div key={item.slug} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                            <Wrench className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.count} listings</p>
                        </div>
                        <Link href={`/search?category=${item.slug}`}>
                            <Button className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 h-8 px-4 rounded-lg font-bold border-0">
                                Get Best Deal
                            </Button>
                        </Link>
                    </div>
                ))}
            </div>
        </Card>
    )
}

interface LocationChipsProps {
    currentCity: string
    currentArea?: string
    onAreaSelect?: (area: string) => void
    onNearbyClick?: (location: string) => void
}

const nearbyLocations = [
    'Mira Road East',
    'Kandivali East',
    'Kandivali West',
    'Malad West',
    'Malad East',
    'Thane West',
    'Nalasopara East',
    'Vashi',
    'Borivali West',
    'Andheri West',
    'Bandra West',
    'Goregaon East',
    'Powai',
    'Dahisar',
    'Virar'
]

export function LocationChips({ currentCity, currentArea, onAreaSelect, onNearbyClick }: LocationChipsProps) {
    const [isRequestingLocation, setIsRequestingLocation] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [buttonText, setButtonText] = useState('Nearby')

    const handleUseLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser')
            return
        }

        setIsRequestingLocation(true)
        setButtonText('Locating...')

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
                    )

                    if (!response.ok) throw new Error('Failed to fetch location data')

                    const data = await response.json()
                    const address = data.address

                    // Try to pick the most relevant "area" name
                    // Priority: suburb -> neighbourhood -> residential -> village -> city_district
                    const areaName = address.suburb ||
                        address.neighbourhood ||
                        address.residential ||
                        address.village ||
                        address.city_district ||
                        address.road ||
                        "Current Location"

                    setButtonText(areaName)

                    if (onNearbyClick) {
                        onNearbyClick(areaName)
                    }
                } catch (error) {
                    console.error('Error getting location name:', error)
                    setButtonText('Nearby')
                } finally {
                    setIsRequestingLocation(false)
                }
            },
            (error) => {
                console.error('Geolocation error:', error)
                let msg = 'Unable to retrieve your location'
                setButtonText('Nearby')
                if (error.code === error.PERMISSION_DENIED) msg = 'Location permission denied'
                else if (error.code === error.POSITION_UNAVAILABLE) msg = 'Location information is unavailable'
                else if (error.code === error.TIMEOUT) msg = 'The request to get user location timed out'

                // Show user friendly error
                alert(msg)

                setIsRequestingLocation(false)
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        )
    }

    const handleAreaClick = (area: string) => {
        if (onAreaSelect) {
            onAreaSelect(area)
        }
    }

    // Filter locations based on search query
    const filteredLocations = nearbyLocations.filter(location =>
        location.toLowerCase().includes(searchQuery.toLowerCase()) &&
        location !== 'Use Precise Location'
    )

    const [suggestions, setSuggestions] = useState<{ name: string, fullAddress: string, type: string }[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)

    // Debounced search for autocomplete
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length > 2) {
                setIsSearching(true)
                try {
                    // Search primarily in Mumbai/India context
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&addressdetails=1&limit=8&countrycodes=in`
                    )
                    const data = await response.json()

                    // Extract rich location data
                    const places = data.map((item: any) => {
                        const addr = item.address
                        const primaryName = addr.suburb || addr.neighbourhood || addr.residential || addr.village || addr.city_district || item.name || ''

                        // Build full address parts
                        const addressParts = []
                        if (addr.road) addressParts.push(addr.road)
                        if (addr.suburb && addr.suburb !== primaryName) addressParts.push(addr.suburb)
                        if (addr.city || addr.town || addr.municipality) {
                            addressParts.push(addr.city || addr.town || addr.municipality)
                        }
                        if (addr.state) addressParts.push(addr.state)

                        // Determine type
                        let type = 'area'
                        if (item.type === 'railway' || item.class === 'railway') type = 'station'
                        else if (item.type === 'hospital' || item.class === 'amenity') type = 'place'
                        else if (addr.road) type = 'street'

                        return {
                            name: primaryName,
                            fullAddress: addressParts.join(', '),
                            type
                        }
                    }).filter((p: any) => p.name)

                    // Deduplicate by name
                    const seen = new Set()
                    const uniquePlaces = places.filter((p: any) => {
                        if (seen.has(p.name)) return false
                        seen.add(p.name)
                        return true
                    })

                    setSuggestions(uniquePlaces)
                    setShowSuggestions(true)
                } catch (err) {
                    console.error("Autocomplete error:", err)
                } finally {
                    setIsSearching(false)
                }
            } else {
                setSuggestions([])
                setShowSuggestions(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQuery])

    const handleSuggestionClick = (area: string) => {
        // Update search query to selected area
        setSearchQuery(area)
        // Close suggestions
        setShowSuggestions(false)
        // Trigger selection
        if (onAreaSelect) onAreaSelect(area)
    }

    return (
        <div className="relative z-30">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-[#FF5200] flex-shrink-0" />
                <span className="text-sm font-bold text-gray-700">Find Results near you</span>
            </div>

            {/* Nearby Button + Search Row */}
            <div className="flex items-center gap-2 mb-3 relative">
                {/* Nearby Button */}
                <button
                    onClick={handleUseLocation}
                    disabled={isRequestingLocation}
                    className={cn(
                        "flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap flex items-center justify-center gap-1.5 active:scale-95",
                        "bg-white border-2 border-[#FF5200] text-[#FF5200] hover:bg-[#FF5200] hover:text-white hover:shadow-md h-9",
                        isRequestingLocation && "opacity-70 cursor-wait"
                    )}
                >
                    <Navigation className={cn("h-3.5 w-3.5", isRequestingLocation && "animate-spin")} />
                    <span>{buttonText}</span>
                </button>

                {/* Search Input Container */}
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search areas (e.g. Bandra)..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            setShowSuggestions(true)
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#FF5200] focus:ring-1 focus:ring-[#FF5200]"
                    />
                    {isSearching && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="h-3 w-3 border-2 border-[#FF5200] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {/* Autocomplete Dropdown - Google Maps Style */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-80 overflow-y-auto z-50">
                            {suggestions.map((suggestion, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSuggestionClick(suggestion.name)}
                                    className="w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors border-b border-gray-50 last:border-0 flex items-start gap-3 group"
                                >
                                    {/* Location Icon */}
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 group-hover:bg-orange-100 flex items-center justify-center transition-colors">
                                        {suggestion.type === 'station' ? (
                                            <svg className="w-5 h-5 text-gray-500 group-hover:text-[#FF5200]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h4a2 2 0 002-2V7m-6 0h4m-4 0V4a1 1 0 011-1h2a1 1 0 011 1v3m-6 10v2m8-2v2" />
                                            </svg>
                                        ) : (
                                            <MapPin className="w-5 h-5 text-gray-500 group-hover:text-[#FF5200]" />
                                        )}
                                    </div>

                                    {/* Location Details */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 group-hover:text-[#FF5200] truncate">
                                            {suggestion.name}
                                        </p>
                                        {suggestion.fullAddress && (
                                            <p className="text-xs text-gray-500 truncate mt-0.5">
                                                {suggestion.fullAddress}
                                            </p>
                                        )}
                                    </div>

                                    {/* Arrow */}
                                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg className="w-4 h-4 text-[#FF5200]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </button>
                            ))}

                            {/* Footer */}
                            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-1">
                                <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                </svg>
                                <span className="text-[10px] text-gray-400">Powered by OpenStreetMap</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Area Chips - Popular / Fallback */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {nearbyLocations.map((area) => (
                    <button
                        key={area}
                        onClick={() => handleAreaClick(area)}
                        className={cn(
                            "flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap active:scale-95 cursor-pointer select-none",
                            currentArea === area
                                ? "bg-gray-900 text-white shadow-md pointer-events-none"
                                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:shadow-sm"
                        )}
                    >
                        {area}
                    </button>
                ))}
            </div>
        </div>
    )
}
