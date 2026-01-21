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
import { Search, Loader2, Eye, Trash2, CheckCircle, XCircle, MapPin, Phone, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { AdminPageTransition } from '@/components/admin/AdminPageTransition'
import Link from 'next/link'

interface Business {
    id: string
    business_name: string
    city: string
    phone: string
    is_verified: boolean
    created_at: string
    slug: string
}

const ITEMS_PER_PAGE = 10

export default function BusinessesPage() {
    const [businesses, setBusinesses] = useState<Business[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [updating, setUpdating] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        fetchBusinesses()
    }, [])

    const fetchBusinesses = async () => {
        setLoading(true)
        const { data, error } = await (supabase as any)
            .from('providers')
            .select('id, business_name, city, phone, is_verified, created_at, slug')
            .order('created_at', { ascending: false })

        if (error) {
            toast.error('Failed to load businesses')
            console.error('Fetch error:', error)
        } else {
            setBusinesses(data || [])
        }
        setLoading(false)
    }

    const toggleVerification = async (id: string, currentStatus: boolean) => {
        setUpdating(id)
        try {
            const { data, error } = await (supabase as any)
                .from('providers')
                .update({ is_verified: !currentStatus })
                .eq('id', id)
                .select()

            if (error) {
                console.error('Update error:', error)
                toast.error('Failed to update: ' + error.message)
            } else {
                // Update local state immediately
                setBusinesses(prev => prev.map(b =>
                    b.id === id ? { ...b, is_verified: !currentStatus } : b
                ))
                toast.success(`Business ${!currentStatus ? 'verified' : 'unverified'} successfully!`)
            }
        } catch (err: any) {
            console.error('Toggle error:', err)
            toast.error('An error occurred')
        } finally {
            setUpdating(null)
        }
    }

    const deleteBusiness = async (id: string) => {
        if (!confirm('Are you sure you want to delete this business?')) return

        try {
            const { error } = await (supabase as any)
                .from('providers')
                .delete()
                .eq('id', id)

            if (error) {
                toast.error('Failed to delete: ' + error.message)
            } else {
                setBusinesses(prev => prev.filter(b => b.id !== id))
                toast.success('Business deleted successfully!')
            }
        } catch (err) {
            toast.error('An error occurred')
        }
    }

    // Filter and paginate
    const filteredBusinesses = businesses.filter(b =>
        b.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.city?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const totalPages = Math.ceil(filteredBusinesses.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedBusinesses = filteredBusinesses.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery])

    return (
        <AdminPageTransition>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Businesses</h1>
                        <p className="text-muted-foreground mt-1">Manage all registered businesses on the platform.</p>
                    </div>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search businesses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 border-gray-200 focus:border-[#FF5200] focus:ring-[#FF5200]/30 rounded-xl bg-white"
                        />
                    </div>
                </div>

                <div className="border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow className="hover:bg-transparent border-gray-100">
                                <TableHead className="w-[300px]">Business</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-[#FF5200] mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : paginatedBusinesses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        No businesses found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedBusinesses.map((business) => (
                                    <TableRow key={business.id} className="hover:bg-orange-50/30 transition-colors border-gray-50 group">
                                        <TableCell>
                                            <span className="font-semibold text-gray-900 group-hover:text-[#FF5200] transition-colors">
                                                {business.business_name}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-gray-600">
                                                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                                                <span className="text-sm">{business.city || '-'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-gray-600">
                                                <Phone className="h-3.5 w-3.5 text-gray-400" />
                                                <span className="text-sm">{business.phone || '-'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className={
                                                    business.is_verified
                                                        ? 'bg-green-50 text-green-700 hover:bg-green-100 border-0'
                                                        : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-0'
                                                }
                                            >
                                                {business.is_verified ? 'Verified' : 'Pending'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-gray-500">
                                                {new Date(business.created_at).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link href={`/business/${business.slug}`} target="_blank">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className={`h-8 w-8 rounded-lg ${business.is_verified ? 'text-yellow-500 hover:bg-yellow-50' : 'text-green-500 hover:bg-green-50'}`}
                                                    onClick={() => toggleVerification(business.id, business.is_verified)}
                                                    disabled={updating === business.id}
                                                >
                                                    {updating === business.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : business.is_verified ? (
                                                        <XCircle className="h-4 w-4" />
                                                    ) : (
                                                        <CheckCircle className="h-4 w-4" />
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                                                    onClick={() => deleteBusiness(business.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-1">
                    <span className="text-sm text-gray-500">
                        Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredBusinesses.length)} of {filteredBusinesses.length}
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="rounded-lg"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum
                            if (totalPages <= 5) {
                                pageNum = i + 1
                            } else if (currentPage <= 3) {
                                pageNum = i + 1
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i
                            } else {
                                pageNum = currentPage - 2 + i
                            }
                            return (
                                <Button
                                    key={pageNum}
                                    variant={currentPage === pageNum ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`rounded-lg w-9 ${currentPage === pageNum ? 'bg-[#FF5200] hover:bg-[#E04800]' : ''}`}
                                >
                                    {pageNum}
                                </Button>
                            )
                        })}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="rounded-lg"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </AdminPageTransition>
    )
}
