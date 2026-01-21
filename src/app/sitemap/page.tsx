import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function SitemapPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let userData = null
    if (user) {
        const { data } = await supabase.from('users').select('name, email, role').eq('id', user.id).single()
        userData = data
    }

    const sections = [
        {
            title: "Main",
            links: [
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Login / Signup", href: "/login" },
            ]
        },
        {
            title: "Services",
            links: [
                { label: "Categories", href: "/categories" },
                { label: "Search Services", href: "/search" },
                { label: "Add Business", href: "/business/add" },
            ]
        },
        {
            title: "Resources",
            links: [
                { label: "Blog", href: "/blog" },
                { label: "Pricing", href: "/pricing" },
                { label: "Partners", href: "/partners" },
                { label: "Help / FAQ", href: "/faq" },
            ]
        },
        {
            title: "Legal",
            links: [
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
            ]
        }
    ]

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header user={userData} />
            <main className="flex-1 bg-[#FFFBF7] pt-32 pb-20 lg:pt-40 lg:pb-32 relative overflow-hidden">
                {/* Background Gradient Blobs */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100/60 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

                <div className="container mx-auto px-4 max-w-4xl relative z-10">
                    <h1 className="text-4xl font-black text-gray-900 mb-12 text-center">Sitemap</h1>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {sections.map((section, idx) => (
                            <div key={idx} className="space-y-4">
                                <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">{section.title}</h3>
                                <ul className="space-y-3">
                                    {section.links.map((link, lIdx) => (
                                        <li key={lIdx}>
                                            <Link href={link.href} className="text-gray-500 hover:text-[#FF5200] transition-colors">
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
