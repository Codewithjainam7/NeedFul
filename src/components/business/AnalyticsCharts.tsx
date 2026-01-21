'use client'

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts'

export function AnalyticsCharts({ events }: { events: any[] }) {

    // Transform events into chart data (group by date)
    // For now, we'll generate some dummy trend data if events are empty to show the UI
    const data = events.length > 0 ? processEvents(events) : generateDummyData()

    return (
        <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF5200" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#FF5200" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="views"
                        stroke="#FF5200"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorViews)"
                        name="Page Views"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

function processEvents(events: any[]) {
    // Logic to group by date would go here
    return []
}

function generateDummyData() {
    return [
        { date: 'Mon', views: 40 },
        { date: 'Tue', views: 30 },
        { date: 'Wed', views: 65 },
        { date: 'Thu', views: 50 },
        { date: 'Fri', views: 85 },
        { date: 'Sat', views: 120 },
        { date: 'Sun', views: 95 },
    ]
}
