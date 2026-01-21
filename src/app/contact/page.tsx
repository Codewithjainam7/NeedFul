'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ContactPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-1 bg-[#FFFBF7] relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100/60 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

                <div className="container mx-auto px-4 pt-32 pb-16 lg:pt-40 lg:pb-24 relative z-10">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                                We'd Love to <span className="relative inline-block"><span className="text-[#FF5200]">Hear From You</span>
                                    <svg className="absolute w-full h-3 -bottom-2 left-0 text-[#FF5200]/80" viewBox="0 0 100 10" preserveAspectRatio="none">
                                        <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="6" fill="none" />
                                    </svg></span>
                            </h1>
                            <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-600 font-bold text-xs uppercase tracking-wider mt-4 mb-4">Get in Touch</span>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Have a question about a service? Want to join as a pro? Or just want to say hi? Drop us a message.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Contact Info Cards */}
                            <div className="space-y-6">
                                <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
                                    <p className="text-gray-500 mb-4">For general inquiries and support.</p>
                                    <a href="mailto:hello@needful.com" className="text-[#FF5200] font-bold hover:underline">hello@needful.com</a>
                                </div>

                                <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                                    <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
                                    <p className="text-gray-500 mb-4">Mon-Fri from 9am to 6pm.</p>
                                    <a href="tel:+1234567890" className="text-[#FF5200] font-bold hover:underline">+91 98765 43210</a>
                                </div>

                                <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                                    <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-6">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h3>
                                    <p className="text-gray-500 mb-4">Come say hello at our office.</p>
                                    <span className="text-gray-700 font-medium">123 Startup Hub, Tech Park,<br />Mumbai, India</span>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="lg:col-span-2 relative">
                                {/* Outer gradient border */}
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF5200] via-orange-400 to-amber-400 rounded-[2.5rem] opacity-20 blur-sm"></div>

                                <div className="relative bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-orange-100">
                                    {/* Decorative corner gradients */}
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-400/10 to-transparent rounded-full blur-2xl translate-y-1/4 -translate-x-1/4 pointer-events-none"></div>

                                    <h2 className="text-2xl font-black text-gray-900 mb-2">Send a Message</h2>
                                    <p className="text-gray-500 text-sm mb-8">We'll get back to you within 24 hours</p>

                                    <form className="space-y-6 relative z-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 ml-1">Your Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="Rahul Sharma"
                                                    className="w-full h-14 px-6 rounded-xl bg-gradient-to-r from-gray-50 to-orange-50/30 border-2 border-gray-100 focus:bg-white focus:border-[#FF5200]/30 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400 cursor-pointer"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 ml-1">Your Email</label>
                                                <input
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    className="w-full h-14 px-6 rounded-xl bg-gradient-to-r from-gray-50 to-orange-50/30 border-2 border-gray-100 focus:bg-white focus:border-[#FF5200]/30 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400 cursor-pointer"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Subject</label>
                                            <input
                                                type="text"
                                                placeholder="How can we help?"
                                                className="w-full h-14 px-6 rounded-xl bg-gradient-to-r from-gray-50 to-orange-50/30 border-2 border-gray-100 focus:bg-white focus:border-[#FF5200]/30 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400 cursor-pointer"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Message</label>
                                            <textarea
                                                rows={5}
                                                placeholder="Tell us more..."
                                                className="w-full p-6 rounded-xl bg-gradient-to-r from-gray-50 to-orange-50/30 border-2 border-gray-100 focus:bg-white focus:border-[#FF5200]/30 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium text-gray-900 resize-none placeholder:text-gray-400 cursor-pointer"
                                            ></textarea>
                                        </div>

                                        <Button className="w-full h-14 bg-gradient-to-r from-[#FF5200] via-orange-500 to-amber-500 hover:from-[#E04800] hover:via-orange-600 hover:to-amber-600 text-white rounded-xl text-lg font-bold shadow-xl shadow-orange-500/30 transform hover:scale-[1.02] hover:shadow-orange-500/40 transition-all cursor-pointer">
                                            Send Message
                                            <Send className="w-5 h-5 ml-2" />
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
