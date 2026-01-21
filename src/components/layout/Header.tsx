'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search,
    MapPin,
    Menu,
    X,
    User,
    Heart,
    LogOut,
    LayoutDashboard,
    Mic,
    Plus,
    Home,
    HelpCircle,
    LayoutGrid
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { User as SupabaseUser } from '@supabase/supabase-js'

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

const navItems = [
    { name: 'Categories', href: '/categories', icon: LayoutDashboard },
    { name: 'FAQ', href: '/faq', icon: HelpCircle },
    { name: 'About Us', href: '/about', icon: User },
    { name: 'Contact Us', href: '/contact', icon: Mic },
]

interface HeaderProps {
    user?: {
        name?: string | null
        email: string
        role?: string
    } | null
}

export function Header({ user }: HeaderProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCity, setSelectedCity] = useState('Mumbai')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null)
    const supabase = createClient()

    // Auth Modal State
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [authTab, setAuthTab] = useState<'login' | 'signup'>('login')

    useEffect(() => {
        const handleScroll = () => {
            // Trigger header search appearance after scrolling pasthero top
            setScrolled(window.scrollY > 80)
        }
        window.addEventListener('scroll', handleScroll)

        // Check initial user
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setCurrentUser(user)
        }
        checkUser()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setCurrentUser(session?.user ?? null)
        })

        return () => {
            window.removeEventListener('scroll', handleScroll)
            subscription.unsubscribe()
        }
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        setCurrentUser(null)
        router.refresh()
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}&city=${encodeURIComponent(selectedCity)}`)
        }
    }

    const isHomePage = pathname === '/'

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/95 backdrop-blur-xl border-b border-orange-100/50 shadow-md shadow-orange-500/5 py-2'
                : 'bg-gradient-to-b from-white to-white/80 backdrop-blur-md border-b border-white/20 py-4'
                }`}
        >
            {/* Ambient Orange Glow */}
            {/* Top Line - Strong Orange Gradient */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-200 via-[#FF5200] to-orange-200 z-50 shadow-[0_0_10px_rgba(255,82,0,0.5)]" />

            {/* Side Blurs - The "mixing from sides" effect */}
            <div className="absolute bottom-0 left-0 w-1/3 h-[1px] bg-gradient-to-r from-[#FF5200] to-transparent blur-[2px] opacity-70" />
            <div className="absolute bottom-0 right-0 w-1/3 h-[1px] bg-gradient-to-l from-[#FF5200] to-transparent blur-[2px] opacity-70" />

            {/* Ambient Glow */}
            <div className="absolute -top-10 left-1/4 w-96 h-20 bg-orange-500/10 blur-[60px] pointer-events-none rounded-full" />

            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Logo Section */}
                    <Link href="/" className="flex-shrink-0 relative group flex items-center gap-2">
                        <img
                            src="/brand-logo.png"
                            alt="NeedFul"
                            className={`transition-all duration-300 object-contain relative z-10 ${scrolled ? 'h-10 w-auto' : 'h-12 w-auto'
                                }`}
                        />
                    </Link>
                    {/* Navigation Links - Desktop */}
                    <nav className="hidden md:flex items-center gap-8 mx-6">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "text-sm font-medium transition-colors tracking-normal uppercase relative group",
                                        isActive
                                            ? "text-[#FF5200] font-bold"
                                            : "text-gray-700 hover:text-[#FF5200]"
                                    )}
                                >
                                    {item.name}
                                    <span className={cn(
                                        "absolute -bottom-1 left-0 w-full h-0.5 bg-[#FF5200] origin-left transition-transform duration-300",
                                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                    )}></span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Search Bar - Desktop */}
                    <div className={cn(
                        "hidden md:flex flex-1 max-w-xl mx-4 transition-all duration-500 ease-in-out transform",
                        isHomePage && !scrolled
                            ? "opacity-0 pointer-events-none translate-y-4 scale-95"
                            : "opacity-100 translate-y-0 scale-100"
                    )}>
                        <form
                            onSubmit={handleSearch}
                            className="flex items-center w-full shadow-sm hover:shadow-md transition-shadow border border-orange-100/50 rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm"
                        >
                            {/* City Selector */}
                            <div className="relative border-r border-orange-100/50">
                                <Select value={selectedCity} onValueChange={setSelectedCity}>
                                    <SelectTrigger className="w-[140px] h-12 border-0 rounded-none bg-white focus:ring-0 text-gray-800 font-bold hover:bg-orange-50 transition-colors text-sm pl-4 pr-2 focus:ring-offset-0">
                                        <MapPin className="h-4 w-4 text-[#FF5200] mr-2" fill="currentColor" fillOpacity={0.2} />
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent position="popper" className="bg-white/95 backdrop-blur-xl border-orange-100 shadow-xl rounded-2xl z-[200] p-1 min-w-[180px]">
                                        {cities.map((city) => (
                                            <SelectItem
                                                key={city.name}
                                                value={city.name}
                                                disabled={!city.available}
                                                className="text-sm font-medium cursor-pointer pl-4 py-2.5 my-0.5 rounded-lg focus:bg-orange-50 focus:text-orange-700 data-[state=checked]:bg-orange-50 data-[state=checked]:text-orange-700"
                                            >
                                                <span className="flex items-center justify-between w-full gap-4">
                                                    <span>{city.name}</span>
                                                    {!city.available && <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full tracking-wide">Soon</span>}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Search Input */}
                            <div className="relative flex-1">
                                <Input
                                    type="text"
                                    placeholder="Search for services..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-12 border-0 rounded-none focus-visible:ring-0 text-sm pl-4"
                                />
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                        </form>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                        {/* Mobile Search Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden h-9 w-9 rounded-full hover:bg-orange-50 text-gray-700 transition-all duration-200 active:scale-95"
                            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                        >
                            {mobileSearchOpen ? (
                                <X className="h-5 w-5 text-orange-600" />
                            ) : (
                                <Search className="h-5 w-5" />
                            )}
                        </Button>

                        {/* Add business Button */}
                        <Link href="/business/add" className="hidden md:block">
                            <Button
                                variant="ghost"
                                className="flex items-center gap-2 text-gray-700 hover:text-[#FF5200] hover:bg-orange-50 h-9 px-3 font-semibold text-sm transition-all duration-200 active:scale-95 mx-1"
                            >
                                <div className="bg-orange-100 p-1 rounded-full text-[#FF5200]">
                                    <Plus className="h-3 w-3" strokeWidth={3} />
                                </div>
                                <span className="hidden md:inline">Add business</span>
                            </Button>
                        </Link>

                        {currentUser ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-transparent p-0 overflow-hidden border border-orange-100 shadow-sm transition-transform active:scale-95">
                                        {currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture ? (
                                            <img
                                                src={currentUser.user_metadata.avatar_url || currentUser.user_metadata.picture}
                                                alt={currentUser.user_metadata.full_name || currentUser.email}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-100 to-amber-50 text-[#FF5200] font-bold text-lg">
                                                {currentUser.email?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-64 p-2 bg-white rounded-xl shadow-xl border border-gray-100" align="end" forceMount>
                                    <div className="flex items-center gap-3 p-3 mb-2 bg-gray-50 rounded-lg">
                                        {currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture ? (
                                            <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-200">
                                                <img
                                                    src={currentUser.user_metadata.avatar_url || currentUser.user_metadata.picture}
                                                    alt={currentUser.user_metadata.full_name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-[#FF5200] flex items-center justify-center text-white font-bold shadow-sm">
                                                {currentUser.email?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="font-semibold text-gray-900 truncate text-sm">
                                                {currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || 'User'}
                                            </span>
                                            <span className="text-xs text-gray-500 truncate">{currentUser.email}</span>
                                        </div>
                                    </div>
                                    <DropdownMenuSeparator className="bg-gray-100 my-1" />
                                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-sm font-medium p-2.5 rounded-md text-gray-700 focus:bg-orange-50 focus:text-[#FF5200] transition-colors" onClick={() => router.push('/profile')}>
                                        <User className="h-4 w-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-sm font-medium p-2.5 rounded-md text-gray-700 focus:bg-orange-50 focus:text-[#FF5200] transition-colors" onClick={() => router.push('/profile?tab=favorites')}>
                                        <Heart className="h-4 w-4" />
                                        <span>Favorites</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-gray-100 my-1" />
                                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-sm font-medium p-2.5 rounded-md text-red-600 focus:bg-red-50 focus:text-red-700 transition-colors" onClick={handleLogout}>
                                        <LogOut className="h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href="/login" className="hidden md:block">
                                <Button
                                    className="bg-[#FF5200] hover:bg-[#E04800] text-white h-9 px-6 font-semibold text-sm rounded-lg border-0 transition-all duration-200 active:scale-95 hover:shadow-md flex items-center gap-2"
                                >
                                    <User className="h-4 w-4" />
                                    Login / Sign up
                                </Button>
                            </Link>
                        )}

                        {/* Mobile Menu Toggle */}
                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden h-9 w-9 transition-all duration-200 active:scale-95"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-6 bg-gradient-to-b from-white to-orange-50">
                                <SheetHeader className="mb-8 text-left">
                                    <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                                    <div className="flex items-center gap-2">
                                        <img src="/logo.png" alt="Needful" className="h-10 w-auto object-contain" />
                                    </div>
                                </SheetHeader>

                                <div className="flex flex-col gap-8 h-full">
                                    {/* Navigation */}
                                    <nav className="flex flex-col gap-2">
                                        {[
                                            { name: 'Home', href: '/', icon: Home },
                                            ...navItems
                                        ].map((item, index) => {
                                            const isActive = pathname === item.href
                                            return (
                                                <motion.div
                                                    key={item.name}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 + (index * 0.05), duration: 0.3 }}
                                                >
                                                    <Link
                                                        href={item.href}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className={cn(
                                                            "flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all border",
                                                            isActive
                                                                ? "bg-orange-50 text-orange-600 border-orange-100 shadow-sm"
                                                                : "bg-gray-50 text-gray-900 border-transparent hover:bg-white hover:border-orange-100 hover:text-orange-600"
                                                        )}
                                                    >
                                                        <item.icon className={cn("w-5 h-5", isActive ? "text-orange-600" : "text-gray-400 group-hover:text-orange-600")} strokeWidth={isActive ? 2.5 : 2} />
                                                        {item.name}
                                                    </Link>
                                                </motion.div>
                                            )
                                        })}
                                    </nav>

                                    {/* Actions */}
                                    <div className="mt-auto flex flex-col gap-4 border-t border-gray-100 pt-8 pb-4">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4, duration: 0.3 }}
                                        >
                                            <Button asChild variant="outline" className="w-full justify-start gap-3 h-14 text-gray-800 font-bold border-gray-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 shadow-sm rounded-xl">
                                                <Link href="/business/add" onClick={() => setMobileMenuOpen(false)}>
                                                    <div className="bg-orange-100 p-1.5 rounded-full text-[#FF5200]">
                                                        <Plus className="h-4 w-4" strokeWidth={3} />
                                                    </div>
                                                    Add Business
                                                </Link>
                                            </Button>
                                        </motion.div>

                                        {!currentUser && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5, duration: 0.3 }}
                                            >
                                                <Button asChild className="w-full h-14 bg-[#FF5200] hover:bg-[#E04800] text-white font-bold text-lg shadow-xl shadow-orange-500/20 rounded-xl">
                                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                                        Login / Sign up
                                                    </Link>
                                                </Button>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Mobile Search Bar Expansion */}
                    {mobileSearchOpen && (
                        <div className="absolute top-full left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-orange-100 shadow-xl md:hidden animate-in slide-in-from-top-2 duration-200">
                            <form
                                onSubmit={(e) => {
                                    handleSearch(e)
                                    setMobileSearchOpen(false)
                                }}
                                className="flex flex-col gap-3"
                            >
                                <div className="flex items-center w-full shadow-sm border border-orange-100/50 rounded-xl overflow-hidden bg-white">
                                    {/* City Selector Mobile */}
                                    <div className="relative border-r border-orange-50">
                                        <Select value={selectedCity} onValueChange={setSelectedCity}>
                                            <SelectTrigger className="w-[110px] h-12 border-0 rounded-none bg-white focus:ring-0 text-gray-800 font-bold text-sm pl-3 pr-1">
                                                <MapPin className="h-4 w-4 text-[#FF5200] mr-1.5" />
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent position="popper" className="bg-white/95 backdrop-blur-xl border-orange-100 shadow-xl rounded-2xl z-[200] p-1 min-w-[200px]">
                                                {cities.map((city) => (
                                                    <SelectItem
                                                        key={city.name}
                                                        value={city.name}
                                                        disabled={!city.available}
                                                        className="text-sm font-medium cursor-pointer pl-4 py-2.5 my-0.5 rounded-lg focus:bg-orange-50 focus:text-orange-700 data-[state=checked]:bg-orange-50 data-[state=checked]:text-orange-700"
                                                    >
                                                        <span className="flex items-center justify-between w-full gap-4">
                                                            <span>{city.name}</span>
                                                            {!city.available && <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full tracking-wide">Soon</span>}
                                                        </span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Input
                                        type="text"
                                        placeholder="Search services..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="h-12 border-0 rounded-none focus-visible:ring-0 text-base"
                                        autoFocus
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-[#FF5200] text-white font-bold h-11 rounded-xl">
                                    Search
                                </Button>
                            </form>
                        </div>
                    )}
                </div>

            </div>
        </header>
    )
}
