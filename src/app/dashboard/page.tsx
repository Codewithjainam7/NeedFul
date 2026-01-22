import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
    LayoutDashboard,
    Settings,
    Eye,
    Star,
    Phone,
    MapPin,
    Clock,
    CheckCircle,
    Edit,
    Image as ImageIcon,
    ToggleLeft,
    ToggleRight,
    TrendingUp
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { StoryCreatorButton } from '@/components/business/StoryCreatorButton'

interface ProviderData {
    id: string
    business_name: string
    slug: string
    description: string | null
    address: string | null
    city: string
    phone: string | null
    is_verified: boolean
    is_available: boolean
    operating_hours: string | null
    rating: number
    review_count: number
    views: number
    categories: { name: string } | null
}

export default async function DashboardPage() {
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login?redirectTo=/dashboard')
    }

    // Get user data
    const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

    // Get provider data if exists
    const { data: rawProviderData } = await supabase
        .from('providers')
        .select(`
      id,
      business_name,
      slug,
      description,
      address,
      city,
      phone,
      is_verified,
      is_available,
      operating_hours,
      rating,
      review_count,
      views,
      categories (name)
    `)
        .eq('user_id', user.id)
        .single()

    const providerData = rawProviderData as ProviderData | null
    const hasProvider = !!providerData

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header user={userData} />

            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Provider Dashboard
                            </h1>
                            <p className="text-gray-600">
                                Manage your business listing and profile
                            </p>
                        </div>
                        {hasProvider && providerData && (
                            <Link href={`/provider/${providerData.slug}`}>
                                <Button variant="outline" className="gap-2">
                                    <Eye className="h-4 w-4" />
                                    View Public Profile
                                </Button>
                            </Link>
                        )}
                    </div>

                    {hasProvider && providerData ? (
                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Stats Cards */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        Profile Views
                                    </CardTitle>
                                    <Eye className="h-4 w-4 text-gray-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{providerData.views?.toLocaleString() || 0}</div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        <TrendingUp className="inline h-3 w-3 text-green-500 mr-1" />
                                        +12% from last month
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        Rating
                                    </CardTitle>
                                    <Star className="h-4 w-4 text-yellow-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{providerData.rating?.toFixed(1) || '0.0'}</div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {providerData.review_count || 0} reviews
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        Availability
                                    </CardTitle>
                                    {providerData.is_available ? (
                                        <ToggleRight className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <ToggleLeft className="h-5 w-5 text-gray-400" />
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {providerData.is_available ? (
                                            <span className="text-green-600">Open</span>
                                        ) : (
                                            <span className="text-red-600">Closed</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {providerData.operating_hours || 'Hours not set'}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Profile Card */}
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>{providerData.business_name}</CardTitle>
                                            <CardDescription className="flex items-center gap-2 mt-1">
                                                <Badge variant="outline">{providerData.categories?.name || 'Uncategorized'}</Badge>
                                                {providerData.is_verified && (
                                                    <Badge className="bg-blue-100 text-blue-700">
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Verified
                                                    </Badge>
                                                )}
                                            </CardDescription>
                                        </div>
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Edit className="h-4 w-4" />
                                            Edit Profile
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <MapPin className="h-5 w-5 text-red-500" />
                                            <span>{providerData.address || 'Address not set'}, {providerData.city}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Phone className="h-5 w-5 text-green-600" />
                                            <span>{providerData.phone || 'Not set'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Clock className="h-5 w-5 text-blue-600" />
                                            <span>{providerData.operating_hours || 'Not set'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <ImageIcon className="h-5 w-5 text-purple-600" />
                                            <span>0 photos</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                                        <p className="text-gray-600 text-sm">
                                            {providerData.description || 'No description added yet.'}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <StoryCreatorButton
                                        providerId={providerData.id}
                                        providerName={providerData.business_name}
                                    />
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <Edit className="h-4 w-4" />
                                        Edit Profile
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <ImageIcon className="h-4 w-4" />
                                        Manage Photos
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <Settings className="h-4 w-4" />
                                        Update Services
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className={`w-full justify-start gap-2 ${providerData.is_available ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                                    >
                                        {providerData.is_available ? (
                                            <>
                                                <ToggleLeft className="h-4 w-4" />
                                                Mark as Closed
                                            </>
                                        ) : (
                                            <>
                                                <ToggleRight className="h-4 w-4" />
                                                Mark as Open
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <Card className="max-w-2xl mx-auto text-center">
                            <CardHeader>
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <LayoutDashboard className="h-8 w-8 text-primary" />
                                </div>
                                <CardTitle className="text-2xl">List Your Business</CardTitle>
                                <CardDescription>
                                    Create a free business listing to reach thousands of customers.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid sm:grid-cols-3 gap-4 text-center">
                                    <div className="p-4">
                                        <div className="text-3xl font-bold text-primary mb-1">Free</div>
                                        <p className="text-sm text-gray-500">Business listing</p>
                                    </div>
                                    <div className="p-4">
                                        <div className="text-3xl font-bold text-primary mb-1">50K+</div>
                                        <p className="text-sm text-gray-500">Daily visitors</p>
                                    </div>
                                    <div className="p-4">
                                        <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                                        <p className="text-sm text-gray-500">Visibility</p>
                                    </div>
                                </div>
                                <Button size="lg" className="bg-primary hover:bg-primary/90">
                                    Create Your Listing
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
