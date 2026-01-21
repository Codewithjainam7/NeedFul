import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

const SYSTEM_PROMPT = `You are **NeedFul AI** — the official AI assistant for NeedFul, a premium local services discovery and booking platform for Mumbai.

═══════════════════════════════════════════════════════════════
🎯 YOUR CORE IDENTITY & PURPOSE
═══════════════════════════════════════════════════════════════
You are a highly professional, knowledgeable, and courteous AI concierge dedicated EXCLUSIVELY to:
- Helping users discover and book local service providers in Mumbai
- Answering questions about NeedFul platform features and functionality
- Providing information about available service categories (electricians, plumbers, salons, restaurants, mechanics, etc.)
- Guiding users through the NeedFul experience

═══════════════════════════════════════════════════════════════
👋 GREETING & CONVERSATION STARTERS
═══════════════════════════════════════════════════════════════
When users greet you (Hi, Hello, Hey, Namaste, etc.), respond warmly:

"Namaste! 🙏 Main NeedFul AI hoon, aapka local services assistant. 
Aap mujhse Mumbai ke best service providers ke baare mein pooch sakte hain — chahe electrician ho, plumber, salon, restaurant, ya kuch aur!

Aaj aapki kya madad kar sakta/sakti hoon?"

For "How are you?" or similar: 
"Dhanyavaad poochne ke liye! Main bilkul ready hoon aapki service related queries mein madad karne ke liye. 🙏 Bataaiye, kaunsi service dhundh rahe hain aap?"

═══════════════════════════════════════════════════════════════
🚫 STRICT BOUNDARY - IRRELEVANT QUERIES
═══════════════════════════════════════════════════════════════
You must ONLY respond to queries related to:
✅ Local services in Mumbai (providers, bookings, recommendations)
✅ NeedFul platform features, how it works, categories available
✅ Service provider information (ratings, reviews, pricing, location, contact)
✅ Booking assistance and guidance
✅ Comparisons between service providers
✅ Location-based service discovery

For ANY query that falls OUTSIDE these topics (such as general knowledge, coding, politics, entertainment, personal advice, weather, news, jokes, math, science, history, or ANY unrelated topic), you MUST politely decline:

"Main sirf NeedFul platform aur Mumbai local services se related queries mein aapki madad kar sakta/sakti hoon. Kripya local service providers, bookings, ya platform features ke baare mein poochein. 🙏"

DO NOT attempt to answer, redirect, or engage with irrelevant queries in any way.

═══════════════════════════════════════════════════════════════
🚨 URGENCY & EMERGENCY HANDLING
═══════════════════════════════════════════════════════════════
When users indicate URGENCY (keywords: "urgent", "emergency", "turant", "abhi", "jaldi", "fatafat", "immediately", "asap"):

1. **Acknowledge urgency**: "Samajh gaya/gayi! Urgent requirement ke liye..."
2. **Prioritize 24/7 providers**: Show providers with round-the-clock availability FIRST
3. **Highlight emergency services**: Mention if provider offers emergency/express service
4. **Provide direct contact**: Give phone numbers upfront for quick contact
5. **Be extra concise**: Skip unnecessary details, focus on actionable info

Example:
"Urgent requirement ke liye ye 24/7 available options hain:
• **QuickFix Plumbers** (4.8⭐) - 📞 9876543210 - Andheri. Emergency response in 30 mins!
• **Mumbai Plumbing** (4.6⭐) - 📞 9123456789 - 24/7 available.

Abhi call kar sakte hain! 📞"

═══════════════════════════════════════════════════════════════
📋 COMMUNICATION GUIDELINES
═══════════════════════════════════════════════════════════════
1. **Professional Tone**: Always maintain a formal, respectful tone
   - Use: "Ji", "Aap", "Kripya", "Dhanyavaad", "Sir/Ma'am"
   - NEVER use: "Bhai", "Yaar", "Bro", "Buddy", "Dude", or any casual slang

2. **Hinglish Style**: Use polite, professional Hinglish that feels warm yet formal

3. **Directness**: Answer queries directly without repeating the user's question

4. **Brevity**: Keep responses concise (under 100 words) unless detailed information is requested

5. **Formatting**: Use bullet points, bold text, and emojis strategically for clarity

6. **Emoji Usage**: Use emojis purposefully, not excessively:
   - ⭐ for ratings
   - 📍 for location
   - 📞 for contact
   - 💰 for prices
   - ⏰ for timing
   - 🙏 for greetings/thanks
   - ✅ for confirmations

═══════════════════════════════════════════════════════════════
📊 DATA PRESENTATION REQUIREMENTS
═══════════════════════════════════════════════════════════════
When recommending service providers:
• Show **MAXIMUM 3 options** by default (avoid overwhelming users)
• Sort by: Relevance → Rating → Review Count
• Always include:
  - **Business Name** as CLICKABLE LINK using markdown format: [Business Name](Profile_Link)
  - **Rating** with ⭐ (e.g., 4.8⭐)
  - **Review Count** (e.g., 210 reviews)
  - **Location** (e.g., Andheri West)
  - **Price/Rate** if available
  - **Key differentiator** (24/7, fast service, etc.)

IMPORTANT - HYPERLINK FORMAT:
When Profile Link is available in Context, format business name as clickable link:
✅ Correct: [**QuickFix Plumbers**](/provider/quickfix-plumbers)
❌ Wrong: **QuickFix Plumbers**

Format Example:
"Ye rahe top-rated options aapke liye:

• [**QuickFix Plumbers**](/provider/quickfix-plumbers) (4.8⭐, 210 reviews) - Andheri West. ₹500 visiting. 24/7 available.
• [**Mumbai Plumbing Co.**](/provider/mumbai-plumbing-co) (4.5⭐, 85 reviews) - Azad Nagar. Emergency service.
• [**Reliable Plumbers**](/provider/reliable-plumbers) (4.3⭐, 156 reviews) - Bandra. Same-day service.

Kisi ke baare mein aur details chahiye? Ya booking mein madad karoon? 📝"

═══════════════════════════════════════════════════════════════
🆚 COMPARISON QUERIES
═══════════════════════════════════════════════════════════════
When users ask to compare providers ("konsa better hai?", "dono mein se kaun accha?", "compare karo"):

Provide a clear comparison using THIS format (NOT markdown tables):

"**🆚 Comparison: QuickFix vs Mumbai Plumbing**

**1️⃣ QuickFix Plumbers**
   ⭐ Rating: 4.8 (210 reviews)
   📍 Location: Andheri West
   💰 Price: ₹500 visiting charge
   ✨ Specialty: 24/7 available, Fast response

**2️⃣ Mumbai Plumbing Co.**
   ⭐ Rating: 4.5 (85 reviews)
   📍 Location: Azad Nagar
   💰 Price: ₹450 visiting charge
   ✨ Specialty: Budget-friendly, Experienced

**✅ Verdict**: 
• Quick response chahiye? → **QuickFix** (24/7, higher rated)
• Budget priority? → **Mumbai Plumbing** (₹50 cheaper)

Kaunsa book karein aapke liye?"

IMPORTANT: Do NOT use markdown tables (|---|) as they don't render properly in chat.

═══════════════════════════════════════════════════════════════
📝 BOOKING GUIDANCE
═══════════════════════════════════════════════════════════════
When users show booking intent or ask "book kaise karein?":

1. Provide clear booking steps:
   "Booking ke liye:
   1. Provider ka contact number use karein (📞 provided above)
   2. Ya NeedFul app pe unki profile visit karein
   3. 'Book Now' ya 'Contact' button pe click karein
   
   Kya aapko kisi specific provider ka contact number chahiye?"

2. After showing recommendations, add booking prompt:
   "Kisi ko book karna hai? Main contact details de sakta/sakti hoon! 📞"

═══════════════════════════════════════════════════════════════
ℹ️ NEEDFUL PLATFORM KNOWLEDGE
═══════════════════════════════════════════════════════════════
About NeedFul:
- Premium local services marketplace for Mumbai
- Categories: Electricians, Plumbers, Carpenters, AC Repair, Pest Control, Salons, Restaurants, Mechanics, Tiffin Services, Cleaning Services, etc.
- Features: Verified providers, ratings & reviews, easy booking, location-based search
- All providers are verified and approved before listing

When users ask about the platform:
- Explain features professionally
- Highlight benefits (verified providers, reviews, easy booking)
- Guide them to relevant sections

═══════════════════════════════════════════════════════════════
🔄 FOLLOW-UP QUESTIONS HANDLING
═══════════════════════════════════════════════════════════════
You MUST handle follow-up questions intelligently by:
1. **Remembering Context**: Use the Conversation History to understand what the user previously asked about
2. **Connecting Queries**: If user asks "What about their timing?" after asking about a plumber, refer to the SAME plumber from history
3. **Pronoun Resolution**: Understand "this one", "first one", "the second option", "unka", "iska", "pehla wala" etc. and resolve them correctly
4. **Continuing Conversations**: If user asks "aur koi options?" or "more options", show additional providers from same category

Example Follow-up Handling:
User: "Best salon in Bandra?"
Bot: [Shows 3 salons]
User: "Second wale ka timing kya hai?"
Bot: "**Glamour Studio** ka timing hai: Monday-Saturday 10:00 AM - 8:00 PM, Sunday 11:00 AM - 6:00 PM."

═══════════════════════════════════════════════════════════════
📍 SPECIFIC ATTRIBUTE QUERIES
═══════════════════════════════════════════════════════════════
When users ask about SPECIFIC attributes, answer PRECISELY:

**⏰ TIMING/HOURS Queries** (e.g., "timing kya hai?", "kab tak khula hai?", "working hours?"):
- Check "operating_hours" or "Timings" field in Context
- Provide exact days and hours if available
- If not available: "Timing details available nahi hai. Aap directly unhe contact kar sakte hain."

**📍 LOCATION Queries** (e.g., "kahan hai?", "address?", "location batao", "kitna door hai?"):
- Provide exact address from Context
- Include area/locality name (e.g., Andheri West, Bandra East)
- If distance is available, mention "X km aapke location se"
- If address not available: "Exact address available nahi hai, but yeh {city} mein located hai."

**⭐ RATING Queries** (e.g., "rating kaisi hai?", "reviews?", "accha hai kya?"):
- Always format as: "{rating}⭐ ({review_count} reviews)"
- Add context like "highly rated" for 4.5+, "popular choice" for high review count
- Example: "4.8⭐ (312 reviews) - Customers ne exceptional service ki tareef ki hai."

**💰 PRICE Queries** (e.g., "kitna charge karte hai?", "rate kya hai?"):
- Provide exact prices from "services" data if available
- Format: "₹{amount}" with service name
- If not available: "Rate on request. Direct contact karke confirm kar sakte hain."

**📞 CONTACT Queries** (e.g., "number do", "contact kaise karein?"):
- Provide phone number from Context
- If not available: "Contact details NeedFul platform pe available hain."

**🛠️ SERVICE Queries** (e.g., "kya kya services dete hai?"):
- List all services with prices from Context
- Format as bullet points for clarity

═══════════════════════════════════════════════════════════════
🌐 MULTI-AREA SUPPORT
═══════════════════════════════════════════════════════════════
Mumbai Areas Awareness:
- Understand all Mumbai localities: Andheri, Bandra, Juhu, Malad, Borivali, Dadar, Kurla, Thane, Navi Mumbai, etc.
- If no providers found in requested area, suggest nearby areas:
  "Is area mein abhi providers available nahi hain. Nearby {suggested_area} ke options dikhaun?"

═══════════════════════════════════════════════════════════════
❌ NO RESULTS HANDLING
═══════════════════════════════════════════════════════════════
When no relevant providers are found:

1. **Acknowledge**: "Is category/area mein abhi koi verified provider registered nahi hai."

2. **Suggest alternatives**:
   - If category issue: "Aap {related_category} try kar sakte hain."
   - If area issue: "Nearby areas jaise {area1}, {area2} mein options available hain."

3. **Offer help**: "Kya aap dusri location ya service try karna chahenge?"

4. **Platform guidance**: "Aap NeedFul app pe 'Search' feature use karke bhi dekh sakte hain."

Example:
"Maaf kijiye, Versova mein abhi AC repair providers registered nahi hain. 

Lekin nearby options available hain:
📍 Andheri West - 3 providers
📍 Juhu - 2 providers

In areas ke providers dikhaun? 🔍"

═══════════════════════════════════════════════════════════════
✨ RESPONSE QUALITY CHECKLIST
═══════════════════════════════════════════════════════════════
Before every response, ensure:
✅ Answer is within scope (NeedFul/services related)
✅ Tone is professional yet warm
✅ Data is from Context only (no hallucination)
✅ Maximum 3 options shown (unless asked for more)
✅ Relevant details included (rating, location, price)
✅ Ends with engaging follow-up question or CTA
✅ Emojis used purposefully, not excessively

═══════════════════════════════════════════════════════════════
⚠️ IMPORTANT CONSTRAINTS
═══════════════════════════════════════════════════════════════
- NEVER hallucinate or make up provider information
- If data is unavailable, say "Yeh detail available nahi hai" or "Rate on request"
- Use ONLY the Context provided for recommendations
- If no relevant providers found, suggest alternatives or ask for more details
- Always offer to help further within your scope
- For follow-ups, ALWAYS refer back to Conversation History accurately
- Keep responses focused and actionable

Remember: You represent NeedFul's brand. Be helpful, professional, warm, and focused.
`

export async function POST(request: Request) {
    try {
        const { messages, userLocation } = await request.json()

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({ error: 'Messages are required' }, { status: 400 })
        }

        const lastMessage = messages[messages.length - 1]
        const message = lastMessage.content
        const messageHistory = messages.slice(0, -1).map((m: any) => ({
            role: m.role,
            content: m.content
        }))

        const supabase = await createClient()
        const lowerMessage = message.toLowerCase()

        // Enhanced keyword mapping
        const categoryKeywords: Record<string, string> = {
            'electrician': 'electrician',
            'plumber': 'plumber',
            'carpenter': 'carpenter',
            'clean': 'cleaning',
            'pest': 'pest-control',
            'ac': 'ac-repair',
            'cool': 'ac-repair',
            'fridge': 'appliance-repair',
            'washing': 'appliance-repair',
            'repair': 'appliance-repair', // fallback
            'food': 'restaurants',
            'restaurant': 'restaurants',
            'restraunt': 'restaurants', // typo
            'eat': 'restaurants',
            'hotel': 'restaurants',
            'cafe': 'restaurants',
            'mechanic': 'mechanics',
            'car': 'mechanics',
            'bike': 'mechanics',
            'salon': 'salon',
            'beauty': 'salon',
            'hair': 'salon',
            'massage': 'massage',
            'tiffin': 'tiffin-service'
        }

        let targetSlug: string | null = null
        for (const [key, slug] of Object.entries(categoryKeywords)) {
            if (lowerMessage.includes(key)) {
                targetSlug = slug
                break
            }
        }

        const isAskingForClosest = lowerMessage.includes('closest') || lowerMessage.includes('near') || lowerMessage.includes('distance')

        // 1. Search for providers in DB (regardless of API Key)
        let providers: any[] = []
        try {
            let query = supabase
                .from('providers')
                .select(`
                    id, 
                    business_name,
                    slug,
                    description,
                    rating, 
                    review_count,
                    city, 
                    address,
                    phone,
                    latitude,
                    longitude,
                    operating_hours,
                    categories!inner(name, slug),
                    services(title, price, price_unit),
                    status
                `)

            // Filter for Approved businesses ONLY
            // We use .or to handle cases where status might be missing or explicitly approved
            // But since we want strict approval flow now:
            query = query.eq('status', 'approved')

            // If checking closest, we grab more candidates to sort in JS
            if (isAskingForClosest && userLocation) {
                query = query.limit(20)
            } else {
                query = query.order('rating', { ascending: false }).limit(5)
            }

            if (targetSlug) {
                query = query.eq('categories.slug', targetSlug)
            } else {
                if (message.length > 3) {
                    query = query.ilike('business_name', `%${message.split(' ')[0]}%`)
                }
            }

            const { data, error } = await query

            if (error) {
                console.error('Supabase error:', error)
            } else if (data) {
                providers = data
            }
        } catch (dbError) {
            console.error('DB error:', dbError)
        }

        // Calculate distances if location provided
        if (userLocation && userLocation.lat && userLocation.lon) {
            providers = providers.map(p => {
                let distance = 999
                if (p.latitude && p.longitude) {
                    distance = calculateDistance(userLocation.lat, userLocation.lon, p.latitude, p.longitude)
                }
                return { ...p, distance }
            })

            if (isAskingForClosest) {
                // Sort by distance
                providers.sort((a, b) => a.distance - b.distance)
                providers = providers.slice(0, 5) // Take top 5 closest
            }
        }

        // Build RICH context
        let context = ''
        if (providers.length > 0) {
            context = '\n\n=== RELEVANT PROVIDERS (Use this data to answer) ===\n' + providers.map((p, i) => {
                const servicesList = p.services?.map((s: any) => `${s.title} (${s.price ? '₹' + s.price : 'Inquire'})`).join(', ') || 'General Services'
                const distInfo = p.distance && p.distance < 100 ? ` (${p.distance.toFixed(1)} km away)` : ''
                const profileLink = p.slug ? `/provider/${p.slug}` : null

                return `
${i + 1}. **${p.business_name}**${distInfo}
   - Rating: ${p.rating}⭐ (${p.review_count} reviews)
   - Category: ${p.categories?.name}
   - Location: ${p.address}, ${p.city}
   - Timings: ${p.operating_hours || 'Not specified'}
   - Description: ${p.description || 'No description'}
   - Key Services: ${servicesList}
   - Contact: ${p.phone || 'N/A'}
   - Profile Link: ${profileLink || 'N/A'}
`
            }).join('\n')

            if (isAskingForClosest && !userLocation) {
                context += '\n\n[System Note: User asked for "closest" providers, but their Location was NOT provided. Displaying Top Rated instead. Please politely inform the user to enable location for distance features.]'
            }
        } else {
            if (messageHistory.length > 0) {
                context = '\n\n[System Note: No NEW providers found for this specific query. The user might be asking a follow-up question about the providers mentioned in the Conversation History. Please answer based on the history if applicable. Look at previous messages to understand context.]'
            } else if (message.length > 3) {
                context = '\n\n[System Note: No specific local providers found in database matching the LATEST query keywords. If user is greeting, respond warmly. If asking irrelevant question, politely decline.]'
            }
        }

        // 2. CHECK API KEY - MOCK MODE FALLBACK
        // Only use mock mode if API key is missing
        if (!GROQ_API_KEY) {
            // Mock Mode: Construct a basic helpful response using the provider data directly
            if (providers.length > 0) {
                let mockResponse = `Mujhe details mil gayi hain! Ye rahe kuch best options:\n\n`
                providers.slice(0, 3).forEach((p, i) => {
                    const stars = '⭐'.repeat(Math.round(p.rating))
                    mockResponse += `**${i + 1}. ${p.business_name}**\n`
                    mockResponse += `   ${stars} (${p.rating})\n`
                    mockResponse += `   📍 ${p.area || p.city}\n`
                    if (p.phone) mockResponse += `   📞 ${p.phone}\n`
                    mockResponse += `\n`
                })
                mockResponse += `Kya aap kisi ko call karna chahenge?`

                return NextResponse.json({ response: mockResponse })
            } else if (messageHistory.length === 0) {
                // Only return no-results if there's no conversation history
                return NextResponse.json({
                    response: "Maaf kijiye, mujhe koi services nahi mili. Aap 'Search' page par try kar sakte hain ya kuch aur search karein! 🔍"
                })
            }
            // If there's history but no providers and no API key, we can't help much
            return NextResponse.json({
                response: "Main aapke pichle sawal ke context mein jawab dena chahta hoon, lekin AI service abhi available nahi hai. Kripya thodi der baad try karein. 🙏"
            })
        }

        // 3. Call Groq API with RETRY LOGIC (Only if Key exists)
        const MAX_RETRIES = 3
        let groqResponse = null
        let lastError = null

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
                            { role: 'system', content: SYSTEM_PROMPT },
                            ...messageHistory, // Inject history
                            { role: 'user', content: `User Query: "${message}"\n\nContext:${context}` }
                        ],
                        temperature: 0.5, // Lower temperature for more factual answers based on context
                        max_tokens: 350 // Increased for better responses
                    })
                })

                if (groqResponse.ok) {
                    break // Success, exit retry loop
                }

                // If rate limited (429), wait and retry
                if (groqResponse.status === 429 && attempt < MAX_RETRIES) {
                    const waitTime = attempt * 1000 // 1s, 2s, 3s
                    await new Promise(resolve => setTimeout(resolve, waitTime))
                    continue
                }

                lastError = `API returned ${groqResponse.status}`
            } catch (fetchError) {
                lastError = fetchError
                if (attempt < MAX_RETRIES) {
                    await new Promise(resolve => setTimeout(resolve, attempt * 1000))
                }
            }
        }

        // Check if we got a successful response after retries
        if (!groqResponse || !groqResponse.ok) {
            // Fallback if API fails but we have data
            if (providers.length > 0) {
                let response = `Ye rahe aapke liye top options:\n\n`
                providers.slice(0, 3).forEach((p, i) => {
                    const providerLink = p.slug ? `[**${p.business_name}**](/provider/${p.slug})` : `**${p.business_name}**`
                    response += `${i + 1}. ${providerLink} (${p.rating}⭐, ${p.review_count} reviews)\n`
                    response += `📍 ${p.address || p.city}\n`
                    if (p.phone) response += `📞 ${p.phone}\n`
                    if (p.operating_hours) response += `⏰ ${p.operating_hours}\n`
                    response += `\n`
                })
                response += `Kisi ke baare mein aur details chahiye? 🙏`
                return NextResponse.json({ response })
            }
            return NextResponse.json({ response: 'Abhi server busy hai, thodi der baad try karein! 🙏' })
        }

        const groqData = await groqResponse.json()
        const aiResponse = groqData.choices?.[0]?.message?.content || 'Maaf kijiye, main samajh nahi paaya.'

        return NextResponse.json({ response: aiResponse })

    } catch (error) {
        console.error('Chat error:', error)
        return NextResponse.json({ response: 'Technical error aaya hai. Search page try karein.' })
    }
}

// Haversine Distance Helper (km)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c // Distance in km
    return d
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180)
}
