'use client'

import { useEffect, useRef } from 'react'
import { trackAnalyticsEvent } from '@/app/actions/analytics'

interface AnalyticsTrackerProps {
    providerId: string
}

export function AnalyticsTracker({ providerId }: AnalyticsTrackerProps) {
    const tracked = useRef(false)

    useEffect(() => {
        // Track view only once per page load
        if (!tracked.current) {
            tracked.current = true
            trackAnalyticsEvent(providerId, 'view').catch(console.error)
        }
    }, [providerId])

    return null // This component doesn't render anything
}
