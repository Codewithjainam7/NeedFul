import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function BlogPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let userData = null
    if (user) {
        const { data } = await supabase.from('users').select('name, email, role').eq('id', user.id).single()
        userData = data
    }

    // Mock Posts
    const posts = [
        { title: "10 Tips for Home Maintenance", category: "Home Care", date: "Jan 12, 2026", bg: "bg-orange-50" },
        { title: "How to Choose the Right Electrician", category: "Expert Advice", date: "Jan 08, 2026", bg: "bg-blue-50" },
        { title: "Top Wedding Venues in Mumbai", category: "Events", date: "Jan 05, 2026", bg: "bg-pink-50" },
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
                        <div className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 font-bold text-sm tracking-wide mb-6">
                            THE NEEDFUL BLOG
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                            Tips, Guides & <br /><span className="text-green-600">Insights</span>
                        </h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                            Expert advice on home maintenance, services, and local lifestyle.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {posts.map((post, idx) => (
                            <article key={idx} className="group cursor-pointer">
                                <div className={`aspect-[4/3] rounded-3xl ${post.bg} mb-6 overflow-hidden relative`}>
                                    {/* Placeholder for real image */}
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium opacity-50">
                                        Image Placeholder
                                    </div>
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                                </div>
                                <div className="flex items-center gap-3 text-sm font-medium mb-3">
                                    <span className="text-[#FF5200]">{post.category}</span>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-gray-500">{post.date}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#FF5200] transition-colors">
                                    {post.title}
                                </h3>
                                <div className="flex items-center gap-2 text-gray-500 font-medium group-hover:gap-3 transition-all">
                                    Read Article <ArrowRight className="w-4 h-4" />
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <div className="inline-block px-8 py-4 bg-gray-50 rounded-full text-gray-500 font-medium border border-gray-100">
                            More articles coming soon...
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
