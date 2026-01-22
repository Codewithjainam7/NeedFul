import { useState } from 'react'
import { Image as ImageIcon, Grid, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'

interface PhotoGalleryProps {
    images: { url: string }[]
}

export function PhotoGallery({ images = [] }: PhotoGalleryProps) {
    const [open, setOpen] = useState(false)

    if (!images.length) return null

    if (images.length === 1) {
        return (
            <>
                <div
                    className="relative rounded-xl overflow-hidden bg-gray-100 h-[300px] md:h-[400px] cursor-pointer group"
                    onClick={() => setOpen(true)}
                >
                    <img
                        src={images[0].url}
                        alt="Main View"
                        className="w-full h-full object-contain bg-gray-800 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    <Button
                        variant="secondary"
                        className="absolute right-4 bottom-4 bg-white/90 hover:bg-white text-gray-900 shadow-md font-semibold gap-2 z-10"
                    >
                        <Grid className="w-4 h-4" />
                        View Photo
                    </Button>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-w-4xl w-full h-[80vh] p-0 overflow-hidden bg-black/95 border-none">
                        <DialogTitle className="sr-only">Photo View</DialogTitle>
                        <div className="relative h-full flex flex-col">
                            <div className="flex items-center justify-end p-4 px-6 absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/60 to-transparent">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-white hover:bg-white/20 rounded-full"
                                    onClick={() => setOpen(false)}
                                >
                                    <X className="w-6 h-6" />
                                </Button>
                            </div>
                            <div className="flex-1 flex items-center justify-center p-4">
                                <img
                                    src={images[0].url}
                                    alt="Full View"
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </>
        )
    }

    return (
        <>
            <div className="relative rounded-xl overflow-hidden bg-gray-100 h-[300px] md:h-[400px]">
                {/* Main Image Grid */}
                <div className="grid grid-cols-4 grid-rows-2 gap-1 h-full">
                    {/* Hero Image - 2x2 */}
                    <div className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden" onClick={() => setOpen(true)}>
                        <img
                            src={images[0]?.url || 'https://via.placeholder.com/600'}
                            alt="Main View"
                            className="w-full h-full object-contain bg-gray-800 transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    </div>

                    {/* Secondary Images */}
                    <div className="col-span-1 row-span-1 relative group cursor-pointer overflow-hidden" onClick={() => setOpen(true)}>
                        <img
                            src={images[1]?.url || 'https://via.placeholder.com/300'}
                            alt="Interior View"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                    <div className="col-span-1 row-span-1 relative group cursor-pointer overflow-hidden rounded-tr-xl" onClick={() => setOpen(true)}>
                        <img
                            src={images[2]?.url || 'https://via.placeholder.com/300'}
                            alt="Ambiance"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                    <div className="col-span-1 row-span-1 relative group cursor-pointer overflow-hidden" onClick={() => setOpen(true)}>
                        <img
                            src={images[3]?.url || 'https://via.placeholder.com/300'}
                            alt="Food"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>

                    {/* Last Image with Overlay */}
                    <div className="col-span-1 row-span-1 relative group cursor-pointer overflow-hidden rounded-br-xl" onClick={() => setOpen(true)}>
                        <img
                            src={images[4]?.url || images[0]?.url || 'https://via.placeholder.com/300'}
                            alt="More"
                            className="w-full h-full object-cover filter blur-[2px] brightness-75 transition-all duration-500 group-hover:scale-105 group-hover:blur-[1px]"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/40 hover:bg-black/30 transition-colors">
                            <ImageIcon className="w-6 h-6 mb-1" />
                            <span className="font-bold text-lg">+{Math.max(0, images.length - 4)}</span>
                            <span className="text-xs font-medium">Photos</span>
                        </div>
                    </div>
                </div>

                <Button
                    variant="secondary"
                    className="absolute right-4 bottom-4 bg-white/90 hover:bg-white text-gray-900 shadow-md font-semibold gap-2 z-10"
                    onClick={() => setOpen(true)}
                >
                    <Grid className="w-4 h-4" />
                    View Gallery
                </Button>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-4xl w-full h-[80vh] p-0 overflow-hidden bg-black/95 border-none">
                    <DialogTitle className="sr-only">Photo Gallery</DialogTitle>
                    <div className="relative h-full flex flex-col">
                        <div className="flex items-center justify-between p-4 px-6 absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/60 to-transparent">
                            <div className="text-white font-medium">{images.length} Photos</div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20 rounded-full"
                                onClick={() => setOpen(false)}
                            >
                                <X className="w-6 h-6" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative rounded-lg overflow-hidden bg-gray-900 aspect-video group">
                                        <img
                                            src={img.url}
                                            alt={`Gallery ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                                {images.length === 0 && (
                                    <div className="col-span-2 text-gray-400 text-center py-20">No images available</div>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
