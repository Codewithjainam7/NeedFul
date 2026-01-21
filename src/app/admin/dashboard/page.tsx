import { createClient } from "@/lib/supabase/server";
import { BusinessTable } from "@/components/admin/BusinessTable";
import { Store, Users, Star, Activity } from "lucide-react";

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
        .select("id, business_name, email, city, rating, is_verified, is_responsive, created_at")
        .order("created_at", { ascending: false });

    return data || [];
}

export default async function DashboardPage() {
    const supabase = await createClient();
    const stats = await getStats(supabase);
    const businesses = await getBusinesses(supabase);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your platform's performance.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Total Businesses</h3>
                        <Store className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-2xl font-bold">{stats.businessCount}</div>
                    <p className="text-xs text-muted-foreground mt-1">+2 from last month</p>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Total Users</h3>
                        <Users className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold">{stats.userCount}</div>
                    <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Total Reviews</h3>
                        <Star className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div className="text-2xl font-bold">{stats.reviewCount}</div>
                    <p className="text-xs text-muted-foreground mt-1">+4% from last month</p>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Active Now</h3>
                        <Activity className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold">+573</div>
                    <p className="text-xs text-muted-foreground mt-1">+201 since last hour</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight">Recent Businesses</h2>
                    <button className="text-sm text-primary hover:underline">View All</button>
                </div>
                <BusinessTable businesses={businesses} />
            </div>
        </div>
    );
}
