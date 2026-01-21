'use client'

interface EngagementFunnelProps {
    views: number
    engagements: number
    contacts: number
}

export function EngagementFunnel({ views, engagements, contacts }: EngagementFunnelProps) {
    const maxWidth = 100

    const viewsPercent = 100
    const engagementsPercent = views > 0 ? (engagements / views) * 100 : 0
    const contactsPercent = views > 0 ? (contacts / views) * 100 : 0

    const stages = [
        {
            label: 'Profile Views',
            value: views,
            percent: viewsPercent,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700'
        },
        {
            label: 'User Engagements',
            value: engagements,
            percent: engagementsPercent,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-700'
        },
        {
            label: 'Contact Actions',
            value: contacts,
            percent: contactsPercent,
            color: 'from-[#FF5200] to-[#FF7A47]',
            bgColor: 'bg-orange-50',
            textColor: 'text-[#FF5200]'
        }
    ]

    if (views === 0) {
        return (
            <div className="flex items-center justify-center h-[200px] text-gray-400">
                <div className="text-center">
                    <p className="text-lg font-semibold mb-2">No Funnel Data Yet</p>
                    <p className="text-sm">User journey will be tracked here</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 py-4">
            {stages.map((stage, index) => (
                <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${stage.color} flex items-center justify-center text-white font-bold shadow-lg`}>
                                {index + 1}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{stage.label}</p>
                                <p className="text-sm text-gray-500">{stage.value.toLocaleString()} users</p>
                            </div>
                        </div>
                        <div className={`px-4 py-2 rounded-lg ${stage.bgColor}`}>
                            <p className={`text-lg font-bold ${stage.textColor}`}>
                                {stage.percent.toFixed(1)}%
                            </p>
                        </div>
                    </div>

                    {/* Visual Bar */}
                    <div className="relative h-12 bg-gray-100 rounded-xl overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${stage.color} transition-all duration-1000 ease-out flex items-center justify-end pr-4`}
                            style={{ width: `${Math.max(stage.percent, 5)}%` }}
                        >
                            {stage.value > 0 && (
                                <span className="text-white font-bold text-sm drop-shadow-lg">
                                    {stage.value}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Drop-off indicator */}
                    {index < stages.length - 1 && stages[index + 1].value < stage.value && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 ml-14">
                            <span>↘</span>
                            <span>
                                {((stage.value - stages[index + 1].value) / stage.value * 100).toFixed(1)}% drop-off
                            </span>
                        </div>
                    )}
                </div>
            ))}

            {/* Summary Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <p className="text-sm text-gray-600 mb-1">Engagement Rate</p>
                    <p className="text-2xl font-bold text-green-700">
                        {engagementsPercent.toFixed(1)}%
                    </p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
                    <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
                    <p className="text-2xl font-bold text-[#FF5200]">
                        {contactsPercent.toFixed(1)}%
                    </p>
                </div>
            </div>
        </div>
    )
}
