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
import { format, subDays, startOfDay, parse } from 'date-fns'

export function AnalyticsCharts({ events }: { events: any[] }) {
    // Transform events into chart data (group by date)
    const data = processEvents(events)

    return (
        <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF5200" stopOpacity={0.3} />
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
                        allowDecimals={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            padding: '12px'
                        }}
                        labelStyle={{
                            fontWeight: 600,
                            marginBottom: '4px',
                            color: '#1F2937'
                        }}
                        itemStyle={{
                            color: '#FF5200',
                            fontSize: '14px'
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
    if (!events || events.length === 0) {
        // If no events, return last 7 days with 0 views
        return generateEmptyData()
    }

    // Group events by date
    const eventsByDate: Record<string, number> = {}

    events.forEach((event) => {
        // Parse the created_at timestamp and format as date
        const eventDate = new Date(event.created_at)
        const dateKey = format(eventDate, 'MMM dd')

        // Count only 'view' events
        if (event.event_type === 'view') {
            eventsByDate[dateKey] = (eventsByDate[dateKey] || 0) + 1
        }
    })

    // Generate data for last 30 days
    const chartData = []
    for (let i = 29; i >= 0; i--) {
        const date = subDays(new Date(), i)
        const dateKey = format(date, 'MMM dd')

        chartData.push({
            date: dateKey,
            views: eventsByDate[dateKey] || 0
        })
    }

    return chartData
}

function generateEmptyData() {
    // Generate last 7 days with 0 views
    const chartData = []
    for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i)
        chartData.push({
            date: format(date, 'MMM dd'),
            views: 0
        })
    }
    return chartData
}
