"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, Star } from "lucide-react";



export function DashboardCharts() {
    const [stats, setStats] = useState({
        pendingCount: 0,
        verifiedCount: 0,
        avgRating: 0,
        todaySignups: 0,
    });
    const [monthlyData, setMonthlyData] = useState<any[]>([]);
    const [weeklyData, setWeeklyData] = useState<any[]>([]);
    const [reviewDistribution, setReviewDistribution] = useState<any[]>([]);
    const [topCities, setTopCities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchStats();

        // Subscribe to real-time changes
        const channel = supabase
            .channel('dashboard_updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'providers' }, () => fetchStats())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => fetchStats())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => fetchStats())
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchStats = async () => {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // 1. Fetch raw data needed for charts
            const [
                { data: providers },
                { data: users },
                { data: reviews }
            ] = await Promise.all([
                (supabase as any).from('providers').select('id, created_at, is_verified, city, rating'),
                (supabase as any).from('users').select('id, created_at'),
                (supabase as any).from('reviews').select('id, created_at, rating')
            ]);

            const safeProviders = providers || [];
            const safeUsers = users || [];
            const safeReviews = reviews || [];

            // --- Stats Logic ---
            const pendingCount = safeProviders.filter((p: any) => !p.is_verified).length + 4; // +4 Demo
            const verifiedCount = safeProviders.filter((p: any) => p.is_verified).length + 12; // +12 Demo
            const avgRatingVal = safeReviews.length > 0
                ? (safeReviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / safeReviews.length).toFixed(1)
                : "4.8"; // Demo fallback rating
            const todaySignups = safeUsers.filter((u: any) => new Date(u.created_at) >= today).length + 5; // +5 Demo

            setStats({
                pendingCount,
                verifiedCount,
                avgRating: Number(avgRatingVal),
                todaySignups
            });

            // --- Monthly Growth Logic (Last 6 Months) ---
            const months: any = {};
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            // Initialize last 6 months with BASELINE DEMO DATA
            for (let i = 5; i >= 0; i--) {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;

                // Demo Baseline Pattern: Linear growth
                const baseUsers = 120 + ((5 - i) * 30); // 120, 150, 180...
                const baseReviews = 45 + ((5 - i) * 15);

                months[key] = {
                    name: monthNames[d.getMonth()],
                    users: baseUsers,
                    reviews: baseReviews,
                    businesses: 10 + ((5 - i) * 5),
                    sortDate: d
                };
            }

            safeUsers.forEach((u: any) => {
                const d = new Date(u.created_at);
                const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
                if (months[key]) months[key].users++;
            });
            safeProviders.forEach((p: any) => {
                const d = new Date(p.created_at);
                const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
                if (months[key]) months[key].businesses++;
            });
            safeReviews.forEach((r: any) => {
                const d = new Date(r.created_at);
                const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
                if (months[key]) months[key].reviews++;
            });

            // Convert to array and sort
            const growthChartData = Object.values(months).sort((a: any, b: any) => a.sortDate - b.sortDate);
            setMonthlyData(growthChartData);

            // --- Weekly Activity Logic (Last 7 Days) ---
            const days: any = {};
            const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dayName = dayNames[d.getDay()];
                const dateKey = d.toISOString().split('T')[0];

                // Demo Baseline
                days[dateKey] = {
                    day: dayName,
                    signups: Math.floor(Math.random() * 10) + 5, // 5-15 random
                    reviews: Math.floor(Math.random() * 5) + 2
                };
            }

            safeUsers.forEach((u: any) => {
                const dateKey = new Date(u.created_at).toISOString().split('T')[0];
                if (days[dateKey]) days[dateKey].signups++;
            });
            safeReviews.forEach((r: any) => {
                const dateKey = new Date(r.created_at).toISOString().split('T')[0];
                if (days[dateKey]) days[dateKey].reviews++;
            });
            setWeeklyData(Object.values(days));

            // --- Review Distribution Logic ---
            const dist = [0, 3, 7, 15, 30, 45]; // Demo Baseline (Indices 1-5 used)
            safeReviews.forEach((r: any) => {
                const rating = Math.round(r.rating || 0);
                if (rating >= 1 && rating <= 5) dist[rating]++;
            });

            const distChartData = [
                { name: "5 Stars", value: dist[5], color: "#22c55e" },
                { name: "4 Stars", value: dist[4], color: "#84cc16" },
                { name: "3 Stars", value: dist[3], color: "#eab308" },
                { name: "2 Stars", value: dist[2], color: "#f97316" },
                { name: "1 Star", value: dist[1], color: "#ef4444" },
            ].filter(d => d.value > 0);

            setReviewDistribution(distChartData);

            // --- Top Cities Logic ---
            const cityCounts: any = {
                "New York": 24,    // Demo
                "Los Angeles": 18, // Demo
                "Chicago": 12,     // Demo
                "Miami": 8,        // Demo
            };
            safeProviders.forEach((p: any) => {
                if (p.city) {
                    const c = p.city.trim();
                    cityCounts[c] = (cityCounts[c] || 0) + 1;
                }
            });
            const sortedCities = Object.entries(cityCounts)
                .map(([name, value]) => ({ name, value }))
                .sort((a: any, b: any) => b.value - a.value)
                .slice(0, 5); // Top 5
            setTopCities(sortedCities);

        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-32">
                    {[1, 2, 3, 4].map(i => <div key={i} className="bg-gray-100 rounded-2xl"></div>)}
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 h-[300px]">
                    <div className="col-span-4 bg-gray-100 rounded-2xl"></div>
                    <div className="col-span-3 bg-gray-100 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-orange-100 bg-gradient-to-br from-orange-50 to-white hover:scale-[1.02] transition-transform duration-300 shadow-sm hover:shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900 font-[family-name:var(--font-space-grotesk)]">{stats.pendingCount}</p>
                                <p className="text-xs text-gray-500">Pending Approval</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-green-100 bg-gradient-to-br from-green-50 to-white hover:scale-[1.02] transition-transform duration-300 shadow-sm hover:shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900 font-[family-name:var(--font-space-grotesk)]">{stats.verifiedCount}</p>
                                <p className="text-xs text-gray-500">Verified Businesses</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-yellow-100 bg-gradient-to-br from-yellow-50 to-white hover:scale-[1.02] transition-transform duration-300 shadow-sm hover:shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                                <Star className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900 font-[family-name:var(--font-space-grotesk)]">{stats.avgRating}⭐</p>
                                <p className="text-xs text-gray-500">Avg. Rating</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-white hover:scale-[1.02] transition-transform duration-300 shadow-sm hover:shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900 font-[family-name:var(--font-space-grotesk)]">{stats.todaySignups}</p>
                                <p className="text-xs text-gray-500">Today's Signups</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Charts */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 border-white/60 bg-white/60 backdrop-blur-xl shadow-md hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-gray-900">Platform Growth</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={monthlyData}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FF5200" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#FF5200" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Area type="monotone" dataKey="users" stroke="#FF5200" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" name="Users" />
                                    <Area type="monotone" dataKey="reviews" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorReviews)" name="Reviews" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 border-white/60 bg-white/60 backdrop-blur-xl shadow-md hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-gray-900">Review Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={reviewDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                                        {reviewDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                            {reviewDistribution.map((item) => (
                                <div key={item.name} className="flex items-center gap-1.5 text-xs">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-gray-600">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Weekly Activity */}
                <Card className="border-white/60 bg-white/60 backdrop-blur-xl shadow-md hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-gray-900">Weekly Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                                    <Bar dataKey="signups" fill="#FF5200" radius={[4, 4, 0, 0]} name="Signups" />
                                    <Bar dataKey="reviews" fill="#10b981" radius={[4, 4, 0, 0]} name="Reviews" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Cities */}
                <Card className="border-white/60 bg-white/60 backdrop-blur-xl shadow-md hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-gray-900">Top Locations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px]">
                            {topCities.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={topCities} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                                        <XAxis type="number" stroke="#888" fontSize={12} hide />
                                        <YAxis dataKey="name" type="category" stroke="#666" fontSize={12} tickLine={false} axisLine={false} width={100} />
                                        <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                                        <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Businesses" barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-gray-500 text-sm">No location data available</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
