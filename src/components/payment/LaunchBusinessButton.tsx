"use client"

import Script from 'next/script'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Rocket } from 'lucide-react'
import { toast } from 'sonner'

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface LaunchBusinessButtonProps {
    providerName?: string
    providerEmail?: string
    providerPhone?: string
    onSuccess?: (paymentId: string) => void
    className?: string
}

export function LaunchBusinessButton({
    providerName = "Business Owner",
    providerEmail = "owner@example.com",
    providerPhone = "9999999999",
    onSuccess,
    className
}: LaunchBusinessButtonProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handlePayment = async () => {
        setIsLoading(true)

        if (!window.Razorpay) {
            toast.error("Razorpay SDK failed to load. Please check your internet connection.")
            setIsLoading(false)
            return
        }

        // TODO: In a real app, create an order on the backend first using razorpay-node
        // and pass the order_id here. For now, we use client-side only mode for testing.

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_test_PlaceHolderKey", // Replace with your actual Test Key
            amount: 500000, // Amount is in currency subunits. Default currency is INR. Hence, 500000 refers to 500000 paise
            currency: "INR",
            name: "NeedFul Business Launch",
            description: "Premium Business Launch Fee",
            image: "https://needful.com/brand-logo.png", // Replace with your logo URL
            handler: function (response: any) {
                toast.success(`Payment Successful! ID: ${response.razorpay_payment_id}`)
                if (onSuccess) {
                    onSuccess(response.razorpay_payment_id)
                }
                // Call your API here to update the user's status to "Launched"
            },
            prefill: {
                name: providerName,
                email: providerEmail,
                contact: providerPhone
            },
            notes: {
                address: "NeedFul Corporate Office"
            },
            theme: {
                color: "#FF5200"
            }
        };

        try {
            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response: any) {
                toast.error(`Payment Failed: ${response.error.description}`);
            });
            rzp1.open();
        } catch (err) {
            console.error("Payment initiation failed", err);
            toast.error("Could not initiate payment.");
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="lazyOnload"
            />
            <Button
                onClick={handlePayment}
                className={`bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg shadow-orange-500/20 transition-all ${className}`}
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <Rocket className="mr-2 h-4 w-4" />
                        Launch Business (₹5000)
                    </>
                )}
            </Button>
        </>
    )
}
