import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'

export default async function PrivacyPage() {
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
                    <h1 className="text-4xl font-black text-gray-900 mb-8">Privacy Policy</h1>
                    <div className="prose prose-lg prose-gray max-w-none">
                        <p className="text-xl text-gray-500 mb-8">Last Updated: January 15, 2026</p>

                        <h3>1. Introduction</h3>
                        <p>
                            NeedFul ("we", "our", "us") respects your privacy. This Privacy Policy informs you about how we collect, use, and protect your personal information.
                        </p>

                        <h3>2. Information We Collect</h3>
                        <p>We collect information you provide directly to us, such as when you create an account, post a review, or contact customer support.</p>

                        <h3>3. How We Use Information</h3>
                        <p>We use your information to provide, maintain, and improve our services, communicate with you, and personalize your experience.</p>

                        <h3>4. Information Sharing</h3>
                        <p>We do not share your personal information with third parties except as described in this policy (e.g., with service providers you connect with).</p>

                        <h3>5. Security</h3>
                        <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access.</p>

                        <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 mt-8">
                            <p className="text-sm text-gray-500 m-0">
                                For complete details, please verify with our legal department. This is a simplified placeholder text.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
