'use client'

import { useState, useRef, useEffect, ChangeEvent } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Image as ImageIcon, Video, Loader2, Check } from 'lucide-react'
import { useCreateStory } from '@/hooks/useBusinessStories'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { toast } from 'sonner'

interface StoryCreatorProps {
    providerId: string
    providerName: string
    onClose: () => void
    onSuccess?: () => void
}

export function StoryCreator({
    providerId,
    providerName,
    onClose,
    onSuccess,
}: StoryCreatorProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string>('')
    const [caption, setCaption] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [mounted, setMounted] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const createStory = useCreateStory()

    // Mount check for portal
    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        const validVideoTypes = ['video/mp4', 'video/mov', 'video/quicktime']

        if (![...validImageTypes, ...validVideoTypes].includes(file.type)) {
            toast.error('Invalid file type. Please upload JPG, PNG, MP4, or MOV.')
            return
        }

        // Validate file size
        const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024
        if (file.size > maxSize) {
            const limit = file.type.startsWith('video/') ? '50MB' : '10MB'
            toast.error(`File too large. Maximum size is ${limit}.`)
            return
        }

        setSelectedFile(file)
        setPreviewUrl(URL.createObjectURL(file))
    }

    const handleUpload = async () => {
        if (!selectedFile) return

        setIsUploading(true)
        setUploadProgress(0)

        try {
            const supabase = createClient()

            // Generate unique filename
            const fileExt = selectedFile.name.split('.').pop()
            const fileName = `${providerId}/${Date.now()}.${fileExt}`
            const filePath = `stories/${fileName}`

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('business-content')
                .upload(filePath, selectedFile, {
                    cacheControl: '3600',
                    upsert: false,
                })

            if (uploadError) throw uploadError

            setUploadProgress(70)

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('business-content')
                .getPublicUrl(filePath)

            setUploadProgress(90)

            // Create story record
            await createStory.mutateAsync({
                providerId,
                mediaUrl: publicUrl,
                mediaType: selectedFile.type.startsWith('video/') ? 'video' : 'image',
                caption: caption.trim() || undefined,
            })

            setUploadProgress(100)
            toast.success('Story published successfully! 🎉')

            setTimeout(() => {
                onSuccess?.()
                onClose()
            }, 500)
        } catch (error) {
            console.error('Upload error:', error)
            toast.error('Failed to publish story. Please try again.')
            setIsUploading(false)
            setUploadProgress(0)
        }
    }

    const mediaType = selectedFile?.type.startsWith('video/') ? 'video' : 'image'

    // Use portal to render modal outside parent hierarchy
    if (!mounted) return null

    const modalContent = (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onClose()
                }}
                onMouseMove={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                    onMouseMove={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseUp={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#FF5200] to-orange-600 p-6 relative">
                        <h2 className="text-2xl font-bold text-white">Create Story</h2>
                        <p className="text-white/90 text-sm mt-1">
                            Share updates with customers in your area
                        </p>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                        {/* Upload Area */}
                        {!selectedFile ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-[#FF5200] hover:bg-orange-50 transition-all group"
                            >
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-orange-100 group-hover:bg-orange-200 flex items-center justify-center transition-colors">
                                        <Upload className="w-8 h-8 text-[#FF5200]" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-gray-900">
                                            Upload Photo or Video
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Click to browse or drag and drop
                                        </p>
                                    </div>
                                    <div className="flex gap-4 text-sm text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <ImageIcon className="w-4 h-4" />
                                            <span>JPG, PNG (max 10MB)</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Video className="w-4 h-4" />
                                            <span>MP4, MOV (max 50MB)</span>
                                        </div>
                                    </div>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4,video/mov,video/quicktime"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Preview */}
                                <div className="relative aspect-[9/16] max-h-[500px] rounded-xl overflow-hidden bg-black">
                                    {mediaType === 'image' ? (
                                        <Image
                                            src={previewUrl}
                                            alt="Story preview"
                                            fill
                                            className="object-contain"
                                        />
                                    ) : (
                                        <video
                                            src={previewUrl}
                                            className="w-full h-full object-contain"
                                            controls
                                        />
                                    )}
                                </div>

                                {/* Change File Button */}
                                <button
                                    onClick={() => {
                                        setSelectedFile(null)
                                        setPreviewUrl('')
                                    }}
                                    className="text-sm text-[#FF5200] hover:text-orange-600 font-medium"
                                >
                                    Change file
                                </button>

                                {/* Caption Input */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Caption (Optional)
                                    </label>
                                    <textarea
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                        maxLength={200}
                                        rows={3}
                                        placeholder="Add a caption to your story..."
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF5200] focus:ring-4 focus:ring-orange-100 outline-none transition-all resize-none text-sm"
                                    />
                                    <p className="text-xs text-gray-400 mt-1 text-right">
                                        {caption.length}/200
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                        {isUploading ? (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Publishing your story...</span>
                                    <span className="text-[#FF5200] font-semibold">{uploadProgress}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-[#FF5200] to-orange-600"
                                        initial={{ width: '0%' }}
                                        animate={{ width: `${uploadProgress}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpload}
                                    disabled={!selectedFile || isUploading}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FF5200] to-orange-600 text-white rounded-xl font-semibold hover:from-[#E04800] hover:to-[#FF5200] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Publishing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-5 h-5" />
                                            <span>Publish Story</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )

    return createPortal(modalContent, document.body)
}
