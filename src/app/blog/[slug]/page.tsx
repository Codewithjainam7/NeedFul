import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, Calendar, User, Clock, CheckCircle, Lightbulb } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// Blog article data
const articles: Record<string, {
    title: string
    category: string
    date: string
    author: string
    readTime: string
    image: string
    content: { type: 'paragraph' | 'heading' | 'tip' | 'list', text: string }[]
}> = {
    "home-maintenance-tips": {
        title: "10 Tips for Home Maintenance",
        category: "Home Care",
        date: "January 12, 2026",
        author: "Needful Team",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop",
        content: [
            { type: 'paragraph', text: "Keeping your home in top condition doesn't have to be overwhelming. With a little regular attention, you can prevent major problems before they start and save thousands in repair costs." },
            { type: 'heading', text: "1. Check Your HVAC Filters Monthly" },
            { type: 'paragraph', text: "Dirty air filters force your heating and cooling system to work harder, increasing energy bills and reducing equipment lifespan. Replace filters every 1-3 months depending on usage." },
            { type: 'heading', text: "2. Inspect Your Roof Twice a Year" },
            { type: 'paragraph', text: "Look for missing, cracked, or curling shingles, especially after storms. Early detection of roof problems can prevent costly water damage inside your home." },
            { type: 'heading', text: "3. Clean Gutters and Downspouts" },
            { type: 'paragraph', text: "Clogged gutters cause water to overflow, leading to foundation issues, basement flooding, and landscaping damage. Clean them at least twice yearly." },
            { type: 'heading', text: "4. Test Smoke and Carbon Monoxide Detectors" },
            { type: 'paragraph', text: "Press the test button monthly and replace batteries annually. Replace the entire unit every 10 years for smoke detectors and 5-7 years for CO detectors." },
            { type: 'heading', text: "5. Drain Your Water Heater" },
            { type: 'paragraph', text: "Sediment buildup reduces efficiency. Drain a few gallons from the tank annually to flush out debris and extend the unit's life." },
            { type: 'tip', text: "Pro Tip: Schedule your home maintenance tasks at the start of each season to make it a habit and never miss important checks." },
            { type: 'heading', text: "6. Seal Windows and Doors" },
            { type: 'paragraph', text: "Check weatherstripping and caulking around windows and doors. Proper sealing prevents drafts and lowers heating/cooling costs." },
            { type: 'heading', text: "7. Clean Dryer Vents" },
            { type: 'paragraph', text: "Lint buildup is a serious fire hazard. Clean the lint trap after every load and have the vent professionally cleaned annually." },
            { type: 'heading', text: "8. Check for Leaks" },
            { type: 'paragraph', text: "Inspect under sinks, around toilets, and near appliances for signs of water damage. Small leaks can cause major problems if left unchecked." },
            { type: 'heading', text: "9. Maintain Your Landscaping" },
            { type: 'paragraph', text: "Trim trees and shrubs away from your home's exterior. Overgrown vegetation can damage siding and provide pathways for pests." },
            { type: 'heading', text: "10. Schedule Professional Inspections" },
            { type: 'paragraph', text: "Have your HVAC, plumbing, and electrical systems professionally inspected annually to catch issues early." },
            { type: 'tip', text: "Regular home maintenance is an investment in your property's value and your family's comfort. Create a maintenance calendar and stick to it!" }
        ]
    },
    "choose-right-electrician": {
        title: "How to Choose the Right Electrician",
        category: "Expert Advice",
        date: "January 8, 2026",
        author: "Needful Expert",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop",
        content: [
            { type: 'paragraph', text: "Hiring the right electrician is crucial for your home's safety and your peace of mind. Electrical work done incorrectly can lead to fires, electrocution, and costly repairs. Here's how to find a qualified professional you can trust." },
            { type: 'heading', text: "Verify Licensing and Insurance" },
            { type: 'paragraph', text: "Always check that your electrician holds a valid license for your area. Licensed electricians have passed examinations proving their knowledge of electrical codes and safety practices. Additionally, ensure they carry liability insurance and workers' compensation." },
            { type: 'heading', text: "Look for Experience" },
            { type: 'paragraph', text: "Ask how long they've been in business and whether they have experience with your specific type of project. An electrician who specializes in residential work may not be the best choice for commercial installations." },
            { type: 'heading', text: "Check Reviews and References" },
            { type: 'paragraph', text: "Read online reviews on platforms like NeedFul, Google, and the Better Business Bureau. Ask for references from recent clients, and follow up by calling them about quality, punctuality, and experience." },
            { type: 'tip', text: "Always get at least three detailed written quotes that itemize labor, materials, and additional fees. Be wary of unusually low quotes." },
            { type: 'heading', text: "Ask About Permits" },
            { type: 'paragraph', text: "Major electrical work typically requires permits and inspections. A reputable electrician will handle the permit process and ensure the work passes inspection." },
            { type: 'heading', text: "Understand the Warranty" },
            { type: 'paragraph', text: "Ask about warranties on both labor and materials. Quality electricians stand behind their work with guarantees that protect you if something goes wrong." },
            { type: 'heading', text: "Evaluate Communication" },
            { type: 'paragraph', text: "Note how responsive and communicative the electrician is from your first contact. Good communication is essential for a smooth project." },
            { type: 'tip', text: "Remember: electrical work is not the place to cut corners. Investing in a qualified, experienced electrician protects your home, your family, and your investment." }
        ]
    },
    "wedding-venues-mumbai": {
        title: "Top Wedding Venues in Mumbai",
        category: "Events",
        date: "January 5, 2026",
        author: "Needful Lifestyle",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
        content: [
            { type: 'paragraph', text: "Mumbai, the city of dreams, offers some of India's most spectacular wedding venues. Whether you're planning an intimate ceremony or a grand celebration, the city has options to match every vision and budget." },
            { type: 'heading', text: "The Taj Mahal Palace" },
            { type: 'paragraph', text: "This iconic 5-star heritage hotel has hosted royalty and celebrities for over a century. The Sea Lounge and Crystal Room offer stunning views of the Gateway of India and the Arabian Sea." },
            { type: 'heading', text: "Dome at NSCI" },
            { type: 'paragraph', text: "One of Mumbai's largest wedding venues, the Dome can accommodate up to 10,000 guests. Its grand architecture and modern amenities make it ideal for lavish celebrations." },
            { type: 'heading', text: "Turf Club Mumbai" },
            { type: 'paragraph', text: "The Royal Western India Turf Club offers expansive lawns with a charming colonial ambiance. The open-air setting is perfect for evening receptions under the stars." },
            { type: 'heading', text: "ITC Maratha" },
            { type: 'paragraph', text: "This luxury hotel combines Maratha heritage with world-class service. The Grand Central ballroom and Sterling Hall provide sophisticated settings for celebrations." },
            { type: 'tip', text: "Book 12-18 months in advance for popular dates and consider off-peak seasons for better rates." },
            { type: 'heading', text: "Sahara Star" },
            { type: 'paragraph', text: "Known for its unique dome-shaped venue inspired by a lotus, Sahara Star offers a truly distinctive backdrop. The LED-lit ceiling can transform to match any theme." },
            { type: 'heading', text: "Bayview Lawns, JW Marriott" },
            { type: 'paragraph', text: "The lush seaside lawns at JW Marriott Juhu offer a romantic setting with the Arabian Sea as your backdrop. Perfect for sunset ceremonies." },
            { type: 'tip', text: "Your wedding venue sets the tone for your entire celebration. Take time to visit multiple locations and choose a space that resonates with your style." }
        ]
    },
    "plumbing-emergency-guide": {
        title: "What to Do in a Plumbing Emergency",
        category: "Home Care",
        date: "January 2, 2026",
        author: "Needful Team",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=1200&auto=format&fit=crop",
        content: [
            { type: 'paragraph', text: "A plumbing emergency can strike at any time – a burst pipe, an overflowing toilet, or a major leak. Knowing what to do in these first critical moments can save you thousands in water damage." },
            { type: 'heading', text: "Step 1: Shut Off the Water" },
            { type: 'paragraph', text: "The first and most important step is to stop the water flow. For local issues like a toilet or sink, look for the shutoff valve nearby. For major emergencies, locate and turn off your main water shutoff valve." },
            { type: 'tip', text: "Know where your main water shutoff valve is BEFORE an emergency happens. It's usually located where the main water line enters your home." },
            { type: 'heading', text: "Step 2: Turn Off Your Water Heater" },
            { type: 'paragraph', text: "If you've shut off the main water, turn off your water heater to prevent damage and overheating. For gas heaters, turn the dial to 'pilot'. For electric, flip the circuit breaker." },
            { type: 'heading', text: "Step 3: Address Small Leaks" },
            { type: 'paragraph', text: "For small leaks, use plumber's tape, a pipe clamp, or even rags to temporarily stop the flow while you wait for professional help." },
            { type: 'heading', text: "Step 4: Open Drains and Spigots" },
            { type: 'paragraph', text: "After shutting off the main valve, open outdoor spigots and drains to direct remaining water away from your home and relieve pressure in the system." },
            { type: 'heading', text: "Step 5: Document Everything" },
            { type: 'paragraph', text: "Take photos and videos of the damage for insurance purposes. Note the time the emergency started and what actions you took." },
            { type: 'tip', text: "Save the number of a trusted emergency plumber in your phone. On NeedFul, you can find verified 24/7 emergency plumbers in your area." },
            { type: 'heading', text: "When to Call a Professional" },
            { type: 'paragraph', text: "Call a plumber immediately for burst pipes, sewage backups, gas line issues, or any situation you can't control. Don't attempt repairs that require expertise." }
        ]
    },
    "ac-maintenance-summer": {
        title: "Preparing Your AC for Summer",
        category: "Seasonal Tips",
        date: "December 28, 2025",
        author: "Needful Expert",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1631545806609-35d4ae440431?q=80&w=1200&auto=format&fit=crop",
        content: [
            { type: 'paragraph', text: "Indian summers can be brutal, and the last thing you want is your AC breaking down during a heat wave. A little preparation goes a long way in ensuring your air conditioning runs efficiently all season." },
            { type: 'heading', text: "Clean or Replace Air Filters" },
            { type: 'paragraph', text: "Dirty filters restrict airflow and reduce efficiency. Clean reusable filters monthly or replace disposable ones. This simple step can reduce energy consumption by 5-15%." },
            { type: 'heading', text: "Clear the Outdoor Unit" },
            { type: 'paragraph', text: "Remove debris, leaves, and vegetation from around your outdoor condenser unit. Ensure at least 2 feet of clearance on all sides for proper airflow." },
            { type: 'tip', text: "Before the season starts, run your AC for a few hours to identify any issues early, when technicians are less busy." },
            { type: 'heading', text: "Check and Clean the Coils" },
            { type: 'paragraph', text: "Both indoor evaporator coils and outdoor condenser coils collect dirt over time. Clean coils ensure efficient heat absorption and release." },
            { type: 'heading', text: "Inspect the Drain Line" },
            { type: 'paragraph', text: "A clogged drain line can cause water damage and humidity problems. Pour a cup of diluted bleach down the drain monthly to prevent algae growth." },
            { type: 'heading', text: "Test Your Thermostat" },
            { type: 'paragraph', text: "Ensure your thermostat is working correctly. Consider upgrading to a programmable or smart thermostat for better efficiency and convenience." },
            { type: 'heading', text: "Schedule Professional Servicing" },
            { type: 'paragraph', text: "Annual professional maintenance can catch issues early, improve efficiency, and extend the life of your unit. Book early to avoid the summer rush." },
            { type: 'tip', text: "Set your AC to 24-25°C for optimal comfort and efficiency. Every degree lower can increase energy consumption by 3-5%." }
        ]
    },
    "best-restaurants-bangalore": {
        title: "Best Restaurants in Bangalore 2026",
        category: "Food & Dining",
        date: "December 20, 2025",
        author: "Needful Lifestyle",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
        content: [
            { type: 'paragraph', text: "Bangalore's food scene is as diverse as its tech culture. From innovative fine dining to beloved local gems, here's our curated list of the best restaurants to try in 2026." },
            { type: 'heading', text: "Karavalli – The Taj West End" },
            { type: 'paragraph', text: "An institution for coastal cuisine, Karavalli serves authentic dishes from Kerala, Mangalore, and Goa in a stunning heritage setting. Don't miss the Appam with Stew." },
            { type: 'heading', text: "Toit Brewpub" },
            { type: 'paragraph', text: "India's most famous brewpub pairs excellent craft beers with pub grub favorites. The Tintin Toit and wood-fired pizzas are crowd favorites." },
            { type: 'tip', text: "Book tables in advance for popular restaurants, especially on weekends. On NeedFul, you can discover verified restaurants and read authentic reviews." },
            { type: 'heading', text: "The Fatty Bao" },
            { type: 'paragraph', text: "Pan-Asian flavors meet modern presentation at this trendy spot. The Bao buns and Ramen are exceptional, and the cocktails are creative." },
            { type: 'heading', text: "Vidyarthi Bhavan" },
            { type: 'paragraph', text: "A Bangalore institution since 1943, this no-frills restaurant serves the city's best Masala Dosa. Arrive early to avoid long queues." },
            { type: 'heading', text: "Brahmin's Coffee Bar" },
            { type: 'paragraph', text: "Another heritage spot famous for its Idli-Vada-Khara Bath combo. A true taste of old Bangalore that's not to be missed." },
            { type: 'heading', text: "Olive Beach" },
            { type: 'paragraph', text: "Mediterranean vibes and cuisine in a beautiful whitewashed setting. Perfect for a special occasion or a leisurely weekend brunch." },
            { type: 'heading', text: "Meghana Foods" },
            { type: 'paragraph', text: "Known for their legendary Andhra-style Biryani, Meghana Foods is a must-visit for spice lovers. Multiple outlets across the city." },
            { type: 'tip', text: "Explore local neighborhoods like Indiranagar, Koramangala, and Jayanagar for hidden gems and authentic local food experiences." }
        ]
    }
}


interface PageProps {
    params: Promise<{ slug: string }>
}

export default async function BlogArticlePage({ params }: PageProps) {
    const { slug } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let userData = null
    if (user) {
        const { data } = await supabase.from('users').select('name, email, role').eq('id', user.id).single()
        userData = data
    }

    const article = articles[slug]

    if (!article) {
        notFound()
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header user={userData} />
            <main className="flex-1 bg-[#FFFBF7] pt-32 pb-20 lg:pt-40 lg:pb-32 relative overflow-hidden">
                {/* Background Gradient Blobs */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100/60 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

                <article className="container mx-auto px-4 max-w-4xl relative z-10">
                    {/* Back Button */}
                    <Link href="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#FF5200] transition-colors mb-12 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Blog</span>
                    </Link>

                    {/* Category Badge */}
                    <div className="inline-block px-4 py-1.5 rounded-full bg-[#FF5200]/10 text-[#FF5200] font-bold text-sm tracking-wide mb-6">
                        {article.category}
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
                        {article.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-6 text-gray-500 mb-8">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{article.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{article.readTime}</span>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="rounded-3xl overflow-hidden mb-12 shadow-xl">
                        <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-[400px] object-cover"
                        />
                    </div>

                    {/* Article Content */}
                    <div className="space-y-6">
                        {article.content.map((item, idx) => {
                            if (item.type === 'heading') {
                                return (
                                    <h2 key={idx} className="text-xl font-bold text-gray-900 mt-8 mb-2 flex items-center gap-3">
                                        <span className="w-2 h-2 bg-[#FF5200] rounded-full"></span>
                                        {item.text}
                                    </h2>
                                )
                            }
                            if (item.type === 'tip') {
                                return (
                                    <div key={idx} className="p-6 bg-gradient-to-r from-[#FF5200]/10 to-orange-100/50 rounded-2xl border-l-4 border-[#FF5200] my-8">
                                        <div className="flex items-start gap-3">
                                            <Lightbulb className="w-5 h-5 text-[#FF5200] flex-shrink-0 mt-0.5" />
                                            <p className="text-gray-700 font-medium">{item.text}</p>
                                        </div>
                                    </div>
                                )
                            }
                            return (
                                <p key={idx} className="text-gray-600 leading-relaxed text-lg">
                                    {item.text}
                                </p>
                            )
                        })}
                    </div>

                    {/* Share & CTA */}
                    <div className="mt-16 p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Need professional help?</h3>
                        <p className="text-gray-500 mb-6">Find verified local professionals for all your service needs on NeedFul.</p>
                        <Link
                            href="/search"
                            className="inline-flex items-center justify-center px-6 py-3 bg-[#FF5200] text-white font-bold rounded-xl hover:bg-[#e04800] transition-colors"
                        >
                            Find Professionals
                        </Link>
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    )
}

export async function generateStaticParams() {
    return Object.keys(articles).map((slug) => ({
        slug,
    }))
}
