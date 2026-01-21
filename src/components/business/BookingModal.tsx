'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle2, Loader2, Calendar, Clock, User, Sparkles, X } from 'lucide-react'

interface BookingModalProps {
    isOpen: boolean
    onClose: () => void
    businessName: string
}

export function BookingModal({ isOpen, onClose, businessName }: BookingModalProps) {
    const [step, setStep] = useState<'form' | 'success'>('form')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        setIsLoading(false)
        setStep('success')
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden bg-transparent border-0 shadow-none [&>button]:hidden">
                <AnimatePresence mode="wait">
                    {step === 'form' ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden"
                        >
                            {/* Header Gradient */}
                            <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-6 pt-8 relative overflow-hidden">
                                <DialogTitle className="sr-only">Book Service with {businessName}</DialogTitle>
                                <div className="absolute top-0 right-0 p-4 opacity-20">
                                    <Sparkles className="w-24 h-24 text-white rotate-12" />
                                </div>
                                <button
                                    onClick={onClose}
                                    className="absolute right-4 top-4 rounded-full p-1 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none opacity-70 hover:bg-white/20 text-white"
                                >
                                    <X className="h-5 w-5" />
                                    <span className="sr-only">Close</span>
                                </button>

                                <h2 className="text-2xl font-bold text-white relative z-10">Check Availability</h2>
                                <p className="text-blue-50 relative z-10 mt-1">
                                    Book a slot with <span className="font-semibold">{businessName}</span>
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Date</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input id="date" required type="date" className="pl-10 rounded-xl h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="time">Time</Label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input id="time" required type="time" className="pl-10 rounded-xl h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="service">Service Type</Label>
                                    <Input id="service" required placeholder="e.g. Deep Cleaning, Repair..." className="rounded-xl h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Your Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input id="name" required placeholder="Enter full name" className="pl-10 rounded-xl h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mobile">Mobile Number</Label>
                                    <div className="flex gap-2">
                                        <div className="flex items-center justify-center px-3 border border-gray-200 bg-gray-50 rounded-xl text-sm font-medium text-gray-600">
                                            +91
                                        </div>
                                        <Input id="mobile" required type="tel" placeholder="98765 43210" className="rounded-xl h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all" />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 text-white font-bold shadow-lg shadow-blue-200 transition-all active:scale-[0.98] mt-4"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Checking Slot...
                                        </>
                                    ) : (
                                        <>
                                            Request Booking
                                        </>
                                    )}
                                </Button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-3xl p-8 text-center shadow-2xl border border-blue-100 w-full"
                        >
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Requested!</h3>
                            <p className="text-gray-500 mb-8">
                                We have received your request for <strong>{businessName}</strong>. Our team will call you shortly to confirm the slot.
                            </p>
                            <Button
                                onClick={onClose}
                                className="w-full h-11 rounded-xl bg-gray-900 text-white hover:bg-gray-800 font-semibold"
                            >
                                Done
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog >
    )
}
