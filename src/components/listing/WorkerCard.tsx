'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { MapPin, Star, Heart, Phone, Zap, Briefcase, User, CheckCircle2 } from 'lucide-react'
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
        } catch (err) {
            setIsFavorited(!newState)
            toast.error("Failed to update favorite")
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
                'group bg-white shadow-sm hover:shadow-md transition-all duration-300 rounded-xl cursor-pointer border border-gray-100 overflow-hidden relative',
                className
            )}
        >
            {/* Top Pattern / Banner Effect (Optional, subtle background) */}
            <div className="h-16 bg-gradient-to-r from-orange-50 to-orange-100/50 absolute top-0 w-full z-0" />

            <div className="p-4 relative z-10 flex flex-col md:flex-row gap-4 items-start md:items-center">

                {/* Profile Avatar Section */}
                <div className="flex-shrink-0 mx-auto md:mx-0 relative">
                    <div className="w-24 h-24 md:w-20 md:h-20 rounded-full border-4 border-white shadow-sm overflow-hidden bg-gray-100 relative">
                        {profileImage ? (
                            <Image
                                src={profileImage.url}
                                alt={provider.business_name}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <User className="w-10 h-10" />
                            </div>
                        )}
                    </div>
                    {/* Verified Badge Absolute */}
                    {provider.is_verified && (
                        <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow-sm">
                            <CheckCircle2 className="w-5 h-5 text-blue-500 fill-white" />
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0 text-center md:text-left w-full">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#FF5200] transition-colors truncate">
                                {provider.business_name}
                            </h3>
                            <p className="text-xs text-gray-500 font-medium mb-2 flex items-center justify-center md:justify-start gap-1">
                                {provider.categories?.name}
                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                <MapPin className="w-3 h-3" /> {provider.city || 'Mumbai'}
                            </p>
                        </div>

                        {/* Favorite Pulse */}
                        <button onClick={handleFavorite} className="absolute top-4 right-4 md:static md:p-1 hover:bg-gray-50 rounded-full transition-colors">
                            <Heart className={cn("w-5 h-5", isFavorited ? "fill-red-500 text-red-500" : "text-gray-300")} />
                        </button>
                    </div>

                    {/* Trust Stats Row */}
                    <div className="flex items-center justify-center md:justify-start gap-4 my-3 text-xs">
                        <div className="flex flex-col items-center md:items-start group/stat">
                            <div className="flex items-center gap-1 font-bold text-gray-800 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                {provider.rating} <Star className="w-3 h-3 fill-green-600 text-green-600" />
                            </div>
                            <span className="text-[10px] text-gray-400 mt-0.5">Rating</span>
                        </div>

                        <div className="w-px h-6 bg-gray-100" />

                        <div className="flex flex-col items-center md:items-start">
                            <span className="font-bold text-gray-800">{jobsDone > 0 ? `${jobsDone}+` : 'New'}</span>
                            <span className="text-[10px] text-gray-400 mt-0.5">Jobs Done</span>
                        </div>

                        <div className="w-px h-6 bg-gray-100" />

                        <div className="flex flex-col items-center md:items-start">
                            <span className="font-bold text-gray-800">{provider.experience_years || 2}+ Yrs</span>
                            <span className="text-[10px] text-gray-400 mt-0.5">Experience</span>
                        </div>
                    </div>

                    {/* Action Row */}
                    <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                        <Button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            className="h-8 text-xs font-bold bg-[#FF5200] hover:bg-[#E04800] rounded-full px-5"
                        >
                            Book Now
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleShowNumber}
                            className={cn(
                                "h-8 text-xs font-semibold rounded-full border-gray-200 px-4",
                                showNumber && "bg-gray-50 text-gray-900"
                            )}
                        >
                            <Phone className="w-3 h-3 mr-1.5" />
                            {showNumber ? provider.phone : 'Call'}
                        </Button>
                    </div>

                </div>
            </div>
        </Card>
    )
}
