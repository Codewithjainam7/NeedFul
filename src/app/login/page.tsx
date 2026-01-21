'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowRight, Zap, Shield, Sparkles, Scissors, Wrench, Palette, Hammer, Target, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Suspense } from 'react'
import { motion } from 'framer-motion'

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get('redirectTo') || '/'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [focusedField, setFocusedField] = useState<string | null>(null)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const { clientX, clientY, currentTarget } = e
        const { left, top, width, height } = currentTarget.getBoundingClientRect()
        const x = (clientX - left) / width - 0.5
        const y = (clientY - top) / height - 0.5
        setMousePosition({ x, y })
    }

    const handleMouseLeave = () => {
        setMousePosition({ x: 0, y: 0 })
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const supabase = createClient()
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            toast.error(error.message)
            setLoading(false)
            return
        }

        toast.success('Welcome back!')
        router.push(redirectTo)
        router.refresh()
    }

    const handleGoogleLogin = async () => {
        setGoogleLoading(true)
        const supabase = createClient()

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`
            }
        })

        if (error) {
            toast.error(error.message)
            setGoogleLoading(false)
        }
    }

    if (!mounted) return null

    return (
        <section
            className="min-h-screen flex relative overflow-hidden bg-[#FFFBF7]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Background Gradients - Enhanced Orange Theme */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-orange-100/60 via-orange-200/40 to-amber-100/20 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 will-change-transform" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-orange-50/50 via-amber-50/30 to-blue-50/20 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/3 will-change-transform" />

            {/* Additional 3D Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[5%] w-16 h-16 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-2xl blur-sm animate-bounce-slow transform rotate-12" />
                <div className="absolute bottom-[30%] right-[10%] w-24 h-24 border border-orange-200/40 rounded-full animate-spin-reverse-slow opacity-60" />
            </div>

            {/* Left side - Orbital Animation */}
            <div className="hidden lg:flex lg:w-1/2 relative z-10">
                <div className="flex flex-col justify-center items-center w-full p-12">
                    {/* Logo */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Link href="/" className="group relative">
                            <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <img
                                src="/logo.png"
                                alt="Needful"
                                className="w-44 h-auto object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500 relative z-10"
                            />
                        </Link>
                    </motion.div>

                    {/* Heading */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-center mt-10"
                    >
                        <h1 className="text-5xl font-bold text-gray-900 mb-4">
                            Welcome to{' '}
                            <span className="relative inline-block text-[#FF5200]">
                                Needful
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-orange-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                                </svg>
                            </span>
                        </h1>
                        <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
                            Discover trusted local service providers. From electricians to restaurants, we connect you with the best.
                        </p>
                    </motion.div>

                    {/* Orbital Animation Display */}
                    <div className="relative w-[450px] h-[450px] mt-8 flex items-center justify-center perspective-[1000px]">
                        <div
                            className="relative w-full h-full flex items-center justify-center transform-style-3d transition-transform duration-200 ease-out will-change-transform"
                            style={{
                                transform: `rotateX(${mousePosition.y * 8}deg) rotateY(${mousePosition.x * -8}deg)`
                            }}
                        >
                            {/* Center Core */}
                            <div className="relative z-20 w-24 h-24 bg-white rounded-full shadow-[0_0_50px_-12px_rgba(0,0,0,0.12)] flex items-center justify-center">
                                <div className="absolute inset-2 border border-orange-50 rounded-full animate-ping-slow" />
                                <img src="/logo.png" alt="Needful" className="w-12 h-12 object-contain" />
                            </div>

                            {/* Orbital Rings Background */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="absolute w-[220px] h-[220px] rounded-full border border-gray-100/60" />
                                <div className="absolute w-[340px] h-[340px] rounded-full border border-gray-100/50" />
                                <div className="absolute w-[440px] h-[440px] rounded-full border border-gray-100/40" />
                            </div>

                            {/* Ring 1 - Inner */}
                            <div className="absolute w-[220px] h-[220px] rounded-full animate-spin-slow" style={{ animationDuration: '25s' }}>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm border border-orange-100 px-3 py-1.5 rounded-full shadow-[0_8px_30px_rgba(255,82,0,0.15)] flex items-center gap-2 animate-counter-spin" style={{ animationDuration: '25s' }}>
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-bold text-gray-700 whitespace-nowrap">Verified Pros</span>
                                </div>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white/90 backdrop-blur-sm border border-orange-100 p-2.5 rounded-2xl shadow-[0_8px_30px_rgba(255,82,0,0.15)] animate-counter-spin" style={{ animationDuration: '25s' }}>
                                    <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                                        <Zap className="w-4 h-4 fill-current" />
                                    </div>
                                </div>
                            </div>

                            {/* Ring 2 - Middle */}
                            <div className="absolute w-[340px] h-[340px] rounded-full animate-spin-reverse-slow" style={{ animationDuration: '35s' }}>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm border border-orange-100 p-2.5 rounded-2xl shadow-[0_8px_30px_rgba(255,82,0,0.15)] flex gap-2 pr-4 animate-counter-spin-reverse" style={{ animationDuration: '35s' }}>
                                    <div className="w-8 h-8 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500">
                                        <Scissors className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <span className="text-[10px] font-bold text-gray-900">Salon</span>
                                        <span className="text-[8px] text-gray-500">At Home</span>
                                    </div>
                                </div>
                                <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm border border-orange-100 p-2.5 rounded-2xl shadow-[0_8px_30px_rgba(255,82,0,0.15)] animate-counter-spin-reverse" style={{ animationDuration: '35s' }}>
                                    <div className="w-8 h-8 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                                        <Hammer className="w-4 h-4 fill-current" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white/90 backdrop-blur-sm border border-orange-100 p-2.5 rounded-2xl shadow-[0_8px_30px_rgba(255,82,0,0.15)] animate-counter-spin-reverse" style={{ animationDuration: '35s' }}>
                                    <div className="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
                                        <Palette className="w-4 h-4 fill-current" />
                                    </div>
                                </div>
                            </div>

                            {/* Ring 3 - Outer */}
                            <div className="absolute w-[440px] h-[440px] rounded-full animate-spin-slow" style={{ animationDuration: '45s' }}>
                                <div className="absolute top-[10%] right-[5%] bg-white/90 backdrop-blur-sm border border-orange-100 p-2.5 rounded-2xl shadow-[0_8px_30px_rgba(255,82,0,0.15)] flex gap-2 pr-4 animate-counter-spin" style={{ animationDuration: '45s' }}>
                                    <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center text-green-500">
                                        <Wrench className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <span className="text-[10px] font-bold text-gray-900">Plumber</span>
                                        <span className="text-[8px] text-gray-500">Expert</span>
                                    </div>
                                </div>
                                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm border border-orange-100 p-2.5 rounded-2xl shadow-[0_8px_30px_rgba(255,82,0,0.15)] animate-counter-spin" style={{ animationDuration: '45s' }}>
                                    <div className="w-8 h-8 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600">
                                        <Target className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="absolute bottom-[10%] left-[15%] bg-white/90 backdrop-blur-sm border border-orange-100 p-2.5 rounded-2xl shadow-[0_8px_30px_rgba(255,82,0,0.15)] animate-counter-spin" style={{ animationDuration: '45s' }}>
                                    <div className="w-8 h-8 bg-teal-50 rounded-xl flex items-center justify-center text-teal-500">
                                        <Shield className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            {/* Floating Sparkles */}
                            <div className="absolute -top-8 right-[20%] animate-bounce-slow">
                                <Sparkles className="w-6 h-6 text-yellow-400 drop-shadow-lg" />
                            </div>
                            <div className="absolute bottom-[-20px] left-[20%] animate-bounce-slow" style={{ animationDelay: '1s' }}>
                                <div className="w-5 h-5 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-md rotate-12 shadow-lg" />
                            </div>
                        </div>
                    </div>

                    {/* Testimonial Card */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="mt-8 max-w-sm"
                    >
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-3xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                            <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-white/60">
                                <div className="flex items-center gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-4 h-4 text-orange-400 fill-current" viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-gray-600 text-sm italic leading-relaxed">
                                    "Found an amazing electrician within minutes. The service was professional and rates were transparent!"
                                </p>
                                <p className="text-gray-800 font-semibold mt-2 text-sm">— Priya S., Mumbai</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8 relative z-10">
                <motion.div
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <Link href="/" className="inline-block">
                            <img
                                src="/logo.png"
                                alt="Needful"
                                className="h-14 w-auto object-contain mx-auto"
                            />
                        </Link>
                    </div>

                    {/* Form Card */}
                    <motion.div
                        className="relative group"
                    >
                        {/* Animated gradient border */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 rounded-[2rem] opacity-30 blur-lg transition-opacity duration-500" />

                        <div className="relative bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl shadow-orange-100/40 border border-white/60">
                            {/* Header with icon */}
                            <div className="text-center mb-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3, type: 'spring' }}
                                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30 mb-4"
                                >
                                    <Lock className="w-7 h-7 text-white" />
                                </motion.div>
                                <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                                <p className="text-gray-500 mt-2">Sign in to continue to Needful</p>
                            </div>

                            {/* Google Login Button */}
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-14 mb-6 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-orange-300 font-semibold text-base rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
                                onClick={handleGoogleLogin}
                                disabled={googleLoading}
                            >
                                {googleLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        <svg className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Continue with Google
                                    </>
                                )}
                            </Button>

                            {/* Divider */}
                            <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t-2 border-gray-100"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-400 font-medium">or continue with email</span>
                                </div>
                            </div>

                            {/* Login Form */}
                            <form onSubmit={handleLogin} className="space-y-5">
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-700 font-semibold text-sm">Email Address</Label>
                                    <div className={`relative group transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.02]' : ''}`}>
                                        {/* Focus glow effect */}
                                        <div className={`absolute -inset-0.5 bg-gradient-to-r from-orange-400 to-amber-400 rounded-2xl blur opacity-0 transition-opacity duration-300 ${focusedField === 'email' ? 'opacity-40' : ''}`} />

                                        <div className="relative">
                                            <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${focusedField === 'email' ? 'text-orange-500' : 'text-gray-400'}`} />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                onFocus={() => setFocusedField('email')}
                                                onBlur={() => setFocusedField(null)}
                                                className="pl-12 h-14 bg-white border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-2xl focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20 focus:bg-white transition-all duration-300 cursor-pointer"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="text-gray-700 font-semibold text-sm">Password</Label>
                                        <Link href="/reset-password" className="text-sm text-orange-500 hover:text-orange-600 font-medium hover:underline underline-offset-2 transition-colors cursor-pointer">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className={`relative group transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.02]' : ''}`}>
                                        {/* Focus glow effect */}
                                        <div className={`absolute -inset-0.5 bg-gradient-to-r from-orange-400 to-amber-400 rounded-2xl blur opacity-0 transition-opacity duration-300 ${focusedField === 'password' ? 'opacity-40' : ''}`} />

                                        <div className="relative">
                                            <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${focusedField === 'password' ? 'text-orange-500' : 'text-gray-400'}`} />
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                onFocus={() => setFocusedField('password')}
                                                onBlur={() => setFocusedField(null)}
                                                className="pl-12 pr-12 h-14 bg-white border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-2xl focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20 focus:bg-white transition-all duration-300 cursor-pointer"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full h-14 bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 hover:from-orange-600 hover:via-orange-600 hover:to-amber-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        <>
                                            Sign In
                                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                                        </>
                                    )}
                                </Button>
                            </form>

                            {/* Sign up link */}
                            <p className="mt-8 text-center text-gray-600">
                                Don't have an account?{' '}
                                <Link href="/signup" className="text-orange-500 hover:text-orange-600 font-bold hover:underline underline-offset-2 transition-colors cursor-pointer">
                                    Sign up for free
                                </Link>
                            </p>
                        </div>
                    </motion.div>

                    {/* Back to home */}
                    <div className="text-center mt-6">
                        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors group cursor-pointer">
                            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                            <span>Back to Needful</span>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* CSS Animations */}
            <style jsx global>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes spin-reverse-slow {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                @keyframes counter-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(-360deg); }
                }
                @keyframes counter-spin-reverse {
                    from { transform: rotate(-360deg); }
                    to { transform: rotate(0deg); }
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes ping-slow {
                    0% { transform: scale(1); opacity: 1; }
                    75%, 100% { transform: scale(1.5); opacity: 0; }
                }
                .animate-spin-slow {
                    animation: spin-slow 30s linear infinite;
                }
                .animate-spin-reverse-slow {
                    animation: spin-reverse-slow 30s linear infinite;
                }
                .animate-counter-spin {
                    animation: counter-spin 30s linear infinite;
                }
                .animate-counter-spin-reverse {
                    animation: counter-spin-reverse 30s linear infinite;
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
                .animate-ping-slow {
                    animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                .perspective-\[1000px\] {
                    perspective: 1000px;
                }
                .transform-style-3d {
                    transform-style: preserve-3d;
                }
            `}</style>
        </section>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#FFFBF7]">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <span className="text-white font-bold text-3xl">N</span>
                    </div>
                    <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto" />
                </div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    )
}
