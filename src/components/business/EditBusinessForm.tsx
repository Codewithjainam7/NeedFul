'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { ProviderWithDetails, Category } from '@/types/database'
import { z } from 'zod'

// Simplified schema for editing - closely matches the create schema but for updates
const editBusinessSchema = z.object({
    business_name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
    city: z.string().min(1, "City is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    address: z.string().optional(),
    operating_hours: z.string().optional(),
    // We can add dynamic details validation later if needed
    details: z.any().optional(),
})

type EditBusinessFormProps = {
    provider: ProviderWithDetails
    categories: Category[]
}

export function EditBusinessForm({ provider, categories }: EditBusinessFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm({
        resolver: zodResolver(editBusinessSchema),
        defaultValues: {
            business_name: provider.business_name,
            description: provider.description || '',
            city: provider.city,
            phone: provider.phone || '',
            address: provider.address || '',
            operating_hours: provider.operating_hours || '',
            // We'll skip complex details for this first iteration to ensure stability
        }
    })

    const { register, handleSubmit, formState: { errors } } = form

    const onSubmit = async (data: any) => {
        setIsLoading(true)
        try {
            const supabase = createClient()

            // TYPE FIX: Cast supabase to any to bypass strict type inference
            const { error } = await (supabase as any)
                .from('providers')
                .update({
                    business_name: data.business_name,
                    description: data.description,
                    city: data.city,
                    phone: data.phone,
                    address: data.address,
                    operating_hours: data.operating_hours
                })
                .eq('id', provider.id)

            if (error) throw error

            toast.success('Business details updated!')
            router.refresh()
            router.push('/profile')
        } catch (error: any) {
            console.error('Error updating business:', error)
            toast.error(error.message || 'Failed to update business')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="pl-0 hover:bg-transparent hover:text-[#FF5200]"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Profile
            </Button>

            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Edit {provider.business_name}</h1>
                    <p className="text-gray-500 text-sm">Update your business information.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="business_name">Business Name</Label>
                            <Input id="business_name" {...register('business_name')} className="h-11" />
                            {errors.business_name && <p className="text-red-500 text-xs">{errors.business_name.message as string}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" {...register('phone')} className="h-11" />
                                {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message as string}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" {...register('city')} className="h-11" />
                                {errors.city && <p className="text-red-500 text-xs">{errors.city.message as string}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" {...register('address')} className="h-11" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="operating_hours">Operating Hours</Label>
                            <Input id="operating_hours" {...register('operating_hours')} placeholder="e.g. Mon-Sat: 10AM - 9PM" className="h-11" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" {...register('description')} className="min-h-[100px] resize-none" />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => router.back()} className="h-11">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-[#FF5200] hover:bg-[#E04800] text-white h-11 px-8">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
