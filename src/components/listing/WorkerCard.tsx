'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { MapPin, Star, Heart, Phone, Zap, Briefcase, User, CheckCircle2, BadgeCheck } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import type { Provider, Category, Service } from '@/types/database'
import { toggleFavorite } from '@/app/actions/favorites'
import { toast } from 'sonner'

interface WorkerCardProps {
    provider: Provider & {
        categories?: Category
        services?: Service[]
        provider_images?: { url: string; is_primary: boolean }[]
        experience_years?: number
    }
    jobsDone?: number // New prop for job count
    onSave?: (providerId: string) => void
    isSaved?: boolean
    className?: string
}

export function WorkerCard({ provider, jobsDone = 0, onSave, isSaved = false, className }: WorkerCardProps) {
    const [isFavorited, setIsFavorited] = useState(isSaved)
    const [showNumber, setShowNumber] = useState(false)

    const images = provider.provider_images || []
    // Find primary or use first
    const profileImage = images.find(img => img.is_primary) || images[0]

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
            // Show the actual error message from the server
            toast.error(err.message || "Failed to update favorite")
        }
    }

    const handleShowNumber = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setShowNumber(true)
    }

    const router = useRouter()
    const handleCardClick = (e: React.MouseEvent) => {
        const selection = window.getSelection()
        if (selection && selection.toString().length > 0) return
        router.push(`/business/${provider.slug}`)
    }

    return (
        <Card
            onClick={handleCardClick}
            className={cn(
                'group bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 rounded-2xl cursor-pointer border border-gray-100 overflow-hidden relative',
                className
            )}
        >
            <div className="p-5 relative z-10 flex flex-col gap-4 items-start">

                {/* Header: Avatar + Info */}
                <div className="flex w-full gap-4 items-start">
                    <div className="flex-shrink-0 relative">
                        <div className="w-16 h-16 rounded-full border-[3px] border-white shadow-md overflow-hidden bg-gray-50 relative ring-1 ring-gray-100">
                            {profileImage ? (
                                <Image
                                    src={profileImage.url}
                                    alt={provider.business_name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    unoptimized
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <User className="w-8 h-8" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 min-w-0 pt-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#FF5200] transition-colors truncate flex items-center gap-1.5">
                                    {provider.business_name}
                                    {provider.is_verified && (
                                        <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-500 text-white" />
                                    )}
                                </h3>
                                <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5 mt-1">
                                    <span className="text-gray-900 font-semibold">{provider.categories?.name}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                    <span className="flex items-center gap-0.5"><MapPin className="w-3.5 h-3.5 text-gray-400" /> {provider.city || 'Mumbai'}</span>
                                </p>
                            </div>
                            <button onClick={handleFavorite} className="p-2 -mr-2 -mt-2 hover:bg-red-50 rounded-full transition-colors group/heart">
                                <Heart className={cn("w-5 h-5 transition-transform group-hover/heart:scale-110", isFavorited ? "fill-red-500 text-red-500" : "text-gray-300")} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Trust Stats Row - Full Width */}
                <div className="w-full grid grid-cols-3 gap-2 py-3 border-y border-gray-50">
                    <div className="flex flex-col items-center justify-center border-r border-gray-50 last:border-0">
                        <div className="flex items-center gap-1.5 font-bold text-white bg-[#0F9D58] px-2.5 py-0.5 rounded-[6px] text-xs shadow-sm">
                            {provider.rating} <Star className="w-3 h-3 fill-white text-white" />
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1.5 font-medium tracking-wide uppercase">Rating</span>
                    </div>

                    <div className="flex flex-col items-center justify-center border-r border-gray-50 last:border-0">
                        <span className="font-bold text-gray-900 text-sm">{jobsDone > 0 ? `${jobsDone}+` : 'New'}</span>
                        <span className="text-[10px] text-gray-400 mt-1 font-medium tracking-wide uppercase">Jobs</span>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <span className="font-bold text-gray-900 text-sm">5+ Yrs</span>
                        <span className="text-[10px] text-gray-400 mt-1 font-medium tracking-wide uppercase">Exp</span>
                    </div>
                </div>

                {/* Action Row */}
                <div className="flex w-full gap-3 mt-1">
                    <Button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        className="flex-1 h-10 text-sm font-bold bg-[#FF5200] hover:bg-[#E04800] text-white rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
                    >
                        Book Now
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleShowNumber}
                        className={cn(
                            "h-10 w-12 flex-shrink-0 rounded-xl border-gray-200 hover:bg-gray-50 hover:text-gray-900 text-gray-700 transition-all p-0 flex items-center justify-center",
                            showNumber && "w-auto px-4 bg-gray-100 text-gray-900 border-gray-300"
                        )}
                    >
                        <Phone className={cn("w-4 h-4", showNumber && "mr-2")} />
                        {showNumber && provider.phone}
                    </Button>
                </div>

            </div>
        </Card>
    )
}
