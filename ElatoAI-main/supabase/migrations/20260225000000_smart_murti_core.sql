-- 1. Modify public.users table (or user_info JSONB if your schema prefers it)
-- Since the existing `users` table has columns `user_id`, `email`, etc., we will add these core columns.
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS whatsapp_number text UNIQUE,
ADD COLUMN IF NOT EXISTS date_of_birth date,
ADD COLUMN IF NOT EXISTS zodiac_sign text,
ADD COLUMN IF NOT EXISTS wallet_balance numeric DEFAULT 0;

-- 2. Create the Wallet Transactions table
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    transaction_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    type text NOT NULL CHECK (type IN ('credit', 'debit')),
    amount numeric NOT NULL CHECK (amount > 0),
    service_name text NOT NULL,
    status text NOT NULL DEFAULT 'completed',
    created_at timestamptz DEFAULT now()
);

-- RLS for Wallet Transactions
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" 
    ON public.wallet_transactions 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON public.wallet_transactions(user_id);

-- 3. Create the Service Catalog Table
CREATE TABLE IF NOT EXISTS public.service_catalog (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL UNIQUE,
    type text NOT NULL CHECK (type IN ('fixed', 'metered')),
    price numeric NOT NULL,
    description text,
    created_at timestamptz DEFAULT now()
);

-- RLS for Service Catalog
ALTER TABLE public.service_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service catalog is accessible to all users" 
    ON public.service_catalog 
    FOR SELECT 
    USING (true);

-- Insert Default Services
INSERT INTO public.service_catalog (name, type, price, description)
VALUES 
    ('Pooja', 'fixed', 101, 'Fixed price for regular Puja'),
    ('Face Reading', 'fixed', 51, 'Fixed price for AI Face Reading'),
    ('Hawan', 'fixed', 501, 'Fixed price for comprehensive Hawan'),
    ('AI Chat', 'metered', 5, 'Price per minute for AI Chat'),
    ('AI Call', 'metered', 9, 'Price per minute for AI Voice Calling')
ON CONFLICT (name) DO UPDATE 
SET price = EXCLUDED.price, type = EXCLUDED.type;

-- 4. Trigger for 100 Rs Welcome Bonus
-- We need to replace the old trigger from `20251216000000_enable_user_sync_trigger.sql` 
-- or create a new trigger on public.users. Since the previous trigger inserts into public.users,
-- let's attach a trigger to `public.users` after insert.

CREATE OR REPLACE FUNCTION public.handle_user_welcome_bonus()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    -- Credit 100rs default to the wallet balance
    UPDATE public.users 
    SET wallet_balance = 100
    WHERE user_id = NEW.user_id;

    -- Log the transaction
    INSERT INTO public.wallet_transactions (user_id, type, amount, service_name, status)
    VALUES (NEW.user_id, 'credit', 100, 'Welcome Bonus', 'completed');

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_public_user_created ON public.users;
CREATE TRIGGER on_public_user_created
AFTER INSERT ON public.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_user_welcome_bonus();
