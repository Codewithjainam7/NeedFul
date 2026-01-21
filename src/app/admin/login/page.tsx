'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Lock, Mail, Loader2, ShieldCheck, Server, Database, Activity, ArrowRight, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminLoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [focusedField, setFocusedField] = useState<string | null>(null)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    const router = useRouter()
    const supabase = createClient()

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const { clientX, clientY, currentTarget } = e
        const { left, top, width, height } = currentTarget.getBoundingClientRect()
        const x = (clientX - left) / width - 0.5
        const y = (clientY - top) / height - 0.5
        setMousePosition({ x, y })
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                toast.error(error.message)
                return
            }

            // Check if user is actually an admin
            const { data: { session } } = await supabase.auth.getSession()

            if (session) {
                const { data: userData } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', session.user.id)
                    .single()

                const profile = userData as { role: string } | null

                if (profile?.role !== 'admin') {
                    await supabase.auth.signOut()
                    toast.error('Access Denied. You are not an admin.')
                    return
                }

                toast.success('Welcome back, Admin!')
                router.push('/admin/dashboard')
                router.refresh()
            }

        } catch (error) {
            toast.error('Something went wrong')
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section
            className="min-h-screen flex relative overflow-hidden bg-[#0F172A]"
            onMouseMove={handleMouseMove}
        >
            {/* Background Gradients - Dark Admin Theme */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-orange-500/20 via-orange-600/10 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 will-change-transform" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-900/20 via-slate-800/20 to-transparent rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 will-change-transform" />

            {/* Left side - Animation */}
            <div className="hidden lg:flex lg:w-1/2 relative z-10">
                <div className="flex flex-col justify-center items-center w-full p-12">

                    {/* Header */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
                            Admin <span className="text-[#FF5200]">Portal</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-md mx-auto">
                            Secure access for NeedFul system administrators. Monitor, manage, and scale.
                        </p>
                    </motion.div>

                    {/* Orbital Security Animation */}
                    <div className="relative w-[500px] h-[500px] mt-12 flex items-center justify-center perspective-[1000px]">
                        <div
                            className="relative w-full h-full flex items-center justify-center transform-style-3d transition-transform duration-200 ease-out"
                            style={{
                                transform: `rotateX(${mousePosition.y * 10}deg) rotateY(${mousePosition.x * -10}deg)`
                            }}
                        >
                            {/* Center Core */}
                            <div className="relative z-20 w-32 h-32 bg-slate-900 rounded-full shadow-[0_0_50px_-12px_rgba(255,82,0,0.3)] flex items-center justify-center border border-slate-700/50">
                                <div className="absolute inset-2 border border-[#FF5200]/30 rounded-full animate-ping-slow" />
                                <ShieldCheck className="w-12 h-12 text-[#FF5200]" />
                            </div>

                            {/* Rings */}
                            {/* Inner Ring */}
                            <div className="absolute w-[280px] h-[280px] rounded-full animate-spin-slow border border-slate-700/30" style={{ animationDuration: '30s' }}>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800/90 backdrop-blur-md border border-slate-700 p-3 rounded-full shadow-lg animate-counter-spin" style={{ animationDuration: '30s' }}>
                                    <Database className="w-5 h-5 text-blue-400" />
                                </div>
                            </div>

                            {/* Outer Ring */}
                            <div className="absolute w-[420px] h-[420px] rounded-full animate-spin-reverse-slow border border-slate-700/20" style={{ animationDuration: '40s' }}>
                                <div className="absolute bottom-[15%] right-[10%] bg-slate-800/90 backdrop-blur-md border border-slate-700 p-3 rounded-full shadow-lg animate-counter-spin-reverse" style={{ animationDuration: '40s' }}>
                                    <Server className="w-5 h-5 text-green-400" />
                                </div>
                                <div className="absolute top-[15%] left-[10%] bg-slate-800/90 backdrop-blur-md border border-slate-700 p-3 rounded-full shadow-lg animate-counter-spin-reverse" style={{ animationDuration: '40s' }}>
                                    <Activity className="w-5 h-5 text-[#FF5200]" />
                                </div>
                            </div>
                        </div>
                    </div>
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
                    {/* Mobile Logo Rep */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#FF5200] shadow-lg shadow-orange-500/30 mb-4">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Admin Access</h2>
                    </div>

                    <div className="relative group">
                        {/* Glow Border */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF5200] to-orange-600 rounded-[2rem] opacity-50 blur-md group-hover:opacity-75 transition-opacity duration-500" />

                        <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl border border-slate-700">

                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-white">Authenticate</h2>
                                <p className="text-slate-400 mt-1 text-sm">Please enter your credentials</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-5">
                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Email</Label>
                                    <div className={`relative group transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.01]' : ''}`}>
                                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${focusedField === 'email' ? 'text-[#FF5200]' : 'text-slate-500'}`} />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            required
                                            className="pl-12 h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600 rounded-xl focus:border-[#FF5200] focus:ring-[#FF5200]/20 transition-all"
                                            placeholder="admin@needful.com"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Password</Label>
                                    <div className={`relative group transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.01]' : ''}`}>
                                        <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${focusedField === 'password' ? 'text-[#FF5200]' : 'text-slate-500'}`} />
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField(null)}
                                            required
                                            className="pl-12 h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600 rounded-xl focus:border-[#FF5200] focus:ring-[#FF5200]/20 transition-all"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#FF5200] transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 mt-4 bg-[#FF5200] hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Access Dashboard'}
                                </Button>
                            </form>
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors">
                            <ArrowRight className="w-4 h-4 rotate-180" />
                            <span className="text-sm">Back to Website</span>
                        </Link>
                    </div>

                </motion.div>
            </div>

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
                @keyframes ping-slow {
                     0% { transform: scale(1); opacity: 1; }
                     75%, 100% { transform: scale(1.5); opacity: 0; }
                }
                .animate-spin-slow { animation: spin-slow 30s linear infinite; }
                .animate-spin-reverse-slow { animation: spin-reverse-slow 30s linear infinite; }
                .animate-counter-spin { animation: counter-spin 30s linear infinite; }
                .animate-counter-spin-reverse { animation: counter-spin-reverse 30s linear infinite; }
                .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
                .perspective-\[1000px\] { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
            `}</style>
        </section>
    )
}
