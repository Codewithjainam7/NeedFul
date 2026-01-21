'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const enquirySchema = z.object({
    provider_id: z.string().uuid(),
    customer_name: z.string().min(2, 'Name must be at least 2 characters'),
    customer_phone: z.string().min(10, 'Please enter a valid phone number'),
    customer_email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
    message: z.string().min(10, 'Message must be at least 10 characters'),
})

type EnquiryInsert = {
    provider_id: string
    customer_name: string
    customer_phone: string
    customer_email: string | null
    message: string
    status: string
}

type EnquiryUpdate = {
    status: string
    updated_at: string
}

export async function submitEnquiry(data: z.infer<typeof enquirySchema>) {
    try {
        const validatedData = enquirySchema.parse(data)
        const supabase = await createClient()

        const insertData: EnquiryInsert = {
            provider_id: validatedData.provider_id,
            customer_name: validatedData.customer_name,
            customer_phone: validatedData.customer_phone,
            customer_email: validatedData.customer_email || null,
            message: validatedData.message,
            status: 'new'
        }

        const { error } = await supabase
            .from('enquiries' as any)
            .insert(insertData as any)

        if (error) throw error

        try {
            await supabase
                .from('analytics_events')
                .insert({
                    provider_id: validatedData.provider_id,
                    event_type: 'enquiry_click',
                    metadata: { customer_name: validatedData.customer_name }
                })
        } catch (e) {
            console.warn('Analytics tracking failed:', e)
        }

        return { success: true }
    } catch (error: any) {
        console.error('Error submitting enquiry:', error)
        return { error: error.message || 'Failed to submit enquiry' }
    }
}

export async function getEnquiries(providerId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('enquiries' as any)
        .select('*')
        .eq('provider_id', providerId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching enquiries:', error)
        return { enquiries: [], error: error.message }
    }

    return { enquiries: data || [] }
}

export async function updateEnquiryStatus(enquiryId: string, status: 'new' | 'contacted' | 'closed') {
    const supabase = await createClient()

    const updateData: EnquiryUpdate = {
        status,
        updated_at: new Date().toISOString()
    }

    const { error } = await supabase
        .from('enquiries' as any)
        .update(updateData as any)
        .eq('id', enquiryId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/profile')
    return { success: true }
}
