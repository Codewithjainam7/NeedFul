'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { MapPin, Star, Heart, Phone, User, CheckCircle2, BadgeCheck, Loader2, Calendar, Clock, ShieldCheck, Briefcase } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import type { Provider, Category, Service } from '@/types/database'
import { toggleFavorite } from '@/app/actions/favorites'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { motion, AnimatePresence } from 'framer-motion'

interface WorkerCardProps {
    provider: Provider & {
        categories?: Category
        services?: Service[]
        provider_images?: { url: string; is_primary: boolean }[]
        experience_years?: number
    }
    jobsDone?: number
    onSave?: (providerId: string) => void
    isSaved?: boolean
    className?: string
}

export function WorkerCard({ provider, jobsDone = 0, onSave, isSaved = false, className }: WorkerCardProps) {
    const [isFavorited, setIsFavorited] = useState(isSaved)
    const [showNumber, setShowNumber] = useState(false)
    const [isBookingOpen, setIsBookingOpen] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const router = useRouter()

    const images = provider.provider_images || []
    const profileImage = images.find(img => img.is_primary) || images[0]
    const servicePrice = provider.services?.[0]?.price || 500

    const handleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const newState = !isFavorited
        setIsFavorited(newState)
        try {
            const result = await toggleFavorite(provider.id)
            if (result.error) throw new Error(result.error)
            onSave?.(provider.id)
        } catch (err: any) {
            setIsFavorited(!newState)
            toast.error(err.message || "Failed to update favorite")
        }
    }

    const handleShowNumber = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setShowNumber(true)
    }

    const handleCardClick = (e: React.MouseEvent) => {
        const selection = window.getSelection()
        if (selection && selection.toString().length > 0) return
        router.push(`/business/${provider.slug}`)
    }

    const handleBookClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsBookingOpen(true)
    }

    const confirmBooking = async () => {
        setIsProcessing(true)
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsProcessing(false)
        setIsBookingOpen(false)
        router.push('/booking/success')
    }

    return (
        <>
            <Card
                onClick={handleCardClick}
                className={cn(
                    'group bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 rounded-2xl cursor-pointer border border-slate-100 overflow-hidden relative',
                    className
                )}
            >
                <div className="p-5 relative z-10 flex flex-col gap-4 items-start">
                    {/* Header: Avatar + Info */}
                    <div className="flex w-full gap-4 items-start">
                        <div className="flex-shrink-0 relative">
                            <div className="w-16 h-16 rounded-full border-[3px] border-white shadow-md overflow-hidden bg-slate-50 relative ring-1 ring-slate-100/50">
                                {profileImage ? (
                                    <Image
                                        src={profileImage.url}
                                        alt={provider.business_name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <User className="w-8 h-8" />
                                    </div>
                                )}
                            </div>
                            {provider.is_verified && (
                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                    <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-500 text-white" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0 pt-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#FF5200] transition-colors truncate">
                                        {provider.business_name}
                                    </h3>
                                    <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                                        <span className="text-slate-900 font-semibold">{provider.categories?.name}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                                        <span className="flex items-center gap-0.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {provider.city || 'Mumbai'}</span>
                                    </p>
                                </div>
                                <button onClick={handleFavorite} className="p-2 -mr-2 -mt-2 hover:bg-slate-50 rounded-full transition-colors group/heart">
                                    <Heart className={cn("w-5 h-5 transition-transform group-hover/heart:scale-110", isFavorited ? "fill-red-500 text-red-500" : "text-slate-300")} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Trust Stats Row */}
                    <div className="w-full grid grid-cols-3 gap-2 py-3 border-y border-slate-50/80">
                        <div className="flex flex-col items-center justify-center border-r border-slate-50 last:border-0 relative overflow-hidden group/stat">
                            <div className="flex items-center gap-1.5 font-bold text-white bg-gradient-to-tr from-emerald-500 to-emerald-400 px-2.5 py-0.5 rounded-[6px] text-xs shadow-sm shadow-emerald-500/20 group-hover/stat:shadow-emerald-500/30 transition-shadow">
                                {provider.rating} <Star className="w-3 h-3 fill-white text-white" />
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1.5 font-bold tracking-wider uppercase">Rating</span>
                        </div>

                        <div className="flex flex-col items-center justify-center border-r border-slate-50 last:border-0">
                            <span className="font-bold text-slate-900 text-sm">{jobsDone > 0 ? `${jobsDone}+` : 'New'}</span>
                            <span className="text-[10px] text-slate-400 mt-1 font-bold tracking-wider uppercase">Jobs</span>
                        </div>

                        <div className="flex flex-col items-center justify-center">
                            <span className="font-bold text-slate-900 text-sm">5+ Yrs</span>
                            <span className="text-[10px] text-slate-400 mt-1 font-bold tracking-wider uppercase">Exp</span>
                        </div>
                    </div>

                    {/* Action Row */}
                    <div className="flex w-full gap-3 mt-1">
                        <Button
                            onClick={handleBookClick}
                            className="flex-1 h-10 text-sm font-bold bg-[#FF5200] hover:bg-[#E04800] text-white rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all active:scale-[0.98]"
                        >
                            Book Now
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleShowNumber}
                            className={cn(
                                "h-10 w-12 flex-shrink-0 rounded-xl border-slate-200 hover:bg-slate-50 hover:text-slate-900 text-slate-600 transition-all p-0 flex items-center justify-center hover:border-slate-300",
                                showNumber && "w-auto px-4 bg-slate-100 text-slate-900 border-slate-300"
                            )}
                        >
                            <Phone className={cn("w-4 h-4 transition-all", showNumber && "mr-2")} />
                            <span className={cn("transition-all overflow-hidden whitespace-nowrap", showNumber ? "w-auto opacity-100 inline" : "w-0 opacity-0 hidden")}>{provider.phone}</span>
                        </Button>
                    </div>

                </div>
            </Card>

            <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-white border-none shadow-2xl rounded-3xl">

                    {/* Decorative Header Background */}
                    <div className="h-32 bg-gradient-to-br from-[#FF5200] to-[#FF8142] relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute -top-8 -left-8 w-32 h-32 bg-black/5 rounded-full blur-2xl"></div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-3 right-3 text-white/80 hover:text-white hover:bg-white/20 rounded-full"
                            onClick={() => setIsBookingOpen(false)}
                        >
                            <span className="sr-only">Close</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-5 w-5"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </Button>
                    </div>

                    <div className="px-6 pb-8 -mt-12 relative z-10">
                        {/* Profile Image with Ring */}
                        <div className="flex justify-center mb-4">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                className="relative"
                            >
                                <div className="p-1.5 bg-white rounded-full shadow-lg">
                                    <div className="w-24 h-24 rounded-full bg-slate-100 overflow-hidden relative ring-1 ring-slate-100">
                                        {profileImage ? (
                                            <Image
                                                src={profileImage.url}
                                                alt={provider.business_name}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <User className="w-full h-full p-6 text-slate-300" />
                                        )}
                                    </div>
                                </div>
                                <div className="absolute bottom-1 right-1 bg-green-500 text-white p-1.5 rounded-full shadow-sm ring-2 ring-white">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                            </motion.div>
                        </div>

                        <DialogHeader className="space-y-1.5 text-center mb-6">
                            <DialogTitle className="text-2xl font-bold text-slate-900">
                                {provider.business_name}
                            </DialogTitle>
                            <div className="flex items-center justify-center gap-2 text-sm text-slate-500 font-medium">
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{provider.categories?.name}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {provider.rating}</span>
                            </div>
                        </DialogHeader>

                        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 mb-6 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#FF5200]">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Service Cost</p>
                                        <p className="text-sm font-medium text-slate-900">Standard Visit</p>
                                    </div>
                                </div>
                                <div className="text-xl font-bold text-slate-900">₹{servicePrice}</div>
                            </div>

                            <div className="h-px bg-slate-200/50 w-full" />

                            <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
                                <div className="flex items-center gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                                    <span>Verified Provider</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                                    <span>Fast Response</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full h-14 text-lg font-bold rounded-2xl bg-[#FF5200] hover:bg-[#E04800] text-white shadow-xl shadow-orange-500/20 active:scale-[0.98] transition-all"
                            onClick={confirmBooking}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Confirming...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span>Confirm Booking</span>
                                    <span className="bg-white/20 px-2 py-0.5 rounded text-sm">₹{servicePrice}</span>
                                </div>
                            )}
                        </Button>

                        <p className="text-xs text-center text-slate-400 mt-4 px-4 font-medium leading-relaxed">
                            By booking, you agree to our Terms of Service. Payment will be collected after service.
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
