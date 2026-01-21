import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Eye, Phone, MessageCircle, Heart, TrendingUp, Users, MousePointerClick, Activity } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AnalyticsCharts } from '@/components/business/AnalyticsCharts'
import { EventTypeChart } from '@/components/business/EventTypeChart'
import { EngagementFunnel } from '@/components/business/EngagementFunnel'

export default async function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params

    // Check Auth & Ownership
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/')

    const { data: provider } = await supabase
        .from('providers')
        .select('*')
        .eq('id', id)
        .single()

    if (!provider) return notFound()

    const providerData = provider as { user_id: string; business_name: string; review_count: number }

    if (providerData.user_id !== user.id) redirect('/profile')

    // Fetch Analytics Data
    let events: any[] = []
    let favoritesCount = 0

    try {
        const { data, error } = await supabase
            .from('analytics_events')
            .select('*')
            .eq('provider_id', id)
            .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

        if (!error && data) events = data

        // Get favorites count
        const { count } = await supabase
            .from('favorites')
            .select('*', { count: 'exact', head: true })
            .eq('provider_id', id)

        favoritesCount = count || 0
    } catch (e) {
        console.warn("Analytics table might be missing", e)
    }

    // Calculate Detailed Stats
    const totalViews = events.filter((e: any) => e.event_type === 'view').length
    const phoneClicks = events.filter((e: any) => e.event_type === 'phone_click').length
    const whatsappClicks = events.filter((e: any) => e.event_type === 'whatsapp_click').length
    const enquiryClicks = events.filter((e: any) => e.event_type === 'enquiry_click').length

    // Calculate engagement metrics
    const totalEngagements = phoneClicks + whatsappClicks + enquiryClicks
    const engagementRate = totalViews > 0 ? ((totalEngagements / totalViews) * 100).toFixed(1) : '0.0'
    const conversionRate = totalViews > 0 ? (((phoneClicks + whatsappClicks) / totalViews) * 100).toFixed(1) : '0.0'

    // Calculate trends (compare with previous period)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)

    let previousPeriodEvents: any[] = []
    try {
        const { data } = await supabase
            .from('analytics_events')
            .select('*')
            .eq('provider_id', id)
            .gte('created_at', sixtyDaysAgo.toISOString())
            .lt('created_at', thirtyDaysAgo.toISOString())

        if (data) previousPeriodEvents = data
    } catch (e) { }

    const prevViews = previousPeriodEvents.filter((e: any) => e.event_type === 'view').length
    const prevPhoneClicks = previousPeriodEvents.filter((e: any) => e.event_type === 'phone_click').length
    const prevWhatsappClicks = previousPeriodEvents.filter((e: any) => e.event_type === 'whatsapp_click').length

    const viewsTrend = prevViews > 0 ? (((totalViews - prevViews) / prevViews) * 100).toFixed(0) : '0'
    const phoneTrend = prevPhoneClicks > 0 ? (((phoneClicks - prevPhoneClicks) / prevPhoneClicks) * 100).toFixed(0) : '0'
    const whatsappTrend = prevWhatsappClicks > 0 ? (((whatsappClicks - prevWhatsappClicks) / prevWhatsappClicks) * 100).toFixed(0) : '0'

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                        <div>
                            <Link href="/profile" className="inline-flex items-center text-sm text-gray-500 hover:text-[#FF5200] mb-3 transition-colors group">
                                <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Profile
                            </Link>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FF5200] to-[#FF7A47] bg-clip-text text-transparent mb-1">Analytics Dashboard</h1>
                            <p className="text-gray-600 text-base">{providerData.business_name}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Select defaultValue="30d">
                                <SelectTrigger className="w-[160px] bg-white border-2 border-gray-200 h-11 shadow-sm hover:border-[#FF5200] transition-colors">
                                    <SelectValue placeholder="Period" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="7d">Last 7 Days</SelectItem>
                                    <SelectItem value="30d">Last 30 Days</SelectItem>
                                    <SelectItem value="90d">Last 3 Months</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" disabled className="hidden md:flex h-11 border-2 border-gray-200 bg-white shadow-sm">
                                Export Report
                            </Button>
                        </div>
                    </div>

                    {/* Primary Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatsCard
                            title="Total Views"
                            value={totalViews}
                            icon={<Eye className="w-7 h-7" strokeWidth={2.5} />}
                            trend={viewsTrend}
                            trendLabel="vs last period"
                            gradient="from-blue-500 to-blue-600"
                        />
                        <StatsCard
                            title="Phone Clicks"
                            value={phoneClicks}
                            icon={<Phone className="w-7 h-7" strokeWidth={2.5} />}
                            trend={phoneTrend}
                            trendLabel="vs last period"
                            gradient="from-green-500 to-green-600"
                        />
                        <StatsCard
                            title="WhatsApp Chats"
                            value={whatsappClicks}
                            icon={<MessageCircle className="w-7 h-7" strokeWidth={2.5} />}
                            trend={whatsappTrend}
                            trendLabel="vs last period"
                            gradient="from-emerald-500 to-emerald-600"
                        />
                        <StatsCard
                            title="Favorites"
                            value={favoritesCount}
                            icon={<Heart className="w-7 h-7" strokeWidth={2.5} fill="currentColor" />}
                            gradient="from-red-500 to-rose-500"
                        />
                    </div>

                    {/* Secondary Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-2 border-gray-100 shadow-lg bg-gradient-to-br from-white to-orange-50/30">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-semibold text-gray-600">Engagement Rate</p>
                                    <Activity className="w-5 h-5 text-[#FF5200]" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900">{engagementRate}%</h3>
                                <p className="text-xs text-gray-500 mt-1">Users who interacted after viewing</p>
                            </CardContent>
                        </Card>
                        <Card className="border-2 border-gray-100 shadow-lg bg-gradient-to-br from-white to-purple-50/30">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-semibold text-gray-600">Conversion Rate</p>
                                    <TrendingUp className="w-5 h-5 text-purple-600" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900">{conversionRate}%</h3>
                                <p className="text-xs text-gray-500 mt-1">Views to contact actions</p>
                            </CardContent>
                        </Card>
                        <Card className="border-2 border-gray-100 shadow-lg bg-gradient-to-br from-white to-indigo-50/30">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-semibold text-gray-600">Total Engagements</p>
                                    <MousePointerClick className="w-5 h-5 text-indigo-600" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900">{totalEngagements}</h3>
                                <p className="text-xs text-gray-500 mt-1">All user interactions</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Row 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Trend Chart */}
                        <Card className="border-2 border-gray-100 shadow-xl">
                            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-[#FF5200]" />
                                    Performance Trend
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <AnalyticsCharts events={events} />
                            </CardContent>
                        </Card>

                        {/* Event Type Breakdown */}
                        <Card className="border-2 border-gray-100 shadow-xl">
                            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-[#FF5200]" />
                                    Event Breakdown
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <EventTypeChart
                                    views={totalViews}
                                    phoneClicks={phoneClicks}
                                    whatsappClicks={whatsappClicks}
                                    enquiries={enquiryClicks}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Engagement Funnel */}
                    <Card className="border-2 border-gray-100 shadow-xl">
                        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Users className="w-5 h-5 text-[#FF5200]" />
                                Engagement Funnel
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <EngagementFunnel
                                views={totalViews}
                                engagements={totalEngagements}
                                contacts={phoneClicks + whatsappClicks}
                            />
                        </CardContent>
                    </Card>

                    {/* Performance Insights */}
                    {totalViews > 0 && (
                        <Card className="border-2 border-orange-100 shadow-xl bg-gradient-to-br from-orange-50/50 to-white">
                            <CardHeader>
                                <CardTitle className="text-xl text-[#FF5200]">📊 Performance Insights</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {parseFloat(engagementRate) > 5 && (
                                        <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                            <span className="text-2xl">✅</span>
                                            <div>
                                                <p className="font-semibold text-green-900">Great Engagement!</p>
                                                <p className="text-sm text-green-700">Your {engagementRate}% engagement rate is above average. Keep up the good work!</p>
                                            </div>
                                        </div>
                                    )}
                                    {whatsappClicks > phoneClicks && (
                                        <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                            <span className="text-2xl">💬</span>
                                            <div>
                                                <p className="font-semibold text-blue-900">WhatsApp Preferred</p>
                                                <p className="text-sm text-blue-700">Customers prefer chatting on WhatsApp. Consider highlighting your WhatsApp availability.</p>
                                            </div>
                                        </div>
                                    )}
                                    {totalViews > 0 && totalEngagements === 0 && (
                                        <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <span className="text-2xl">💡</span>
                                            <div>
                                                <p className="font-semibold text-yellow-900">Boost Engagement</p>
                                                <p className="text-sm text-yellow-700">You're getting views but no clicks. Try updating your photos and description to encourage contact.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}

function StatsCard({
    title,
    value,
    icon,
    trend,
    trendLabel,
    gradient
}: {
    title: string
    value: number
    icon: any
    trend?: string
    trendLabel?: string
    gradient: string
}) {
    const isPositive = trend && parseInt(trend) >= 0

    return (
        <Card className="border-2 border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50/50 overflow-hidden relative">
            {/* Decorative background gradient */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-full blur-2xl`}></div>

            <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-600 mb-2">{title}</p>
                        <h3 className="text-4xl font-bold text-gray-900">{value.toLocaleString()}</h3>
                    </div>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-xl shadow-gray-400/20 ring-4 ring-white`}>
                        <div className="text-white scale-110">{icon}</div>
                    </div>
                </div>
                {trend && (
                    <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${isPositive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                        }`}>
                        <span>{isPositive ? '↗' : '↘'}</span>
                        <span>{Math.abs(parseInt(trend))}% {trendLabel}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
