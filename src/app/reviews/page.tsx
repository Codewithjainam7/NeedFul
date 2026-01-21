import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { Star } from 'lucide-react'

export default async function ReviewsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let userData = null
    if (user) {
        const { data } = await supabase.from('users').select('name, email, role').eq('id', user.id).single()
        userData = data
    }

    // Mock Reviews
    const reviews = [
        { name: "Sarah J.", city: "Mumbai", rating: 5, text: "NeedFul helped me find a plumber in 10 minutes. The service was excellent and verified!" },
        { name: "Rahul M.", city: "Bangalore", rating: 5, text: "Best platform for local services. I hired a cleaner and the experience was seamless." },
        { name: "Priya S.", city: "Delhi", rating: 4, text: "Great interface and easy to use. Found a good electrician quickly." },
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
                        <div className="inline-block px-4 py-1.5 rounded-full bg-yellow-100 text-yellow-700 font-bold text-sm tracking-wide mb-6">
                            USER STORIES
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                            Trusted by <br /><span className="text-yellow-500">Thousands</span>
                        </h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                            See what our community has to say about their experience with NeedFul professionals.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {reviews.map((review, idx) => (
                            <div key={idx} className="p-8 rounded-3xl bg-gray-50 border border-transparent hover:border-yellow-200 transition-colors">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                                <p className="text-gray-700 text-lg mb-6 leading-relaxed">"{review.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                                        {review.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">{review.name}</div>
                                        <div className="text-sm text-gray-500">{review.city}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12 bg-white/50 p-8 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">All reviews are from verified users.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
