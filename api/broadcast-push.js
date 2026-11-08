const webpush = require('web-push');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://pdxvybpwtxbbhnyfhjej.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkeHZ5YnB3dHhiYmhueWZoamVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NjQ5MzYsImV4cCI6MjA5MjU0MDkzNn0.u-dcL--wTorVZtObhtM-u7PdBDyzJHnyUiZdSshjNWs';

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || process.env.VITE_VAPID_PUBLIC_KEY || 'BKLNXeDdATHKhe1ZPaqlONQqB1fwrsksz7sJIrQfKdmKA1AwNQZ2acmokKFU671KHI5Kq25oN-kMrePC9TspOWI';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || 'LhkRuMR6G8D1eTFp5aM55MLmp7GPDzgoYagh7vwFBfA';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@rccgimpacthouse.org';

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, apikey'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      title,
      body,
      url = '/events',
      tag = `impact-${Date.now()}`,
      image,
      icon = '/pwa-192x192.png',
      badge = '/badge-72x72.png',
      test_endpoint,
    } = req.body || {};

    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required' });
    }

    // 1. Fetch active subscribers from Supabase
    let query = supabase.from('push_subscriptions').select('id, endpoint, p256dh, auth');
    if (test_endpoint) {
      query = query.eq('endpoint', test_endpoint);
    }

    const { data: subscriptions, error: fetchError } = await query;
    if (fetchError) {
      console.error('[Broadcast API] Error fetching subscriptions:', fetchError);
      return res.status(500).json({ error: `Failed to query subscribers: ${fetchError.message}` });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return res.status(200).json({
        success: true,
        target_count: 0,
        success_count: 0,
        failure_count: 0,
        message: 'No registered devices found',
      });
    }

    // 2. Prepare payload
    const notificationPayload = JSON.stringify({
      title,
      body,
      url,
      tag,
      image,
      icon,
      badge,
    });

    let successCount = 0;
    let failureCount = 0;
    const expiredEndpoints = [];

    // 3. Dispatch to all push services (Apple APNs, Google FCM, Mozilla)
    await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          };

          await webpush.sendNotification(pushSubscription, notificationPayload, {
            TTL: 86400, // 24 hours
            urgency: 'high',
          });
          successCount++;
        } catch (err) {
          failureCount++;
          console.warn('[Broadcast API] Delivery failed for endpoint:', sub.endpoint.slice(0, 40), err?.statusCode || err?.message);
          if (err && (err.statusCode === 410 || err.statusCode === 404)) {
            expiredEndpoints.push(sub.endpoint);
          }
        }
      })
    );

    // 4. Prune uninstalled/expired endpoints from database
    if (expiredEndpoints.length > 0) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .in('endpoint', expiredEndpoints);
    }

    // 5. Log to push_notifications_log
    try {
      await supabase.from('push_notifications_log').insert({
        title,
        body,
        url,
        icon,
        badge,
        tag,
        target_count: subscriptions.length,
        success_count: successCount,
        failure_count: failureCount,
      });
    } catch (logErr) {
      console.warn('[Broadcast API] Could not record push log:', logErr);
    }

    return res.status(200).json({
      success: true,
      target_count: subscriptions.length,
      success_count: successCount,
      failure_count: failureCount,
      pruned_count: expiredEndpoints.length,
    });
  } catch (err) {
    console.error('[Broadcast API] Global handler exception:', err);
    return res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Internal push service error',
    });
  }
};
