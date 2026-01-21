import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EnquiriesList } from '@/components/business/EnquiriesList'
import { getEnquiries } from '@/app/actions/enquiries'

interface EnquiriesPageProps {
    params: Promise<{ id: string }>
}

export default async function EnquiriesPage({ params }: EnquiriesPageProps) {
    const { id } = await params
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/auth')
    }

    // Get provider details and verify ownership
    const { data: provider, error } = await (supabase as any)
        .from('providers')
        .select('id, business_name, user_id')
        .eq('id', id)
        .single()

    if (error || !provider || provider.user_id !== user.id) {
        redirect('/profile')
    }

    // Get enquiries for this business
    const { enquiries } = await getEnquiries(id)

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50/30">
            {/* Header */}
            <div className="bg-white border-b-2 border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4">
                        <Link href="/profile?tab=business">
                            <Button variant="outline" size="sm" className="gap-2 border-2">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Profile
                            </Button>
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF5200] to-orange-600 flex items-center justify-center shadow-lg">
                                    <MessageCircle className="w-6 h-6 text-white" />
                                </div>
                                Customer Enquiries
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Manage enquiries for <span className="font-semibold text-[#FF5200]">{provider.business_name}</span>
                            </p>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-orange-50 border-2 border-orange-200 rounded-xl">
                            <span className="text-sm font-semibold text-gray-600">Total:</span>
                            <span className="text-2xl font-bold text-[#FF5200]">{enquiries.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Suspense fallback={<div>Loading...</div>}>
                    <EnquiriesList enquiries={enquiries} businessName={provider.business_name} />
                </Suspense>
            </div>
        </div>
    )
}
