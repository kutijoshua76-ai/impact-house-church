-- Migration: Web Push Subscriptions & Push Notifications Log
-- Enables real-time PWA push notifications for RCCG Impact House

-- 1. Create table for client push subscriptions
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    endpoint TEXT NOT NULL UNIQUE,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for speedy lookups
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON public.push_subscriptions(endpoint);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON public.push_subscriptions(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous visitors and logged in members to insert their push subscriptions
CREATE POLICY "Allow public insert into push_subscriptions"
    ON public.push_subscriptions
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Allow subscribers to update their existing subscription (by endpoint)
CREATE POLICY "Allow public update push_subscriptions"
    ON public.push_subscriptions
    FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);

-- Allow public select so PostgREST upsert (return=representation) succeeds for anonymous subscribers
CREATE POLICY "Allow public select push_subscriptions"
    ON public.push_subscriptions
    FOR SELECT
    TO public
    USING (true);

-- Allow subscribers to delete/unsubscribe by endpoint
CREATE POLICY "Allow public delete push_subscriptions"
    ON public.push_subscriptions
    FOR DELETE
    TO public
    USING (true);

-- 2. Create table for Push Notifications Broadcast Log
CREATE TABLE IF NOT EXISTS public.push_notifications_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    url TEXT DEFAULT '/events',
    icon TEXT DEFAULT '/pwa-192x192.png',
    badge TEXT DEFAULT '/badge-72x72.png',
    tag TEXT DEFAULT 'impact-announcement',
    sent_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    sent_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    target_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    failure_count INTEGER DEFAULT 0
);

-- Enable RLS on notification logs
ALTER TABLE public.push_notifications_log ENABLE ROW LEVEL SECURITY;

-- Allow authenticated admins to read and insert push logs
CREATE POLICY "Allow authenticated read on push_notifications_log"
    ON public.push_notifications_log
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert on push_notifications_log"
    ON public.push_notifications_log
    FOR INSERT
    TO authenticated
    WITH CHECK (true);
