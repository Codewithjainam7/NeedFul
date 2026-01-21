import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { Search, MapPin, Star, ShieldCheck } from 'lucide-react'

export default async function HowItWorksPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let userData = null
    if (user) {
        const { data } = await supabase.from('users').select('name, email, role').eq('id', user.id).single()
        userData = data
    }

    const steps = [
        {
            icon: Search,
            title: "Search Services",
            desc: "Find what you need with our smart search. Filter by location, budget, and rating.",
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            icon: MapPin,
            title: "Locate Pros",
            desc: "Browse detailed profiles of verified professionals near your location.",
            color: "text-orange-500",
            bg: "bg-orange-50"
        },
        {
            icon: ShieldCheck,
            title: "Hire Securely",
            desc: "Contact pros directly or book through our secure platform with guarantee.",
            color: "text-green-500",
            bg: "bg-green-50"
        },
        {
            icon: Star,
            title: "Rate & Review",
            desc: "Share your experience to help the community. Quality comes first.",
            color: "text-purple-500",
            bg: "bg-purple-50"
        }
    ]

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header user={userData} />
            <main className="flex-1 bg-[#FFFBF7] pt-32 pb-20 lg:pt-40 lg:pb-32 relative overflow-hidden">
                {/* Background Gradient Blobs */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100/60 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-violet-100 text-violet-600 font-bold text-sm tracking-wide mb-6">
                            SIMPLE & FAST
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                            How <span className="text-violet-600">NeedFul</span> Works
                        </h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                            Getting things done shouldn't be complicated. We've simplified the process of finding trusted local help.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                        {steps.map((step, idx) => (
                            <div key={idx} className="relative group">
                                <div className="h-full p-8 rounded-3xl border border-gray-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className={`w-14 h-14 ${step.bg} rounded-2xl flex items-center justify-center mb-6`}>
                                        <step.icon className={`w-7 h-7 ${step.color}`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                    <p className="text-gray-500 leading-relaxed text-sm">
                                        {step.desc}
                                    </p>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-100 -translate-y-1/2 z-[-1]" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
