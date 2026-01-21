'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit2, Trash2, Search, Wrench, Car, Palette, Sparkles, Hammer, Calculator, Shirt, HardHat, Stethoscope, GraduationCap, Zap, Music, Gift, Scissors, UtensilsCrossed, Home, Briefcase, Camera, Heart, ShoppingBag, Plane, Dumbbell, Tv, Book, Coffee, Pizza, Flower2, Dog, Baby, Bike, Bus, Building, Landmark, Trees, Waves, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { AdminPageTransition } from '@/components/admin/AdminPageTransition'

interface Category {
    id: string
    name: string
    slug: string
    icon: string
    description: string
}

// Map icon names to Lucide components
const iconMap: { [key: string]: any } = {
    'Armchair': Home,
    'Car': Car,
    'Palette': Palette,
    'Sparkles': Sparkles,
    'Hammer': Hammer,
    'Calculator': Calculator,
    'Shirt': Shirt,
    'HardHat': HardHat,
    'Stethoscope': Stethoscope,
    'GraduationCap': GraduationCap,
    'Zap': Zap,
    'Music': Music,
    'Gift': Gift,
    'Scissors': Scissors,
    'UtensilsCrossed': UtensilsCrossed,
    'Home': Home,
    'Briefcase': Briefcase,
    'Camera': Camera,
    'Heart': Heart,
    'ShoppingBag': ShoppingBag,
    'Plane': Plane,
    'Dumbbell': Dumbbell,
    'Tv': Tv,
    'Book': Book,
    'Coffee': Coffee,
    'Pizza': Pizza,
    'Flower2': Flower2,
    'Dog': Dog,
    'Baby': Baby,
    'Bike': Bike,
    'Bus': Bus,
    'Building': Building,
    'Landmark': Landmark,
    'Trees': Trees,
    'Waves': Waves,
    'Wrench': Wrench,
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({ name: '', slug: '', icon: '', description: '' })
    const supabase = createClient()

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        setLoading(true)
        const { data, error } = await (supabase as any)
            .from('categories')
            .select('*')
            .order('name')

        if (error) {
            toast.error('Failed to load categories')
        } else {
            setCategories(data || [])
        }
        setLoading(false)
    }

    const filteredCategories = categories.filter(c =>
        c.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getIcon = (iconName: string) => {
        const IconComponent = iconMap[iconName] || Wrench
        return <IconComponent className="w-6 h-6 text-[#FF5200]" />
    }

    const handleEdit = (category: Category) => {
        setEditingCategory(category)
        setFormData({
            name: category.name,
            slug: category.slug,
            icon: category.icon || '',
            description: category.description || ''
        })
        setIsEditOpen(true)
    }

    const handleSaveEdit = async () => {
        if (!editingCategory) return
        setIsSaving(true)

        const { error } = await (supabase as any)
            .from('categories')
            .update({
                name: formData.name,
                slug: formData.slug,
                icon: formData.icon,
                description: formData.description
            })
            .eq('id', editingCategory.id)

        if (error) {
            toast.error('Failed to update category')
        } else {
            toast.success('Category updated successfully!')
            setIsEditOpen(false)
            setEditingCategory(null)
            fetchCategories()
        }
        setIsSaving(false)
    }

    const handleAdd = async () => {
        if (!formData.name || !formData.slug) {
            toast.error('Name and slug are required')
            return
        }
        setIsSaving(true)

        const { error } = await (supabase as any)
            .from('categories')
            .insert({
                name: formData.name,
                slug: formData.slug,
                icon: formData.icon || 'Wrench',
                description: formData.description
            })

        if (error) {
            toast.error('Failed to add category')
        } else {
            toast.success('Category added successfully!')
            setIsAddOpen(false)
            setFormData({ name: '', slug: '', icon: '', description: '' })
            fetchCategories()
        }
        setIsSaving(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return
        setIsDeleting(id)

        const { error } = await (supabase as any)
            .from('categories')
            .delete()
            .eq('id', id)

        if (error) {
            toast.error('Failed to delete category')
        } else {
            toast.success('Category deleted successfully!')
            fetchCategories()
        }
        setIsDeleting(null)
    }

    const openAddModal = () => {
        setFormData({ name: '', slug: '', icon: '', description: '' })
        setIsAddOpen(true)
    }

    return (
        <AdminPageTransition>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Categories</h1>
                        <p className="text-muted-foreground mt-1">Manage business categories on the platform.</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative w-full md:w-60">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 border-gray-200 focus:border-[#FF5200] focus:ring-[#FF5200]/30 rounded-xl bg-white"
                            />
                        </div>
                        <Button onClick={openAddModal} className="bg-[#FF5200] hover:bg-[#E04800] text-white rounded-xl shadow-lg shadow-orange-500/20">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Category
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {loading ? (
                        <div className="col-span-full text-center py-12 text-gray-500">Loading categories...</div>
                    ) : filteredCategories.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-gray-500">No categories found.</div>
                    ) : (
                        filteredCategories.map((category) => (
                            <Card key={category.id} className="border border-gray-100 bg-white hover:shadow-xl hover:border-orange-200 transition-all duration-300 group rounded-2xl overflow-hidden">
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                {getIcon(category.icon)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 group-hover:text-[#FF5200] transition-colors">{category.name}</h3>
                                                <p className="text-xs text-gray-400 font-medium">{category.slug}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 mt-4 pt-3 border-t border-gray-100">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(category)}
                                            className="flex-1 h-9 text-gray-500 hover:text-[#FF5200] hover:bg-orange-50 rounded-lg text-xs font-medium"
                                        >
                                            <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(category.id)}
                                            disabled={isDeleting === category.id}
                                            className="flex-1 h-9 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg text-xs font-medium"
                                        >
                                            {isDeleting === category.id ? (
                                                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                            )}
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                <div className="text-center text-sm text-gray-500">
                    {filteredCategories.length} categories total
                </div>

                {/* Edit Modal */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="sm:max-w-[480px] bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl p-0 overflow-hidden">
                        <DialogHeader className="p-6 bg-gradient-to-r from-[#FF5200] to-orange-400">
                            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                                <Edit2 className="w-5 h-5 text-white/80" />
                                Edit Category
                            </DialogTitle>
                            <p className="text-white/80 text-sm mt-1">Make changes to the category details below.</p>
                        </DialogHeader>
                        <div className="space-y-5 p-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-gray-700 font-medium ml-1">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="rounded-xl border-gray-200 focus:border-[#FF5200] focus:ring-[#FF5200]/20 h-11 bg-gray-50/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug" className="text-gray-700 font-medium ml-1">Slug</Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="rounded-xl border-gray-200 focus:border-[#FF5200] focus:ring-[#FF5200]/20 h-11 bg-gray-50/50"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="icon" className="text-gray-700 font-medium ml-1">Icon Name</Label>
                                    <Input
                                        id="icon"
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        placeholder="e.g., Car"
                                        className="rounded-xl border-gray-200 focus:border-[#FF5200] focus:ring-[#FF5200]/20 h-11 bg-gray-50/50"
                                    />
                                </div>
                                <div className="flex items-end pb-1">
                                    {formData.icon && iconMap[formData.icon] && (
                                        <div className="flex items-center gap-3 bg-orange-50 px-4 py-2 rounded-xl border border-orange-100 w-full h-11">
                                            {getIcon(formData.icon)}
                                            <span className="text-sm font-medium text-gray-600">Preview</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-gray-700 font-medium ml-1">Description</Label>
                                <Input
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="rounded-xl border-gray-200 focus:border-[#FF5200] focus:ring-[#FF5200]/20 h-11 bg-gray-50/50"
                                />
                            </div>
                        </div>
                        <DialogFooter className="p-6 pt-0 gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setIsEditOpen(false)}
                                className="rounded-xl h-11 border-gray-200 hover:bg-gray-50 hover:text-gray-900 font-medium flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSaveEdit}
                                disabled={isSaving}
                                className="bg-gradient-to-r from-[#FF5200] to-orange-500 hover:from-orange-600 hover:to-[#FF5200] text-white rounded-xl h-11 shadow-lg shadow-orange-500/20 font-medium flex-1"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Add Modal */}
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogContent className="sm:max-w-[480px] bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl p-0 overflow-hidden">
                        <DialogHeader className="p-6 bg-gradient-to-r from-[#FF5200] to-orange-400">
                            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                                <Plus className="w-6 h-6 text-white/80" />
                                Add New Category
                            </DialogTitle>
                            <p className="text-white/80 text-sm mt-1">Create a new business category.</p>
                        </DialogHeader>
                        <div className="space-y-5 p-6">
                            <div className="space-y-2">
                                <Label htmlFor="add-name" className="text-gray-700 font-medium ml-1">Name *</Label>
                                <Input
                                    id="add-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Plumbing"
                                    className="rounded-xl border-gray-200 focus:border-[#FF5200] focus:ring-[#FF5200]/20 h-11 bg-gray-50/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="add-slug" className="text-gray-700 font-medium ml-1">Slug *</Label>
                                <Input
                                    id="add-slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="e.g., plumbing"
                                    className="rounded-xl border-gray-200 focus:border-[#FF5200] focus:ring-[#FF5200]/20 h-11 bg-gray-50/50"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="add-icon" className="text-gray-700 font-medium ml-1">Icon Name</Label>
                                    <Input
                                        id="add-icon"
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        placeholder="e.g., Wrench"
                                        className="rounded-xl border-gray-200 focus:border-[#FF5200] focus:ring-[#FF5200]/20 h-11 bg-gray-50/50"
                                    />
                                </div>
                                <div className="flex items-end pb-1">
                                    {formData.icon && iconMap[formData.icon] && (
                                        <div className="flex items-center gap-3 bg-orange-50 px-4 py-2 rounded-xl border border-orange-100 w-full h-11">
                                            {getIcon(formData.icon)}
                                            <span className="text-sm font-medium text-gray-600">Preview</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="add-description" className="text-gray-700 font-medium ml-1">Description</Label>
                                <Input
                                    id="add-description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="rounded-xl border-gray-200 focus:border-[#FF5200] focus:ring-[#FF5200]/20 h-11 bg-gray-50/50"
                                />
                            </div>
                        </div>
                        <DialogFooter className="p-6 pt-0 gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setIsAddOpen(false)}
                                className="rounded-xl h-11 border-gray-200 hover:bg-gray-50 hover:text-gray-900 font-medium flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAdd}
                                disabled={isSaving}
                                className="bg-gradient-to-r from-[#FF5200] to-orange-500 hover:from-orange-600 hover:to-[#FF5200] text-white rounded-xl h-11 shadow-lg shadow-orange-500/20 font-medium flex-1"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Add Category
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminPageTransition>
    )
}
