import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'

export default async function TermsPage() {
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

                <div className="container mx-auto px-4 max-w-3xl relative z-10">
                    <h1 className="text-4xl font-black text-gray-900 mb-8">Terms of Service</h1>
                    <div className="prose prose-lg prose-gray max-w-none">
                        <p className="text-xl text-gray-500 mb-8">Effective Date: January 15, 2026</p>

                        <h3>1. Acceptance of Terms</h3>
                        <p>
                            By accessing or using NeedFul, you agree to be bound by these Terms of Service and our Privacy Policy.
                        </p>

                        <h3>2. User Responsibilities</h3>
                        <p>You agree to provide accurate information and to use the platform in accordance with all applicable laws and regulations.</p>

                        <h3>3. Service Listings</h3>
                        <p>Service professionals differ in qualifications and experience. We verify businesses to the best of our ability but do not guarantee 100% accuracy of all listings.</p>

                        <h3>4. Limitation of Liability</h3>
                        <p>NeedFul is a platform connecting users and providers. We are not liable for the acts or omissions of any service provider.</p>

                        <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 mt-8">
                            <p className="text-sm text-gray-500 m-0">
                                This document is for demonstration purposes.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
