'use client'

import { Phone, MessageCircle, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface StickyActionBarProps {
    provider: any
    onBook?: () => void
}

export function StickyActionBar({ provider, onBook }: StickyActionBarProps) {
    const handleCall = () => {
        if (provider?.phone) {
            window.location.href = `tel:${provider.phone}`
        } else {
            toast.error("Phone number not available")
        }
    }

    const handleWhatsApp = () => {
        if (provider?.whatsapp || provider?.phone) {
            const num = provider.whatsapp || provider.phone
            window.open(`https://wa.me/${num?.replace(/\D/g, '')}`, '_blank')
        } else {
            toast.error("WhatsApp number not available")
        }
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-50 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-3">
                <Button
                    onClick={handleCall}
                    className="flex-1 bg-[#FF5200] hover:bg-[#E04800] text-white font-bold h-11 text-sm shadow-sm rounded-xl"
                >
                    <Phone className="w-4 h-4 mr-2" />
                    Show Number
                </Button>
                <Button
                    onClick={handleWhatsApp}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold h-11 text-sm shadow-sm rounded-xl"
                >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 shrink-0 rounded-xl border-gray-300"
                    onClick={onBook}
                >
                    <Calendar className="w-5 h-5 text-gray-700" />
                </Button>
            </div>
        </div>
    )
}
