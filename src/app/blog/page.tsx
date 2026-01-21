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

    // Blog Posts with real images
    const posts = [
        {
            slug: "home-maintenance-tips",
            title: "10 Tips for Home Maintenance",
            category: "Home Care",
            date: "Jan 12, 2026",
            image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop",
            excerpt: "Keep your home in top shape with these essential maintenance tips that every homeowner should know."
        },
        {
            slug: "choose-right-electrician",
            title: "How to Choose the Right Electrician",
            category: "Expert Advice",
            date: "Jan 08, 2026",
            image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
            excerpt: "Finding a qualified electrician doesn't have to be daunting. Here's your complete guide to hiring the best."
        },
        {
            slug: "wedding-venues-mumbai",
            title: "Top Wedding Venues in Mumbai",
            category: "Events",
            date: "Jan 05, 2026",
            image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
            excerpt: "Discover the most stunning wedding venues in Mumbai for your dream celebration."
        },
        {
            slug: "plumbing-emergency-guide",
            title: "What to Do in a Plumbing Emergency",
            category: "Home Care",
            date: "Jan 02, 2026",
            image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=800&auto=format&fit=crop",
            excerpt: "Learn how to handle common plumbing emergencies before the professionals arrive."
        },
        {
            slug: "ac-maintenance-summer",
            title: "Preparing Your AC for Summer",
            category: "Seasonal Tips",
            date: "Dec 28, 2025",
            image: "https://images.unsplash.com/photo-1631545806609-35d4ae440431?q=80&w=800&auto=format&fit=crop",
            excerpt: "Essential maintenance tips to ensure your air conditioning runs efficiently all summer long."
        },
        {
            slug: "best-restaurants-bangalore",
            title: "Best Restaurants in Bangalore 2026",
            category: "Food & Dining",
            date: "Dec 20, 2025",
            image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
            excerpt: "Our curated list of the best restaurants in Bangalore for every occasion and cuisine."
        },
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
                            <Link href={`/blog/${post.slug}`} key={idx}>
                                <article className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-lg shadow-gray-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className="aspect-[4/3] overflow-hidden relative">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#FF5200] text-xs font-bold rounded-full">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="text-sm text-gray-400 mb-2">{post.date}</div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#FF5200] transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                                        <div className="flex items-center gap-2 text-[#FF5200] font-bold text-sm group-hover:gap-3 transition-all">
                                            Read More <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
