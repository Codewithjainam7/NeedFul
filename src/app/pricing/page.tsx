import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { Check, X as XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function PricingPage() {
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

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 font-bold text-sm tracking-wide mb-6">
                            FOR BUSINESSES
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                            Simple, Transparent <br /><span className="text-violet-600">Pricing</span>
                        </h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                            Choose the plan that's right for your business. Grow your reach with NeedFul.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Free Plan */}
                        <div className="rounded-3xl p-8 border border-gray-200 bg-white">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Basic</h3>
                            <div className="text-4xl font-black text-gray-900 mb-6">Free</div>
                            <p className="text-gray-500 mb-8 border-b border-gray-100 pb-8">Perfect for getting started and listing your business.</p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex gap-3 text-sm font-medium text-gray-700"><Check className="w-5 h-5 text-green-500" /> Basic Business Profile</li>
                                <li className="flex gap-3 text-sm font-medium text-gray-700"><Check className="w-5 h-5 text-green-500" /> 1 Category Listing</li>
                                <li className="flex gap-3 text-sm font-medium text-gray-700"><Check className="w-5 h-5 text-green-500" /> Receive Inquiries</li>
                                <li className="flex gap-3 text-sm font-medium text-gray-400"><XIcon className="w-5 h-5" /> Verified Badge</li>
                            </ul>
                            <Button variant="outline" className="w-full rounded-xl h-12 font-bold">Get Started</Button>
                        </div>

                        {/* Pro Plan */}
                        <div className="rounded-3xl p-8 border-2 border-[#FF5200] bg-orange-50/10 relative shadow-xl shadow-orange-500/10">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FF5200] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                Most Popular
                            </div>
                            <h3 className="text-xl font-bold text-[#FF5200] mb-2">Professional</h3>
                            <div className="text-4xl font-black text-gray-900 mb-6">₹999<span className="text-base font-medium text-gray-500">/mo</span></div>
                            <p className="text-gray-500 mb-8 border-b border-gray-100 pb-8">For growing businesses needing more visibility.</p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex gap-3 text-sm font-bold text-gray-900"><Check className="w-5 h-5 text-[#FF5200]" /> Verified Badge</li>
                                <li className="flex gap-3 text-sm font-bold text-gray-900"><Check className="w-5 h-5 text-[#FF5200]" /> Top Search Ranking</li>
                                <li className="flex gap-3 text-sm font-bold text-gray-900"><Check className="w-5 h-5 text-[#FF5200]" /> 5 Category Listings</li>
                                <li className="flex gap-3 text-sm font-bold text-gray-900"><Check className="w-5 h-5 text-[#FF5200]" /> Priority Support</li>
                            </ul>
                            <Button className="w-full rounded-xl h-12 font-bold bg-[#FF5200] hover:bg-[#e04800]">Upgrade to Pro</Button>
                        </div>

                        {/* Enterprise Plan */}
                        <div className="rounded-3xl p-8 border border-gray-200 bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
                            <div className="text-4xl font-black text-gray-900 mb-6">Custom</div>
                            <p className="text-gray-500 mb-8 border-b border-gray-200/50 pb-8">For large agencies and multi-location businesses.</p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex gap-3 text-sm font-medium text-gray-700"><Check className="w-5 h-5 text-gray-900" /> Multi-location Management</li>
                                <li className="flex gap-3 text-sm font-medium text-gray-700"><Check className="w-5 h-5 text-gray-900" /> API Access</li>
                                <li className="flex gap-3 text-sm font-medium text-gray-700"><Check className="w-5 h-5 text-gray-900" /> Dedicated Account Manager</li>
                                <li className="flex gap-3 text-sm font-medium text-gray-700"><Check className="w-5 h-5 text-gray-900" /> Custom Analytics</li>
                            </ul>
                            <Button variant="outline" className="w-full rounded-xl h-12 font-bold bg-white">Contact Sales</Button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
