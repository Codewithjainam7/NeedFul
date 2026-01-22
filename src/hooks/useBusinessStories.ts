'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export interface BusinessStory {
    id: string
    provider_id: string
    media_url: string
    media_type: 'image' | 'video'
    thumbnail_url?: string
    caption?: string
    view_count: number
    is_active: boolean
    created_at: string
    expires_at: string
    // Joined data
    provider?: {
        id: string
        business_name: string
        slug: string
        city: string
        latitude?: number
        longitude?: number
        provider_images?: { url: string; is_primary: boolean }[]
    }
}

export interface GroupedStories {
    provider_id: string
    provider_name: string
    provider_slug: string
    provider_logo?: string
    city: string
    stories: BusinessStory[]
    has_unviewed: boolean
}

// Helper: Calculate distance between two coordinates (Haversine formula)
function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371 // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

/**
 * Hook to fetch business stories with location-based filtering
 * @param userCity - User's current city for filtering
 * @param userLat - User's latitude (optional)
 * @param userLon - User's longitude (optional)
 * @param radiusKm - Radius in kilometers for location filtering (default: 15km)
 */
export function useBusinessStories(
    userCity?: string,
    userLat?: number,
    userLon?: number,
    radiusKm: number = 15
) {
    return useQuery({
        queryKey: ['business-stories', userCity, userLat, userLon, radiusKm],
        queryFn: async () => {
            const supabase = createClient()

            // Fetch active, non-expired stories with provider details
            const { data: stories, error } = await supabase
                .from('business_stories')
                .select(
                    `
          *,
          provider:providers (
            id,
            business_name,
            slug,
            city,
            latitude,
            longitude,
            provider_images (
              url,
              is_primary
            )
          )
        `
                )
                .eq('is_active', true)
                .gt('expires_at', new Date().toISOString())
                .order('created_at', { ascending: false })

            if (error) throw error
            if (!stories) return []

            let filteredStories = stories as BusinessStory[]

            // Filter by location if provided
            if (userCity) {
                filteredStories = filteredStories.filter(
                    (story) => story.provider?.city === userCity
                )
            }

            // Filter by radius if coordinates provided
            if (userLat && userLon) {
                filteredStories = filteredStories.filter((story) => {
                    if (!story.provider?.latitude || !story.provider?.longitude) {
                        return false
                    }
                    const distance = calculateDistance(
                        userLat,
                        userLon,
                        story.provider.latitude,
                        story.provider.longitude
                    )
                    return distance <= radiusKm
                })
            }

            // Group stories by provider
            const grouped: Record<string, GroupedStories> = {}

            filteredStories.forEach((story) => {
                const providerId = story.provider_id
                if (!grouped[providerId]) {
                    const primaryImage = story.provider?.provider_images?.find(
                        (img) => img.is_primary
                    )
                    grouped[providerId] = {
                        provider_id: providerId,
                        provider_name: story.provider?.business_name || '',
                        provider_slug: story.provider?.slug || '',
                        provider_logo: primaryImage?.url,
                        city: story.provider?.city || '',
                        stories: [],
                        has_unviewed: false,
                    }
                }
                grouped[providerId].stories.push(story)
            })

            return Object.values(grouped)
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    })
}

/**
 * Hook to fetch stories for a specific business
 */
export function useProviderStories(providerId: string) {
    return useQuery({
        queryKey: ['provider-stories', providerId],
        queryFn: async () => {
            const supabase = createClient()

            const { data, error } = await supabase
                .from('business_stories')
                .select('*')
                .eq('provider_id', providerId)
                .eq('is_active', true)
                .gt('expires_at', new Date().toISOString())
                .order('created_at', { ascending: false })

            if (error) throw error
            return (data || []) as BusinessStory[]
        },
        enabled: !!providerId,
    })
}

/**
 * Hook to record a story view
 */
export function useRecordStoryView() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            storyId,
            userId,
        }: {
            storyId: string
            userId?: string
        }) => {
            const supabase = createClient()

            // Get viewer IP for anonymous tracking
            const viewerIp = await fetch('https://api.ipify.org?format=json')
                .then((res) => res.json())
                .then((data) => data.ip)
                .catch(() => 'unknown')

            const { error } = await supabase.from('story_views').insert({
                story_id: storyId,
                user_id: userId || null,
                viewer_ip: userId ? null : viewerIp, // Only use IP for anonymous users
            } as any)

            // Ignore duplicate view errors
            if (error && !error.message.includes('duplicate')) {
                throw error
            }

            return { success: true }
        },
        onSuccess: () => {
            // Refetch stories to update view counts
            queryClient.invalidateQueries({ queryKey: ['business-stories'] })
            queryClient.invalidateQueries({ queryKey: ['provider-stories'] })
        },
    })
}

/**
 * Hook to create a new story
 */
export function useCreateStory() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            providerId,
            mediaUrl,
            mediaType,
            thumbnailUrl,
            caption,
        }: {
            providerId: string
            mediaUrl: string
            mediaType: 'image' | 'video'
            thumbnailUrl?: string
            caption?: string
        }) => {
            const supabase = createClient()

            const { data, error } = await supabase
                .from('business_stories')
                .insert({
                    provider_id: providerId,
                    media_url: mediaUrl,
                    media_type: mediaType,
                    thumbnail_url: thumbnailUrl,
                    caption: caption || null,
                } as any)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['business-stories'] })
            queryClient.invalidateQueries({ queryKey: ['provider-stories'] })
        },
    })
}

/**
 * Hook to delete a story
 */
export function useDeleteStory() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (storyId: string) => {
            const supabase = createClient()

            const { error } = await supabase
                .from('business_stories')
                .delete()
                .eq('id', storyId)

            if (error) throw error
            return { success: true }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['business-stories'] })
            queryClient.invalidateQueries({ queryKey: ['provider-stories'] })
        },
    })
}

/**
 * Hook to get story analytics
 */
export function useStoryAnalytics(storyId: string) {
    return useQuery({
        queryKey: ['story-analytics', storyId],
        queryFn: async () => {
            const supabase = createClient()

            const { data, error } = await supabase
                .from('story_views')
                .select('*')
                .eq('story_id', storyId)

            if (error) throw error

            const views = data as { user_id: string | null }[]

            return {
                total_views: views.length,
                unique_users: views.filter((v) => v.user_id).length,
                anonymous_views: views.filter((v) => !v.user_id).length,
            }
        },
        enabled: !!storyId,
    })
}
