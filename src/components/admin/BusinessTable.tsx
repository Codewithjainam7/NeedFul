"use client";

import { CheckCircle, XCircle, MoreVertical, Star, MapPin } from "lucide-react";
import { format } from "date-fns";

type Business = {
    id: string;
    business_name: string;
    email: string | null;
    city: string;
    rating: number;
    is_verified: boolean;
    is_responsive: boolean;
    created_at: string;
};

export function BusinessTable({ businesses }: { businesses: Business[] }) {
    return (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                        <tr>
                            <th className="px-6 py-4">Business</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Rating</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {businesses.map((business) => (
                            <tr key={business.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-foreground">{business.business_name}</div>
                                    <div className="text-muted-foreground text-xs">{business.email || "No email"}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>{business.city}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {business.is_verified ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600">
                                                <CheckCircle className="w-3.5 h-3.5" />
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600">
                                                <XCircle className="w-3.5 h-3.5" />
                                                Unverified
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="font-semibold">{business.rating.toFixed(1)}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">
                                    {format(new Date(business.created_at), "MMM d, yyyy")}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
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
