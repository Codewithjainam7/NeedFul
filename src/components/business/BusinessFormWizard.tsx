'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createBusinessSchema, CreateBusinessInput } from '@/lib/business-schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Check, ChevronRight, ChevronLeft, Building2, Utensils, Stethoscope, Store, Loader2, Upload, X, Image as ImageIcon } from 'lucide-react'
import { createBusiness } from '@/app/actions/business'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { LocationAutocomplete } from '@/components/ui/location-autocomplete'
import dynamic from 'next/dynamic'
import { MapPin } from 'lucide-react'

// Dynamically import MapPicker with no SSR to avoid Leaflet window issues
const MapPicker = dynamic(() => import('@/components/ui/map-picker'), {
    ssr: false,
    loading: () => null
})

type Category = {
    id: string;
    name: string;
    slug: string;
    icon?: string;
}

export function BusinessFormWizard({ categories }: { categories: Category[] }) {
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const [isMapOpen, setIsMapOpen] = useState(false)


    const form = useForm<CreateBusinessInput>({
        resolver: zodResolver(createBusinessSchema),
        mode: 'onChange',
        defaultValues: {
            business_name: '',
            description: '',
            city: 'Mumbai',
            category_slug: '',
            details: {},
            images: [],
        }
    })

    const { register, control, watch, setValue, formState: { errors, isValid } } = form
    const selectedCategoryId = watch('category_id')
    const selectedCategory = categories.find(c => c.id === selectedCategoryId)

    const validateStep = async () => {
        let fieldsToValidate: any[] = []
        if (step === 1) fieldsToValidate = ['business_name', 'description', 'city', 'area', 'address', 'phone']
        if (step === 2) fieldsToValidate = ['category_id']
        if (step === 3) {
            // Validate specific details based on category logic or just validate 'details' object if schema permits
            // For now, we'll validate the entire 'details' path
            fieldsToValidate = ['details']
        }

        const result = await form.trigger(fieldsToValidate)
        if (result) setStep(s => s + 1)
    }

    const [uploading, setUploading] = useState(false)
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!e.target.files || e.target.files.length === 0) return
            setUploading(true)
            const file = e.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
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

            const currentImages = form.getValues('images') || []
            form.setValue('images', [...currentImages, publicUrl])
            toast.success('Image uploaded!')
        } catch (error) {
            toast.error('Error uploading image')
        } finally {
            setUploading(false)
        }
    }

    const onSubmit = async (data: CreateBusinessInput) => {
        setIsLoading(true)
        data.category_slug = selectedCategory?.slug || ''

        try {
            const res = await createBusiness(null, data)
            if (res.error) {
                toast.error(res.error)
            } else {
                toast.success("Business listed successfully!")
                router.push(`/business/${res.slug}`)
            }
        } catch (e) {
            toast.error("Something went wrong.")
        } finally {
            setIsLoading(false)
        }
    }

    const steps = [
        { id: 1, title: 'Basic Info' },
        { id: 2, title: 'Category' },
        { id: 3, title: 'Details' },
        { id: 4, title: 'Review' }
    ]

    return (
        <div className="flex flex-col h-full min-h-[600px] shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
            {/* Progress Bar - Solid White */}
            <div className="bg-white border-b border-gray-100 p-6 md:p-8">
                <div className="flex justify-between items-center max-w-xl mx-auto relative">
                    {/* Background Line */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full -z-10" />

                    {/* Active Line (Solid Brand Color) */}
                    <div
                        className="absolute top-1/2 left-0 h-1 bg-[#FF5200] -translate-y-1/2 rounded-full -z-10 transition-all duration-500 ease-in-out"
                        style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                    />

                    {steps.map((s) => {
                        const isActive = step >= s.id;
                        const isCompleted = step > s.id;

                        return (
                            <div key={s.id} className="flex flex-col items-center relative group">
                                <div
                                    className={`
                                        w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2
                                        ${isActive
                                            ? 'bg-[#FF5200] border-[#FF5200] text-white shadow-lg shadow-orange-500/20 scale-110'
                                            : 'bg-white border-gray-200 text-gray-400'
                                        }
                                    `}
                                >
                                    {isCompleted ? <Check className="w-4 h-4" strokeWidth={3} /> : s.id}
                                </div>
                                <span className={`
                                    absolute -bottom-6 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-300
                                    ${isActive ? 'text-[#FF5200]' : 'text-gray-400'}
                                `}>
                                    {s.title}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Form Content - Solid White Card Main */}
            <div className="flex-1 p-6 md:p-8 relative z-20 bg-white">
                <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
                    console.error("Form Validation Errors:", errors)
                    toast.error("Please check the form for errors. Some required fields might be missing.")
                })} className="max-w-xl mx-auto space-y-6">
                    <AnimatePresence mode="wait">

                        {/* STEP 1: BASIC INFO */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <Label className="font-bold text-gray-700 text-xs uppercase tracking-wide">Business Name</Label>
                                            <Input {...register('business_name')} placeholder="e.g. Sharma Sweets" className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm" />
                                            {errors.business_name && <p className="text-red-500 text-xs font-semibold mt-1">{errors.business_name.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold text-gray-700 text-xs uppercase tracking-wide">Phone Number</Label>
                                            <Input {...register('phone')} placeholder="+91 9876543210" className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm" />
                                            {errors.phone && <p className="text-red-500 text-xs font-semibold mt-1">{errors.phone.message}</p>}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold text-gray-700 text-xs uppercase tracking-wide">Description</Label>
                                        <Textarea {...register('description')} placeholder="Tell us about your business..." className="min-h-[100px] rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm resize-none" />
                                        {errors.description && <p className="text-red-500 text-xs font-semibold mt-1">{errors.description.message}</p>}
                                    </div>


                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <Label className="font-bold text-gray-700 text-xs uppercase tracking-wide">City</Label>
                                            <Select onValueChange={(val) => setValue('city', val)} defaultValue={watch('city')}>
                                                <SelectTrigger className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm"><SelectValue placeholder="Select City" /></SelectTrigger>
                                                <SelectContent position="popper">
                                                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                                                    <SelectItem value="Delhi">Delhi</SelectItem>
                                                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold text-gray-700 text-xs uppercase tracking-wide">Area / Locality</Label>
                                            <Controller
                                                control={control}
                                                name="area"
                                                render={({ field }) => (
                                                    <LocationAutocomplete
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        placeholder="Select or type area..."
                                                    />
                                                )}
                                            />
                                            {errors.area && <p className="text-red-500 text-xs font-semibold mt-1">{errors.area.message}</p>}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <Label className="font-bold text-gray-700 text-xs uppercase tracking-wide">Full Address</Label>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 text-orange-600 hover:text-orange-700 hover:bg-orange-50 text-xs font-medium px-2"
                                                onClick={() => setIsMapOpen(true)}
                                            >
                                                <MapPin className="w-3 h-3 mr-1" />
                                                Pick on Map
                                            </Button>
                                        </div>
                                        <div className="relative">
                                            <Input {...register('address')} placeholder="Shop No, Building, Street..." className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm pr-10" />
                                            <MapPin
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer hover:text-orange-500 transition-colors"
                                                onClick={() => setIsMapOpen(true)}
                                            />
                                        </div>
                                        {errors.address && <p className="text-red-500 text-xs font-semibold mt-1">{errors.address.message}</p>}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Map Picker Modal */}
                        <MapPicker
                            isOpen={isMapOpen}
                            onClose={() => setIsMapOpen(false)}
                            onConfirm={(location) => {
                                setValue('address', location.address, { shouldDirty: true })
                                // If we had lat/lng fields in the form, we would set them here too
                                // setValue('latitude', location.lat)
                                // setValue('longitude', location.lng)
                            }}
                        />

                        {/* STEP 2: CATEGORY Selection with Search */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="text-center space-y-2">
                                    <h3 className="text-2xl font-bold text-gray-800">Choose Category</h3>
                                    <p className="text-gray-500 text-sm">Select the most relevant category for your business.</p>
                                </div>

                                {/* Category Dropdown with Search */}
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Controller
                                            control={control}
                                            name="category_id"
                                            render={({ field }) => {
                                                const [searchQuery, setSearchQuery] = useState('')
                                                const [isOpen, setIsOpen] = useState(false)

                                                // Use only database categories (no local fallbacks to avoid validation errors)
                                                const filteredCategories = categories.filter(cat =>
                                                    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
                                                )

                                                const selectedCat = categories.find(c => c.id === field.value)

                                                return (
                                                    <div className="relative">
                                                        {/* Dropdown Trigger */}
                                                        <div
                                                            className={`
                                                                w-full h-14 px-5 rounded-xl cursor-pointer flex items-center justify-between
                                                                border-2 transition-all duration-200
                                                                ${isOpen
                                                                    ? 'border-[#FF5200] ring-4 ring-orange-500/10 bg-white'
                                                                    : field.value
                                                                        ? 'border-[#FF5200]/30 bg-orange-50/50'
                                                                        : 'border-gray-200 bg-gray-50 hover:border-orange-300'
                                                                }
                                                            `}
                                                            onClick={() => setIsOpen(!isOpen)}
                                                        >
                                                            <span className={`font-medium ${field.value ? 'text-gray-900' : 'text-gray-400'}`}>
                                                                {selectedCat?.name || 'Select a category...'}
                                                            </span>
                                                            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                                                        </div>

                                                        {/* Dropdown Panel */}
                                                        {isOpen && (
                                                            <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-orange-100 overflow-hidden">
                                                                {/* Search Input */}
                                                                <div className="p-3 border-b border-gray-100">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Search categories..."
                                                                        value={searchQuery}
                                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                                        className="w-full h-12 px-4 rounded-xl bg-gradient-to-r from-gray-50 to-orange-50/30 border border-gray-200 focus:border-[#FF5200] focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    />
                                                                </div>

                                                                {/* Categories List */}
                                                                <div className="max-h-64 overflow-y-auto p-2">
                                                                    {filteredCategories.length > 0 ? (
                                                                        filteredCategories.map((cat) => (
                                                                            <div
                                                                                key={cat.id}
                                                                                onClick={() => {
                                                                                    field.onChange(cat.id)
                                                                                    setValue('category_slug', cat.slug)
                                                                                    setIsOpen(false)
                                                                                    setSearchQuery('')
                                                                                }}
                                                                                className={`
                                                                                    flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-150
                                                                                    ${field.value === cat.id
                                                                                        ? 'bg-orange-100 text-[#FF5200]'
                                                                                        : 'hover:bg-orange-50 text-gray-700'
                                                                                    }
                                                                                `}
                                                                            >
                                                                                <div className={`
                                                                                    p-2 rounded-lg transition-colors
                                                                                    ${field.value === cat.id ? 'bg-[#FF5200] text-white' : 'bg-gray-100 text-gray-500'}
                                                                                `}>
                                                                                    <Building2 className="w-4 h-4" />
                                                                                </div>
                                                                                <span className="font-medium">{cat.name}</span>
                                                                                {field.value === cat.id && (
                                                                                    <Check className="w-4 h-4 ml-auto text-[#FF5200]" />
                                                                                )}
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <div className="px-4 py-8 text-center text-gray-400">
                                                                            No categories found
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            }}
                                        />
                                    </div>

                                    {/* Selected category display */}
                                    {selectedCategoryId && (
                                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200 flex items-center gap-3">
                                            <div className="bg-[#FF5200] p-2 rounded-lg text-white">
                                                <Building2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-orange-600 font-medium uppercase tracking-wide">Selected Category</p>
                                                <p className="font-bold text-gray-900">{selectedCategory?.name || categories.find(c => c.id === selectedCategoryId)?.name}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {errors.category_id && <p className="text-red-500 text-center text-sm font-medium">{errors.category_id.message}</p>}
                            </motion.div>
                        )}

                        {/* STEP 3: DYNAMIC DETAILS */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-gray-800">
                                        {selectedCategory ? `${selectedCategory.name} Details` : 'Additional Details'}
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1">A few more specific details.</p>
                                </div>

                                {/* DYNAMIC FORM LOGIC (Re-styled inputs) */}
                                {selectedCategory?.slug === 'restaurants' && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                        <div className="space-y-3">
                                            <Label className="font-bold text-gray-700 text-xs uppercase tracking-wide">Cuisines</Label>
                                            <Input
                                                placeholder="e.g. North Indian, Chinese, Italian"
                                                onChange={(e) => {
                                                    const val = e.target.value.split(',').map(s => s.trim())
                                                    setValue('details.cuisines', val)
                                                }}
                                                className="h-14 rounded-xl bg-white border-2 border-gray-100 focus:border-[#FF5200] focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm text-base"
                                            />
                                            <p className="text-xs text-gray-400">Separate multiple cuisines with commas</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="space-y-3">
                                                <Label className="font-bold text-gray-700 text-xs uppercase tracking-wide">Average Cost (for two)</Label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                                                    <Input
                                                        placeholder="800"
                                                        {...register('details.avg_cost')}
                                                        className="h-14 pl-8 rounded-xl bg-white border-2 border-gray-100 focus:border-[#FF5200] focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm text-base"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="font-bold text-gray-700 text-xs uppercase tracking-wide">Type</Label>
                                                <Select onValueChange={(val) => setValue('details.veg_non_veg', val)}>
                                                    <SelectTrigger className="h-14 rounded-xl bg-white border-2 border-gray-100 focus:border-[#FF5200] focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm text-base">
                                                        <SelectValue placeholder="Select Type" />
                                                    </SelectTrigger>
                                                    <SelectContent position="popper" className="max-h-[200px] overflow-y-auto rounded-xl border-orange-100 shadow-xl">
                                                        <SelectItem value="Veg" className="focus:bg-orange-50 focus:text-orange-700 cursor-pointer py-3 rounded-lg my-1">Pure Veg</SelectItem>
                                                        <SelectItem value="Non-Veg" className="focus:bg-orange-50 focus:text-orange-700 cursor-pointer py-3 rounded-lg my-1">Non-Veg</SelectItem>
                                                        <SelectItem value="Both" className="focus:bg-orange-50 focus:text-orange-700 cursor-pointer py-3 rounded-lg my-1">Both</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="pb-4"></div>
                                    </div>
                                )}

                                {selectedCategory?.slug === 'doctors' && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                        <div className="space-y-3">
                                            <Label className="font-bold text-gray-700 text-xs uppercase tracking-wide">Specialization</Label>
                                            <Input {...register('details.specialization')} placeholder="e.g. Cardiologist" className="h-14 rounded-xl bg-white border-2 border-gray-100 focus:border-[#FF5200] focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm text-base" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="space-y-3">
                                                <Label className="font-bold text-gray-700 text-xs uppercase tracking-wide">Experience (Years)</Label>
                                                <Input type="number" {...register('details.experience_years')} placeholder="10" className="h-14 rounded-xl bg-white border-2 border-gray-100 focus:border-[#FF5200] focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm text-base" />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="font-bold text-gray-700 text-xs uppercase tracking-wide">Consultation Fee</Label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                                                    <Input type="number" {...register('details.consultation_fee')} placeholder="500" className="h-14 pl-8 rounded-xl bg-white border-2 border-gray-100 focus:border-[#FF5200] focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm text-base" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pb-4"></div>
                                    </div>
                                )}

                                {selectedCategory?.slug === 'hotels' && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                        <div className="space-y-3">
                                            <Label className="font-bold text-gray-700 text-xs uppercase tracking-wide">Star Rating</Label>
                                            <Select onValueChange={(val) => setValue('details.star_rating', parseInt(val))}>
                                                <SelectTrigger className="h-14 rounded-xl bg-white border-2 border-gray-100 focus:border-[#FF5200] focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm text-base"><SelectValue placeholder="Select Star Rating" /></SelectTrigger>
                                                <SelectContent position="popper" className="rounded-xl border-orange-100 shadow-xl">
                                                    {[1, 2, 3, 4, 5].map(n => <SelectItem key={n} value={n.toString()} className="focus:bg-orange-50 focus:text-orange-700 cursor-pointer py-3 rounded-lg my-1">{n} Star</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="font-bold text-gray-700 text-xs uppercase tracking-wide">Amenities</Label>
                                            <Input
                                                placeholder="e.g. WiFi, Pool, Gym"
                                                onChange={(e) => {
                                                    const val = e.target.value.split(',').map(s => s.trim())
                                                    setValue('details.amenities', val)
                                                }}
                                                className="h-14 rounded-xl bg-white border-2 border-gray-100 focus:border-[#FF5200] focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm text-base"
                                            />
                                            <p className="text-xs text-gray-400">Separate multiple amenities with commas</p>
                                        </div>
                                        <div className="pb-4"></div>
                                    </div>
                                )}

                                {['restaurants', 'doctors', 'hotels'].indexOf(selectedCategory?.slug || '') === -1 && (
                                    <div className="p-6 bg-orange-50 rounded-xl border border-orange-100 text-orange-900 shadow-sm">
                                        <p className="font-semibold text-sm">General details for {selectedCategory?.name}</p>
                                        <div className="mt-4 space-y-2">
                                            <Label className="font-bold text-gray-800 text-xs uppercase tracking-wide">Services Offered (Comma separated)</Label>
                                            <Input
                                                placeholder="List your services..."
                                                onChange={(e) => {
                                                    const val = e.target.value.split(',').map(s => s.trim())
                                                    setValue('details.services_offered', val)
                                                }}
                                                className="h-14 rounded-xl bg-white border-2 border-orange-200 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 text-base"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Image Upload Section */}
                                <div className="space-y-3 pt-4">
                                    <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 text-sm text-blue-900 flex flex-col md:flex-row gap-4 items-center shadow-sm">
                                        <div className="bg-white p-3 rounded-full shadow-sm border border-blue-100">
                                            <Upload className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <p className="font-bold text-base mb-0.5 text-blue-900">Upload Photos</p>
                                            <p className="text-blue-700/80 text-xs">Add images to make your listing attractive. (Max 5MB)</p>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={uploading}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                            />
                                            <Button type="button" variant="secondary" disabled={uploading} className="bg-white text-blue-700 hover:bg-blue-100 border border-blue-200">
                                                {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ImageIcon className="w-4 h-4 mr-2" />}
                                                {uploading ? 'Uploading...' : 'Select Image'}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Image Previews */}
                                    {watch('images') && watch('images')!.length > 0 && (
                                        <div className="grid grid-cols-3 gap-3">
                                            {watch('images')?.map((url, idx) => (
                                                <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group">
                                                    <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => {
                                                            const newImages = watch('images')?.filter((_, i) => i !== idx)
                                                            setValue('images', newImages)
                                                        }}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 4: REVIEW */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-gray-800">Review & Submit</h3>
                                    <p className="text-gray-500 text-sm mt-1">Double check your information.</p>
                                </div>
                                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-4">
                                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                        <span className="text-gray-500 font-bold text-xs uppercase tracking-wide">Business Name</span>
                                        <span className="text-lg font-bold text-gray-800">{watch('business_name')}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                        <span className="text-gray-500 font-bold text-xs uppercase tracking-wide">Category</span>
                                        <span className="bg-orange-100 text-orange-700 border border-orange-200 px-3 py-1 rounded-full text-sm font-bold shadow-sm">{selectedCategory?.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                        <span className="text-gray-500 font-bold text-xs uppercase tracking-wide">City</span>
                                        <span className="text-gray-800 font-medium">{watch('city')}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 font-bold text-xs uppercase tracking-wide">Contact</span>
                                        <span className="text-gray-800 font-medium">{watch('phone')}</span>
                                    </div>
                                </div>

                                {/* Display uploaded images in review */}
                                {watch('images') && watch('images')!.length > 0 && (
                                    <div className="space-y-3">
                                        <p className="text-gray-500 font-bold text-xs uppercase tracking-wide">Uploaded Photos</p>
                                        <div className="grid grid-cols-3 gap-3">
                                            {watch('images')?.map((url, idx) => (
                                                <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                                                    <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-8 border-t border-gray-100">
                        {step > 1 ? (
                            <Button type="button" variant="outline" onClick={() => setStep(s => s - 1)} className="rounded-xl h-12 px-6 border-2 hover:bg-gray-50 hover:border-gray-300 transition-all">
                                <ChevronLeft className="w-4 h-4 mr-2" /> Back
                            </Button>
                        ) : <div></div>}

                        {step < 4 ? (
                            <Button type="button" onClick={validateStep} className="bg-[#FF5200] hover:bg-orange-700 text-white rounded-xl h-12 px-8 shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all active:scale-[0.98]">
                                Next <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button type="submit" disabled={isLoading || form.formState.isSubmitting} className="bg-gradient-to-r from-[#FF5200] via-orange-500 to-amber-500 hover:from-[#E04800] hover:via-orange-600 hover:to-amber-600 text-white rounded-xl h-12 px-10 w-full md:w-auto shadow-xl shadow-orange-500/30 hover:shadow-orange-500/40 transition-all active:scale-[0.98] text-lg font-semibold cursor-pointer">
                                {isLoading || form.formState.isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Check className="w-5 h-5 mr-2" />}
                                Launch Business
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div >
    )
}
