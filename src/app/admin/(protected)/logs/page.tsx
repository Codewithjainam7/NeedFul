"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, User, Store, Star, Clock, Loader2 } from 'lucide-react'
import { AdminPageTransition } from '@/components/admin/AdminPageTransition'
import { formatDistanceToNow } from 'date-fns'

const getTypeColor = (type: string) => {
    switch (type) {
        case 'user': return 'bg-blue-50 text-blue-700 border-blue-200'
        case 'business': return 'bg-orange-50 text-orange-700 border-orange-200'
        case 'review': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
        case 'admin': return 'bg-purple-50 text-purple-700 border-purple-200'
        default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
}

export default function ActivityLogsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchLogs()
    }, [])

    const fetchLogs = async () => {
        try {
            const [users, providers, reviews] = await Promise.all([
                supabase.from('users').select('id, name, email, created_at').order('created_at', { ascending: false }).limit(20),
                supabase.from('providers').select('id, business_name, created_at').order('created_at', { ascending: false }).limit(20),
                supabase.from('reviews').select('id, rating, created_at').order('created_at', { ascending: false }).limit(20)
            ])

            const userLogs = (users.data || []).map((u: any) => ({
                id: `u-${u.id}`,
                action: 'New user registered',
                user: u.name || u.email || 'Unknown User',
                type: 'user',
                time: new Date(u.created_at),
                rawTime: u.created_at,
                icon: User
            }))

            const providerLogs = (providers.data || []).map((p: any) => ({
                id: `p-${p.id}`,
                action: 'Business listing created',
                user: p.business_name || 'Unknown Business',
                type: 'business',
                time: new Date(p.created_at),
                rawTime: p.created_at,
                icon: Store
            }))

            const reviewLogs = (reviews.data || []).map((r: any) => ({
                id: `r-${r.id}`,
                action: `Review submitted (${r.rating} stars)`,
                user: 'Anonymous User', // Reviews often link to users, but we'll keep simple for now
                type: 'review',
                time: new Date(r.created_at),
                rawTime: r.created_at,
                icon: Star
            }))

            // Merge and sort desc
            const allLogs = [...userLogs, ...providerLogs, ...reviewLogs]
                .sort((a, b) => b.time.getTime() - a.time.getTime())
                .slice(0, 50) // Keep top 50 recent events

            setLogs(allLogs)
        } catch (error) {
            console.error('Error fetching logs:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredLogs = logs.filter(log =>
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <AdminPageTransition>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Activity Logs</h1>
                        <p className="text-muted-foreground mt-1">Track all system events and user actions.</p>
                    </div>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search logs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 border-gray-200 focus:border-[#FF5200] focus:ring-[#FF5200]/30 rounded-xl bg-white"
                        />
                    </div>
                </div>

                <Card className="border-white/60 bg-white/60 backdrop-blur-xl shadow-md hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gray-400" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                            </div>
                        ) : filteredLogs.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {filteredLogs.map((log) => (
                                    <div key={log.id} className="flex items-center gap-4 p-4 hover:bg-white/50 transition-colors">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${getTypeColor(log.type)}`}>
                                            <log.icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{log.action}</p>
                                            <p className="text-sm text-gray-500">{log.user}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline" className={getTypeColor(log.type)}>
                                                {log.type}
                                            </Badge>
                                            <span className="text-xs text-gray-400 whitespace-nowrap">
                                                {formatDistanceToNow(log.time, { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">No activity logs found.</div>
                        )}
                    </CardContent>
                </Card>

                <div className="text-center text-sm text-gray-500">
                    Showing {filteredLogs.length} of {logs.length} logs
                </div>
            </div>
        </AdminPageTransition>
    )
}
