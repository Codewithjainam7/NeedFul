'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Users, Target, Shield, Zap, Globe, Award } from 'lucide-react'

export default function AboutPage() {
    const stats = [
        { label: 'Active Users', value: '50k+', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Service Providers', value: '10k+', icon: Shield, color: 'text-green-500', bg: 'bg-green-50' },
        { label: 'Cities Covered', value: '20+', icon: Globe, color: 'text-orange-500', bg: 'bg-orange-50' },
        { label: 'Jobs Completed', value: '100k+', icon: Award, color: 'text-purple-500', bg: 'bg-purple-50' },
    ]

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-1 overflow-hidden pt-24">
                {/* Hero Section */}
                <section className="relative py-16 lg:py-24 bg-[#FFFBF7]">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100/60 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-600 font-bold text-xs uppercase tracking-wider mb-6">Our Story</span>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight relative inline-block">
                            Empowering <span className="text-[#FF5200]">Local Experts.</span><br />
                            Simplifying Your Life.
                            {/* Orange underline */}
                            <svg className="absolute w-full h-3 -bottom-2 left-0 text-[#FF5200]/80" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="6" fill="none" />
                            </svg>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Needful is on a mission to connect reliable service professionals with the people who need them most – instanly, securely, and seamlessly.
                        </p>
                    </div>
                </section>

                {/* Stats Grid */}
                <section className="py-12 -mt-16 relative z-20">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 text-center hover:-translate-y-1 transition-transform duration-300">
                                    <div className={`w-12 h-12 mx-auto rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                                    <div className="text-sm font-bold text-gray-400 uppercase tracking-wide">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-20 md:py-32 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
                            <div className="flex-1 w-full relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-pink-500 rounded-3xl transform rotate-3 opacity-20 blur-lg"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                                    alt="Team working"
                                    className="relative rounded-3xl shadow-2xl hover:scale-[1.02] transition-transform duration-500 w-full object-cover h-[400px]"
                                />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">Built on <span className="text-[#FF5200]">Trust & Quality</span></h2>
                                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                    We started Needful with a simple idea: it shouldn't be hard to find a good plumber, a skilled beautician, or a trusted mechanic.
                                </p>
                                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                    Today, we are building the digital infrastructure for the local service economy, helping thousands of professionals grow their business while ensuring customers get top-notch service every time.
                                </p>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-50 text-orange-700 font-bold">
                                        <Target className="w-5 h-5" />
                                        <span>Visionary</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 text-blue-700 font-bold">
                                        <Zap className="w-5 h-5" />
                                        <span>Fast</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
