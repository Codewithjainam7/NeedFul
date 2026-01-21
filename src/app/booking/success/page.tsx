"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Home, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AdminPageTransition } from '@/components/admin/AdminPageTransition'

export default function BookingSuccessPage() {
    const router = useRouter()
    const [showContent, setShowContent] = useState(false)

    useEffect(() => {
        // Trigger entrance animation
        const timer = setTimeout(() => setShowContent(true), 100)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className={`max-w-md w-full border-none shadow-xl bg-white/80 backdrop-blur-xl transition-all duration-1000 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="p-8 flex flex-col items-center justify-center text-center space-y-6">

                    {/* Success Icon Animation */}
                    <div className="relative">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                            <CheckCircle2 className="w-12 h-12 text-green-600 drop-shadow-sm" />
                        </div>
                        <div className="absolute inset-0 border-4 border-green-200 rounded-full animate-ping opacity-25"></div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Booking Confirmed!</h1>
                        <p className="text-slate-500 font-medium">
                            Your appointment has been successfully scheduled.
                        </p>
                    </div>

                    <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">Order ID</span>
                            <span className="font-mono font-semibold text-slate-700">#BK-{Math.floor(100000 + Math.random() * 900000)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">Status</span>
                            <span className="text-green-600 font-semibold bg-green-100 px-2 py-0.5 rounded-full text-xs">Confirmed</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full pt-2">
                        <Button variant="outline" className="w-full rounded-xl h-11 border-slate-200 hover:bg-slate-50 hover:text-slate-900" asChild>
                            <Link href="/">
                                <Home className="w-4 h-4 mr-2" />
                                Home
                            </Link>
                        </Button>
                        <Button className="w-full rounded-xl h-11 bg-[#FF5200] hover:bg-[#E04800] text-white shadow-lg shadow-orange-500/20" asChild>
                            <Link href="/admin/dashboard">
                                <Calendar className="w-4 h-4 mr-2" />
                                My Bookings
                            </Link>
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
