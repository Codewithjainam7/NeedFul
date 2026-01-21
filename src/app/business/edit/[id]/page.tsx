import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { EditBusinessForm } from '@/components/business/EditBusinessForm'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProviderWithDetails, Category } from '@/types/database'

export default async function EditBusinessPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { id } = params

    // 1. Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/')

    // 2. Fetch Provider Data
    const { data: provider, error } = await supabase
        .from('providers')
        .select(`
            *,
            categories (*),
            services (*),
            provider_images (*)
        `)
        .eq('id', id)
        .single()

    if (error || !provider) {
        return notFound()
    }

    // 3. Verify Ownership
    // TYPE FIX: Explicitly cast provider to handle 'never' inference
    const providerData = provider as { user_id: string };
    if (providerData.user_id !== user.id) {
        // Prevent unauthorized editing
        redirect('/profile')
    }

    // 4. Fetch Categories (for the form)
    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('name')

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-24">
                <EditBusinessForm
                    provider={provider as ProviderWithDetails}
                    categories={categories as Category[] || []}
                />
            </main>
            <Footer />
        </div>
    )
}
