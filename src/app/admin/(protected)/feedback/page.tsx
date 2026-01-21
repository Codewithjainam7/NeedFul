"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, MessageSquare, CheckCircle, Clock, AlertCircle, Mail, Trash2, Reply } from 'lucide-react'
import { AdminPageTransition } from '@/components/admin/AdminPageTransition'
import { formatDistanceToNow } from 'date-fns'

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'read': return <Badge className="bg-green-50 text-green-700 border-green-200">Read</Badge>
        case 'pending': return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
        case 'urgent': return <Badge className="bg-red-50 text-red-700 border-red-200">Urgent</Badge>
        default: return <Badge className="bg-gray-50 text-gray-700 border-gray-200">{status}</Badge>
    }
}

const getTypeIcon = (type: string) => {
    switch (type) {
        case 'bug': return <AlertCircle className="w-5 h-5 text-red-500" />
        case 'feature': return <Clock className="w-5 h-5 text-blue-500" />
        case 'praise': return <CheckCircle className="w-5 h-5 text-green-500" />
        default: return <MessageSquare className="w-5 h-5 text-gray-500" />
    }
}

export default function FeedbackPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [feedbacks, setFeedbacks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchFeedbacks()
    }, [])

    const fetchFeedbacks = async () => {
        try {
            const { data, error } = await supabase
                .from('feedbacks')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setFeedbacks(data || []);
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
            setFeedbacks([]);
        } finally {
            setLoading(false);
        }
    }

    const filteredFeedback = feedbacks.filter(f =>
        (f.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.message || '').toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Stats Logic
    const pendingCount = feedbacks.filter(f => f.status === 'pending').length;
    const resolvedCount = feedbacks.filter(f => f.status === 'read' || f.status === 'resolved').length;

    return (
        <AdminPageTransition>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Feedback</h1>
                        <p className="text-muted-foreground mt-1">User-submitted feedback and support requests.</p>
                    </div>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search feedback..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 border-gray-200 focus:border-[#FF5200] focus:ring-[#FF5200]/30 rounded-xl bg-white"
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border-none shadow-sm bg-gradient-to-br from-yellow-50 to-white hover:shadow-md transition-all">
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-yellow-700">{pendingCount}</p>
                            <p className="text-sm text-yellow-600">Pending</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-gradient-to-br from-red-50 to-white hover:shadow-md transition-all">
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-red-700">{feedbacks.filter(f => f.type === 'bug' || f.status === 'urgent').length}</p>
                            <p className="text-sm text-red-600">Urgent/Bugs</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-gradient-to-br from-green-50 to-white hover:shadow-md transition-all">
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-green-700">{resolvedCount}</p>
                            <p className="text-sm text-green-600">Resolved</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition-all">
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-blue-700">{feedbacks.length}</p>
                            <p className="text-sm text-blue-600">Total</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Feedback List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Loading feedbacks...</div>
                    ) : filteredFeedback.length > 0 ? (
                        filteredFeedback.map((feedback) => (
                            <Card key={feedback.id} className="border-white/60 bg-white/60 backdrop-blur-xl shadow-md hover:shadow-lg transition-all duration-300 group">
                                <CardContent className="p-5">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-sm">
                                            {getTypeIcon(feedback.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-gray-900 text-lg">{feedback.subject}</h3>
                                                {getStatusBadge(feedback.status)}
                                            </div>
                                            <p className="text-gray-600 text-sm mb-3 leading-relaxed">{feedback.message}</p>
                                            <div className="flex items-center gap-4 text-xs text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> {feedback.email}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {feedback.created_at ? formatDistanceToNow(new Date(feedback.created_at), { addSuffix: true }) : 'Recently'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Reply className="w-4 h-4 mr-2" /> Reply
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                            No feedbacks found.
                        </div>
                    )}
                </div>
            </div>
        </AdminPageTransition>
    )
}
