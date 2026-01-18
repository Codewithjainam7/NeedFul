'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import {
    Utensils, Building2, Stethoscope, Plane, Car, Truck,
    Home, GraduationCap, Briefcase, Film, Heart, Scissors,
    Smartphone, Zap, Tv, Ticket, LineChart, Shield, Gift,
    Hammer, ShoppingBag, Music, Palette, ChevronRight
} from 'lucide-react'
import Link from 'next/link'

const allCategories = [
    { name: 'Restaurants', slug: 'restaurants', icon: Utensils, color: 'text-orange-500', bg: 'bg-orange-50', desc: 'Find the best dining spots' },
    { name: 'Hotels', slug: 'hotels', icon: Building2, color: 'text-blue-500', bg: 'bg-blue-50', desc: 'Luxury & budget stays' },
    { name: 'Doctors', slug: 'doctors', icon: Stethoscope, color: 'text-green-500', bg: 'bg-green-50', desc: 'Specialists near you' },
    { name: 'Travel', slug: 'travel', icon: Plane, color: 'text-sky-500', bg: 'bg-sky-50', desc: 'Flights & tours' },
    { name: 'Auto Care', slug: 'auto-care', icon: Car, color: 'text-red-500', bg: 'bg-red-50', desc: 'Mechanics & washing' },
    { name: 'Movers', slug: 'movers', icon: Truck, color: 'text-amber-500', bg: 'bg-amber-50', desc: 'Packers & movers' },
    { name: 'Home Decor', slug: 'home-decor', icon: Home, color: 'text-purple-500', bg: 'bg-purple-50', desc: 'Interiors & furniture' },
    { name: 'Education', slug: 'education', icon: GraduationCap, color: 'text-indigo-500', bg: 'bg-indigo-50', desc: 'Tutors & colleges' },
    { name: 'Jobs', slug: 'jobs', icon: Briefcase, color: 'text-gray-700', bg: 'bg-gray-100', desc: 'Career opportunities' },
    { name: 'Movies', slug: 'movies', icon: Film, color: 'text-pink-500', bg: 'bg-pink-50', desc: 'Showtimes & tickets' },
    { name: 'Wedding', slug: 'wedding', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50', desc: 'Planners & venues' },
    { name: 'Salons', slug: 'salons', icon: Scissors, color: 'text-teal-500', bg: 'bg-teal-50', desc: 'Hair & beauty' },
    { name: 'Gym', slug: 'gym', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50', desc: 'Fitness centers' },
    { name: 'Loans', slug: 'loans', icon: LineChart, color: 'text-emerald-500', bg: 'bg-emerald-50', desc: 'Financial services' },
    { name: 'Insurance', slug: 'insurance', icon: Shield, color: 'text-cyan-500', bg: 'bg-cyan-50', desc: 'Life & health' },
    { name: 'Repairs', slug: 'repairs', icon: Hammer, color: 'text-orange-600', bg: 'bg-orange-50', desc: 'Home maintenance' },
    { name: 'Shopping', slug: 'shopping', icon: ShoppingBag, color: 'text-fuchsia-500', bg: 'bg-fuchsia-50', desc: 'Malls & stores' },
    { name: 'Events', slug: 'events', icon: Music, color: 'text-violet-500', bg: 'bg-violet-50', desc: 'Concerts & shows' },
    { name: 'Beauty', slug: 'beauty', icon: Palette, color: 'text-pink-600', bg: 'bg-pink-50', desc: 'Makeup & spa' },
    { name: 'Gifts', slug: 'gifts', icon: Gift, color: 'text-red-400', bg: 'bg-red-50', desc: 'Shops & florists' },
]

export default function CategoriesPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-1 bg-[#FFFBF7] relative overflow-hidden pt-28">
                {/* Background Gradients */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100/60 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

                <div className="container mx-auto px-4 pt-8 pb-16 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight relative inline-block">
                            Explore All <span className="text-[#FF5200]">Categories</span>
                            {/* Orange underline */}
                            <svg className="absolute w-full h-3 -bottom-2 left-0 text-[#FF5200]/80" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="6" fill="none" />
                            </svg>
                        </h1>
                        <p className="text-lg text-gray-600 mt-4">
                            Find trusted experts and services for every need. From daily essentials to luxury experiences.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {allCategories.map((cat, idx) => (
                            <Link
                                key={idx}
                                href={`/search?category=${cat.slug}`}
                                className="group relative bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 border border-gray-100 hover:border-orange-100 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full ${cat.bg} opacity-20 group-hover:scale-150 transition-transform duration-500 ease-out`} />

                                <div className={`inline-flex p-3 rounded-2xl ${cat.bg} ${cat.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <cat.icon className="w-8 h-8" strokeWidth={1.5} />
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#FF5200] transition-colors mb-2">
                                    {cat.name}
                                </h3>

                                <p className="text-sm text-gray-500 font-medium mb-4 line-clamp-1">
                                    {cat.desc}
                                </p>

                                <div className="flex items-center text-xs font-bold text-gray-400 group-hover:text-[#FF5200] transition-colors">
                                    <span>Browse</span>
                                    <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
