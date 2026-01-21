'use server'

import { createClient } from '@/lib/supabase/server'

type EventType = 'view' | 'phone_click' | 'whatsapp_click' | 'enquiry_click'

export async function trackAnalyticsEvent(providerId: string, eventType: EventType, metadata?: any) {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('analytics_events')
            .insert({
                provider_id: providerId,
                event_type: eventType,
                metadata: metadata || null
            })

        if (error) {
            console.error('Failed to track analytics:', error)
            return { error: error.message }
        }

        return { success: true }
    } catch (error: any) {
        console.error('Failed to track analytics:', error)
        return { error: error.message || 'Failed to track event' }
    }
}
