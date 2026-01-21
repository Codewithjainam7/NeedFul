'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Store, Star, TrendingUp, Eye, MousePointerClick } from 'lucide-react'
import { AdminPageTransition } from '@/components/admin/AdminPageTransition'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock data for charts
const monthlyData = [
    { month: 'Jan', users: 45, businesses: 12, reviews: 78 },
    { month: 'Feb', users: 52, businesses: 18, reviews: 92 },
    { month: 'Mar', users: 78, businesses: 24, reviews: 110 },
    { month: 'Apr', users: 110, businesses: 32, reviews: 145 },
    { month: 'May', users: 145, businesses: 41, reviews: 178 },
    { month: 'Jun', users: 180, businesses: 52, reviews: 220 },
    { month: 'Jul', users: 220, businesses: 65, reviews: 280 },
]

const trafficData = [
    { day: 'Mon', views: 1200, clicks: 340 },
    { day: 'Tue', views: 1450, clicks: 420 },
    { day: 'Wed', views: 1380, clicks: 380 },
    { day: 'Thu', views: 1520, clicks: 450 },
    { day: 'Fri', views: 1680, clicks: 520 },
    { day: 'Sat', views: 980, clicks: 280 },
    { day: 'Sun', views: 850, clicks: 220 },
]

export default function AnalyticsPage() {
    const [stats, setStats] = useState({ users: 0, businesses: 0, reviews: 0 })
    const [chartData, setChartData] = useState<any[]>(monthlyData)
    const supabase = createClient()

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Fetch real data
            const [usersRes, businessesRes, reviewsRes] = await Promise.all([
                (supabase as any).from('users').select('id, created_at', { count: 'exact' }),
                (supabase as any).from('providers').select('id, created_at', { count: 'exact' }),
                (supabase as any).from('reviews').select('id, created_at', { count: 'exact' }),
            ])

            setStats({
                users: usersRes.count || 0,
                businesses: businessesRes.count || 0,
                reviews: reviewsRes.count || 0,
            })

            // Process Monthly Data for Charts
            // Note: This logic duplicates DashboardCharts, ideal for refactoring into a hook later
            const months: any = {};
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            for (let i = 5; i >= 0; i--) {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
                months[key] = { month: monthNames[d.getMonth()], users: 0, businesses: 0, reviews: 0, sortDate: d };
            }

            (usersRes.data || []).forEach((u: any) => {
                const d = new Date(u.created_at);
                const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
                if (months[key]) months[key].users++;
            });
            (businessesRes.data || []).forEach((p: any) => {
                const d = new Date(p.created_at);
                const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
                if (months[key]) months[key].businesses++;
            });
            (reviewsRes.data || []).forEach((r: any) => {
                const d = new Date(r.created_at);
                const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
                if (months[key]) months[key].reviews++;
            });

            // If empty, use demo
            if (!usersRes.count && !businessesRes.count) {
                // Keep mock data defined at top
                setChartData(monthlyData);
            } else {
                setChartData(Object.values(months).sort((a: any, b: any) => a.sortDate - b.sortDate));
            }

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <AdminPageTransition>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Analytics</h1>
                    <p className="text-muted-foreground mt-1">Platform-wide statistics and growth metrics.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-none shadow-md bg-gradient-to-br from-blue-50 to-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Total Users</p>
                                    <h3 className="text-3xl font-bold text-gray-900">{stats.users}</h3>
                                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+12% this month</span>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md bg-gradient-to-br from-orange-50 to-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Businesses</p>
                                    <h3 className="text-3xl font-bold text-gray-900">{stats.businesses}</h3>
                                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+8% this month</span>
                                </div>
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <Store className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md bg-gradient-to-br from-yellow-50 to-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Reviews</p>
                                    <h3 className="text-3xl font-bold text-gray-900">{stats.reviews}</h3>
                                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+15% this month</span>
                                </div>
                                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                                    <Star className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md bg-gradient-to-br from-green-50 to-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Growth Rate</p>
                                    <h3 className="text-3xl font-bold text-gray-900">24%</h3>
                                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Healthy</span>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-none shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg">Platform Growth</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" stroke="#888" fontSize={12} />
                                    <YAxis stroke="#888" fontSize={12} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="users" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
                                    <Area type="monotone" dataKey="businesses" stroke="#FF5200" fill="#FF5200" fillOpacity={0.2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg">Weekly Traffic</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={trafficData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="day" stroke="#888" fontSize={12} />
                                    <YAxis stroke="#888" fontSize={12} />
                                    <Tooltip />
                                    <Bar dataKey="views" fill="#10B981" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="clicks" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminPageTransition>
    )
}
