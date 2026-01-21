-- DEMO DATA SCRIPT
-- Run this in Supabase SQL Editor to populate your dashboard

-- 1. Ensure Categories Exist
INSERT INTO categories (id, name, slug, icon, display_order)
VALUES 
    ('cat-1', 'Plumbers', 'plumbers', 'Wrench', 1),
    ('cat-2', 'Electricians', 'electricians', 'Zap', 2),
    ('cat-3', 'Carpenters', 'carpenters', 'Hammer', 3),
    ('cat-4', 'Painters', 'painters', 'Paintbrush', 4),
    ('cat-5', 'Cleaners', 'cleaners', 'SprayCan', 5)
ON CONFLICT (id) DO NOTHING;

-- 2. Get Admin User ID (assuming admin@needful.com exists)
DO $$
DECLARE
    admin_uid uuid;
BEGIN
    SELECT id INTO admin_uid FROM auth.users WHERE email = 'admin@needful.com';

    -- If admin exists, insert demo providers
    IF admin_uid IS NOT NULL THEN
        
        -- Business 1: Pending Approval
        INSERT INTO providers (
            user_id, business_name, slug, description, city, category_id, 
            is_verified, is_responsive, rating, review_count, status, created_at
        ) VALUES (
            admin_uid, 
            'Mumbai Modern Plumbers', 
            'mumbai-modern-plumbers', 
            'Expert plumbing services for residential and commercial needs.', 
            'Mumbai', 
            'cat-1', 
            true, true, 4.8, 120, 
            'pending', -- Pending status for testing
            NOW()
        );

        -- Business 2: Already Approved
        INSERT INTO providers (
            user_id, business_name, slug, description, city, category_id, 
            is_verified, is_responsive, rating, review_count, status, created_at
        ) VALUES (
            admin_uid, 
            'Volts & Amps Electric', 
            'volts-amps-electric', 
            '24/7 Emergency electrical repairs and installation.', 
            'Mumbai', 
            'cat-2', 
            true, false, 4.5, 85, 
            'approved', 
            NOW() - INTERVAL '2 days'
        );

        -- Business 3: Rejected
        INSERT INTO providers (
            user_id, business_name, slug, description, city, category_id, 
            is_verified, is_responsive, rating, review_count, status, created_at
        ) VALUES (
            admin_uid, 
            'Shady Carpentry Co.', 
            'shady-carpentry', 
            'Cheap wood works.', 
            'Mumbai', 
            'cat-3', 
            false, false, 2.1, 5, 
            'rejected', 
            NOW() - INTERVAL '5 days'
        );

    ELSE
        RAISE NOTICE 'Admin user (admin@needful.com) not found. Please create the user first.';
    END IF;
END $$;
