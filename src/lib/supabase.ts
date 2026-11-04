import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

function isValidHttpUrl(string: string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

const isConfigured = isValidHttpUrl(rawUrl) && rawKey && rawKey !== 'your_supabase_anon_key';

if (!isConfigured) {
  console.warn('Supabase credentials missing or invalid in .env. Falling back to placeholder to prevent app crash.');
}

export const supabase = createClient(
  isConfigured ? rawUrl : 'https://placeholder.supabase.co', 
  isConfigured ? rawKey : 'placeholder'
);
