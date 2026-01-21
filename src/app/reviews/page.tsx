import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { Star, Quote } from 'lucide-react'

export default async function ReviewsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let userData = null
    if (user) {
        const { data } = await supabase.from('users').select('name, email, role').eq('id', user.id).single()
        userData = data
    }

    // Expanded Reviews
    const reviews = [
        { name: "Sarah J.", city: "Mumbai", rating: 5, text: "NeedFul helped me find a plumber in 10 minutes. The service was excellent and verified!", service: "Plumbing", color: "bg-blue-100 text-blue-600" },
        { name: "Rahul M.", city: "Bangalore", rating: 5, text: "Best platform for local services. I hired a cleaner and the experience was seamless.", service: "Cleaning", color: "bg-green-100 text-green-600" },
        { name: "Priya S.", city: "Delhi", rating: 4, text: "Great interface and easy to use. Found a good electrician quickly.", service: "Electrical", color: "bg-yellow-100 text-yellow-600" },
        { name: "Amit K.", city: "Pune", rating: 5, text: "Booked an AC service through NeedFul. The technician was professional and fixed the issue in no time!", service: "AC Repair", color: "bg-purple-100 text-purple-600" },
        { name: "Neha R.", city: "Chennai", rating: 5, text: "Found an amazing wedding photographer. The quality of professionals on this platform is outstanding.", service: "Photography", color: "bg-pink-100 text-pink-600" },
        { name: "Vikram P.", city: "Hyderabad", rating: 4, text: "Used NeedFul for pest control. Quick response and effective treatment. Will use again!", service: "Pest Control", color: "bg-orange-100 text-orange-600" },
        { name: "Ananya G.", city: "Kolkata", rating: 5, text: "The best part is the verified reviews. Helped me find a trusted carpenter for my new home.", service: "Carpentry", color: "bg-teal-100 text-teal-600" },
        { name: "Rajesh T.", city: "Ahmedabad", rating: 5, text: "Excellent platform! Got my car serviced through a NeedFul listed garage. Very professional.", service: "Auto Service", color: "bg-red-100 text-red-600" },
        { name: "Meera B.", city: "Jaipur", rating: 4, text: "Found a great caterer for my daughter's birthday party. The food was delicious!", service: "Catering", color: "bg-indigo-100 text-indigo-600" },
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

                    {/* Stats Section */}
                    <div className="flex justify-center gap-8 md:gap-16 mb-16">
                        <div className="text-center">
                            <div className="text-4xl font-black text-[#FF5200]">50K+</div>
                            <div className="text-sm text-gray-500 font-medium">Happy Users</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-black text-[#FF5200]">4.8</div>
                            <div className="text-sm text-gray-500 font-medium">Average Rating</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-black text-[#FF5200]">100K+</div>
                            <div className="text-sm text-gray-500 font-medium">Jobs Done</div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {reviews.map((review, idx) => (
                            <div key={idx} className="p-6 rounded-3xl bg-white shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
                                {/* Quote Icon */}
                                <div className="absolute top-4 right-4 text-gray-100">
                                    <Quote className="w-8 h-8 fill-current" />
                                </div>

                                {/* Service Badge */}
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${review.color}`}>
                                    {review.service}
                                </span>

                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-6 leading-relaxed">"{review.text}"</p>
                                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                    <div className={`w-10 h-10 rounded-full ${review.color} flex items-center justify-center font-bold`}>
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

                    <div className="text-center mt-12 p-8 bg-gradient-to-r from-[#FF5200] to-orange-400 rounded-3xl max-w-2xl mx-auto">
                        <h3 className="text-2xl font-bold text-white mb-3">Share Your Experience</h3>
                        <p className="text-white/80 mb-6">Help others find the best services by leaving a review.</p>
                        <button className="px-6 py-3 bg-white text-[#FF5200] font-bold rounded-xl hover:bg-gray-100 transition-colors">
                            Write a Review
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

