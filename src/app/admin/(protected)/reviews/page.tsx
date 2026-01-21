'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Loader2, Star, MessageSquare, Trash2, ThumbsUp } from 'lucide-react'
import { toast } from 'sonner'
// import { Review } from '@/types/database' // Assuming Review type exists or we mock it

export default function ReviewsPage() {
    // Mocking reviews for now as we might not have a lot of data or the join query handy
    const [reviews, setReviews] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const supabase = createClient()

    useEffect(() => {
        fetchReviews()
    }, [])

    const fetchReviews = async () => {
        setLoading(true)
        // This is a complex join usually, simplified for now
        const { data, error } = await supabase
            .from('reviews')
            .select(`
                *,
                user:users(name, email),
                provider:providers(business_name)
            `)
            .order('created_at', { ascending: false })
            .limit(50)

        if (error) {
            console.error(error)
            toast.error('Failed to load reviews')
        } else {
            setReviews(data || [])
        }
        setLoading(false)
    }

    const filteredReviews = reviews.filter(review =>
        review.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
                    <p className="text-muted-foreground">Monitor and manage user reviews.</p>
                </div>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search reviews..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : filteredReviews.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                        <p className="text-muted-foreground">No reviews found.</p>
                    </div>
                ) : (
                    filteredReviews.map((review) => (
                        <div key={review.id} className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                                        {review.user?.name?.[0] || 'U'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</p>
                                        <p className="text-xs text-gray-500">on <span className="font-medium text-gray-700">{review.provider?.business_name || 'Unknown Business'}</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center px-2.5 py-1 bg-yellow-50 rounded-lg border border-yellow-100">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1.5" />
                                    <span className="font-bold text-yellow-700">{review.rating}</span>
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm leading-relaxed mb-4 pl-13">
                                {review.comment || "No written comment."}
                            </p>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                <span className="text-xs text-gray-400">
                                    {new Date(review.created_at).toLocaleDateString()}
                                </span>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600">
                                        <Trash2 className="h-4 w-4 mr-1.5" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
