import { createClient } from "@/lib/supabase/server";
import { BusinessTable } from "@/components/admin/BusinessTable";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { Store, Users, Star, Activity, TrendingUp, ArrowRight } from "lucide-react";
import { AdminPageTransition } from "@/components/admin/AdminPageTransition";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

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
        .order("created_at", { ascending: false })
        .limit(5);

    return data || [];
}

async function getRecentUsers(supabase: any) {
    const { data } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

    return data || [];
}

export default async function DashboardPage() {
    const supabase = await createClient();
    const stats = await getStats(supabase);
    const businesses = await getBusinesses(supabase);
    const recentUsers = await getRecentUsers(supabase);

    return (
        <AdminPageTransition>
            <div className="space-y-8 pb-10">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                    <p className="text-gray-500">Overview of your platform's performance.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-3xl bg-gradient-to-br from-[#FF5200] to-orange-600 p-6 shadow-xl shadow-orange-500/20 text-white hover:scale-[1.02] transition-transform duration-300">
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

                    <div className="rounded-3xl border border-white/60 bg-white/60 backdrop-blur-xl p-6 shadow-md hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02] hover:bg-white group">
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

                    <div className="rounded-3xl border border-white/60 bg-white/60 backdrop-blur-xl p-6 shadow-md hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 hover:scale-[1.02] hover:bg-white group">
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

                    <div className="rounded-3xl border border-white/60 bg-white/60 backdrop-blur-xl p-6 shadow-md hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 hover:scale-[1.02] hover:bg-white group">
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

                {/* Charts Area */}
                <DashboardCharts />

                {/* Content Tables Grid */}
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Recent Businesses */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="relative inline-block pb-2">
                                <h2 className="text-xl font-bold tracking-tight text-gray-900">Recent Businesses</h2>
                                <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-[#FF5200] rounded-full"></span>
                            </div>
                            <Link href="/admin/businesses" className="text-sm font-medium text-[#FF5200] hover:text-orange-700 flex items-center gap-1">
                                View All <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <BusinessTable businesses={businesses} />
                    </div>

                    {/* Recent Users */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="relative inline-block pb-2">
                                <h2 className="text-xl font-bold tracking-tight text-gray-900">Recent Users</h2>
                                <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-blue-500 rounded-full"></span>
                            </div>
                            <Link href="/admin/users" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                View All <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="border border-white/20 rounded-3xl bg-white/70 backdrop-blur-xl shadow-2xl shadow-orange-500/5 overflow-hidden ring-1 ring-black/5">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                                        <tr>
                                            <th className="px-6 py-3">User</th>
                                            <th className="px-6 py-3">Role</th>
                                            <th className="px-6 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentUsers.map((user: any) => (
                                            <tr key={user.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 border border-white shadow-sm">
                                                            {user.name?.[0] || user.email?.[0]?.toUpperCase()}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span>{user.name || 'Anonymous'}</span>
                                                            <span className="text-xs text-gray-500 font-normal">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge
                                                        variant="secondary"
                                                        className={
                                                            user.role === 'admin' ? 'bg-orange-50 text-[#FF5200]' :
                                                                user.role === 'provider' ? 'bg-blue-50 text-blue-600' :
                                                                    'bg-gray-100 text-gray-600'
                                                        }
                                                    >
                                                        {user.role || 'user'}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                        <span className="text-gray-500">Active</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminPageTransition>
    );
}
