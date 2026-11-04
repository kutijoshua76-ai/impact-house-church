-- Migration: Web Push Subscriptions, Notification Logs, Sermons & Daily Bible Verses
-- Project: RCCG Impact House PWA

-- ==============================================================================
-- 1. PUSH NOTIFICATION SUBSCRIPTIONS TABLE
-- ==============================================================================
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

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON public.push_subscriptions(endpoint);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON public.push_subscriptions(user_id);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert into push_subscriptions"
    ON public.push_subscriptions
    FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Allow public update push_subscriptions"
    ON public.push_subscriptions
    FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow public delete push_subscriptions"
    ON public.push_subscriptions
    FOR DELETE
    TO public
    USING (true);

CREATE POLICY "Allow authenticated users to read push_subscriptions"
    ON public.push_subscriptions
    FOR SELECT
    TO authenticated
    USING (true);

-- ==============================================================================
-- 2. PUSH NOTIFICATIONS BROADCAST LOG TABLE
-- ==============================================================================
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

ALTER TABLE public.push_notifications_log ENABLE ROW LEVEL SECURITY;

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

-- ==============================================================================
-- 3. SERMONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.sermons (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    speaker TEXT NOT NULL DEFAULT 'Pastor Fervour',
    category TEXT NOT NULL DEFAULT 'Good News',
    series TEXT,
    scripture TEXT,
    duration TEXT,
    sermon_date DATE DEFAULT CURRENT_DATE,
    video_url TEXT,
    audio_url TEXT,
    thumbnail_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sermons_date ON public.sermons(sermon_date DESC);
CREATE INDEX IF NOT EXISTS idx_sermons_category ON public.sermons(category);

ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on sermons"
    ON public.sermons
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow authenticated insert on sermons"
    ON public.sermons
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update on sermons"
    ON public.sermons
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on sermons"
    ON public.sermons
    FOR DELETE
    TO authenticated
    USING (true);

-- ==============================================================================
-- 4. BIBLE VERSES TABLE (DAILY VERSES & SCRIPTURE REFLECTIONS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.bible_verses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference TEXT NOT NULL,
    book TEXT,
    chapter INTEGER,
    verse_number TEXT,
    verse TEXT NOT NULL,
    translation TEXT DEFAULT 'NKJV',
    category TEXT DEFAULT 'daily',
    theme TEXT,
    reflection TEXT,
    prayer TEXT,
    day_of_year INTEGER,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bible_verses_day ON public.bible_verses(day_of_year);
CREATE INDEX IF NOT EXISTS idx_bible_verses_category ON public.bible_verses(category);

ALTER TABLE public.bible_verses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on bible_verses"
    ON public.bible_verses
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow authenticated insert on bible_verses"
    ON public.bible_verses
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update on bible_verses"
    ON public.bible_verses
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on bible_verses"
    ON public.bible_verses
    FOR DELETE
    TO authenticated
    USING (true);

