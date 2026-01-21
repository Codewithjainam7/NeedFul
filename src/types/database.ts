export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    name: string | null
                    email: string
                    phone: string | null
                    city: string | null
                    role: 'customer' | 'provider' | 'admin'
                    created_at: string
                }
                Insert: {
                    id: string
                    name?: string | null
                    email: string
                    phone?: string | null
                    city?: string | null
                    role?: 'customer' | 'provider' | 'admin'
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string | null
                    email?: string
                    phone?: string | null
                    city?: string | null
                    role?: 'customer' | 'provider' | 'admin'
                    created_at?: string
                }
            }
            categories: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    icon: string
                    display_order: number
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    icon: string
                    display_order?: number
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    icon?: string
                    display_order?: number
                }
            }
            providers: {
                Row: {
                    id: string
                    user_id: string
                    business_name: string
                    slug: string
                    description: string | null
                    address: string | null
                    city: string
                    phone: string | null
                    whatsapp: string | null
                    email: string | null
                    category_id: string | null
                    is_verified: boolean
                    is_responsive: boolean
                    is_available: boolean
                    operating_hours: string | null
                    rating: number
                    review_count: number
                    views: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    business_name: string
                    slug: string
                    description?: string | null
                    address?: string | null
                    city: string
                    phone?: string | null
                    whatsapp?: string | null
                    email?: string | null
                    category_id?: string | null
                    is_verified?: boolean
                    is_responsive?: boolean
                    is_available?: boolean
                    operating_hours?: string | null
                    rating?: number
                    review_count?: number
                    views?: number
                    latitude?: number
                    longitude?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    business_name?: string
                    slug?: string
                    description?: string | null
                    address?: string | null
                    city?: string
                    phone?: string | null
                    whatsapp?: string | null
                    email?: string | null
                    category_id?: string
                    is_verified?: boolean
                    is_responsive?: boolean
                    is_available?: boolean
                    operating_hours?: string | null
                    rating?: number
                    review_count?: number
                    views?: number
                    latitude?: number
                    longitude?: number
                    created_at?: string
                }
            }
            services: {
                Row: {
                    id: string
                    provider_id: string
                    title: string
                    description: string | null
                    price: number | null
                    price_unit: string | null
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    provider_id: string
                    title: string
                    description?: string | null
                    price?: number | null
                    price_unit?: string | null
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    provider_id?: string
                    title?: string
                    description?: string | null
                    price?: number | null
                    price_unit?: string | null
                    is_active?: boolean
                    created_at?: string
                }
            }
            provider_images: {
                Row: {
                    id: string
                    provider_id: string
                    url: string
                    display_order: number
                    is_primary: boolean
                }
                Insert: {
                    id?: string
                    provider_id: string
                    url: string
                    display_order?: number
                    is_primary?: boolean
                }
                Update: {
                    id?: string
                    provider_id?: string
                    url?: string
                    display_order?: number
                    is_primary?: boolean
                }
            }
            reviews: {
                Row: {
                    id: string
                    provider_id: string
                    user_id: string
                    rating: number
                    comment: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    provider_id: string
                    user_id: string
                    rating: number
                    comment?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    provider_id?: string
                    user_id?: string
                    rating?: number
                    comment?: string | null
                    created_at?: string
                }
            }
            favorites: {
                Row: {
                    id: string
                    user_id: string
                    provider_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    provider_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    provider_id?: string
                    created_at?: string
                }
            }
            enquiries: {
                Row: {
                    id: string
                    provider_id: string
                    customer_name: string
                    customer_phone: string
                    customer_email: string | null
                    message: string
                    status: 'new' | 'contacted' | 'closed'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    provider_id: string
                    customer_name: string
                    customer_phone: string
                    customer_email?: string | null
                    message: string
                    status?: 'new' | 'contacted' | 'closed'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    provider_id?: string
                    customer_name?: string
                    customer_phone?: string
                    customer_email?: string | null
                    message?: string
                    status?: 'new' | 'contacted' | 'closed'
                    created_at?: string
                    updated_at?: string
                }
            }
            analytics_events: {
                Row: {
                    id: string
                    provider_id: string
                    event_type: string
                    metadata: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    provider_id: string
                    event_type: string
                    metadata?: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    provider_id?: string
                    event_type?: string
                    metadata?: Json
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            user_role: 'customer' | 'provider' | 'admin'
        }
    }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Convenience types
export type User = Tables<'users'>
export type Category = Tables<'categories'>
export type Provider = Tables<'providers'>
export type Service = Tables<'services'>
export type ProviderImage = Tables<'provider_images'>
export type Review = Tables<'reviews'>
export type Favorite = Tables<'favorites'>

// Extended types with relations
export type ProviderWithCategory = Provider & {
    categories: Category
}

export type ProviderWithDetails = Provider & {
    categories: Category
    services: Service[]
    provider_images: ProviderImage[]
}
