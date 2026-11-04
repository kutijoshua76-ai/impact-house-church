import { supabase } from './supabase';
import { broadcastPushNotification, SendPushResult } from './pushBroadcast';

export interface BibleVerseItem {
  id: string;
  reference: string;
  book: string;
  chapter: number;
  verseNumber: string;
  text: string;
  translation: string;
  theme: string;
  reflection: string;
  prayer: string;
}

export const CURATED_VERSES: BibleVerseItem[] = [
  {
    id: 'v-1',
    reference: 'Philippians 4:13',
    book: 'Philippians',
    chapter: 4,
    verseNumber: '13',
    text: 'I can do all things through Christ who strengthens me.',
    translation: 'NKJV',
    theme: 'Strength & Victory',
    reflection: 'Whatever challenges appear before you today, your capability does not rest solely on human intellect or physical energy. Christ supplies an inexhaustible spring of endurance and victory inside your spirit.',
    prayer: 'Lord Jesus, I anchor my confidence in Your unshakeable power today. Fill my mind with divine courage and grant me grace to triumph in every assignment before me. Amen.'
  },
  {
    id: 'v-2',
    reference: 'Jeremiah 29:11',
    book: 'Jeremiah',
    chapter: 29,
    verseNumber: '11',
    text: 'For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, to give you a future and a hope.',
    translation: 'NIV',
    theme: 'Divine Destiny & Hope',
    reflection: 'God has not left your life to chance or unpredictable circumstance. Every season—even seasons of waiting or preparation—is woven into His intentional blueprint for your upliftment and good.',
    prayer: 'Father, thank You that my future is secure in Your hands. Free my heart from anxiety and reveal the beauty of Your guidance step by step today. Amen.'
  },
  {
    id: 'v-3',
    reference: 'Isaiah 40:31',
    book: 'Isaiah',
    chapter: 40,
    verseNumber: '31',
    text: 'Those who wait on the LORD shall renew their strength; they shall mount up with wings like eagles, they shall run and not be weary, they shall walk and not faint.',
    translation: 'NKJV',
    theme: 'Supernatural Renewal',
    reflection: 'Waiting on the Lord is an active stance of trust and prayerful alignment. When you wait on God, an exchange happens: your weakness is traded for His everlasting power, elevating you above earthly turbulence.',
    prayer: 'Father of light, I rest my heart in Your presence. Renew my mind, breathe fresh vitality into my physical body, and lift me high above discouragement. Amen.'
  },
  {
    id: 'v-4',
    reference: 'Proverbs 3:5-6',
    book: 'Proverbs',
    chapter: 3,
    verseNumber: '5-6',
    text: 'Trust in the LORD with all your heart and lean not on your own understanding; in all your ways acknowledge Him, and He shall direct your paths.',
    translation: 'NKJV',
    theme: 'Wisdom & Divine Guidance',
    reflection: 'Human reasoning sees only partial horizons, but God comprehends eternity. Handing the wheel to Him in daily decisions leads you clear of hidden snares directly into His favor.',
    prayer: 'Wise and loving Father, I submit every decision, conversation, and goal today into Your hands. Direct my steps and let Your wisdom illuminate my road. Amen.'
  },
  {
    id: 'v-5',
    reference: 'Psalm 23:1-3',
    book: 'Psalms',
    chapter: 23,
    verseNumber: '1-3',
    text: 'The LORD is my shepherd; I shall not want. He makes me to lie down in green pastures; He leads me beside the still waters. He restores my soul.',
    translation: 'NKJV',
    theme: 'Peace & Abundant Care',
    reflection: 'As your Shepherd, Jesus knows exactly what nourishes your spirit and heals your emotional weariness. You will not lack any good thing as you follow His gentle voice.',
    prayer: 'Good Shepherd, thank You for leading me by quiet waters. Restore my peace, protect my home, and overflow my cup with Your tender mercies. Amen.'
  },
  {
    id: 'v-6',
    reference: 'Romans 8:28',
    book: 'Romans',
    chapter: 8,
    verseNumber: '28',
    text: 'And we know that in all things God works for the good of those who love Him, who have been called according to His purpose.',
    translation: 'NIV',
    theme: 'Purpose & Providence',
    reflection: 'No delay is wasted; no trial is purposeless. The Almighty orchestrates all moving parts behind the scenes to produce a testimony that brings glory to His name and advancement to your life.',
    prayer: 'Almighty God, I praise You because You turn even disappointments into appointments of grace. Work out all things for my ultimate good today. Amen.'
  },
  {
    id: 'v-7',
    reference: 'Joshua 1:9',
    book: 'Joshua',
    chapter: 1,
    verseNumber: '9',
    text: 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.',
    translation: 'NIV',
    theme: 'Courage & Presence',
    reflection: 'Courage is not the absence of pressure, but the revelation that the King of Kings walks alongside you. Step boldly into your meetings, exams, tasks, and opportunities today.',
    prayer: 'Lord God of hosts, silence every whisper of fear in my heart. Clothe me with unyielding courage and let Your presence go before me today. Amen.'
  },
  {
    id: 'v-8',
    reference: 'Psalm 46:1-2',
    book: 'Psalms',
    chapter: 46,
    verseNumber: '1-2',
    text: 'God is our refuge and strength, a very present help in trouble. Therefore we will not fear, even though the earth be removed.',
    translation: 'NKJV',
    theme: 'Refuge & Divine Protection',
    reflection: 'When storms gather in the world, believers have an unshakable fortress. God is not distant; He is a very present, immediate help right inside your situation.',
    prayer: 'Heavenly Father, I hide under the shadow of Your wings today. You are my safe harbor, my defense, and my everlasting peace. Amen.'
  },
  {
    id: 'v-9',
    reference: '2 Timothy 1:7',
    book: '2 Timothy',
    chapter: 1,
    verseNumber: '7',
    text: 'For God has not given us a spirit of fear, but of power and of love and of a sound mind.',
    translation: 'NKJV',
    theme: 'Clarity & Sound Mind',
    reflection: 'Fear, confusion, and panic are not from God. His Holy Spirit inside you imparts clear vision, self-discipline, divine authority, and boundless compassion.',
    prayer: 'Holy Spirit, flood my thoughts with clarity and calm. I cast down fear and receive Your spirit of love, power, and sound judgment right now. Amen.'
  },
  {
    id: 'v-10',
    reference: 'Matthew 6:33',
    book: 'Matthew',
    chapter: 6,
    verseNumber: '33',
    text: 'Seek first the kingdom of God and His righteousness, and all these things shall be added to you.',
    translation: 'NKJV',
    theme: 'Kingdom Priorities',
    reflection: 'When you make God’s presence, will, and kingdom your primary ambition, the temporal necessities of life cease to be an agonizing chase—they are added to you with ease.',
    prayer: 'Lord, be first in my thoughts, first in my calendar, and first in my heart today. Take care of my needs as I delight in Your kingdom. Amen.'
  },
  {
    id: 'v-11',
    reference: 'Psalm 91:1-2',
    book: 'Psalms',
    chapter: 91,
    verseNumber: '1-2',
    text: 'He who dwells in the secret place of the Most High shall abide under the shadow of the Almighty. I will say of the LORD, "He is my refuge and my fortress; my God, in Him I will trust."',
    translation: 'NKJV',
    theme: 'Divine Shield',
    reflection: 'Dwelling in the secret place is a posture of continual communion with God. Under His shadow, no weapon formed against your destiny can prosper.',
    prayer: 'Lord God Most High, I pitch my tent in Your presence today. Shield my coming and going, my loved ones, and my work from every evil snare. Amen.'
  },
  {
    id: 'v-12',
    reference: 'Philippians 4:6-7',
    book: 'Philippians',
    chapter: 4,
    verseNumber: '6-7',
    text: 'Be anxious for nothing, but in everything by prayer and supplication, with thanksgiving, let your requests be made known to God; and the peace of God, which surpasses all understanding, will guard your hearts and minds through Christ Jesus.',
    translation: 'NKJV',
    theme: 'Peace Over Anxiety',
    reflection: 'Turn every worry into a prayer and every burden into praise. God answers with supernatural peace that stands guard like a garrison over your emotional state.',
    prayer: 'Father, I release every heavy worry and deadline into Your care. Fill my heart with thanksgiving and cover me with peace that defies understanding. Amen.'
  },
  {
    id: 'v-13',
    reference: 'Psalm 119:105',
    book: 'Psalms',
    chapter: 119,
    verseNumber: '105',
    text: 'Your word is a lamp to my feet and a light to my path.',
    translation: 'NKJV',
    theme: 'Illumination & Direction',
    reflection: 'In a world filled with contradictory opinions, the scripture provides a lamp that illuminates the very next step and a bright light that clarifies the road ahead.',
    prayer: 'Lord, let Your Word speak clearly to my circumstances today. Give me understanding and wisdom to walk in Your truth. Amen.'
  },
  {
    id: 'v-14',
    reference: 'Romans 12:2',
    book: 'Romans',
    chapter: 12,
    verseNumber: '2',
    text: 'Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God’s will is—His good, pleasing and perfect will.',
    translation: 'NIV',
    theme: 'Transformation & Focus',
    reflection: 'A renewed mind perceives possibilities where others see dead ends. When you marinate your thoughts in God’s Word, you align with His perfect, prosperous will.',
    prayer: 'Father, renew my thought life. Strip away negativity, worldly pressure, and doubt, and tune my heart to perceive Your perfect will today. Amen.'
  },
  {
    id: 'v-15',
    reference: 'Zechariah 4:6',
    book: 'Zechariah',
    chapter: 4,
    verseNumber: '6',
    text: 'Not by might nor by power, but by My Spirit, says the LORD of hosts.',
    translation: 'NKJV',
    theme: 'The Grace of the Holy Spirit',
    reflection: 'The mountains standing before you will not be dismantled by sheer human hustle, but by the gentle yet unstoppable breath of the Spirit of God.',
    prayer: 'Holy Spirit, breathe upon my endeavors today. Where human capability stops, let Your sovereign grace take over and accomplish the impossible. Amen.'
  },
  {
    id: 'v-16',
    reference: 'Hebrews 11:1',
    book: 'Hebrews',
    chapter: 11,
    verseNumber: '1',
    text: 'Now faith is the substance of things hoped for, the evidence of things not seen.',
    translation: 'NKJV',
    theme: 'Living Faith',
    reflection: 'Faith is not wishful thinking; it is the concrete title-deed of heaven’s promises already made reality in Christ. Hold firm to what God has spoken.',
    prayer: 'Lord, increase my faith. Help me to look beyond physical limitations and stand on the certainty of Your eternal promises today. Amen.'
  },
  {
    id: 'v-17',
    reference: 'Psalm 37:4-5',
    book: 'Psalms',
    chapter: 37,
    verseNumber: '4-5',
    text: 'Delight yourself also in the LORD, and He shall give you the desires of your heart. Commit your way to the LORD, trust also in Him, and He shall bring it to pass.',
    translation: 'NKJV',
    theme: 'Desire & Divine Fulfillment',
    reflection: 'When your greatest delight is knowing God, He purifies your passions and brings His divine fulfillment to pass in ways far exceeding your expectations.',
    prayer: 'Father, my soul delights in You. I commit my career, family, health, and hopes into Your loving hands. Bring Your glorious plans to pass. Amen.'
  },
  {
    id: 'v-18',
    reference: 'Ephesians 3:20',
    book: 'Ephesians',
    chapter: 3,
    verseNumber: '20',
    text: 'Now to Him who is able to do exceedingly abundantly above all that we ask or think, according to the power that works in us.',
    translation: 'NKJV',
    theme: 'Exceeding Grace',
    reflection: 'God never runs out of capacity. His ability begins where your wildest imagination ends. The same resurrecting power lives and operates inside you today.',
    prayer: 'Heavenly Father, broaden my expectations. I thank You for doing exceedingly and abundantly beyond what I can formulate into words. Amen.'
  },
  {
    id: 'v-19',
    reference: 'Galatians 5:22-23',
    book: 'Galatians',
    chapter: 5,
    verseNumber: '22-23',
    text: 'The fruit of the Spirit is love, joy, peace, longsuffering, kindness, goodness, faithfulness, gentleness, self-control.',
    translation: 'NKJV',
    theme: 'Fruitful Character',
    reflection: 'Christ-like character is the greatest witness you can offer today. Let the Holy Spirit produce patience, joy, and kindness in every interaction you have.',
    prayer: 'Holy Spirit, cultivate in me the fruit of love, gentleness, and peace. Let my words bring life and grace to everyone I encounter today. Amen.'
  },
  {
    id: 'v-20',
    reference: 'John 14:27',
    book: 'John',
    chapter: 14,
    verseNumber: '27',
    text: 'Peace I leave with you, My peace I give to you; not as the world gives do I give to you. Let not your heart be troubled, neither let it be afraid.',
    translation: 'NKJV',
    theme: 'Unshakable Peace',
    reflection: 'Worldly peace depends on smooth conditions, but Christ’s peace thrives in the middle of turbulence. His gift of peace cannot be taken away by circumstances.',
    prayer: 'Lord Jesus, I receive Your peace today. Quiet my thoughts, steady my pulse, and guard my soul against distress. Amen.'
  },
  {
    id: 'v-21',
    reference: 'Psalm 103:1-4',
    book: 'Psalms',
    chapter: 103,
    verseNumber: '1-4',
    text: 'Bless the LORD, O my soul; and all that is within me, bless His holy name! Bless the LORD, O my soul, and forget not all His benefits: who forgives all your iniquities, who heals all your diseases, who redeems your life from destruction.',
    translation: 'NKJV',
    theme: 'Praise & Remembrance',
    reflection: 'Gratitude changes your spiritual posture. Counting God’s past faithfulness fuels present confidence and releases health and redemption to every area of your life.',
    prayer: 'Bless the Lord, O my soul! I thank You for Your unending forgiveness, healing power, and daily mercies that surround me today. Amen.'
  }
];

/**
 * Returns today's deterministic day of the year (1 - 366).
 */
export function getDayOfYear(date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Returns a deterministic date key string (e.g. "2026-11-04").
 */
export function getTodayDateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Retrieves the Bible Verse for today.
 * First queries Supabase `bible_verses` if available, and gracefully falls back to CURATED_VERSES.
 */
export async function getTodayVerse(): Promise<BibleVerseItem> {
  const dayOfYear = getDayOfYear();
  const fallbackIndex = dayOfYear % CURATED_VERSES.length;
  const localDefault = CURATED_VERSES[fallbackIndex];

  try {
    const { data, error } = await supabase
      .from('bible_verses')
      .select('*')
      .or(`day_of_year.eq.${dayOfYear},category.eq.daily`)
      .limit(1);

    if (!error && data && data.length > 0) {
      const row = data[0];
      return {
        id: row.id || localDefault.id,
        reference: row.reference || localDefault.reference,
        book: row.book || localDefault.book,
        chapter: row.chapter || localDefault.chapter,
        verseNumber: row.verse_number || localDefault.verseNumber,
        text: row.verse || row.text || localDefault.text,
        translation: row.translation || localDefault.translation,
        theme: row.category || row.theme || localDefault.theme,
        reflection: row.reflection || localDefault.reflection,
        prayer: row.prayer || localDefault.prayer,
      };
    }
  } catch (err) {
    console.warn('[DailyVerse] Falling back to curated scripture repository:', err);
  }

  return localDefault;
}

/**
 * Checks whether user has enabled daily verse notifications.
 * Defaults to true if push is subscribed.
 */
export function isDailyVerseNotificationEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem('impact_daily_verse_enabled');
  if (stored === null) {
    // Default to enabled if push notifications are subscribed
    return localStorage.getItem('impact_push_subscribed') === 'true';
  }
  return stored === 'true';
}

/**
 * Sets daily verse notification preference.
 */
export function setDailyVerseNotificationEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('impact_daily_verse_enabled', enabled ? 'true' : 'false');
}

/**
 * Checks if today's verse notification has already been triggered on this device today.
 */
export function hasNotifiedToday(): boolean {
  if (typeof window === 'undefined') return true;
  const lastDate = localStorage.getItem('impact_last_verse_notified_date');
  return lastDate === getTodayDateKey();
}

/**
 * Dispatches a client-side Service Worker notification for today's verse if not sent yet today.
 */
export async function checkAndTriggerDailyVerseNotification(force = false): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  if (!force) {
    if (!isDailyVerseNotificationEnabled()) {
      return false;
    }
    if (hasNotifiedToday()) {
      return false;
    }
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    if (!registration) return false;

    const verse = await getTodayVerse();
    const todayKey = getTodayDateKey();

    const title = `📖 Daily Word: ${verse.reference}`;
    const truncatedText = verse.text.length > 120 ? `${verse.text.slice(0, 117)}...` : verse.text;
    const body = `"${truncatedText}"\nTap for today's devotional & prayer.`;

    await registration.showNotification(title, {
      body,
      icon: '/pwa-192x192.png',
      badge: '/badge-72x72.png',
      tag: `daily-verse-${todayKey}`,
      renotify: force,
      data: {
        url: '/daily-verse',
        type: 'daily-verse',
        verseId: verse.id,
        reference: verse.reference,
      },
      vibrate: [120, 60, 120],
      actions: [
        { action: 'open', title: 'Read Reflection' },
        { action: 'dismiss', title: 'Close' },
      ],
    });

    localStorage.setItem('impact_last_verse_notified_date', todayKey);
    return true;
  } catch (err) {
    console.error('[DailyVerse] Failed to trigger notification:', err);
    return false;
  }
}

/**
 * Admin action: Broadcasts today's Bible Verse to ALL subscribed devices via the Push Notification function.
 */
export async function broadcastDailyVerseToAllSubscribers(customVerse?: BibleVerseItem): Promise<SendPushResult> {
  const verse = customVerse || (await getTodayVerse());
  const truncatedText = verse.text.length > 120 ? `${verse.text.slice(0, 117)}...` : verse.text;

  return broadcastPushNotification({
    title: `📖 Daily Scripture: ${verse.reference}`,
    body: `"${truncatedText}" — Tap to read today's word and prayer.`,
    url: '/daily-verse',
    tag: `impact-verse-${getTodayDateKey()}`,
  });
}

