"use client";

import { CheckCircle, XCircle, MoreVertical, Star, MapPin, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Business = {
    id: string;
    business_name: string;
    email: string | null;
    city: string;
    rating: number;
    is_verified: boolean;
    is_responsive: boolean;
    created_at: string;
    status?: 'pending' | 'approved' | 'rejected';
};

export function BusinessTable({ businesses }: { businesses: Business[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();
    const supabase = createClient();

    const ITEMS_PER_PAGE = 50;
    const totalPages = Math.ceil(businesses.length / ITEMS_PER_PAGE);

    // Calculate current items
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentData = businesses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Optional: Scroll to top of table
    };

    const updateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
        setLoadingId(id);
        try {
            const { error } = await supabase
                .from('providers')
                // @ts-ignore
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            toast.success(`Business ${newStatus === 'approved' ? 'Approved' : 'Rejected'}`);
            router.refresh(); // Refresh to show optimized updates
        } catch (error: any) {
            toast.error(error.message || "Failed to update status");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="border border-white/20 rounded-3xl bg-white/70 backdrop-blur-xl shadow-2xl shadow-orange-500/5 overflow-hidden ring-1 ring-black/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gradient-to-r from-orange-50/50 to-white backdrop-blur-md sticky top-0 z-10 text-gray-700 font-semibold border-b border-gray-200/50">
                            <tr>
                                <th className="px-6 py-4">Business</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {currentData.map((business) => (
                                <tr key={business.id} className="hover:bg-orange-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">{business.business_name}</div>
                                        <div className="text-gray-400 text-xs">{format(new Date(business.created_at), "MMM d, yyyy")}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-gray-500">
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span>{business.city}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {(!business.status || business.status === 'pending') && (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                    Pending
                                                </span>
                                            )}
                                            {business.status === 'approved' && (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                    Approved
                                                </span>
                                            )}
                                            {business.status === 'rejected' && (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                    Rejected
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {loadingId === business.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                            ) : (
                                                <>
                                                    {business.status !== 'approved' && (
                                                        <button
                                                            onClick={() => updateStatus(business.id, 'approved')}
                                                            className="p-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {business.status !== 'rejected' && (
                                                        <button
                                                            onClick={() => updateStatus(business.id, 'rejected')}
                                                            className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                            title="Reject"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {businesses.length === 0 && (
                    <div className="p-12 text-center text-gray-400">
                        No businesses found.
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 py-4">
                    <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Prev
                    </button>

                    <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] md:max-w-none scrollbar-hide p-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            // Logic to show limited pages if too many, simplified for now to show all unless huge
                            if (totalPages > 10 && Math.abs(currentPage - page) > 2 && page !== 1 && page !== totalPages) {
                                if (Math.abs(currentPage - page) === 3) return <span key={page} className="text-gray-400">...</span>;
                                return null;
                            }

                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={cn(
                                        "w-8 h-8 flex-shrink-0 flex items-center justify-center text-sm font-medium rounded-lg transition-all",
                                        currentPage === page
                                            ? "bg-[#FF5200] text-white shadow-md shadow-orange-500/20 scale-105"
                                            : "text-gray-600 hover:bg-gray-100"
                                    )}
                                >
                                    {page}
                                </button>
                            )
                        })}
                    </div>

                    <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
