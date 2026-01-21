'use client'

import {
    Wrench, Zap, Hammer, Paintbrush, SprayCan,
    Scissors, Search, Truck, Shirt, Armchair
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { SectionHeading } from '@/components/ui/SectionHeading'

const serviceProviders = [
    { name: 'Plumber', slug: 'plumbers', icon: Wrench, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Electrician', slug: 'electricians', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { name: 'Carpenter', slug: 'carpenters', icon: Hammer, color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'Painter', slug: 'painters', icon: Paintbrush, color: 'text-orange-500', bg: 'bg-orange-50' },
    { name: 'Pest Control', slug: 'pest-control', icon: SprayCan, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'AC Repair', slug: 'ac-repair', icon: Armchair, color: 'text-cyan-500', bg: 'bg-cyan-50' }, // Using Armchair as placeholder for AC/Appliance if specific icon missing, or just rely on generic
    { name: 'Cleaning', slug: 'cleaning', icon: Shirt, color: 'text-teal-500', bg: 'bg-teal-50' },
    { name: 'Movers', slug: 'movers', icon: Truck, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { name: 'Salon', slug: 'salon', icon: Scissors, color: 'text-pink-500', bg: 'bg-pink-50' },
    { name: 'More', slug: '', icon: Search, color: 'text-gray-500', bg: 'bg-gray-50' },
]

export function ServiceProviders() {
    return (
        <section className="py-12 bg-white relative z-10">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <SectionHeading className="mb-0">
                        Home Services
                    </SectionHeading>
                    <Link href="/search" className="text-sm font-bold text-[#FF5200] hover:underline">
                        View All
                    </Link>
                </div>

                <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-4">
                    {serviceProviders.map((service, idx) => (
                        <Link
                            key={idx}
                            href={service.slug ? `/search?category=${service.slug}` : '/search'}
                            className="flex flex-col items-center gap-3 group cursor-pointer"
                        >
                            <motion.div
                                whileHover={{
                                    y: -8,
                                    scale: 1.05,
                                    rotateX: 10,
                                    boxShadow: "0px 10px 20px rgba(0,0,0,0.1)"
                                }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className={`w-16 h-16 rounded-2xl ${service.bg} border border-transparent group-hover:border-gray-200 flex items-center justify-center relative overflow-hidden`}
                            >
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                                <service.icon className={`w-7 h-7 ${service.color} transition-transform group-hover:scale-110`} strokeWidth={2} />
                            </motion.div>
                            <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wide group-hover:text-[#FF5200] transition-colors text-center w-full truncate px-1">
                                {service.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
