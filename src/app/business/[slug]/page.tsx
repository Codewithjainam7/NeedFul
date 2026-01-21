'use client'


import { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BusinessHeader } from '@/components/business/BusinessHeader'
import { PhotoGallery } from '@/components/business/PhotoGallery'
import { BusinessTabs } from '@/components/business/BusinessTabs'
import { StickyActionBar } from '@/components/business/StickyActionBar'
import { EnquiryForm } from '@/components/listing/SidebarWidgets'
import { BusinessMapWrapper } from '@/components/business/BusinessMapWrapper'
import { AnalyticsTracker } from '@/components/business/AnalyticsTracker'
import { createClient } from '@/lib/supabase/client'
import { Provider, Category, Service } from '@/types/database'
import { Loader2 } from 'lucide-react'

type ProviderWithDetails = Provider & {
    categories: Category
    services: Service[]
    provider_images: { url: string; is_primary: boolean }[]
    latitude?: number
    longitude?: number
}

import { BookingModal } from '@/components/business/BookingModal'

export default function BusinessDetailPage() {
    const params = useParams()
    const slug = params.slug as string
    const [provider, setProvider] = useState<ProviderWithDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [isBookingOpen, setIsBookingOpen] = useState(false)

    useEffect(() => {
        if (!slug) return

        async function fetchProvider() {
            setLoading(true)
            const supabase = createClient()

            // We need to fetch the category to get the slug for relations if needed,
            // but just joining is enough.
            const { data, error } = await supabase
                .from('providers')
                .select(`
                    *,
                    categories:categories(*),
                    provider_images:provider_images(*)
                `)
                .eq('slug', slug)
                .single()

            if (error || !data) {
                console.error('Error fetching provider:', error)
                // In a real app we might redirect to 404 here
            } else {
                // Manually map the data to match expected shape if necessary
                const providerData = data as any // Type assertion to bypass strict inference issues temporarily

                const formattedData: ProviderWithDetails = {
                    ...providerData,
                    // If your SQL relation returns array for one-to-many, it's fine.
                    // Map provider_images to 'images' for the gallery component if it expects that key
                    // Note: 'images' is not in ProviderWithDetails type but might be used by components expecting it
                    // We'll stick to the type definition for now, or extend it if needed.
                    categories: providerData.categories,
                    services: providerData.services,
                    provider_images: providerData.provider_images || []
                }
                setProvider(formattedData)
            }
            setLoading(false)
        }

        fetchProvider()
    }, [slug])

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!provider) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <h1 className="text-2xl font-bold mb-2">Business Not Found</h1>
                    <p className="text-gray-500">The business you are looking for does not exist or has been removed.</p>
                </div>
                <Footer />
            </div>
        )
    }

    // Map provider data to the shape expected by components (if they differ from DB)
    // PhotoGallery expects "images" array with "url" property.
    const galleryImages = provider.provider_images?.map(img => ({ url: img.url })) || []

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <AnalyticsTracker providerId={provider.id} />

            <main className="container mx-auto px-4 pt-20 pb-12 max-w-7xl">
                {/* 1. Header Section */}
                <BusinessHeader provider={provider} />

                {/* 2. Photo Gallery */}
                <div className="my-6">
                    <PhotoGallery images={galleryImages} />
                </div>

                <div className="flex flex-col lg:flex-row gap-8 mt-8">
                    {/* 3. Main Content (Left Column) */}
                    <div className="flex-1 min-w-0">
                        <BusinessTabs provider={provider} />
                    </div>

                    {/* 4. Sidebar (Right Column) - Sticky on Desktop */}
                    <div className="w-full lg:w-[350px] space-y-6">
                        <div className="sticky top-24">
                            <div className="bg-white border border-orange-200 rounded-xl shadow-sm p-4 mb-6 hidden md:block border-orange-100">
                                <h3 className="font-bold text-gray-900 mb-2">Contact Business</h3>
                                <p className="text-sm text-gray-600 mb-4">Get the best deal by contacting the business directly.</p>
                                <div className="space-y-3">
                                    <button className="w-full bg-[#FF5200] hover:bg-[#E04800] text-white font-bold h-10 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                        Show Number
                                    </button>
                                    <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-10 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                        WhatsApp
                                    </button>
                                    <button
                                        onClick={() => setIsBookingOpen(true)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        Check Availability
                                    </button>
                                </div>
                            </div>

                            <EnquiryForm />

                            <div className="mt-6">
                                <BusinessMapWrapper
                                    lat={provider.latitude || 19.0760}
                                    lng={provider.longitude || 72.8777}
                                    businessName={provider.business_name}
                                    address={`${provider.address}, ${provider.city}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <StickyActionBar provider={provider} onBook={() => setIsBookingOpen(true)} />
            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                businessName={provider.business_name}
            />
            <Footer />
        </div>
    )
}
