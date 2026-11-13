import * as webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://pdxvybpwtxbbhnyfhjej.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || process.env.VITE_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@rccgimpacthouse.org';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  try {
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  } catch (err) {
    console.warn('[Broadcast API] Failed to initialize VAPID details:', err?.message);
  }
}
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const CURATED_DAILY_VERSES = [
  { reference: 'Philippians 4:13', text: 'I can do all things through Christ who strengthens me.' },
  { reference: 'Jeremiah 29:11', text: 'For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, to give you a future and a hope.' },
  { reference: 'Isaiah 40:31', text: 'Those who wait on the LORD shall renew their strength; they shall mount up with wings like eagles, they shall run and not be weary, they shall walk and not faint.' },
  { reference: 'Proverbs 3:5-6', text: 'Trust in the LORD with all your heart and lean not on your own understanding; in all your ways acknowledge Him, and He shall direct your paths.' },
  { reference: 'Psalm 23:1-3', text: 'The LORD is my shepherd; I shall not want. He makes me to lie down in green pastures; He leads me beside the still waters. He restores my soul.' },
  { reference: 'Romans 8:28', text: 'And we know that in all things God works for the good of those who love Him, who have been called according to His purpose.' },
  { reference: 'Joshua 1:9', text: 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.' },
  { reference: 'Psalm 46:1-2', text: 'God is our refuge and strength, a very present help in trouble. Therefore we will not fear, even though the earth be removed.' },
  { reference: '2 Timothy 1:7', text: 'For God has not given us a spirit of fear, but of power and of love and of a sound mind.' },
  { reference: 'Matthew 6:33', text: 'Seek first the kingdom of God and His righteousness, and all these things shall be added to you.' },
  { reference: 'Psalm 91:1-2', text: 'He who dwells in the secret place of the Most High shall abide under the shadow of the Almighty. I will say of the LORD, He is my refuge and my fortress; my God, in Him I will trust.' },
  { reference: 'Philippians 4:6-7', text: 'Be anxious for nothing, but in everything by prayer and supplication, with thanksgiving, let your requests be made known to God; and the peace of God, which surpasses all understanding, will guard your hearts.' },
  { reference: 'Psalm 119:105', text: 'Your word is a lamp to my feet and a light to my path.' },
  { reference: 'Hebrews 11:1', text: 'Now faith is the substance of things hoped for, the evidence of things not seen.' },
  { reference: '1 Peter 5:7', text: 'Casting all your care upon Him, for He cares for you.' },
  { reference: 'Psalm 121:1-2', text: 'I will lift up my eyes to the hills—from whence comes my help? My help comes from the LORD, who made heaven and earth.' },
  { reference: 'Zephaniah 3:17', text: 'The LORD your God in your midst, the Mighty One, will save; He will rejoice over you with gladness, He will quiet you with His love, He will rejoice over you with singing.' },
  { reference: 'Romans 12:2', text: 'Do not conform to the pattern of this world, but be transformed by the renewing of your mind.' },
  { reference: 'Psalm 103:1-3', text: 'Bless the LORD, O my soul, and forget not all His benefits: who forgives all your iniquities, who heals all your diseases.' },
  { reference: 'Ephesians 3:20', text: 'Now to Him who is able to do exceedingly abundantly above all that we ask or think, according to the power that works in us.' },
  { reference: 'Colossians 3:23', text: 'And whatever you do, do it heartily, as to the Lord and not to men.' },
  { reference: '1 Thessalonians 5:16-18', text: 'Rejoice always, pray without ceasing, in everything give thanks; for this is the will of God in Christ Jesus for you.' },
  { reference: 'James 1:5', text: 'If any of you lacks wisdom, let him ask of God, who gives to all liberally and without reproach, and it will be given to him.' },
  { reference: 'Psalm 34:8', text: 'Oh, taste and see that the LORD is good; blessed is the man who trusts in Him!' },
  { reference: 'Galatians 5:22-23', text: 'The fruit of the Spirit is love, joy, peace, longsuffering, kindness, goodness, faithfulness, gentleness, self-control.' },
  { reference: 'John 14:27', text: 'Peace I leave with you, My peace I give to you; not as the world gives do I give to you. Let not your heart be troubled, neither let it be afraid.' },
  { reference: 'Psalm 27:1', text: 'The LORD is my light and my salvation; whom shall I fear? The LORD is the strength of my life; of whom shall I be afraid?' },
  { reference: 'Micah 6:8', text: 'He has shown you, O man, what is good; and what does the LORD require of you but to do justly, to love mercy, and to walk humbly with your God?' },
  { reference: 'Deuteronomy 31:8', text: 'And the LORD, He is the One who goes before you. He will be with you, He will not leave you nor forsake you; do not fear nor be dismayed.' },
  { reference: 'Psalm 118:24', text: 'This is the day the LORD has made; we will rejoice and be glad in it.' },
];

function getTodayDateKey() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

async function getDailyScriptureForToday() {
  const dayOfYear = getDayOfYear();
  try {
    const { data } = await supabase
      .from('bible_verses')
      .select('reference, verse, text')
      .limit(365);

    if (data && data.length > 0) {
      const idx = (dayOfYear - 1) % data.length;
      const row = data[idx] || data[0];
      return {
        reference: row.reference,
        text: row.verse || row.text,
      };
    }
  } catch (err) {
    console.warn('[Daily Scripture] Database lookup fallback:', err?.message);
  }

  const fallbackIdx = (dayOfYear - 1) % CURATED_DAILY_VERSES.length;
  return CURATED_DAILY_VERSES[fallbackIdx];
}

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, apikey'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.error('[Broadcast API] Missing VAPID credentials in environment variables.');
    return res.status(500).json({
      success: false,
      error: 'VAPID credentials not configured. Please set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY in hosting environment variables.',
    });
  }

  try {
    let title = '';
    let messageText = '';
    let url = '/events';
    let tag = `impact-${Date.now()}`;
    let image;
    let icon = '/pwa-192x192.png';
    let badge = '/badge-72x72.png';
    let test_endpoint;
    let isDailyCron = false;

    // A) GET request = 7:00 AM Daily Scripture Automated Broadcast (Vercel Cron or Healthcheck)
    if (req.method === 'GET') {
      isDailyCron = true;
      const todayVerse = await getDailyScriptureForToday();
      const todayKey = getTodayDateKey();
      const truncated = todayVerse.text.length > 120 ? `${todayVerse.text.slice(0, 117)}...` : todayVerse.text;

      title = `📖 Daily Scripture: ${todayVerse.reference}`;
      messageText = `"${truncated}" — Tap to read today's word and prayer.`;
      url = '/daily-verse';
      tag = `impact-verse-${todayKey}`;
    } else if (req.method === 'POST') {
      // B) POST request = Manual / Admin broadcast
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {
          body = {};
        }
      }

      title = body?.title;
      messageText = body?.body;
      url = body?.url || '/events';
      tag = body?.tag || `impact-${Date.now()}`;
      image = body?.image;
      icon = body?.icon || '/pwa-192x192.png';
      badge = body?.badge || '/badge-72x72.png';
      test_endpoint = body?.test_endpoint;

      if (!title || !messageText) {
        return res.status(400).json({ error: 'Title and body are required' });
      }
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
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
      body: messageText,
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
            headers: {
              'Urgency': 'high',
              'Topic': 'impact-broadcast',
              'apns-priority': '10',
              'apns-push-type': 'alert',
            },
          });
          successCount++;
        } catch (err) {
          failureCount++;
          console.warn('[Broadcast API] Delivery failed for endpoint:', sub.endpoint.slice(0, 40), err?.statusCode || err?.message);
          if (err && (err.statusCode === 410 || err.statusCode === 404 || err.statusCode === 403 || err.statusCode === 400)) {
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
        body: messageText,
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
      mode: isDailyCron ? 'cron' : 'manual',
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
}
