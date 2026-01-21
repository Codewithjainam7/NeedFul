import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'

export default async function CareersPage() {
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
                    <div className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 font-bold text-sm tracking-wide mb-6">
                        JOIN OUR TEAM
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                        Build the Future of <br /> <span className="text-[#FF5200]">Local Services</span>
                    </h1>
                    <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
                        We're on a mission to organize the world's local services. Join us in building a platform that empowers millions of professionals and users.
                    </p>
                    <div className="p-12 bg-gray-50 rounded-3xl border border-gray-100">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-2xl">🚧</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Openings Coming Soon</h2>
                        <p className="text-gray-500">We are currently updating our job board. Please check back later.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
