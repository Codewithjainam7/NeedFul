"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Flag, AlertTriangle, Shield, CheckCircle, XCircle, Eye, Trash2, Filter, Clock } from 'lucide-react'
import { AdminPageTransition } from '@/components/admin/AdminPageTransition'
import { formatDistanceToNow } from 'date-fns'

const getTypeBadge = (type: string) => {
    switch (type) {
        case 'review': return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Review</Badge>
        case 'business': return <Badge className="bg-orange-50 text-orange-700 border-orange-200">Business</Badge>
        case 'user': return <Badge className="bg-blue-50 text-blue-700 border-blue-200">User</Badge>
        default: return <Badge className="bg-gray-50 text-gray-700 border-gray-200">{type}</Badge>
    }
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'pending': return <Badge className="bg-red-50 text-red-700 border-red-200">Pending Review</Badge>
        case 'investigating': return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Investigating</Badge>
        case 'resolved': return <Badge className="bg-green-50 text-green-700 border-green-200">Resolved</Badge>
        default: return <Badge className="bg-gray-50 text-gray-700 border-gray-200">{status}</Badge>
    }
}

export default function ReportsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [filter, setFilter] = useState('all')
    const [reports, setReports] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchReports()
    }, [])

    const fetchReports = async () => {
        try {
            const { data, error } = await (supabase
                .from('reports') as any)
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.warn("Reports table not found or empty, using empty state");
            } else {
                setReports(data || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            const { error } = await (supabase
                .from('reports') as any)
                .update({ status })
                .eq('id', id);

            if (error) throw error;

            setReports(reports.map(r => r.id === id ? { ...r, status } : r));
        } catch (error) {
            console.error("Error updating report:", error);
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this report?')) return;
        try {
            const { error } = await (supabase
                .from('reports') as any)
                .delete()
                .eq('id', id);

            if (error) throw error;
            setReports(reports.filter(r => r.id !== id));
        } catch (error) {
            console.error("Error deleting report:", error);
        }
    }

    const filteredReports = reports.filter(r => {
        const matchesSearch = (r.content || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (r.reason || '').toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = filter === 'all' || r.status === filter
        return matchesSearch && matchesFilter
    })

    const pendingCount = reports.filter(r => r.status === 'pending').length

    return (
        <AdminPageTransition>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Reports</h1>
                        <p className="text-muted-foreground mt-1">Review flagged content and spam reports.</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative w-full md:w-60">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search reports..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 border-gray-200 focus:border-[#FF5200] focus:ring-[#FF5200]/30 rounded-xl bg-white"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <select
                                className="h-10 rounded-xl border border-gray-200 pl-9 pr-3 text-sm bg-white focus:border-[#FF5200] focus:ring-[#FF5200]/30 outline-none appearance-none cursor-pointer"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="all">All Reports</option>
                                <option value="pending">Pending</option>
                                <option value="investigating">Investigating</option>
                                <option value="resolved">Resolved</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Alert for pending */}
                {pendingCount > 0 && (
                    <Card className="border-none shadow-md bg-gradient-to-r from-red-50 to-white border-l-4 border-l-red-500">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                            </div>
                            <span className="text-red-700 font-medium">{pendingCount} report(s) need your attention</span>
                        </CardContent>
                    </Card>
                )}

                {/* Reports List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Loading reports...</div>
                    ) : filteredReports.length > 0 ? (
                        filteredReports.map((report) => (
                            <Card key={report.id} className="border-none bg-white/60 backdrop-blur-xl shadow-md hover:shadow-lg transition-all duration-300 group">
                                <CardContent className="p-5">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${report.status === 'pending' ? 'bg-red-50' : report.status === 'investigating' ? 'bg-yellow-50' : 'bg-green-50'}`}>
                                            <Flag className={`w-5 h-5 ${report.status === 'pending' ? 'text-red-500' : report.status === 'investigating' ? 'text-yellow-500' : 'text-green-500'}`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                {getTypeBadge(report.type)}
                                                {getStatusBadge(report.status)}
                                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {report.created_at ? formatDistanceToNow(new Date(report.created_at), { addSuffix: true }) : 'Recently'}
                                                </span>
                                            </div>
                                            <p className="text-gray-900 font-semibold mb-1 text-lg">{report.reason}</p>
                                            <p className="text-gray-600 text-sm mb-3 bg-gray-50 p-3 rounded-lg border border-gray-100">{report.content}</p>
                                            <p className="text-xs text-gray-400 flex items-center gap-1">
                                                <Shield className="w-3 h-3" /> Reported by: {report.reported_by || report.reportedBy || 'Anonymous'}
                                            </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <Button variant="outline" size="sm" className="rounded-lg hover:bg-gray-50">
                                                <Eye className="w-4 h-4 mr-1" /> View
                                            </Button>
                                            {report.status !== 'resolved' && (
                                                <Button
                                                    onClick={() => handleUpdateStatus(report.id, 'resolved')}
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-lg text-green-600 border-green-200 hover:bg-green-50"
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-1" /> Resolve
                                                </Button>
                                            )}
                                            <Button
                                                onClick={() => handleDelete(report.id)}
                                                variant="ghost"
                                                size="icon"
                                                className="rounded-lg text-red-400 hover:text-red-500 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                            <Shield className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No reports found.</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminPageTransition>
    )
}
