'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Utensils, Scissors, Hammer, Sparkles, Bug, Truck, Camera, LucideIcon } from 'lucide-react'

interface Banner {
    title: string;
    subtitle: string;
    gradient: string;
    image: string;
    cta: string;
    link: string;
    icon: LucideIcon;
}

const banners: Banner[] = [
    {
        title: "Order Food Online",
        subtitle: "Up to 60% OFF on Top Restaurants",
        gradient: "from-orange-600/90 via-orange-600/60 to-transparent",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600",
        cta: "Order Now",
        link: "/search?category=restaurants",
        icon: Utensils
    },
    {
        title: "Spa & Beauty",
        subtitle: "Luxury Salons & Home Services",
        gradient: "from-pink-600/90 via-pink-600/60 to-transparent",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600",
        cta: "Book Appointment",
        link: "/search?category=salons",
        icon: Scissors
    },
    {
        title: "Home Repairs",
        subtitle: "Expert Plumbers, Electricians & More",
        gradient: "from-blue-600/90 via-blue-600/60 to-transparent",
        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=600",
        cta: "Find Experts",
        link: "/search?category=repairs",
        icon: Hammer
    },
    {
        title: "Home Cleaning",
        subtitle: "Deep Cleaning & Disinfection Services",
        gradient: "from-teal-600/90 via-teal-600/60 to-transparent",
        image: "/assets/home-cleaning.png",
        cta: "Book Now",
        link: "/search?category=cleaning",
        icon: Sparkles
    },
    {
        title: "Pest Control",
        subtitle: "Protect Your Home from Pests",
        gradient: "from-purple-600/90 via-purple-600/60 to-transparent",
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600", // Darker aesthetic room (better contrast with purple)
        cta: "Get Safe",
        link: "/search?category=pest-control",
        icon: Bug
    },
    {
        title: "Packers & Movers",
        subtitle: "Hassle-free Relocation Support",
        gradient: "from-indigo-600/90 via-indigo-600/60 to-transparent",
        image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80&w=600", // Moving boxes
        cta: "Move Easy",
        link: "/search?category=movers",
        icon: Truck
    },
    {
        title: "Professional Photography",
        subtitle: "Capture Your Best Moments",
        gradient: "from-rose-600/90 via-rose-600/60 to-transparent",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600", // Camera
        cta: "Book Shoots",
        link: "/search?category=photography",
        icon: Camera
    }
]

export function PromoBanners() {
    return (
        <section className="py-10 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex overflow-x-auto pb-12 gap-6 scrollbar-hide snap-x pt-4">
                    {banners.map((banner, idx) => (
                        <Link
                            key={idx}
                            href={banner.link}
                            className="relative flex-shrink-0 w-[85vw] md:w-[480px] h-[300px] rounded-[32px] overflow-hidden snap-center group cursor-pointer shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-500 ease-out"
                        >
                            {/* Full Background Image */}
                            <Image
                                src={banner.image}
                                alt={banner.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Gradient Overlay for Translucency */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient} z-10`} />

                            {/* Decorative Glass Reflection */}
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none z-20 opacity-30" />

                            {/* Content */}
                            <div className="relative z-30 h-full flex flex-col justify-between p-8 text-white w-full md:w-[70%]">
                                <div className="flex flex-col gap-4">
                                    {/* Category Icon */}
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/20 shadow-sm">
                                        <banner.icon className="w-6 h-6 text-white" strokeWidth={2} />
                                    </div>

                                    {/* Title & Subtitle */}
                                    <div>
                                        <h3 className="text-4xl font-extrabold leading-[1.1] tracking-tight mb-2 text-white drop-shadow-sm max-w-[280px]">
                                            {banner.title}
                                        </h3>
                                        <p className="text-white/90 text-sm font-medium line-clamp-2 leading-relaxed tracking-wide opacity-95">
                                            {banner.subtitle}
                                        </p>
                                    </div>
                                </div>

                                <button className="self-start px-8 py-3.5 bg-white/20 backdrop-blur-xl border border-white/40 text-white rounded-full text-sm font-bold flex items-center gap-2 group-hover:bg-white group-hover:text-black transition-all duration-300 shadow-md">
                                    {banner.cta}
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
