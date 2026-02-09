
-- Create a table to store daily horoscopes globally
CREATE TABLE IF NOT EXISTS public.daily_horoscopes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    sign TEXT NOT NULL,
    horoscope_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure we only have one entry per sign per date
    UNIQUE(date, sign)
);

-- Enable RLS (Read-only for everyone, Write for service role only)
ALTER TABLE public.daily_horoscopes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users"
ON public.daily_horoscopes FOR SELECT
USING (true);

-- Indexes for fast lookup
CREATE INDEX idx_daily_horoscopes_date_sign ON public.daily_horoscopes(date, sign);
