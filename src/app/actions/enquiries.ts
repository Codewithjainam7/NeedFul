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

export async function submitEnquiry(data: z.infer<typeof enquirySchema>) {
    try {
        // Validate input
        const validatedData = enquirySchema.parse(data)

        const supabase = await createClient()

        // Insert enquiry
        const { error } = await supabase
            .from('enquiries')
            .insert({
                provider_id: validatedData.provider_id,
                customer_name: validatedData.customer_name,
                customer_phone: validatedData.customer_phone,
                customer_email: validatedData.customer_email || null,
                message: validatedData.message,
                status: 'new'
            })

        if (error) throw error

        // Track analytics event
        try {
            await supabase
                .from('analytics_events')
                .insert({
                    provider_id: validatedData.provider_id,
                    event_type: 'enquiry_click',
                    metadata: {
                        customer_name: validatedData.customer_name
                    }
                })
        } catch (analyticsError) {
            console.warn('Failed to track analytics:', analyticsError)
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
        .from('enquiries')
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

    const { error } = await supabase
        .from('enquiries')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', enquiryId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/profile')
    return { success: true }
}
