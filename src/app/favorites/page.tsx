import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Heart } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ServiceCard } from '@/components/listing/ServiceCard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'

// Define the expected shape of favorites data
interface FavoriteWithProvider {
    id: string
    created_at: string
    providers: {
        id: string
        business_name: string
        slug: string
        description: string | null
        address: string | null
        city: string
        phone: string | null
        whatsapp: string | null
        is_verified: boolean
        is_responsive: boolean
        is_available: boolean
        operating_hours: string | null
        rating: number
        review_count: number
        category_id: string
        categories: { id: string; name: string; slug: string; icon: string; display_order: number } | null
        services: Array<{ id: string; title: string; description: string | null; price: number | null; price_unit: string | null }>
        provider_images: Array<{ id: string; url: string; is_primary: boolean }>
    } | null
}

export default async function FavoritesPage() {
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login?redirectTo=/favorites')
    }

    // Get user data
    const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

    // Get favorites with provider details
    const { data: rawFavorites } = await supabase
        .from('favorites')
        .select(`
      id,
      created_at,
      providers (
        id,
        business_name,
        slug,
        description,
        address,
        city,
        phone,
        whatsapp,
        is_verified,
        is_responsive,
        is_available,
        operating_hours,
        rating,
        review_count,
        category_id,
        categories (id, name, slug, icon, display_order),
        services (id, title, description, price, price_unit),
        provider_images (id, url, is_primary)
      )
    `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    // Cast to our expected type
    const favorites = rawFavorites as unknown as FavoriteWithProvider[] | null

    // Extract providers from favorites
    const favoriteProviders = favorites
        ?.filter(f => f.providers !== null)
        .map(f => f.providers!) || []

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header user={userData} />

            <main className="flex-1 bg-[#FFFBF7] py-20 lg:py-32 relative overflow-hidden">
                {/* Background Gradient Blobs */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100/60 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

                <div className="container mx-auto px-4 py-8 relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                My Favorites
                            </h1>
                            <p className="text-gray-600">
                                {favoriteProviders.length} saved service provider{favoriteProviders.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>

                    {favoriteProviders.length > 0 ? (
                        <div className="space-y-4">
                            {favoriteProviders.map((provider) => (
                                <ServiceCard
                                    key={provider.id}
                                    provider={provider as any}
                                    isSaved={true}
                                />
                            ))}
                        </div>
                    ) : (
                        <Card className="max-w-md mx-auto text-center py-12">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="h-8 w-8 text-red-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No favorites yet
                            </h3>
                            <p className="text-gray-500 mb-6 px-4">
                                Save service providers you like to easily find them later.
                            </p>
                            <Link href="/search">
                                <Button className="bg-primary hover:bg-primary/90 w-fit px-6">
                                    Explore Services
                                </Button>
                            </Link>
                        </Card>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
