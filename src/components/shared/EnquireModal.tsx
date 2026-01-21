'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle2, Loader2, Send, Sparkles, X } from 'lucide-react'
import { submitEnquiry } from '@/app/actions/enquiries'
import { toast } from 'sonner'

interface EnquireModalProps {
    isOpen: boolean
    onClose: () => void
    businessName: string
    providerId: string
}

export function EnquireModal({ isOpen, onClose, businessName, providerId }: EnquireModalProps) {
    const [step, setStep] = useState<'form' | 'success'>('form')
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const result = await submitEnquiry({
                provider_id: providerId,
                customer_name: formData.name,
                customer_phone: formData.phone,
                customer_email: formData.email,
                message: formData.message
            })

            if (result.error) {
                toast.error(result.error)
                setIsLoading(false)
                return
            }

            setStep('success')
        } catch (error: any) {
            toast.error(error.message || 'Failed to submit enquiry')
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setStep('form')
        setFormData({ name: '', phone: '', email: '', message: '' })
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-transparent border-0 shadow-none [&>button]:hidden">
                <AnimatePresence mode="wait">
                    {step === 'form' ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white/95 backdrop-blur-xl border-2 border-orange-100 shadow-2xl rounded-3xl overflow-hidden"
                        >
                            {/* Header Gradient */}
                            <div className="bg-gradient-to-r from-orange-500 via-[#FF5200] to-orange-600 p-6 pt-8 relative overflow-hidden">
                                <DialogTitle className="sr-only">Enquire about {businessName}</DialogTitle>
                                <div className="absolute top-0 right-0 p-4 opacity-20">
                                    <Sparkles className="w-24 h-24 text-white rotate-12" />
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="absolute right-4 top-4 rounded-full p-1.5 ring-offset-background transition-all hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 text-white hover:rotate-90 duration-300"
                                >
                                    <X className="h-5 w-5" />
                                    <span className="sr-only">Close</span>
                                </button>

                                <h2 className="text-2xl font-bold text-white relative z-10">Send Enquiry</h2>
                                <p className="text-orange-50 relative z-10 mt-1">
                                    Contact <span className="font-semibold">{businessName}</span>
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-gray-700 font-semibold">Name *</Label>
                                    <Input
                                        id="name"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter your full name"
                                        className="rounded-xl h-12 bg-gray-50 border-2 border-gray-200 focus:bg-white focus:border-[#FF5200] transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mobile" className="text-gray-700 font-semibold">Mobile Number *</Label>
                                    <div className="flex gap-2">
                                        <div className="flex items-center justify-center px-4 border-2 border-gray-200 bg-gray-100 rounded-xl text-sm font-bold text-gray-700">
                                            +91
                                        </div>
                                        <Input
                                            id="mobile"
                                            required
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="98765 43210"
                                            className="rounded-xl h-12 bg-gray-50 border-2 border-gray-200 focus:bg-white focus:border-[#FF5200] transition-all"
                                            maxLength={10}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-700 font-semibold">Email (Optional)</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="your.email@example.com"
                                        className="rounded-xl h-12 bg-gray-50 border-2 border-gray-200 focus:bg-white focus:border-[#FF5200] transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message" className="text-gray-700 font-semibold">Your Message *</Label>
                                    <Textarea
                                        id="message"
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Tell us about your requirements..."
                                        className="rounded-xl min-h-[100px] bg-gray-50 border-2 border-gray-200 focus:bg-white focus:border-[#FF5200] transition-all resize-none"
                                        rows={4}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 rounded-xl bg-gradient-to-r from-[#FF5200] to-orange-600 hover:from-orange-600 hover:to-[#FF5200] text-white font-bold shadow-lg shadow-orange-200 transition-all active:scale-[0.98] mt-4"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Enquiry <Send className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>

                                <p className="text-xs text-center text-gray-500 mt-3">
                                    Your details will be shared with the business owner
                                </p>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-3xl p-8 text-center shadow-2xl border-2 border-green-100 w-full"
                        >
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                                <CheckCircle2 className="w-10 h-10" strokeWidth={2.5} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Enquiry Sent!</h3>
                            <p className="text-gray-600 mb-8">
                                Your message has been sent to <strong className="text-[#FF5200]">{businessName}</strong>.
                                They will contact you shortly.
                            </p>
                            <Button
                                onClick={handleClose}
                                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#FF5200] to-orange-600 text-white hover:from-orange-600 hover:to-[#FF5200] font-bold shadow-lg"
                            >
                                Done
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    )
}
