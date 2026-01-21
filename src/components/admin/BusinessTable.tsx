"use client";

import { CheckCircle, XCircle, MoreVertical, Star, MapPin, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
    const router = useRouter();
    const supabase = createClient();

    const updateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
        setLoadingId(id);
        try {
            const { error } = await supabase
                .from('providers')
                .update({ status: newStatus } as any)
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
        <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                        <tr>
                            <th className="px-6 py-4">Business</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {businesses.map((business) => (
                            <tr key={business.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-foreground">{business.business_name}</div>
                                    <div className="text-muted-foreground text-xs">{format(new Date(business.created_at), "MMM d, yyyy")}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>{business.city}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {(!business.status || business.status === 'pending') && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-600">
                                                Pending
                                            </span>
                                        )}
                                        {business.status === 'approved' && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600">
                                                Approved
                                            </span>
                                        )}
                                        {business.status === 'rejected' && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-600">
                                                Rejected
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {loadingId === business.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                        ) : (
                                            <>
                                                {business.status !== 'approved' && (
                                                    <button
                                                        onClick={() => updateStatus(business.id, 'approved')}
                                                        className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {business.status !== 'rejected' && (
                                                    <button
                                                        onClick={() => updateStatus(business.id, 'rejected')}
                                                        className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
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
                <div className="p-12 text-center text-muted-foreground">
                    No businesses found.
                </div>
            )}
        </div>
    );
}
