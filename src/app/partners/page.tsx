import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'

export default async function PartnersPage() {
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
                    <div className="inline-block px-4 py-1.5 rounded-full bg-teal-100 text-teal-700 font-bold text-sm tracking-wide mb-6">
                        PARTNER PROGRAM
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                        Partner with <br /> <span className="text-teal-600">NeedFul</span>
                    </h1>
                    <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Join our network of verified trusted partners and grow your reach across the country.
                    </p>

                    <div className="p-12 bg-teal-50 rounded-3xl border border-teal-100 mb-12">
                        <h2 className="text-2xl font-bold text-teal-900 mb-4">Why Partner with Us?</h2>
                        <div className="grid md:grid-cols-3 gap-8 mt-8 text-left">
                            <div>
                                <h3 className="font-bold text-teal-800 mb-2">High Trust</h3>
                                <p className="text-teal-700/80 text-sm">Associate your brand with the most trusted local service platform.</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-teal-800 mb-2">Massive Reach</h3>
                                <p className="text-teal-700/80 text-sm">Access millions of daily users active on NeedFul.</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-teal-800 mb-2">Growth Tools</h3>
                                <p className="text-teal-700/80 text-sm">Get dedicated tools and analytics to track your success.</p>
                            </div>
                        </div>
                    </div>

                    <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-teal-500/20">
                        Apply for Partnership
                    </Button>
                </div>
            </main>
            <Footer />
        </div>
    )
}
