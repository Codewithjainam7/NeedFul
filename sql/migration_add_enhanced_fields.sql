-- Migration: Add Enhanced Business Fields to Providers Table
-- Run this in Supabase SQL Editor to add all new fields for the enhanced edit form
-- Date: 2026-01-22

-- Add new columns to providers table
ALTER TABLE providers 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS gst_number TEXT,
ADD COLUMN IF NOT EXISTS pricing TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS social_instagram TEXT,
ADD COLUMN IF NOT EXISTS social_facebook TEXT,
ADD COLUMN IF NOT EXISTS social_twitter TEXT;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_providers_email ON providers(email);
CREATE INDEX IF NOT EXISTS idx_providers_tags ON providers USING GIN(tags);

-- Add comments for documentation
COMMENT ON COLUMN providers.email IS 'Business email address for contact';
COMMENT ON COLUMN providers.gst_number IS 'GST registration number if applicable';
COMMENT ON COLUMN providers.pricing IS 'Pricing range or tier (e.g., ₹₹ or ₹500-2000)';
COMMENT ON COLUMN providers.tags IS 'Keywords and tags for search and discovery';
COMMENT ON COLUMN providers.social_instagram IS 'Instagram handle or profile URL';
COMMENT ON COLUMN providers.social_facebook IS 'Facebook page URL';
COMMENT ON COLUMN providers.social_twitter IS 'Twitter/X handle or profile URL';

SELECT 'Migration completed: Enhanced business fields added successfully!' as status;
