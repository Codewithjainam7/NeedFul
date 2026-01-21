'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Phone, MessageCircle, Mail, Clock, CheckCheck, X } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { updateEnquiryStatus } from '@/app/actions/enquiries'
import { toast } from 'sonner'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Enquiry {
    id: string
    customer_name: string
    customer_phone: string
    customer_email: string | null
    message: string
    status: 'new' | 'contacted' | 'closed'
    created_at: string
}

interface EnquiriesListProps {
    enquiries: Enquiry[]
    businessName: string
}

export function EnquiriesList({ enquiries, businessName }: EnquiriesListProps) {
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const handleStatusUpdate = async (enquiryId: string, status: 'contacted' | 'closed') => {
        setLoadingId(enquiryId)
        const result = await updateEnquiryStatus(enquiryId, status)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(`Marked as ${status}`)
        }
        setLoadingId(null)
    }

    const handleWhatsApp = (phone: string, name: string) => {
        const cleanNumber = phone.replace(/\D/g, '')
        const finalNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber
        const message = `Hi ${name}, thank you for your enquiry about ${businessName}. How can I help you?`
        window.open(`https://wa.me/${finalNumber}?text=${encodeURIComponent(message)}`, '_blank')
    }

    const handleCall = (phone: string) => {
        window.open(`tel:${phone}`, '_self')
    }

    if (enquiries.length === 0) {
        return (
            <Card className="border-2 border-gray-100 shadow-sm">
                <CardContent className="py-16 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No Enquiries Yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        When customers enquire about your business, you'll see their details here.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {enquiries.map((enquiry) => (
                <Card
                    key={enquiry.id}
                    className={cn(
                        "border-2 shadow-md hover:shadow-lg transition-all duration-300",
                        enquiry.status === 'new' ? 'border-orange-200 bg-orange-50/30' :
                            enquiry.status === 'contacted' ? 'border-blue-200 bg-blue-50/20' :
                                'border-gray-200 bg-gray-50/50'
                    )}
                >
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-bold text-gray-900">{enquiry.customer_name}</h3>
                                    <Badge
                                        className={cn(
                                            "text-xs font-semibold px-2.5 py-1",
                                            enquiry.status === 'new' && 'bg-orange-500 text-white',
                                            enquiry.status === 'contacted' && 'bg-blue-500 text-white',
                                            enquiry.status === 'closed' && 'bg-gray-500 text-white'
                                        )}
                                    >
                                        {enquiry.status === 'new' && '🆕 New'}
                                        {enquiry.status === 'contacted' && '📞 Contacted'}
                                        {enquiry.status === 'closed' && '✓ Closed'}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Clock className="w-4 h-4" />
                                    {formatDistanceToNow(new Date(enquiry.created_at), { addSuffix: true })}
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Contact Details */}
                        <div className="bg-white px-4 py-3 rounded-xl border-2 border-gray-100 space-y-2">
                            <div className="flex items-center gap-2 text-gray-700">
                                <Phone className="w-4 h-4 text-[#FF5200]" />
                                <span className="font-semibold">{enquiry.customer_phone}</span>
                            </div>
                            {enquiry.customer_email && (
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span>{enquiry.customer_email}</span>
                                </div>
                            )}
                        </div>

                        {/* Message */}
                        <div className="bg-gradient-to-br from-gray-50 to-white px-4 py-3 rounded-xl border-2 border-gray-100">
                            <p className="text-sm font-semibold text-gray-500 mb-1">Message</p>
                            <p className="text-gray-800 leading-relaxed">{enquiry.message}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 pt-2">
                            <Button
                                onClick={() => handleWhatsApp(enquiry.customer_phone, enquiry.customer_name)}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold h-11 rounded-xl shadow-md transition-all active:scale-[0.98]"
                            >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                WhatsApp
                            </Button>
                            <Button
                                onClick={() => handleCall(enquiry.customer_phone)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11 rounded-xl shadow-md transition-all active:scale-[0.98]"
                            >
                                <Phone className="w-4 h-4 mr-2" />
                                Call Now
                            </Button>
                        </div>

                        {/* Status Update Buttons */}
                        {enquiry.status === 'new' && (
                            <div className="flex gap-2 pt-2 border-t-2 border-gray-100">
                                <Button
                                    onClick={() => handleStatusUpdate(enquiry.id, 'contacted')}
                                    disabled={loadingId === enquiry.id}
                                    variant="outline"
                                    className="flex-1 border-2 border-green-200 text-green-700 hover:bg-green-50 font-semibold h-10 rounded-lg"
                                >
                                    <CheckCheck className="w-4 h-4 mr-1.5" />
                                    Mark Contacted
                                </Button>
                                <Button
                                    onClick={() => handleStatusUpdate(enquiry.id, 'closed')}
                                    disabled={loadingId === enquiry.id}
                                    variant="outline"
                                    className="flex-1 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold h-10 rounded-lg"
                                >
                                    <X className="w-4 h-4 mr-1.5" />
                                    Close
                                </Button>
                            </div>
                        )}

                        {enquiry.status === 'contacted' && (
                            <Button
                                onClick={() => handleStatusUpdate(enquiry.id, 'closed')}
                                disabled={loadingId === enquiry.id}
                                variant="outline"
                                className="w-full border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold h-10 rounded-lg"
                            >
                                <X className="w-4 h-4 mr-1.5" />
                                Mark as Closed
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
