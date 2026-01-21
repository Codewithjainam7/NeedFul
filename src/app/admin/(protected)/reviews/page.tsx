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
import { AdminPageTransition } from '@/components/admin/AdminPageTransition'

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
        <AdminPageTransition>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Reviews</h1>
                        <p className="text-muted-foreground mt-1">Monitor and manage user feedback.</p>
                    </div>
                    {/* ... Search ... */}
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search reviews..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 border-gray-200 focus:border-[#FF5200] focus:ring-[#FF5200]/30 rounded-xl bg-white"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loading ? (
                        <div className="col-span-full flex justify-center items-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin text-[#FF5200]" />
                        </div>
                    ) : filteredReviews.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-muted-foreground">No reviews found.</p>
                        </div>
                    ) : (
                        filteredReviews.map((review) => (
                            <div key={review.id} className="bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-white/50 shadow-lg shadow-gray-100/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 hover:scale-[1.02] hover:bg-white group ring-1 ring-black/5 hover:ring-orange-100 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-100 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center text-[#FF5200] font-bold border border-orange-100">
                                            {review.user?.name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 group-hover:text-[#FF5200] transition-colors">{review.user?.name || 'Anonymous'}</p>
                                            <p className="text-xs text-gray-500">
                                                on <span className="font-medium text-gray-700">{review.provider?.business_name || 'Unknown Business'}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center px-2 py-1 bg-yellow-50 rounded-lg border border-yellow-100">
                                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 mr-1" />
                                        <span className="font-bold text-yellow-700 text-sm">{review.rating}</span>
                                    </div>
                                </div>

                                <div className="bg-gray-50/50 p-3 rounded-xl mb-4">
                                    <p className="text-gray-700 text-sm leading-relaxed italic">
                                        "{review.comment || "No written comment."}"
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-md">
                                        {new Date(review.created_at).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 rounded-lg transition-colors">
                                        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AdminPageTransition>
    )
}
