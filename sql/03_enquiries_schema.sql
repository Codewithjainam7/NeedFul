-- Create enquiries table for customer enquiries to businesses
CREATE TABLE IF NOT EXISTS enquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_enquiries_provider_id ON enquiries(provider_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at DESC);

-- Enable RLS
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Policy: Business owners can view their own enquiries
CREATE POLICY "Business owners can view their enquiries"
    ON enquiries FOR SELECT
    USING (
        provider_id IN (
            SELECT id FROM providers WHERE user_id = auth.uid()
        )
    );

-- Policy: Anyone can create enquiries (even anonymous users)
CREATE POLICY "Anyone can create enquiries"
    ON enquiries FOR INSERT
    WITH CHECK (true);

-- Policy: Business owners can update their enquiries (mark as contacted/closed)
CREATE POLICY "Business owners can update their enquiries"
    ON enquiries FOR UPDATE
    USING (
        provider_id IN (
            SELECT id FROM providers WHERE user_id = auth.uid()
        )
    );

-- Add comment
COMMENT ON TABLE enquiries IS 'Customer enquiries to service providers';

SELECT 'Enquiries table created successfully!' as status;
