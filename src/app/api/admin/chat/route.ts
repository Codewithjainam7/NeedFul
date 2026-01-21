import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

const ADMIN_SYSTEM_PROMPT = `You are **NeedFul Admin AI** — an intelligent analytics assistant for the NeedFul platform administrators.

═══════════════════════════════════════════════════════════════
🎯 YOUR ROLE
═══════════════════════════════════════════════════════════════
You are a professional, data-driven AI assistant that helps admins:
- Understand platform metrics and KPIs
- Get quick insights on businesses, users, and reviews
- Track pending approvals and actions needed
- Identify trends and patterns
- Make data-informed decisions

═══════════════════════════════════════════════════════════════
📊 DATA YOU CAN ACCESS (via Context)
═══════════════════════════════════════════════════════════════
- Total counts: Businesses, Users, Reviews
- Pending approvals count
- TODAY's activity (new signups, reviews)
- LAST 7 DAYS (weekly summary)
- LAST 30 DAYS (monthly summary)
- Recent registrations (businesses & users)
- Top-rated and low-rated providers
- City-wise distribution
- Recent reviews

═══════════════════════════════════════════════════════════════
💬 QUERY TYPES YOU HANDLE
═══════════════════════════════════════════════════════════════
1. **Stats Queries**: "Total businesses?", "Kitne users hai?", "Review count?"
2. **Approvals**: "Pending approvals?", "Kitne businesses pending hai?"
3. **Performance**: "Top 5 rated providers?", "Lowest rated?", "Best performers?"
4. **Activity**: "Recent signups?", "New reviews?", "Today's activity?"
5. **Weekly Stats**: "Last week summary?", "This week signups?", "7 din ka data?"
6. **Monthly Stats**: "Last month stats?", "Monthly growth?", "30 din ka summary?"
7. **Trends**: "User growth?", "Business trend?", "Comparison this vs last week?"
8. **Alerts**: "Low rated providers?", "Issues?", "Needs attention?"

═══════════════════════════════════════════════════════════════
📋 RESPONSE FORMAT
═══════════════════════════════════════════════════════════════
- Be concise and data-focused
- Use numbers and metrics prominently
- Format with bullet points for clarity
- Include trends/comparisons when relevant
- Add actionable insights when appropriate

Example Response:
"📊 **Platform Overview**

• **Total Businesses**: 156 (+12 this month)
• **Total Users**: 2,450 (+8% growth)
• **Reviews**: 890

🔔 **Needs Attention**:
• 5 pending approvals
• 2 providers with <3⭐ rating

Kya aur details chahiye?"

═══════════════════════════════════════════════════════════════
🚫 OUT OF SCOPE
═══════════════════════════════════════════════════════════════
Politely decline non-admin queries:
"Main sirf admin analytics aur platform metrics mein madad kar sakta hoon. Kripya stats, approvals, ya performance related questions poochein! 📊"

═══════════════════════════════════════════════════════════════
⚠️ IMPORTANT
═══════════════════════════════════════════════════════════════
- Use ONLY data from Context - never hallucinate numbers
- Be professional but friendly (Hinglish allowed)
- Always offer to help with related queries
- If specific data unavailable, say so clearly
`

export async function POST(request: Request) {
    try {
        const { messages } = await request.json()

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({ error: 'Messages are required' }, { status: 400 })
        }

        const lastMessage = messages[messages.length - 1]
        const message = lastMessage.content.toLowerCase()
        const messageHistory = messages.slice(0, -1).map((m: any) => ({
            role: m.role,
            content: m.content
        }))

        const supabase = await createClient()

        // Date calculations
        const now = new Date()
        const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
        const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
        const today = new Date(now.setHours(0, 0, 0, 0)).toISOString()

        // Fetch admin stats - Overall
        const [
            { count: businessCount },
            { count: userCount },
            { count: reviewCount },
            { count: pendingCount },
        ] = await Promise.all([
            supabase.from('providers').select('*', { count: 'exact', head: true }),
            supabase.from('users').select('*', { count: 'exact', head: true }),
            supabase.from('reviews').select('*', { count: 'exact', head: true }),
            supabase.from('providers').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        ])

        // Fetch time-based stats - Last 7 Days
        const [
            { count: businessLast7Days },
            { count: userLast7Days },
            { count: reviewLast7Days },
        ] = await Promise.all([
            supabase.from('providers').select('*', { count: 'exact', head: true }).gte('created_at', last7Days),
            supabase.from('users').select('*', { count: 'exact', head: true }).gte('created_at', last7Days),
            supabase.from('reviews').select('*', { count: 'exact', head: true }).gte('created_at', last7Days),
        ])

        // Fetch time-based stats - Last 30 Days
        const [
            { count: businessLast30Days },
            { count: userLast30Days },
            { count: reviewLast30Days },
        ] = await Promise.all([
            supabase.from('providers').select('*', { count: 'exact', head: true }).gte('created_at', last30Days),
            supabase.from('users').select('*', { count: 'exact', head: true }).gte('created_at', last30Days),
            supabase.from('reviews').select('*', { count: 'exact', head: true }).gte('created_at', last30Days),
        ])

        // Fetch today's stats
        const [
            { count: businessToday },
            { count: userToday },
            { count: reviewToday },
        ] = await Promise.all([
            supabase.from('providers').select('*', { count: 'exact', head: true }).gte('created_at', today),
            supabase.from('users').select('*', { count: 'exact', head: true }).gte('created_at', today),
            supabase.from('reviews').select('*', { count: 'exact', head: true }).gte('created_at', today),
        ])

        // Fetch recent businesses
        const { data: recentBusinesses } = await supabase
            .from('providers')
            .select('business_name, city, rating, status, created_at')
            .order('created_at', { ascending: false })
            .limit(5)

        // Fetch top rated providers
        const { data: topRated } = await supabase
            .from('providers')
            .select('business_name, rating, review_count, city')
            .eq('status', 'approved')
            .order('rating', { ascending: false })
            .limit(5)

        // Fetch low rated providers (needs attention)
        const { data: lowRated } = await supabase
            .from('providers')
            .select('business_name, rating, review_count, city')
            .eq('status', 'approved')
            .lt('rating', 3)
            .order('rating', { ascending: true })
            .limit(5)

        // Fetch recent reviews
        const { data: recentReviews } = await supabase
            .from('reviews')
            .select('rating, comment, created_at')
            .order('created_at', { ascending: false })
            .limit(5)

        // Fetch city distribution
        const { data: cityData } = await supabase
            .from('providers')
            .select('city')
            .eq('status', 'approved')

        const cityDistribution: Record<string, number> = {}
        cityData?.forEach((p: any) => {
            cityDistribution[p.city] = (cityDistribution[p.city] || 0) + 1
        })

        // Build context with time-based data
        let context = `
═══════════════════════════════════════════════════════════════
📊 ADMIN DASHBOARD DATA (Real-time from Database)
═══════════════════════════════════════════════════════════════

**Overall Stats:**
- Total Businesses: ${businessCount || 0}
- Total Users: ${userCount || 0}
- Total Reviews: ${reviewCount || 0}
- Pending Approvals: ${pendingCount || 0}

**📅 TODAY'S Activity:**
- New Businesses Today: ${businessToday || 0}
- New Users Today: ${userToday || 0}
- New Reviews Today: ${reviewToday || 0}

**📈 LAST 7 DAYS (Weekly Summary):**
- New Businesses: ${businessLast7Days || 0}
- New Users: ${userLast7Days || 0}
- New Reviews: ${reviewLast7Days || 0}

**📊 LAST 30 DAYS (Monthly Summary):**
- New Businesses: ${businessLast30Days || 0}
- New Users: ${userLast30Days || 0}
- New Reviews: ${reviewLast30Days || 0}

**Recent Business Registrations (Last 5):**
${recentBusinesses?.map((b, i) => `${i + 1}. ${b.business_name} (${b.city}) - Status: ${b.status}, Rating: ${b.rating || 'N/A'}`).join('\n') || 'No recent businesses'}

**Top Rated Providers:**
${topRated?.map((p, i) => `${i + 1}. ${p.business_name} - ${p.rating}⭐ (${p.review_count} reviews) - ${p.city}`).join('\n') || 'No data'}

**Low Rated Providers (Needs Attention):**
${lowRated?.length ? lowRated.map((p, i) => `${i + 1}. ${p.business_name} - ${p.rating}⭐ (${p.review_count} reviews) - ${p.city}`).join('\n') : 'No low-rated providers! 🎉'}

**City Distribution:**
${Object.entries(cityDistribution).map(([city, count]) => `- ${city}: ${count} providers`).join('\n') || 'No data'}

**Recent Reviews:**
${recentReviews?.map((r, i) => `${i + 1}. ${r.rating}⭐ - "${r.comment?.slice(0, 50) || 'No comment'}..."`).join('\n') || 'No recent reviews'}
`

        // Check for API key
        if (!GROQ_API_KEY) {
            // Mock response with data
            let response = `📊 **Admin Dashboard Overview**\n\n`
            response += `• **Total Businesses**: ${businessCount || 0}\n`
            response += `• **Total Users**: ${userCount || 0}\n`
            response += `• **Total Reviews**: ${reviewCount || 0}\n`
            response += `• **Pending Approvals**: ${pendingCount || 0}\n\n`

            if (pendingCount && pendingCount > 0) {
                response += `🔔 ${pendingCount} businesses pending approval!\n\n`
            }

            response += `Aur kya jaanna hai? 📈`
            return NextResponse.json({ response })
        }

        // Call Groq API
        const MAX_RETRIES = 3
        let groqResponse = null

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${GROQ_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'gemma2-9b-it',
                        messages: [
                            { role: 'system', content: ADMIN_SYSTEM_PROMPT },
                            ...messageHistory,
                            { role: 'user', content: `Admin Query: "${lastMessage.content}"\n\nContext:${context}` }
                        ],
                        temperature: 0.4,
                        max_tokens: 400
                    })
                })

                if (groqResponse.ok) break

                if (groqResponse.status === 429 && attempt < MAX_RETRIES) {
                    await new Promise(resolve => setTimeout(resolve, attempt * 1000))
                }
            } catch (error) {
                if (attempt < MAX_RETRIES) {
                    await new Promise(resolve => setTimeout(resolve, attempt * 1000))
                }
            }
        }

        if (!groqResponse || !groqResponse.ok) {
            // Fallback response
            let response = `📊 **Quick Stats**\n\n`
            response += `• Businesses: ${businessCount || 0}\n`
            response += `• Users: ${userCount || 0}\n`
            response += `• Reviews: ${reviewCount || 0}\n`
            response += `• Pending: ${pendingCount || 0}\n\n`
            response += `Detailed analytics ke liye thodi der baad try karein! 🙏`
            return NextResponse.json({ response })
        }

        const groqData = await groqResponse.json()
        const aiResponse = groqData.choices?.[0]?.message?.content || 'Data processing mein issue aaya.'

        return NextResponse.json({ response: aiResponse })

    } catch (error) {
        console.error('Admin chat error:', error)
        return NextResponse.json({ response: 'Technical error aaya hai. Please try again.' })
    }
}
