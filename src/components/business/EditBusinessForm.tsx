'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save, ArrowLeft, Upload, X, Image as ImageIcon, Star, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { ProviderWithDetails, Category } from '@/types/database'
import { z } from 'zod'

// Comprehensive schema for editing
const editBusinessSchema = z.object({
    business_name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
    city: z.string().min(1, "City is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    address: z.string().optional(),
    operating_hours: z.string().optional(),
    email: z.string().email("Invalid email").optional().or(z.literal('')),
    website: z.string().url("Invalid URL").optional().or(z.literal('')),
    gst_number: z.string().optional(),
    area: z.string().optional(),
    pricing: z.string().optional(),
    tags: z.string().optional(),
    social_instagram: z.string().optional(),
    social_facebook: z.string().optional(),
    social_twitter: z.string().optional(),
})

type EditBusinessFormProps = {
    provider: ProviderWithDetails
    categories: Category[]
}

export function EditBusinessForm({ provider, categories }: EditBusinessFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [images, setImages] = useState<any[]>(provider.provider_images || [])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const form = useForm({
        resolver: zodResolver(editBusinessSchema),
        defaultValues: {
            business_name: provider.business_name,
            description: provider.description || '',
            city: provider.city,
            phone: provider.phone || '',
            address: provider.address || '',
            operating_hours: provider.operating_hours || '',
            email: provider.email || '',
            website: (provider as any).website || '',
            gst_number: (provider as any).gst_number || '',
            area: (provider as any).area || '',
            pricing: (provider as any).pricing || '',
            tags: (provider as any).tags?.join(', ') || '',
            social_instagram: (provider as any).social_instagram || '',
            social_facebook: (provider as any).social_facebook || '',
            social_twitter: (provider as any).social_twitter || '',
        }
    })

    const { register, handleSubmit, formState: { errors } } = form

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!e.target.files || e.target.files.length === 0) return
            setUploading(true)
            const file = e.target.files[0]

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size must be less than 5MB')
                return
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file')
                return
            }

            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
            const filePath = `${fileName}`

            const supabase = createClient()
            const { error: uploadError } = await supabase.storage
                .from('business-images')
                .upload(filePath, file)

            if (uploadError) {
                toast.error('Error uploading image: ' + uploadError.message)
                return
            }

            const { data: { publicUrl } } = supabase.storage
                .from('business-images')
                .getPublicUrl(filePath)

            // Insert into provider_images table
            const { data: newImage, error: dbError } = await (supabase as any)
                .from('provider_images')
                .insert({
                    provider_id: provider.id,
                    url: publicUrl,
                    is_primary: images.length === 0 // First image is primary
                })
                .select()
                .single()

            if (dbError) {
                toast.error('Error saving image')
                return
            }

            setImages([...images, newImage])
            toast.success('Image uploaded successfully!')

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        } catch (error) {
            toast.error('Error uploading image')
        } finally {
            setUploading(false)
        }
    }

    const handleDeleteImage = async (imageId: string) => {
        try {
            const supabase = createClient()
            const { error } = await (supabase as any)
                .from('provider_images')
                .delete()
                .eq('id', imageId)

            if (error) {
                toast.error('Error deleting image')
                return
            }

            setImages(images.filter(img => img.id !== imageId))
            toast.success('Image deleted successfully')
        } catch (error) {
            toast.error('Error deleting image')
        }
    }

    const handleSetPrimary = async (imageId: string) => {
        try {
            const supabase = createClient()

            // Set all images to non-primary
            await (supabase as any)
                .from('provider_images')
                .update({ is_primary: false })
                .eq('provider_id', provider.id)

            // Set selected image as primary
            const { error } = await (supabase as any)
                .from('provider_images')
                .update({ is_primary: true })
                .eq('id', imageId)

            if (error) {
                toast.error('Error setting primary image')
                return
            }

            setImages(images.map(img => ({
                ...img,
                is_primary: img.id === imageId
            })))
            toast.success('Primary image updated!')
        } catch (error) {
            toast.error('Error updating primary image')
        }
    }

    const onSubmit = async (data: any) => {
        setIsLoading(true)
        try {
            const supabase = createClient()

            // Process tags if provided
            const tagsArray = data.tags ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []

            const { error } = await (supabase as any)
                .from('providers')
                .update({
                    business_name: data.business_name,
                    description: data.description,
                    city: data.city,
                    phone: data.phone,
                    address: data.address,
                    operating_hours: data.operating_hours,
                    email: data.email || null,
                    website: data.website || null,
                    gst_number: data.gst_number || null,
                    area: data.area || null,
                    pricing: data.pricing || null,
                    tags: tagsArray.length > 0 ? tagsArray : null,
                    social_instagram: data.social_instagram || null,
                    social_facebook: data.social_facebook || null,
                    social_twitter: data.social_twitter || null,
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
        <div className="max-w-4xl mx-auto space-y-6">
            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="pl-0 hover:bg-transparent hover:text-[#FF5200] transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Profile
            </Button>

            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Edit {provider.business_name}</h1>
                    <p className="text-gray-500 text-sm mt-1">Update your business information and images.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Basic Information Section */}
                    <div className="space-y-6">
                        <div className="border-l-4 border-[#FF5200] pl-4">
                            <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
                            <p className="text-sm text-gray-500">Essential details about your business</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="business_name" className="text-gray-700 font-medium">Business Name *</Label>
                                <Input
                                    id="business_name"
                                    {...register('business_name')}
                                    className="h-11 border-gray-300 focus:border-[#FF5200] focus:ring-[#FF5200]"
                                />
                                {errors.business_name && <p className="text-red-500 text-xs">{errors.business_name.message as string}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-gray-700 font-medium">Description</Label>
                                <Textarea
                                    id="description"
                                    {...register('description')}
                                    className="min-h-[120px] resize-none border-gray-300 focus:border-[#FF5200] focus:ring-[#FF5200]"
                                    placeholder="Tell customers about your business..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number *</Label>
                                    <Input
                                        id="phone"
                                        {...register('phone')}
                                        className="h-11 border-gray-300 focus:border-[#FF5200] focus:ring-[#FF5200]"
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message as string}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        {...register('email')}
                                        className="h-11 border-gray-300 focus:border-[#FF5200] focus:ring-[#FF5200]"
                                        placeholder="business@example.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs">{errors.email.message as string}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city" className="text-gray-700 font-medium">City *</Label>
                                    <Input
                                        id="city"
                                        {...register('city')}
                                        className="h-11 border-gray-300 focus:border-[#FF5200] focus:ring-[#FF5200]"
                                    />
                                    {errors.city && <p className="text-red-500 text-xs">{errors.city.message as string}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="area" className="text-gray-700 font-medium">Area</Label>
                                    <Input
                                        id="area"
                                        {...register('area')}
                                        className="h-11 border-gray-300 focus:border-[#FF5200] focus:ring-[#FF5200]"
                                        placeholder="e.g., Kandivali East"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-gray-700 font-medium">Full Address</Label>
                                <Input
                                    id="address"
                                    {...register('address')}
                                    className="h-11 border-gray-300 focus:border-[#FF5200] focus:ring-[#FF5200]"
                                    placeholder="Street address, landmarks..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Business Details Section */}
                    <div className="space-y-6">
                        <div className="border-l-4 border-[#FF5200] pl-4">
                            <h2 className="text-xl font-bold text-gray-900">Business Details</h2>
                            <p className="text-sm text-gray-500">Additional information for customers</p>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="operating_hours" className="text-gray-700 font-medium">Operating Hours</Label>
                                    <Input
                                        id="operating_hours"
                                        {...register('operating_hours')}
                                        placeholder="e.g., Mon-Sat: 10AM - 9PM"
                                        className="h-11 border-gray-300 focus:border-[#FF5200] focus:ring-[#FF5200]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pricing" className="text-gray-700 font-medium">Pricing Range</Label>
                                    <Input
                                        id="pricing"
                                        {...register('pricing')}
                                        placeholder="e.g., ₹₹ or 500-2000"
                                        className="h-11 border-gray-300 focus:border-[#FF5200] focus:ring-[#FF5200]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="website" className="text-gray-700 font-medium">Website URL</Label>
                                    <Input
                                        id="website"
                                        type="url"
                                        {...register('website')}
                                        placeholder="https://yourwebsite.com"
                                        className="h-11 border-gray-300 focus:border-[#FF5200] focus:ring-[#FF5200]"
                                    />
                                    {errors.website && <p className="text-red-500 text-xs">{errors.website.message as string}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gst_number" className="text-gray-700 font-medium">GST Number</Label>
                                    <Input
                                        id="gst_number"
                                        {...register('gst_number')}
                                        placeholder="GST number if applicable"
                                        className="h-11 border-gray-300 focus:border-[#FF5200] focus:ring-[#FF5200]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tags" className="text-gray-700 font-medium">Tags / Keywords</Label>
                                <Input
                                    id="tags"
                                    {...register('tags')}
                                    placeholder="e.g., fast delivery, budget-friendly, premium (separate with commas)"
                                    className="h-11 border-gray-300 focus:border-[#FF5200] focus:ring-[#FF5200]"
                                />
                                <p className="text-xs text-gray-500">Separate tags with commas</p>
                            </div>
                        </div>
                    </div>

                    {/* Social Media Section */}
                    <div className="space-y-6">
                        <div className="border-l-4 border-[#FF5200] pl-4">
                            <h2 className="text-xl font-bold text-gray-900">Social Media</h2>
                            <p className="text-sm text-gray-500">Connect your social media accounts</p>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="social_instagram" className="text-gray-700 font-medium">Instagram</Label>
                                    <Input
                                        id="social_instagram"
                                        {...register('social_instagram')}
                                        placeholder="@yourbusiness"
                                        className="h-11 border-gray-300 focus:border-[#FF5200] focus:ring-[#FF5200]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="social_facebook" className="text-gray-700 font-medium">Facebook</Label>
                                    <Input
                                        id="social_facebook"
                                        {...register('social_facebook')}
                                        placeholder="facebook.com/yourbusiness"
                                        className="h-11 border-gray-300 focus:border-[#FF5200] focus:ring-[#FF5200]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="social_twitter" className="text-gray-700 font-medium">Twitter / X</Label>
                                    <Input
                                        id="social_twitter"
                                        {...register('social_twitter')}
                                        placeholder="@yourbusiness"
                                        className="h-11 border-gray-300 focus:border-[#FF5200] focus:ring-[#FF5200]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image Management Section */}
                    <div className="space-y-6">
                        <div className="border-l-4 border-[#FF5200] pl-4">
                            <h2 className="text-xl font-bold text-gray-900">Business Images</h2>
                            <p className="text-sm text-gray-500">Upload and manage your business photos</p>
                        </div>

                        <div className="space-y-4">
                            {/* Upload Button */}
                            <div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="w-full md:w-auto border-[#FF5200] text-[#FF5200] hover:bg-[#FF5200] hover:text-white transition-colors"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4 mr-2" />
                                            Upload New Image
                                        </>
                                    )}
                                </Button>
                                <p className="text-xs text-gray-500 mt-2">Max 5MB per image. JPG, PNG, WebP supported.</p>
                            </div>

                            {/* Image Grid */}
                            {images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {images.map((image) => (
                                        <div
                                            key={image.id}
                                            className={`relative group rounded-lg overflow-hidden border-2 ${image.is_primary ? 'border-[#FF5200] ring-2 ring-[#FF5200] ring-offset-2' : 'border-gray-200'
                                                }`}
                                        >
                                            <div className="aspect-square relative">
                                                <img
                                                    src={image.url}
                                                    alt="Business"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() => handleSetPrimary(image.id)}
                                                        className="bg-white/90 hover:bg-white text-xs"
                                                        disabled={image.is_primary}
                                                    >
                                                        <Star className={`w-3 h-3 mr-1 ${image.is_primary ? 'fill-[#FF5200] text-[#FF5200]' : ''}`} />
                                                        {image.is_primary ? 'Primary' : 'Set Primary'}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleDeleteImage(image.id)}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                            {image.is_primary && (
                                                <div className="absolute top-2 left-2 bg-[#FF5200] text-white text-xs px-2 py-1 rounded-md font-medium flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-white" />
                                                    Primary
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {images.length === 0 && (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500">No images uploaded yet</p>
                                    <p className="text-sm text-gray-400">Click the upload button to add photos</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="pt-6 flex flex-col md:flex-row justify-end gap-3 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            className="h-11 border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-[#FF5200] hover:bg-[#E04800] text-white h-11 px-8 shadow-lg shadow-[#FF5200]/30"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
