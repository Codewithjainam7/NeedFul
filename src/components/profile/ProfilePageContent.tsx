'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ServiceCard } from '@/components/listing/ServiceCard'
import { User, LogOut, Heart, Settings, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { ProviderWithDetails } from '@/types/database'

interface ProfilePageContentProps {
    favorites: ProviderWithDetails[]
    user: any // Supabase user object
}

export function ProfilePageContent({ favorites: initialFavorites, user }: ProfilePageContentProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Determine default tab from URL
    const defaultTab = searchParams.get('tab') === 'favorites' ? 'favorites' : 'profile'

    const [favorites, setFavorites] = useState<ProviderWithDetails[]>(initialFavorites)
    const [isLoading, setIsLoading] = useState(false)

    // Profile form state
    const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '')
    const [phone, setPhone] = useState(user?.user_metadata?.phone || '')
    const [city, setCity] = useState(user?.user_metadata?.city || 'Mumbai')
    const [isSaving, setIsSaving] = useState(false)

    // Handle profile save
    const handleSaveProfile = async () => {
        setIsSaving(true)
        try {
            const supabase = createClient()
            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: fullName,
                    phone: phone,
                    city: city
                }
            })

            if (error) throw error

            toast.success('Profile updated successfully!')
            router.refresh()
        } catch (error: any) {
            console.error('Error updating profile:', error)
            toast.error(error.message || 'Failed to update profile')
        } finally {
            setIsSaving(false)
        }
    }

    // Handle logout
    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.refresh()
        router.push('/')
        toast.success('Logged out successfully')
    }

    // Handle unfavorite
    const handleUnfavorite = (providerId: string) => {
        // Optimistically remove from list
        setFavorites(prev => prev.filter(p => p.id !== providerId))
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-1 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-white to-amber-50/30" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-200/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-amber-100/20 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

                {/* Grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,82,0,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,82,0,0.03) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px'
                    }}
                />

                <div className="container mx-auto px-4 pt-32 pb-8 relative z-10">
                    <div className="flex flex-col md:flex-row gap-8 items-start">

                        {/* Sidebar / User Card */}
                        <div className="w-full md:w-80 flex-shrink-0 space-y-6">
                            <Card className="border-0 shadow-xl shadow-orange-100/50 overflow-hidden bg-white rounded-3xl">
                                {/* Header gradient with patterns */}
                                <div className="bg-gradient-to-br from-[#FF5200] via-orange-500 to-amber-500 h-32 relative">
                                    {/* Decorative patterns */}
                                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white_0%,transparent_50%)]"></div>
                                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_80%,white_0%,transparent_40%)]"></div>

                                    {/* Animated avatar container */}
                                    <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
                                        {/* Animated ring */}
                                        <div className="relative">
                                            <div
                                                className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#FF5200] via-amber-400 to-[#FF5200] opacity-75"
                                                style={{ animation: 'spin 4s linear infinite' }}
                                            />
                                            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#FF5200] via-amber-400 to-[#FF5200] opacity-50 blur-md" />

                                            {/* Avatar */}
                                            <div className="relative w-28 h-28 rounded-full bg-white p-1 shadow-2xl">
                                                <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-50 to-white flex items-center justify-center overflow-hidden ring-4 ring-white">
                                                    {user?.user_metadata?.avatar_url ? (
                                                        <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="h-12 w-12 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* User info */}
                                <div className="pt-20 pb-8 px-6 text-center">
                                    <h1 className="font-bold text-2xl text-gray-900 mb-1">
                                        {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                                    </h1>
                                    <p className="text-sm text-gray-500 mb-4">{user?.email}</p>

                                    {/* Stats row */}
                                    <div className="flex justify-center gap-6 pt-4 border-t border-gray-100">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-[#FF5200]">{favorites.length}</p>
                                            <p className="text-xs text-gray-500">Favorites</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-gray-900">0</p>
                                            <p className="text-xs text-gray-500">Reviews</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <div className="bg-white rounded-2xl shadow-lg shadow-gray-100/50 border border-gray-100 overflow-hidden">
                                <div className="text-sm font-medium">
                                    <button
                                        onClick={() => router.push('/profile?tab=profile')}
                                        className={`w-full text-left px-5 py-4 flex items-center gap-4 transition-all cursor-pointer ${defaultTab === 'profile' ? 'text-[#FF5200] bg-orange-50 border-l-4 border-[#FF5200]' : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'}`}
                                    >
                                        <div className={`p-2 rounded-lg ${defaultTab === 'profile' ? 'bg-orange-100' : 'bg-gray-100'}`}>
                                            <User className={`h-4 w-4 ${defaultTab === 'profile' ? 'text-[#FF5200]' : 'text-gray-500'}`} />
                                        </div>
                                        Personal Information
                                    </button>
                                    <button
                                        onClick={() => router.push('/profile?tab=favorites')}
                                        className={`w-full text-left px-5 py-4 flex items-center gap-4 transition-all cursor-pointer ${defaultTab === 'favorites' ? 'text-[#FF5200] bg-orange-50 border-l-4 border-[#FF5200]' : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'}`}
                                    >
                                        <div className={`p-2 rounded-lg ${defaultTab === 'favorites' ? 'bg-orange-100' : 'bg-gray-100'}`}>
                                            <Heart className={`h-4 w-4 ${defaultTab === 'favorites' ? 'text-[#FF5200]' : 'text-gray-500'}`} />
                                        </div>
                                        My Favorites
                                    </button>
                                    <button
                                        onClick={() => toast.info('Account Settings coming soon!')}
                                        className="w-full text-left px-5 py-4 flex items-center gap-4 text-gray-700 hover:bg-gray-50 transition-all border-l-4 border-transparent cursor-pointer"
                                    >
                                        <div className="p-2 rounded-lg bg-gray-100">
                                            <Settings className="h-4 w-4 text-gray-500" />
                                        </div>
                                        Account Settings
                                    </button>
                                    <button
                                        onClick={() => toast.info('Privacy & Security settings coming soon!')}
                                        className="w-full text-left px-5 py-4 flex items-center gap-4 text-gray-700 hover:bg-gray-50 transition-all border-l-4 border-transparent cursor-pointer"
                                    >
                                        <div className="p-2 rounded-lg bg-gray-100">
                                            <Shield className="h-4 w-4 text-gray-500" />
                                        </div>
                                        Privacy & Security
                                    </button>
                                </div>
                                <div className="h-px bg-gray-100"></div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-5 py-4 flex items-center gap-4 text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                                >
                                    <div className="p-2 rounded-lg bg-red-50">
                                        <LogOut className="h-4 w-4 text-red-500" />
                                    </div>
                                    Log Out
                                </button>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                            <Tabs value={defaultTab} className="w-full" onValueChange={(val) => router.push(`/profile?tab=${val}`)}>
                                <TabsContent value="profile" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <SectionHeading subtitle="Manage your personal details and preferences.">
                                        Personal Information
                                    </SectionHeading>
                                    <Card className="border-0 shadow-lg shadow-gray-100/50 bg-white rounded-2xl">
                                        <CardContent className="space-y-6 pt-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Full Name</Label>
                                                    <Input
                                                        id="name"
                                                        value={fullName}
                                                        onChange={(e) => setFullName(e.target.value)}
                                                        placeholder="Rahul Sharma"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
                                                    <Input id="email" defaultValue={user?.email || ''} disabled readOnly className="bg-gray-100 cursor-not-allowed opacity-70" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">Phone Number</Label>
                                                    <Input
                                                        id="phone"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        placeholder="+91 98765 43210"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="city" className="text-sm font-semibold text-gray-700">City</Label>
                                                    <Input
                                                        id="city"
                                                        value={city}
                                                        onChange={(e) => setCity(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="pt-4 flex justify-end border-t border-gray-100">
                                                <Button
                                                    onClick={handleSaveProfile}
                                                    disabled={isSaving}
                                                    className="bg-[#FF5200] hover:bg-[#E04800] text-white px-8 h-11 font-semibold shadow-lg shadow-orange-500/20 disabled:opacity-50"
                                                >
                                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="favorites" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <SectionHeading subtitle="Manage your saved service providers.">
                                        My Favorites
                                    </SectionHeading>

                                    {favorites.length > 0 ? (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            {favorites.map(provider => (
                                                <ServiceCard
                                                    key={provider.id}
                                                    provider={provider}
                                                    isSaved={true}
                                                    // Optional: Pass a callback if we want to remove it when toggled off
                                                    // For now, ServiceCard toggles state internally. 
                                                    // If we want it to vanish:
                                                    onSave={() => handleUnfavorite(provider.id)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <Card className="border-0 shadow-sm py-16 text-center">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Heart className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">No favorites yet</h3>
                                            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                                                Start exploring services and click the heart icon to save them here for quick access.
                                            </p>
                                            <Button
                                                onClick={() => router.push('/search')}
                                                className="bg-[#FF5200] hover:bg-[#E04800] text-white px-8"
                                            >
                                                Explore Services
                                            </Button>
                                        </Card>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
