import { supabase } from './supabase';

const PUSH_FN = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-push-notification`;

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
 * Invokes the Supabase Edge Function to broadcast a push notification to PWA subscribers.
 */
export async function broadcastPushNotification(options: SendPushOptions): Promise<SendPushResult> {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return { success: false, error: 'You must be logged in as an administrator to send push notifications.' };
    }

    const response = await fetch(PUSH_FN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${session.access_token}`,
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
      error: err instanceof Error ? err.message : 'Network error sending notification.',
    };
  }
}

