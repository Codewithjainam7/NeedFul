'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Edit2, Trash2, Search, Wrench, Car, Palette, Sparkles, Hammer, Calculator, Shirt, HardHat, Stethoscope, GraduationCap, Zap, Music, Gift, Scissors, UtensilsCrossed, Home, Briefcase, Camera, Heart, ShoppingBag, Plane, Dumbbell, Tv, Book, Coffee, Pizza, Flower2, Dog, Baby, Bike, Bus, Building, Landmark, Trees, Waves } from 'lucide-react'
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
                        <Button className="bg-[#FF5200] hover:bg-[#E04800] text-white rounded-xl shadow-lg shadow-orange-500/20">
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
                                        <Button variant="ghost" size="sm" className="flex-1 h-9 text-gray-500 hover:text-[#FF5200] hover:bg-orange-50 rounded-lg text-xs font-medium">
                                            <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                                            Edit
                                        </Button>
                                        <Button variant="ghost" size="sm" className="flex-1 h-9 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg text-xs font-medium">
                                            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
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
            </div>
        </AdminPageTransition>
    )
}
