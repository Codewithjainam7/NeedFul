import { createClient } from "@/lib/supabase/server";
import { BusinessTable } from "@/components/admin/BusinessTable";
import { Store, Users, Star, Activity, TrendingUp } from "lucide-react";
import { AdminPageTransition } from "@/components/admin/AdminPageTransition";

async function getStats(supabase: any) {
    const [
        { count: businessCount },
        { count: userCount },
        { count: reviewCount },
    ] = await Promise.all([
        supabase.from("providers").select("*", { count: "exact", head: true }),
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("reviews").select("*", { count: "exact", head: true }),
    ]);

    return {
        businessCount: businessCount || 0,
        userCount: userCount || 0,
        reviewCount: reviewCount || 0,
    };
}

async function getBusinesses(supabase: any) {
    const { data } = await supabase
        .from("providers")
        .select("id, business_name, email, city, rating, is_verified, is_responsive, created_at, status")
        .order("created_at", { ascending: false });

    return data || [];
}

export default async function DashboardPage() {
    const supabase = await createClient();
    const stats = await getStats(supabase);
    const businesses = await getBusinesses(supabase);

    return (
        <AdminPageTransition>
            <div className="space-y-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                    <p className="text-gray-500">Overview of your platform's performance.</p>
                </div>
                {/* ... rest of content ... */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl bg-gradient-to-br from-[#FF5200] to-orange-600 p-6 shadow-lg shadow-orange-500/20 text-white">
                        <div className="flex items-center justify-between pb-2">
                            <h3 className="tracking-tight text-sm font-medium text-white/80">Total Businesses</h3>
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                <Store className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold">{stats.businessCount.toLocaleString()}</div>
                        <div className="flex items-center gap-1 mt-2">
                            <TrendingUp className="w-3 h-3" />
                            <span className="text-xs text-white/80">+2 from last month</span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between pb-2">
                            <h3 className="tracking-tight text-sm font-medium text-gray-500">Total Users</h3>
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Users className="h-5 w-5 text-blue-500" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{stats.userCount.toLocaleString()}</div>
                        <div className="flex items-center gap-1 mt-2">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-gray-500">+12% from last month</span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between pb-2">
                            <h3 className="tracking-tight text-sm font-medium text-gray-500">Total Reviews</h3>
                            <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                                <Star className="h-5 w-5 text-yellow-500" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{stats.reviewCount.toLocaleString()}</div>
                        <div className="flex items-center gap-1 mt-2">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-gray-500">+4% from last month</span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between pb-2">
                            <h3 className="tracking-tight text-sm font-medium text-gray-500">Active Now</h3>
                            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                                <Activity className="h-5 w-5 text-green-500" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">+573</div>
                        <div className="flex items-center gap-1 mt-2">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-gray-500">+201 since last hour</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="relative inline-block pb-2">
                            <h2 className="text-xl font-bold tracking-tight text-gray-900">Recent Businesses</h2>
                            <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-[#FF5200] rounded-full"></span>
                        </div>
                    </div>
                    <BusinessTable businesses={businesses} />
                </div>
            </div>
        </AdminPageTransition>
    );
}
