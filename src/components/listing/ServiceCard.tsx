'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { MapPin, Star, MoreHorizontal, CheckCircle, Heart, Phone, Send, PhoneCall, ImageIcon, Zap, Edit, Trash2, BarChart3, MessageCircle, PlusCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RatingBadge } from '@/components/shared/RatingStars'
import { TrustBadge, AvailabilityBadge } from '@/components/shared/TrustBadge'
import { ContactButtons } from '@/components/shared/ContactButtons'
import { EnquireModal } from '@/components/shared/EnquireModal'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import type { Provider, Category, Service } from '@/types/database'
import { toggleFavorite } from '@/app/actions/favorites'
import { deleteBusiness } from '@/app/actions/business'
import { trackAnalyticsEvent } from '@/app/actions/analytics'
import { toast } from 'sonner'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { StoryCreator } from '@/components/business/StoryCreator'

interface ServiceCardProps {
    provider: Provider & {
        categories?: Category
        services?: Service[]
        provider_images?: { url: string; is_primary: boolean }[]
    }
    onSave?: (providerId: string) => void
    isSaved?: boolean
    isOwner?: boolean
    className?: string
}

export function ServiceCard({ provider, onSave, isSaved = false, isOwner = false, className }: ServiceCardProps) {
    const [isEnquireModalOpen, setIsEnquireModalOpen] = useState(false)
    const [showNumber, setShowNumber] = useState(false)
    const [isFavorited, setIsFavorited] = useState(isSaved)
    const [isStoryOpen, setIsStoryOpen] = useState(false)

    const images = provider.provider_images || []
    const sortedImages = [...images].sort((a, b) => (Number(b.is_primary) - Number(a.is_primary)))
    const displayImages = sortedImages.slice(0, 4)

    const handleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        // Optimistic update
        const newState = !isFavorited
        setIsFavorited(newState)

        try {
            const result = await toggleFavorite(provider.id)
            if (result.error) {
                toast.error(result.error)
                setIsFavorited(!newState) // Revert
            } else if (typeof result.isFavorited === 'boolean') {
                setIsFavorited(result.isFavorited)
                if (result.isFavorited) {
                    toast.success("Added to favorites")
                } else {
                    toast.info("Removed from favorites")
                }
            }
            // Still call onSave if parent provided it (for list management etc)
            onSave?.(provider.id)
        } catch (err: any) {
            setIsFavorited(!newState)
            toast.error(err.message || "Failed to update favorite")
        }
    }

    const handleWhatsApp = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!provider.phone) {
            toast.error("No phone number available")
            return
        }

        // Track analytics
        trackAnalyticsEvent(provider.id, 'whatsapp_click').catch(console.error)


        // Clean number (remove spaces, dashes, etc)
        const cleanNumber = provider.phone.replace(/\D/g, '')
        // Default to adding 91 if roughly 10 digits
        const finalNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber

        window.open(`https://wa.me/${finalNumber}`, '_blank')
    }

    const handleShowNumber = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        // Track analytics on first click only
        if (!showNumber) {
            trackAnalyticsEvent(provider.id, 'phone_click').catch(console.error)
        }

        setShowNumber(true)
    }

    const router = useRouter()

    const handleCardClick = (e: React.MouseEvent) => {
        // Prevent navigation if text is selected
        const selection = window.getSelection()
        if (selection && selection.toString().length > 0) return

        router.push(`/business/${provider.slug}`)
    }

    return (
        <Card
            onClick={handleCardClick}
            className={cn(
                'group overflow-hidden bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] relative rounded-xl cursor-pointer border border-gray-100',
                className
            )}>
            <div className="flex flex-col md:flex-row gap-4 p-4">
                {/* Image Section - Adjusted width for 2-col layout */}
                <div className="flex-shrink-0 w-full md:w-[220px] lg:w-[240px] flex flex-col gap-2">
                    <Link href={`/business/${provider.slug}`} className="relative block group/image">
                        <div className="relative w-full aspect-video md:h-32 rounded-lg overflow-hidden bg-gray-100 border border-gray-100 shadow-sm">
                            {sortedImages.length > 0 ? (
                                <Image
                                    src={sortedImages[0].url}
                                    alt={provider.business_name}
                                    fill
                                    unoptimized
                                    className="object-cover transition-transform duration-500 group-hover/image:scale-105"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-gray-400 bg-gray-50">
                                    <ImageIcon className="w-8 h-8 opacity-50" />
                                </div>
                            )}
                            {/* Rating Overlay Mobile */}
                            <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-1.5 py-0.5 rounded text-xs font-bold text-gray-900 shadow-sm flex items-center gap-1 z-10 md:hidden">
                                {provider.rating} <Star className="w-3 h-3 fill-[#FFCE00] text-[#FFCE00]" />
                            </div>
                        </div>
                    </Link>

                    {/* Thumbnails */}
                    <div className="hidden md:grid grid-cols-3 gap-2">
                        {[...Array(3)].map((_, idx) => {
                            const img = sortedImages[idx + 1];
                            return (
                                <div key={idx} className="relative aspect-square rounded-md overflow-hidden bg-gray-50 border border-gray-100">
                                    {img ? (
                                        <Image
                                            src={img.url}
                                            alt={`${provider.business_name} ${idx + 2}`}
                                            fill
                                            unoptimized
                                            className="object-cover hover:opacity-90 transition-opacity"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <ImageIcon className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between items-start gap-2">
                        <Link href={`/business/${provider.slug}`} className="flex-1 min-w-0 cursor-pointer">
                            <h3 className="font-bold text-lg md:text-xl leading-tight text-gray-900 group-hover:text-[#FF5200] transition-colors truncate group-hover:animate-marquee group-hover:overflow-visible">
                                {provider.business_name}
                            </h3>
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 font-medium">
                                {provider.categories?.name && (
                                    <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full border border-orange-100">
                                        {provider.categories.name}
                                    </span>
                                )}
                                {provider.city && (
                                    <>
                                        <span className="text-gray-300">•</span>
                                        <span className="truncate flex items-center gap-0.5">
                                            <MapPin className="w-3 h-3" /> {provider.city}
                                        </span>
                                    </>
                                )}
                            </div>
                        </Link>

                        {/* Heart Button */}
                        <button
                            onClick={handleFavorite}
                            className="flex-shrink-0 p-2 hover:bg-gray-50 rounded-full transition-all active:scale-95"
                        >
                            <Heart className={cn(
                                "h-5 w-5 transition-colors",
                                isFavorited ? "fill-[#FF5200] text-[#FF5200]" : "text-gray-300 hover:text-gray-500"
                            )} />
                        </button>
                    </div>

                    {/* Trust Signals & Response Time */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] mt-2 mb-2">
                        <div className="flex items-center gap-1 bg-green-600 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                            {provider.rating} <Star className="w-3 h-3 fill-current" />
                        </div>
                        <span className="text-gray-500">{provider.review_count} reviews</span>
                        <span className="text-gray-300 hidden md:inline">•</span>
                        <span className="text-gray-400 hidden md:inline">Since 2018</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] mb-3">
                        {provider.is_responsive && (
                            <span className="inline-flex items-center gap-1 text-[#FF5200] bg-orange-50 px-2 py-0.5 rounded-md font-medium border border-orange-100/50">
                                <Zap className="w-3 h-3" /> Responds in 15 mins
                            </span>
                        )}
                        <span className="text-gray-400 truncate max-w-[200px] flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {provider.address || `${provider.city}, India`}
                        </span>
                    </div>


                    {/* Action Buttons - Flex Layout */}
                    <div className="flex items-center gap-2 mt-auto pt-3 w-full">
                        {isEnquireModalOpen ? (
                            null
                        ) : null}

                        {/* Owner Actions */}
                        {isOwner ? (
                            <>
                                <Button
                                    className="flex-1 bg-[#FF5200] hover:bg-[#E04800] text-white font-bold h-9 text-xs px-2 rounded-lg shadow-sm whitespace-nowrap transition-transform active:scale-[0.98]"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        router.push(`/business/edit/${provider.id}`)
                                    }}
                                >
                                    <Edit className="w-3.5 h-3.5 mr-1.5" />
                                    Edit
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-9 flex-shrink-0 border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100 font-semibold h-9 text-xs px-0 rounded-lg flex items-center justify-center transition-all active:scale-[0.98]"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setIsStoryOpen(true)
                                    }}
                                    title="Create Story"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-9 flex-shrink-0 border-gray-200 text-gray-700 bg-white hover:bg-gray-50 font-semibold h-9 text-xs px-0 rounded-lg flex items-center justify-center transition-all active:scale-[0.98]"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        router.push(`/business/analytics/${provider.id}`)
                                    }}
                                    title="Analytics"
                                >
                                    <BarChart3 className="w-4 h-4" />
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-9 flex-shrink-0 border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 font-semibold h-9 text-xs px-0 rounded-lg flex items-center justify-center transition-all active:scale-[0.98]"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        router.push(`/business/enquiries/${provider.id}`)
                                    }}
                                    title="Enquiries"
                                >
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={(e) => e.stopPropagation()}
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Business?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your business listing and all associated data.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-red-500 hover:bg-red-600"
                                                onClick={async (e) => {
                                                    e.stopPropagation()
                                                    try {
                                                        const result = await deleteBusiness(provider.id)
                                                        if (result.error) {
                                                            toast.error(result.error)
                                                        } else {
                                                            toast.success('Business deleted successfully')
                                                        }
                                                    } catch (error) {
                                                        toast.error('An unexpected error occurred')
                                                    }
                                                }}
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </>
                        ) : (
                            /* Consumer Actions */
                            <>
                                <Button className="flex-1 bg-[#FF5200] hover:bg-[#E04800] text-white font-bold h-9 text-xs px-1 rounded-lg shadow-sm whitespace-nowrap transition-transform active:scale-[0.98]"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setIsEnquireModalOpen(true)
                                    }}
                                >
                                    Enquire Now
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={handleShowNumber}
                                    title="Call Now"
                                    className={cn(
                                        "w-9 flex-shrink-0 border-gray-200 text-gray-700 bg-white hover:bg-gray-50 font-semibold h-9 text-xs px-0 rounded-lg flex items-center justify-center transition-all active:scale-[0.98]",
                                        showNumber && "bg-gray-50 border-gray-300 text-gray-900"
                                    )}
                                >
                                    <Phone className="w-4 h-4" />
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={handleWhatsApp}
                                    title="Chat on WhatsApp"
                                    className="w-9 flex-shrink-0 border-green-200 text-green-700 bg-white hover:bg-green-50 font-semibold h-9 text-xs px-0 rounded-lg flex items-center justify-center transition-all active:scale-[0.98]"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                </Button>
                            </>
                        )}
                    </div>

                </div>
            </div>

            <EnquireModal
                isOpen={isEnquireModalOpen}
                onClose={() => setIsEnquireModalOpen(false)}
                businessName={provider.business_name}
                providerId={provider.id}
            />

            {isStoryOpen && (
                <StoryCreator
                    providerId={provider.id}
                    providerName={provider.business_name}
                    onClose={() => setIsStoryOpen(false)}
                    onSuccess={() => setIsStoryOpen(false)}
                />
            )}
        </Card >
    )
}

// Skeleton loader for the card
export function ServiceCardSkeleton() {
    return (
        <Card className="overflow-hidden bg-card border border-border">
            <div className="flex gap-4 p-4">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-lg bg-gray-200 animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="flex gap-2">
                        <div className="h-5 bg-gray-200 rounded w-16 animate-pulse" />
                        <div className="h-5 bg-gray-200 rounded w-20 animate-pulse" />
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                    <div className="flex gap-2 pt-2">
                        <div className="h-9 bg-gray-200 rounded w-28 animate-pulse" />
                        <div className="h-9 bg-gray-200 rounded w-24 animate-pulse" />
                    </div>
                </div>
            </div>
        </Card>
    )
}
