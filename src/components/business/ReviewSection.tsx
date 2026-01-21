'use client'

import { useState, useEffect } from 'react'
import { Star, ThumbsUp, MessageCircle, Share2, MoreVertical, Send, PenLine, Loader2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { addReview, getReviews, ReviewComment } from '@/app/actions/reviews'
import { formatDistanceToNow } from 'date-fns'

interface ReviewSectionProps {
    providerId: string
}

function ReviewCard({ review }: { review: any }) {
    const [isHelpful, setIsHelpful] = useState(false)
    const [helpfulCount, setHelpfulCount] = useState(0) // Logic for helpful count would be DB based in real app
    const [showCommentInput, setShowCommentInput] = useState(false)
    const [comment, setComment] = useState('')

    const handleHelpful = () => {
        setIsHelpful(!isHelpful)
        setHelpfulCount(prev => isHelpful ? prev - 1 : prev + 1)
        if (!isHelpful) {
            toast.success("Marked as helpful")
        }
    }

    const handleShare = async () => {
        try {
            await navigator.share({
                title: 'Review for Business',
                text: 'Check out this review on NeedFul!',
                url: window.location.href
            })
        } catch (err) {
            navigator.clipboard.writeText(window.location.href)
            toast.success("Link copied to clipboard")
        }
    }

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault()
        if (!comment.trim()) return

        toast.success("Comment posted successfully")
        setComment('')
        setShowCommentInput(false)
    }

    return (
        <div className="border-b border-gray-100 pb-6 last:border-0">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border border-gray-200">
                        <AvatarFallback className="bg-orange-100 text-orange-700 font-bold">
                            {review.user_name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm md:text-base">{review.user_name}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{review.created_at ? formatDistanceToNow(new Date(review.created_at), { addSuffix: true }) : 'Just now'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1 mb-2">
                <div className={cn(
                    "text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1",
                    review.rating >= 4 ? "bg-green-700" : review.rating >= 3 ? "bg-yellow-500" : "bg-red-500"
                )}>
                    {review.rating} <Star className="w-2.5 h-2.5 fill-white" />
                </div>
            </div>

            {review.comment && (
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {review.comment}
                </p>
            )}

            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleHelpful}
                        className={cn("h-8 px-2", isHelpful ? "text-blue-600 bg-blue-50" : "text-gray-500 hover:text-gray-900")}
                    >
                        <ThumbsUp className={cn("w-4 h-4 mr-1.5", isHelpful && "fill-current")} />
                        Helpful {helpfulCount > 0 && `(${helpfulCount})`}
                    </Button>
                    {/* Comments feature hidden for now to simplify */}
                </div>
            </div>
        </div>
    )
}

export function ReviewSection({ providerId }: ReviewSectionProps) {
    const [reviews, setReviews] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newRating, setNewRating] = useState(5)
    const [newComment, setNewComment] = useState('')
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        loadReviews()
    }, [providerId])

    const loadReviews = async () => {
        setLoading(true)
        const { reviews: data } = await getReviews(providerId)
        setReviews(data || [])
        setLoading(false)
    }

    const handleSubmitReview = async () => {
        setSubmitting(true)
        const res = await addReview(providerId, newRating, newComment)
        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success("Review submitted!")
            setIsDialogOpen(false)
            setNewComment('')
            setNewRating(5)
            loadReviews() // Refresh
        }
        setSubmitting(false)
    }

    // Calculate stats
    const totalReviews = reviews.length
    const avgRating = totalReviews > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
        : '0.0'

    // Distribution
    const distribution = [5, 4, 3, 2, 1].map(stars => {
        const count = reviews.filter(r => Math.round(r.rating) === stars).length
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
        return { stars, count, percentage }
    })

    if (loading) {
        return <div className="flex justify-center py-8"><Loader2 className="animate-spin text-orange-500" /></div>
    }

    return (
        <div className="space-y-8">
            {/* Rating Summary */}
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex flex-col items-center justify-center text-center min-w-[160px]">
                    <span className="text-6xl font-bold text-gray-900 mb-2 tracking-tight">{avgRating}</span>
                    <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                className={cn("w-6 h-6", s <= Number(avgRating) ? "fill-[#FFCE00] text-[#FFCE00]" : "text-gray-200")}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-gray-500 font-medium">{totalReviews} Ratings</span>
                </div>

                {/* Bars */}
                <div className="flex-1 w-full space-y-2 max-w-md">
                    {distribution.map((item) => (
                        <div key={item.stars} className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 w-12 shrink-0">
                                <span className="font-semibold text-gray-700">{item.stars}</span>
                                <Star className="w-3 h-3 text-gray-400" />
                            </div>
                            <Progress value={item.percentage} className="h-2.5 flex-1 rounded-full bg-gray-100" indicatorClassName={
                                item.stars >= 4 ? "bg-green-500" : item.stars === 3 ? "bg-yellow-400" : "bg-red-400"
                            } />
                            <span className="w-8 text-right text-gray-500 text-xs font-medium tabular-nums">{item.count}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center border-t border-gray-100 pt-6">
                <h3 className="font-bold text-lg text-gray-900">User Reviews</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#FF5200] hover:bg-[#E04800] text-white">
                            <PenLine className="w-4 h-4 mr-2" />
                            Write a Review
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[480px] bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl p-0 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#FF5200] to-orange-400 p-6 text-white">
                            <DialogTitle className="text-xl font-bold">Rate your experience</DialogTitle>
                            <p className="text-white/80 text-sm mt-1">Share your feedback to help others</p>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex justify-center gap-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setNewRating(star)}
                                        className="focus:outline-none transition-all active:scale-90 hover:scale-110"
                                    >
                                        <Star
                                            className={cn(
                                                "w-10 h-10 transition-colors drop-shadow-sm",
                                                star <= newRating ? "fill-[#FFCE00] text-[#FFCE00]" : "text-gray-200 hover:text-yellow-200"
                                            )}
                                        />
                                    </button>
                                ))}
                            </div>
                            <Textarea
                                placeholder="Share details of your own experience at this place..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="min-h-[120px] rounded-xl border-gray-200 focus:border-[#FF5200] focus:ring-[#FF5200]/20 resize-none bg-gray-50"
                            />
                        </div>
                        <DialogFooter className="p-6 pt-0 gap-3">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl h-11 px-6">Cancel</Button>
                            <Button
                                onClick={handleSubmitReview}
                                className="bg-gradient-to-r from-[#FF5200] to-orange-500 hover:from-orange-600 hover:to-[#FF5200] text-white rounded-xl h-11 px-8 shadow-lg shadow-orange-500/20"
                                disabled={submitting}
                            >
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Submit Review
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Individual Reviews */}
            {reviews.length > 0 ? (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-2">No reviews yet</p>
                    <Button variant="link" className="text-[#FF5200]" onClick={() => setIsDialogOpen(true)}>
                        Be the first to review!
                    </Button>
                </div>
            )}
        </div>
    )
}
