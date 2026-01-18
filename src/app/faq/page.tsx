'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useState } from 'react'
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
    {
        question: "How do I book a service?",
        answer: "Booking is simple! Search for the service you need (e.g., 'Plumber'), select a verified professional based on reviews, and choose a time slot that works for you. Confirm the booking and you're set!"
    },
    {
        question: "Are the service providers verified?",
        answer: "Yes, absolutely. Every professional on Needful undergoes a strict background check and verification process. We verify their identity, qualifications, and past work records to ensure your safety and quality service."
    },
    {
        question: "Can I cancel or reschedule my booking?",
        answer: "Yes, you can cancel or reschedule up to 2 hours before the scheduled service time directly from your 'My Bookings' section in the app or website. Cancellation charges may apply for last-minute cancellations."
    },
    {
        question: "How do I pay for the service?",
        answer: "We support secure online payments via Credit/Debit Cards, UPI, and Net Banking. You can also choose to pay cash after the service is completed, depending on the provider's preference."
    },
    {
        question: "What if I'm not satisfied with the service?",
        answer: "Your satisfaction is our priority. If you're not happy, please contact our support team within 24 hours of service completion. We have a 'Happiness Guarantee' and will work to resolve the issue or offer a refund."
    },
    {
        question: "How can I become a service provider?",
        answer: "Click on the 'Add Business' or 'Join as Pro' link in the menu. Fill out your details, upload necessary documents, and our team will get in touch with you for verification and onboarding."
    }
]

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-1 bg-[#FFFBF7] pt-28 py-16 lg:py-24 relative overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-orange-100/40 rounded-full blur-[120px] pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 font-bold text-xs uppercase tracking-wider mb-6">Support</span>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight relative inline-block">
                            Frequently Asked <span className="text-[#FF5200]">Questions</span>
                            <svg className="absolute w-full h-3 -bottom-2 left-0 text-[#FF5200]/80" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="6" fill="none" />
                            </svg>
                        </h1>
                        <p className="text-lg text-gray-600 mt-4">
                            Everything you need to know about the product and billing. Can't find the answer you're looking for? Please contact our friendly team.
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-4">
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "bg-white rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer group",
                                    openIndex === idx ? "border-orange-500 shadow-lg shadow-orange-500/10 ring-1 ring-orange-500" : "border-gray-100 hover:border-orange-200"
                                )}
                                onClick={() => setOpenIndex(idx === openIndex ? null : idx)}
                            >
                                <div className="p-6 flex items-center justify-between gap-4">
                                    <h3 className={cn("text-lg font-bold transition-colors", openIndex === idx ? "text-[#FF5200]" : "text-gray-900")}>
                                        {faq.question}
                                    </h3>
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0",
                                        openIndex === idx ? "bg-orange-500 text-white rotate-180" : "bg-gray-100 text-gray-500 group-hover:bg-orange-100 group-hover:text-orange-500"
                                    )}>
                                        <ChevronDown className="w-5 h-5" />
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "px-6 text-gray-600 leading-relaxed overflow-hidden transition-all duration-300 ease-in-out",
                                        openIndex === idx ? "max-h-48 pb-6 opacity-100" : "max-h-0 opacity-0"
                                    )}
                                >
                                    {faq.answer}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <div className="inline-flex flex-col items-center bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                            <div className="flex -space-x-3 mb-4">
                                <img className="w-10 h-10 rounded-full border-2 border-white ring-1 ring-gray-100" src="https://i.pravatar.cc/100?img=1" alt="Support" />
                                <img className="w-10 h-10 rounded-full border-2 border-white ring-1 ring-gray-100" src="https://i.pravatar.cc/100?img=5" alt="Support" />
                                <img className="w-10 h-10 rounded-full border-2 border-white ring-1 ring-gray-100" src="https://i.pravatar.cc/100?img=8" alt="Support" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
                            <p className="text-gray-500 mb-6">Can't find the answer you're looking for? Please chat to our friendly team.</p>
                            <a href="/contact" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#FF5200] text-white font-bold transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/20">
                                <MessageCircle className="w-5 h-5 mr-2" />
                                Get in touch
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
