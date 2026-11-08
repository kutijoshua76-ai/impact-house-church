import { supabase } from './supabase';

const PRIMARY_PUSH_URL = '/api/broadcast-push';
const FALLBACK_EDGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-push-notification`;

export interface SendPushOptions {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  image?: string;
  icon?: string;
  test_endpoint?: string;
}

export interface SendPushResult {
  success: boolean;
  target_count?: number;
  success_count?: number;
  failure_count?: number;
  pruned_count?: number;
  error?: string;
}

/**
 * Broadcasts a real-time Web Push notification to all active devices.
 * Uses the integrated Vercel serverless /api/broadcast-push route,
 * with graceful fallback to Supabase Edge Function.
 */
export async function broadcastPushNotification(options: SendPushOptions): Promise<SendPushResult> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token || '';

  // 1. Primary: High-speed Vercel serverless API route
  try {
    const res = await fetch(PRIMARY_PUSH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
      },
      body: JSON.stringify(options),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        target_count: data.target_count,
        success_count: data.success_count,
        failure_count: data.failure_count,
        pruned_count: data.pruned_count,
      };
    }

    let errMessage = `Broadcast error (${res.status})`;
    try {
      const errText = await res.text();
      try {
        const errJson = JSON.parse(errText);
        if (errJson?.error) errMessage = errJson.error;
        else if (errText) errMessage = errText.slice(0, 120);
      } catch {
        if (errText) errMessage = errText.slice(0, 120);
      }
    } catch {
      // Ignore parse failure
    }

    if (res.status !== 404) {
      return {
        success: false,
        error: errMessage,
      };
    }
  } catch (primaryErr) {
    console.warn('[PushBroadcast] Primary /api/broadcast-push error, falling back:', primaryErr);
  }

  // 2. Fallback: Supabase Edge Function
  try {
    const response = await fetch(FALLBACK_EDGE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(options),
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP error ${response.status}`,
      };
    }

    return {
      success: true,
      target_count: data.target_count,
      success_count: data.success_count,
      failure_count: data.failure_count,
      pruned_count: data.pruned_count,
    };
  } catch (err: unknown) {
    console.error('[PushBroadcast] Failed to send push:', err);
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : 'Unable to reach push delivery service.',
    };
  }
}
