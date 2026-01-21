'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Phone, MapPin, Loader2, ArrowRight, User, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { AnimatedBackgroundLight, ParticleBackground } from '@/components/auth/AnimatedBackground'
import Link from 'next/link'
import { motion } from 'framer-motion'

const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'
]

export default function CompleteProfilePage() {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [checkingAuth, setCheckingAuth] = useState(true)
    const [user, setUser] = useState<any>(null)

    const [formData, setFormData] = useState({
        accountType: 'user',
        businessName: '',
        name: '',
        phone: '',
        city: ''
    })

    useEffect(() => {
        setMounted(true)
        checkUser()
    }, [])

    const checkUser = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            router.push('/login')
            return
        }

        setUser(user)

        // Pre-fill name from Google if available
        if (user.user_metadata?.full_name) {
            setFormData(prev => ({ ...prev, name: user.user_metadata.full_name }))
        } else if (user.user_metadata?.name) {
            setFormData(prev => ({ ...prev, name: user.user_metadata.name }))
        }

        // Check if profile is already complete
        if (user.user_metadata?.phone && user.user_metadata?.city) {
            router.push('/')
            return
        }

        setCheckingAuth(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.phone || !formData.city) {
            toast.error('Please fill in all fields')
            return
        }

        setLoading(true)

        const supabase = createClient()
        const { error } = await supabase.auth.updateUser({
            data: {
                name: formData.name,
                phone: formData.phone,
                city: formData.city,
                profile_completed: true,
                business_name: formData.accountType === 'business' ? formData.businessName : undefined,
                account_type: formData.accountType
            }
        })

        if (error) {
            toast.error(error.message)
            setLoading(false)
            return
        }

        toast.success('Profile completed!')
        router.push('/')
    }

    if (checkingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
            <AnimatedBackgroundLight />
            <ParticleBackground />

            <div className={`relative z-10 w-full max-w-md transform transition-all duration-700 ${mounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                {/* Form Card */}
                <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl shadow-orange-100/30 border border-white/60">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
                            <span className="text-white font-bold text-2xl">N</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Complete Your Profile</h2>
                        <p className="text-gray-500 mt-1 text-sm">
                            Add your details to get personalized recommendations
                        </p>
                    </div>

                    {/* User Info */}
                    {user?.email && (
                        <div className="bg-gray-50 rounded-xl p-3 mb-6 flex items-center gap-3">
                            {user.user_metadata?.avatar_url ? (
                                <img
                                    src={user.user_metadata.avatar_url}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                    <User className="w-5 h-5 text-orange-500" />
                                </div>
                            )}
                            <div>
                                <p className="font-medium text-gray-900 text-sm">{formData.name || 'User'}</p>
                                <p className="text-gray-500 text-xs">{user.email}</p>
                            </div>
                        </div>
                    )}

                    {/* Account Type Toggle */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-gray-100 p-1 rounded-full flex relative w-64">
                            <motion.div
                                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm"
                                initial={false}
                                animate={{
                                    x: formData.accountType === 'user' ? 0 : '100%'
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, accountType: 'user' })}
                                className={`flex-1 relative z-10 text-sm font-semibold py-2 rounded-full transition-colors duration-200 ${formData.accountType === 'user' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                User
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, accountType: 'business' })}
                                className={`flex-1 relative z-10 text-sm font-semibold py-2 rounded-full transition-colors duration-200 ${formData.accountType === 'business' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Business
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Business Name (Conditionally Rendered) */}
                        {formData.accountType === 'business' && (
                            <div>
                                <Label htmlFor="businessName" className="text-gray-700 font-semibold text-sm">Business Name</Label>
                                <div className="relative mt-1">
                                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="businessName"
                                        type="text"
                                        placeholder="Awesome Service Co."
                                        value={formData.businessName}
                                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                        className="pl-10 h-11 bg-gray-50/50 border-2 border-gray-100 text-gray-900 placeholder:text-gray-400 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <Label htmlFor="name" className="text-gray-700 font-semibold text-sm">Full Name</Label>
                            <div className="relative mt-1">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Your name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="pl-10 h-11 bg-gray-50/50 border-2 border-gray-100 text-gray-900 placeholder:text-gray-400 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="phone" className="text-gray-700 font-semibold text-sm">Phone Number</Label>
                            <div className="relative mt-1">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="9876543210"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="pl-10 h-11 bg-gray-50/50 border-2 border-gray-100 text-gray-900 placeholder:text-gray-400 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <Label className="text-gray-700 font-semibold text-sm">City</Label>
                            <Select
                                value={formData.city}
                                onValueChange={(value) => setFormData({ ...formData, city: value })}
                            >
                                <SelectTrigger className="mt-1 h-11 bg-gray-50/50 border-2 border-gray-100 text-gray-900 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-100 w-full">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        <SelectValue placeholder="Select your city" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="bg-white border-gray-200 rounded-xl">
                                    {cities.map((city) => (
                                        <SelectItem key={city} value={city} className="hover:bg-orange-50 rounded-lg">
                                            {city}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 hover:from-orange-600 hover:via-orange-600 hover:to-amber-600 text-white font-bold text-base rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 group mt-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    Complete {formData.accountType === 'business' ? 'Business ' : ''}Profile
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Skip link */}
                    <div className="text-center mt-4">
                        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                            Skip for now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
