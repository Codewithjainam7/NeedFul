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

const monthlyData = [
    { name: "Jan", users: 120, reviews: 45, businesses: 12 },
    { name: "Feb", users: 150, reviews: 62, businesses: 18 },
    { name: "Mar", users: 200, reviews: 89, businesses: 24 },
    { name: "Apr", users: 180, reviews: 78, businesses: 20 },
    { name: "May", users: 220, reviews: 95, businesses: 28 },
    { name: "Jun", users: 280, reviews: 120, businesses: 35 },
    { name: "Jul", users: 320, reviews: 145, businesses: 42 },
];

const weeklyData = [
    { day: "Mon", signups: 12, reviews: 8 },
    { day: "Tue", signups: 18, reviews: 12 },
    { day: "Wed", signups: 15, reviews: 10 },
    { day: "Thu", signups: 22, reviews: 15 },
    { day: "Fri", signups: 28, reviews: 20 },
    { day: "Sat", signups: 14, reviews: 8 },
    { day: "Sun", signups: 10, reviews: 5 },
];

const reviewDistribution = [
    { name: "5 Stars", value: 45, color: "#22c55e" },
    { name: "4 Stars", value: 30, color: "#84cc16" },
    { name: "3 Stars", value: 15, color: "#eab308" },
    { name: "2 Stars", value: 7, color: "#f97316" },
    { name: "1 Star", value: 3, color: "#ef4444" },
];

export function DashboardCharts() {
    const [stats, setStats] = useState({
        pendingCount: 0,
        verifiedCount: 0,
        avgRating: 0,
        todaySignups: 0,
    });
    const supabase = createClient();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [pending, verified, reviews, todayUsers] = await Promise.all([
            (supabase as any).from('providers').select('id', { count: 'exact', head: true }).eq('is_verified', false),
            (supabase as any).from('providers').select('id', { count: 'exact', head: true }).eq('is_verified', true),
            (supabase as any).from('reviews').select('rating'),
            (supabase as any).from('users').select('id', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
        ]);

        const avgRating = reviews.data?.length > 0
            ? (reviews.data.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.data.length).toFixed(1)
            : 0;

        setStats({
            pendingCount: pending.count || 0,
            verifiedCount: verified.count || 0,
            avgRating: Number(avgRating),
            todaySignups: todayUsers.count || 0,
        });
    };

    return (
        <div className="space-y-6">
            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-orange-100 bg-gradient-to-br from-orange-50 to-white">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900">{stats.pendingCount}</p>
                                <p className="text-xs text-gray-500">Pending Approval</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-green-100 bg-gradient-to-br from-green-50 to-white">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900">{stats.verifiedCount}</p>
                                <p className="text-xs text-gray-500">Verified Businesses</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-yellow-100 bg-gradient-to-br from-yellow-50 to-white">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                                <Star className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900">{stats.avgRating}⭐</p>
                                <p className="text-xs text-gray-500">Avg. Rating</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-white">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900">{stats.todaySignups}</p>
                                <p className="text-xs text-gray-500">Today's Signups</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Charts */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 border-gray-100 shadow-sm">
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

                <Card className="col-span-3 border-gray-100 shadow-sm">
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

            {/* Weekly Activity */}
            <Card className="border-gray-100 shadow-sm">
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
        </div>
    );
}
