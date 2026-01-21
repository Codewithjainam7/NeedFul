import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function AdvertisePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let userData = null
    if (user) {
        const { data } = await supabase.from('users').select('name, email, role').eq('id', user.id).single()
        userData = data
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header user={userData} />
            <main className="flex-1 bg-[#FFFBF7] pt-32 pb-20 lg:pt-40 lg:pb-32 relative overflow-hidden">
                {/* Background Gradient Blobs */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100/60 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

                <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 font-bold text-sm tracking-wide mb-6">
                        GROW YOUR BUSINESS
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                        Reach Millions of <br /> <span className="text-blue-600">Local Customers</span>
                    </h1>
                    <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Drive more leads and sales with targeted advertising on NeedFul. Showcase your services to people actively looking for them.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100 text-left">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Sponsored Listings</h3>
                            <p className="text-gray-600 mb-6">Get top placement in search results and category pages.</p>
                            <div className="h-2 w-full bg-blue-200/50 rounded-full overflow-hidden">
                                <div className="h-full w-2/3 bg-blue-500 rounded-full" />
                            </div>
                        </div>
                        <div className="p-8 bg-orange-50 rounded-3xl border border-orange-100 text-left">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Banner Ads</h3>
                            <p className="text-gray-600 mb-6">Visual display ads on high-traffic home and category pages.</p>
                            <div className="h-2 w-full bg-orange-200/50 rounded-full overflow-hidden">
                                <div className="h-full w-2/3 bg-orange-500 rounded-full" />
                            </div>
                        </div>
                    </div>

                    <div className="p-12 bg-gray-900 rounded-3xl text-white">
                        <h2 className="text-3xl font-bold mb-4">Start Advertising Today</h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">Contact our sales team to get a custom quote for your business.</p>
                        <Link href="/contact">
                            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-8">Contact Sales</Button>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
