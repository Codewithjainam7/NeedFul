-- Create analytics_events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('view', 'phone_click', 'whatsapp_click', 'enquiry_click')),
    metadata JSONB DEFAULT '{}'::jsonb, -- Store extra info like city or device type if needed later
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for faster querying by provider and date
CREATE INDEX IF NOT EXISTS idx_analytics_provider_date ON public.analytics_events(provider_id, created_at);

-- RLS Policies
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert events (tracking public views/clicks)
CREATE POLICY "Enable insert for all users" ON public.analytics_events FOR INSERT WITH CHECK (true);

-- Allow provider owners to view their own events
CREATE POLICY "Enable select for business owners" ON public.analytics_events FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.providers
        WHERE public.providers.id = analytics_events.provider_id
        AND public.providers.user_id = auth.uid()
    )
);
