// Supabase Edge Function: send-push-notification
// Sends real-time Web Push notifications to RCCG Impact House PWA subscribers

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import webpush from 'npm:web-push@^3.6.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  image?: string;
  icon?: string;
  badge?: string;
  test_endpoint?: string; // If set, sends only to this specific endpoint
}

serve(async (req) => {
  // 1. Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY') || 'BKLNXeDdATHKhe1ZPaqlONQqB1fwrsksz7sJIrQfKdmKA1AwNQZ2acmokKFU671KHI5Kq25oN-kMrePC9TspOWI';
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY') || 'LhkRuMR6G8D1eTFp5aM55MLmp7GPDzgoYagh7vwFBfA';
    const vapidSubject = Deno.env.get('VAPID_SUBJECT') || 'mailto:admin@rccgimpacthouse.org';

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase environment variables are missing');
    }

    // Configure Web Push VAPID credentials
    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

    // Create Supabase Admin client with service_role to access push_subscriptions
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify sender Authorization (Admin User JWT OR Supabase Service Role / Automated Cron)
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '').trim();

    const isServiceRole = Boolean(supabaseServiceKey && token === supabaseServiceKey);
    if (!isServiceRole) {
      if (!token) {
        return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user) {
        return new Response(JSON.stringify({ error: 'Unauthorized sender' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const body: PushPayload = await req.json();
    const {
      title,
      body: messageText,
      url = '/events',
      tag = `impact-${Date.now()}`,
      image,
      icon = '/pwa-192x192.png',
      badge = '/badge-72x72.png',
      test_endpoint,
    } = body;

    if (!title || !messageText) {
      return new Response(JSON.stringify({ error: 'Title and body are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch subscribers
    let query = supabase.from('push_subscriptions').select('id, endpoint, p256dh, auth');
    if (test_endpoint) {
      query = query.eq('endpoint', test_endpoint);
    }

    const { data: subscriptions, error: fetchError } = await query;
    if (fetchError) {
      throw new Error(`Failed to query subscriptions: ${fetchError.message}`);
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No active subscribers found',
          target_count: 0,
          success_count: 0,
          failure_count: 0,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const pushPayloadString = JSON.stringify({
      title,
      body: messageText,
      url,
      tag,
      image,
      icon,
      badge,
    });

    let successCount = 0;
    let failureCount = 0;
    const expiredEndpoints: string[] = [];

    // Send push to all targets concurrently
    await Promise.all(
      subscriptions.map(async (sub) => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        try {
          await webpush.sendNotification(pushSubscription, pushPayloadString, {
            TTL: 86400, // 24 hours time-to-live
          });
          successCount++;
        } catch (err: any) {
          failureCount++;
          // HTTP 404 or 410 indicates the push token expired or user revoked browser permission
          if (err.statusCode === 404 || err.statusCode === 410) {
            expiredEndpoints.push(sub.endpoint);
          } else {
            console.error(`Push dispatch failed for endpoint: ${sub.endpoint}`, err.message);
          }
        }
      })
    );

    // Auto-prune dead/expired tokens
    if (expiredEndpoints.length > 0) {
      await supabase.from('push_subscriptions').delete().in('endpoint', expiredEndpoints);
      console.log(`Pruned ${expiredEndpoints.length} expired subscription(s)`);
    }

    // Log the broadcast in push_notifications_log
    if (!test_endpoint) {
      await supabase.from('push_notifications_log').insert({
        title,
        body: messageText,
        url,
        tag,
        icon,
        badge,
        sent_by: user.id,
        target_count: subscriptions.length,
        success_count: successCount,
        failure_count: failureCount,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        target_count: subscriptions.length,
        success_count: successCount,
        failure_count: failureCount,
        pruned_count: expiredEndpoints.length,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Edge Function Error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

