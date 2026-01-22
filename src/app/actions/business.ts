'use server'

import { createClient } from "@/lib/supabase/server";
import { createBusinessSchema } from "@/lib/business-schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createBusiness(prevState: any, formData: any) {
    const supabase = await createClient();

    // 1. Check Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { error: "You must be logged in to list a business." };
    }

    // 2. Parse & Validate Data
    const rawData = formData;

    const validation = createBusinessSchema.safeParse(rawData);

    if (!validation.success) {
        return {
            error: "Validation failed",
            details: validation.error.flatten().fieldErrors
        };
    }

    const {
        business_name, description, city, area, address, pincode,
        phone, email, website,
        category_id,
        details, // JSONB
        images // Array of URLs
    } = validation.data;

    // 3. Generate Slug
    const slug = business_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
        + '-' + Math.random().toString(36).substring(2, 7);

    // 4. Insert into Provider
    const { data: provider, error: insertError } = await supabase
        .from('providers')
        .insert({
            user_id: user.id,
            business_name,
            slug,
            description,
            city,
            area,
            address,
            phone,
            email,
            website,
            category_id,
            details,
            is_verified: false,
            rating: 0,
            review_count: 0
        } as any)
        .select()
        .single();

    if (insertError) {
        console.error("DB Insert Error:", insertError);
        return { error: "Failed to create business listing. " + insertError.message };
    }

    // Cast provider to any to avoid type issues with ungenerated Supabase types
    const providerData = provider as any;

    // 5. Insert Images (if any)
    if (images && images.length > 0) {
        const imageInserts = images.map((url: string, index: number) => ({
            provider_id: providerData.id,
            url: url,
            is_primary: index === 0,
            display_order: index
        }));

        const { error: imgError } = await supabase
            .from('provider_images')
            .insert(imageInserts as any);

        if (imgError) {
            console.error("Image Insert Error:", imgError);
        }
    }

    revalidatePath('/search');
    return { success: true, slug: providerData.slug };
}

export async function deleteBusiness(businessId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const { data: provider, error } = await supabase
        .from('providers')
        .select('user_id')
        .eq('id', businessId)
        .single();

    if (error || !provider) {
        return { error: "Business not found" };
    }

    // TYPE FIX: Explicitly cast provider to handle 'never' inference
    const record = provider as { user_id: string };

    if (record.user_id !== user.id) {
        return { error: "You do not have permission to delete this business" };
    }

    const { error: deleteError } = await supabase
        .from('providers')
        .delete()
        .eq('id', businessId);

    if (deleteError) {
        return { error: "Failed to delete business" };
    }

    revalidatePath('/', 'layout'); // Revalidate everything to be safe
    return { success: true };
}
