'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Sparkles, Zap, Hammer, Paintbrush, Scissors, Wrench, Palette, Pin, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { motion } from 'framer-motion'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

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

const rotatingWords = ["Perfect Pro", "Reliable Plumber", "Expert Electrician", "Top Chef", "Skilled Painter"];

interface SearchSuggestion {
    id: string
    business_name: string
    slug: string
    category_name?: string
}

export function HeroSearch() {
    useScrollReveal()
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCity, setSelectedCity] = useState('Mumbai')
    const [wordIndex, setWordIndex] = useState(0)
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % rotatingWords.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Debounced search for suggestions
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.trim().length < 4) {
                setSuggestions([])
                setShowSuggestions(false)
                return
            }

            setIsLoadingSuggestions(true)
            const supabase = createClient()

            try {
                const { data, error } = await supabase
                    .from('providers')
                    .select(`
                        id,
                        business_name,
                        slug,
                        categories:categories(name)
                    `)
                    .ilike('business_name', `%${searchQuery}%`)
                    .limit(6)

                if (!error && data) {
                    const formattedSuggestions = data.map((item: any) => ({
                        id: item.id,
                        business_name: item.business_name,
                        slug: item.slug,
                        category_name: item.categories?.name || 'Service'
                    }))
                    setSuggestions(formattedSuggestions)
                    setShowSuggestions(true)
                }
            } catch (error) {
                console.error('Error fetching suggestions:', error)
            } finally {
                setIsLoadingSuggestions(false)
            }
        }

        const debounceTimer = setTimeout(() => {
            fetchSuggestions()
        }, 300) // 300ms debounce

        return () => clearTimeout(debounceTimer)
    }, [searchQuery])

    // Click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}&city=${encodeURIComponent(selectedCity)}`)
        } else {
            router.push(`/search?city=${encodeURIComponent(selectedCity)}`)
        }
        setShowSuggestions(false)
    }

    const handleSuggestionClick = (slug: string) => {
        router.push(`/business/${slug}`)
        setShowSuggestions(false)
    }

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const { clientX, clientY, currentTarget } = e;
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;
        setMousePosition({ x, y });
    };

    const handleMouseLeave = () => {
        setMousePosition({ x: 0, y: 0 });
    };

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <section
            className="relative w-full min-h-[90vh] bg-[#FFFBF7] overflow-hidden flex items-center pt-20 lg:pt-0"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-orange-100/60 via-orange-200/40 to-amber-100/20 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 will-change-transform" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-orange-50/50 via-amber-50/30 to-blue-50/20 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/3 will-change-transform" />

            {/* Additional 3D Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[5%] w-16 h-16 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-2xl blur-sm animate-bounce-slow transform rotate-12" />
                <div className="absolute bottom-[30%] right-[10%] w-24 h-24 border border-orange-200/40 rounded-full animate-spin-reverse-slow opacity-60" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Left Content: Text & Search */}
                    <div className="flex-1 w-full max-w-2xl text-center lg:text-left pt-10 lg:pt-0">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600 font-bold text-xs tracking-wider mb-8 uppercase animate-fade-in">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                            </span>
                            #1 Local Service Platform
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight">
                            Find the <span className="relative inline-block text-[#FF5200]">
                                <span key={wordIndex} className="animate-fade-in-up inline-block">
                                    {rotatingWords[wordIndex]}
                                </span>
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-orange-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                                </svg>
                            </span> <br />
                            Near You.
                        </h1>

                        <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Connect with verified experts for home repairs, lifestyle services, and more. Instant booking, zero hassle.
                        </p>

                        {/* Search Bar with Autocomplete */}
                        <form onSubmit={handleSearch} className="relative">
                            <motion.div
                                className="bg-white p-3 rounded-2xl shadow-xl shadow-orange-500/5 border border-gray-100 flex flex-col md:flex-row items-center gap-3 max-w-2xl mx-auto lg:mx-0 transform transition-transform will-change-transform"
                                style={{
                                    rotateX: mousePosition.y * 5,
                                    rotateY: mousePosition.x * -5,
                                    perspective: 1000
                                }}
                                whileHover={{ scale: 1.01 }}
                                transition={{ type: 'spring', stiffness: 150, damping: 25 }}
                            >
                                <div className="relative w-full md:w-48">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                                        <MapPin className="text-orange-500 w-5 h-5" />
                                    </div>
                                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                                        <SelectTrigger className="w-full h-12 pl-14 bg-gray-50 border-transparent hover:bg-white focus:ring-0 text-sm font-bold text-gray-700 rounded-xl transition-colors">
                                            <SelectValue placeholder="Select City" />
                                        </SelectTrigger>
                                        <SelectContent position="popper" className="bg-white max-h-[200px] z-[200] p-1">
                                            {cities.map((city) => (
                                                <SelectItem key={city.name} value={city.name} disabled={!city.available} className="text-sm font-medium cursor-pointer pl-4 py-2.5 my-0.5 rounded-lg focus:bg-orange-50 focus:text-orange-700">
                                                    {city.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="h-px md:h-8 w-full md:w-px bg-gray-200 my-2 md:my-0" />
                                <div ref={searchRef} className="relative flex-1 w-full">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => searchQuery.length >= 4 && suggestions.length > 0 && setShowSuggestions(true)}
                                        placeholder="What do you need help with?"
                                        className="w-full h-12 pl-16 pr-4 bg-transparent text-gray-900 placeholder-gray-400 font-medium text-base outline-none relative z-10"
                                    />
                                    {isLoadingSuggestions && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                                            <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                                        </div>
                                    )}
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full md:w-auto px-8 h-12 bg-[#FF5200] hover:bg-[#ff6a22] text-white font-bold text-base rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                                >
                                    Search
                                </Button>
                            </motion.div>

                            {/* Suggestions Dropdown - Outside motion.div for proper positioning */}
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute top-[calc(100%+0.5rem)] left-0 right-0 bg-white border-2 border-orange-200 rounded-2xl shadow-2xl shadow-orange-500/20 z-[100] overflow-hidden max-h-[400px] overflow-y-auto mx-auto max-w-2xl lg:mx-0">
                                    <div className="p-2">
                                        {suggestions.map((suggestion, index) => (
                                            <button
                                                key={suggestion.id}
                                                type="button"
                                                onClick={() => handleSuggestionClick(suggestion.slug)}
                                                className={cn(
                                                    "w-full px-4 py-3.5 text-left hover:bg-orange-50 transition-colors flex items-center justify-between group rounded-xl",
                                                    index !== suggestions.length - 1 && "border-b border-gray-100"
                                                )}
                                            >
                                                <div className="flex-1">
                                                    <div className="font-bold text-gray-900 group-hover:text-[#FF5200] transition-colors text-base">
                                                        {suggestion.business_name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 mt-0.5">
                                                        {suggestion.category_name}
                                                    </div>
                                                </div>
                                                <div className="ml-4 w-8 h-8 rounded-lg bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center transition-colors">
                                                    <Search className="w-4 h-4 text-[#FF5200]" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    {searchQuery.length >= 4 && (
                                        <div className="border-t-2 border-gray-100 px-4 py-3 bg-gray-50 text-center">
                                            <span className="text-xs text-gray-500 font-medium">
                                                Showing {suggestions.length} result{suggestions.length !== 1 ? 's' : ''} for "{searchQuery}"
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </form>

                    </div>

                    {/* Right Content: Advanced Orbital Animation with Parallax */}
                    <div className="flex-1 w-full relative h-[400px] md:h-[600px] hidden md:flex items-center justify-center perspective-[1000px]">
                        <div
                            className="relative w-[300px] md:w-[600px] h-[300px] md:h-[600px] flex items-center justify-center transform-style-3d transition-transform duration-200 ease-out will-change-transform"
                            style={{
                                transform: `rotateX(${mousePosition.y * 8}deg) rotateY(${mousePosition.x * -8}deg)`
                            }}
                        >

                            {/* Center Core */}
                            <div className="relative z-20 w-24 h-24 md:w-32 md:h-32 bg-white rounded-full shadow-[0_0_50px_-12px_rgba(0,0,0,0.12)] flex items-center justify-center animate-pulse-slow">
                                <div className="absolute inset-2 border border-orange-50 rounded-full animate-ping-slow" />
                                <img src="/logo.png" alt="Needful" className="w-14 h-14 md:w-16 md:h-16 object-contain" />
                            </div>

                            {/* Orbital Rings Background */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="absolute w-[300px] h-[300px] rounded-full border border-gray-100/60" />
                                <div className="absolute w-[450px] h-[450px] rounded-full border border-gray-100/50" />
                                <div className="absolute w-[600px] h-[600px] rounded-full border border-gray-100/40" />
                            </div>

                            {/* Ring 1 - Inner  */}
                            <div className="absolute w-[300px] h-[300px] rounded-full animate-spin-slow" style={{ animationDuration: '30s' }}>
                                <div className="absolute top-[18%] right-[12%] bg-white/90 backdrop-blur-sm border border-orange-100 px-3 py-1.5 rounded-full shadow-[0_8px_30px_rgba(255,82,0,0.15)] flex items-center gap-2 animate-counter-spin" style={{ animationDuration: '30s' }}>
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-bold text-gray-700 whitespace-nowrap">Verified Pros</span>
                                </div>
                                <div className="absolute bottom-[20%] left-[10%] bg-white/90 backdrop-blur-sm border border-orange-100 p-1 rounded-full shadow-[0_8px_30px_rgba(255,82,0,0.15)] animate-counter-spin" style={{ animationDuration: '30s' }}>
                                    <img src="https://i.pravatar.cc/100?img=12" className="w-9 h-9 rounded-full object-cover" alt="User" />
                                </div>
                                <div className="absolute top-[20%] left-[10%] bg-white/90 backdrop-blur-sm border border-orange-100 p-2.5 rounded-2xl shadow-[0_8px_30px_rgba(255,82,0,0.15)] animate-counter-spin" style={{ animationDuration: '30s' }}>
                                    <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                                        <Zap className="w-5 h-5 fill-current" />
                                    </div>
                                </div>
                            </div>

                            {/* Ring 2 - Middle */}
                            <div className="absolute w-[450px] h-[450px] rounded-full animate-spin-reverse-slow" style={{ animationDuration: '40s' }}>
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-orange-100 p-2.5 rounded-2xl shadow-[0_8px_30px_rgba(255,82,0,0.15)] flex gap-3 pr-5 animate-counter-spin-reverse" style={{ animationDuration: '40s' }}>
                                    <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500">
                                        <Scissors className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <div className="text-xs font-bold text-gray-900 leading-tight">Salon</div>
                                        <div className="text-[10px] text-gray-500 leading-tight">At Home</div>
                                    </div>
                                </div>
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-orange-100 p-2.5 rounded-2xl shadow-[0_8px_30px_rgba(255,82,0,0.15)] animate-counter-spin-reverse" style={{ animationDuration: '40s' }}>
                                    <div className="w-8 h-8 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                                        <Hammer className="w-5 h-5 fill-current" />
                                    </div>
                                </div>
                                <div className="absolute top-1/2 -right-4 -translate-y-1/2 bg-white/90 backdrop-blur-sm border border-orange-100 p-2.5 rounded-2xl shadow-[0_8px_30px_rgba(255,82,0,0.15)] animate-counter-spin-reverse" style={{ animationDuration: '40s' }}>
                                    <div className="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
                                        <Pin className="w-5 h-5 fill-current" />
                                    </div>
                                </div>
                            </div>

                            {/* Ring 3 - Outer */}
                            <div className="absolute w-[600px] h-[600px] rounded-full animate-spin-slow" style={{ animationDuration: '50s' }}>
                                <div className="absolute bottom-[18%] right-[14%] bg-white/90 backdrop-blur-sm border border-orange-100 p-2.5 rounded-2xl shadow-[0_8px_30px_rgba(255,82,0,0.15)] flex gap-3 pr-5 animate-counter-spin" style={{ animationDuration: '50s' }}>
                                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-500">
                                        <Wrench className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <div className="text-xs font-bold text-gray-900 leading-tight">Plumber</div>
                                        <div className="text-[10px] text-gray-500 leading-tight">Expert</div>
                                    </div>
                                </div>
                                <div className="absolute top-1/2 -left-4 -translate-y-1/2 bg-white/90 backdrop-blur-sm border border-orange-100 p-2.5 rounded-2xl shadow-[0_8px_30px_rgba(255,82,0,0.15)] flex items-center justify-center animate-counter-spin" style={{ animationDuration: '50s' }}>
                                    <div className="w-8 h-8 flex items-center justify-center text-orange-500 bg-orange-50 rounded-xl">
                                        <Palette className="w-5 h-5 fill-current" />
                                    </div>
                                </div>
                            </div>

                            {/* Ring 4 - Ultra Outer */}
                            <div className="absolute w-[750px] h-[750px] rounded-full animate-spin-reverse-slow opacity-60 pointer-events-none" style={{ animationDuration: '70s' }}>
                                <div className="absolute top-[10%] left-[20%] w-4 h-4 bg-orange-400 rounded-full blur-[2px]" />
                                <div className="absolute bottom-[10%] right-[20%] w-6 h-6 border-2 border-blue-400 rounded-md rotate-45" />
                                <div className="absolute top-[50%] right-[5%] w-3 h-3 bg-green-400 rounded-full" />
                            </div>

                            {/* 3D Floating Icons */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-[-50px] right-[20%] animate-bounce-slow">
                                    <Sparkles className="w-8 h-8 text-yellow-400 drop-shadow-lg" />
                                </div>
                                <div className="absolute bottom-[-20px] left-[20%] animate-bounce-slow" style={{ animationDelay: '1s' }}>
                                    <div className="w-6 h-6 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-md rotate-12 shadow-lg" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
