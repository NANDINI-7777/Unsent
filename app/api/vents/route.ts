import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mock-db';
import { detectCrisis } from '@/lib/crisis';
import { filterProfanity } from '@/lib/profanity';
import { supabase } from '@/lib/supabase-client';

// POST — Create a new vent
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, mood, replyStyle, showOnFeed, autoDelete, deviceId, gender } = body;

    // Validate
    if (!content || !mood || !deviceId) {
      return NextResponse.json(
        { error: 'missing required fields' },
        { status: 400 }
      );
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: 'vent must be 500 characters or less' },
        { status: 400 }
      );
    }

    // Rate limiting
    if (!mockDb.checkRateLimit(deviceId)) {
      return NextResponse.json(
        { error: 'slow down — max 5 vents per hour 🌸' },
        { status: 429 }
      );
    }

    // Crisis detection (server-side check)
    const crisisResult = detectCrisis(content);
    if (crisisResult.isCrisis) {
      return NextResponse.json(
        { error: 'crisis_detected', crisis: true },
        { status: 200 }
      );
    }

    // Apply profanity filter
    const filteredContent = filterProfanity(content);

    // Create vent
    let vent;
    if (supabase) {
      const insertData: any = {
        content: filteredContent,
        mood,
        mood_emoji: body.moodEmoji || '🌸',
        mood_color: body.moodColor || '#f56393',
        reply_style: replyStyle || 'heart-to-heart',
        show_on_feed: showOnFeed !== false,
        auto_delete: autoDelete || false,
        device_id: deviceId,
        gender: gender || 'anon',
        expires_at: autoDelete ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : null,
      };

      // Pass user_id if authenticated
      if (body.userId && body.userId !== 'null' && body.userId !== 'undefined') {
        insertData.user_id = body.userId;
      }

      let { data, error } = await supabase
        .from('vents')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        // Fallback retry if user_id column doesn't exist (error code 42703)
        if (error.code === '42703' && insertData.user_id) {
          console.warn('⚠️ user_id column does not exist in vents table yet. Retrying without user_id.');
          delete insertData.user_id;
          const retryRes = await supabase
            .from('vents')
            .insert(insertData)
            .select()
            .single();
          data = retryRes.data;
          error = retryRes.error;
        }
      }

      if (error) {
        console.error('Supabase createVent error:', error);
        throw error;
      }
      
      // Standardize schema fields for frontend components
      vent = {
        id: data.id,
        content: data.content,
        mood: data.mood,
        moodEmoji: data.mood_emoji,
        moodColor: data.mood_color,
        replyStyle: data.reply_style,
        showOnFeed: data.show_on_feed,
        autoDelete: data.auto_delete,
        deviceId: data.device_id,
        replyCount: data.reply_count,
        gender: data.gender || 'anon',
        createdAt: data.created_at,
        expiresAt: data.expires_at,
      };
    } else {
      vent = await mockDb.createVent({
        content: filteredContent,
        mood,
        moodEmoji: body.moodEmoji || '🌸',
        moodColor: body.moodColor || '#f56393',
        replyStyle: replyStyle || 'heart-to-heart',
        showOnFeed: showOnFeed !== false,
        autoDelete: autoDelete || false,
        deviceId,
        gender: gender || 'anon',
      });
    }

    mockDb.recordVent(deviceId);

    return NextResponse.json(vent, { status: 201 });
  } catch (error) {
    console.error('Error creating vent:', error);
    return NextResponse.json(
      { error: 'failed to create vent' },
      { status: 500 }
    );
  }
}

async function seedStarterVents(supabaseClient: any) {
  try {
    console.log('🌱 Seeding starter vents into Supabase...');
    const starterVents = [
      {
        content: "yaar, literally just found out that my roommate has been wearing my clothes to date nights with my ex?? i only realized because she posted a photo wearing my favourite pink top. how do people sleep at night 💀",
        mood: 'dead inside',
        mood_emoji: '💀',
        mood_color: '#c9788f',
        reply_style: 'heart-to-heart',
        show_on_feed: true,
        auto_delete: false,
        device_id: 'sample-1',
        gender: 'anon',
        created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
      {
        content: "heard two girls in the library talking about me behind my back, thinking i couldn't hear because i had my noise-cancelling headphones on. joke's on them, there was no music playing and now I know who to avoid this semester 💅🏻",
        mood: 'dissociating',
        mood_emoji: '😶‍🌫️',
        mood_color: '#e8b4c4',
        reply_style: 'fr tho',
        show_on_feed: true,
        auto_delete: false,
        device_id: 'sample-2',
        gender: 'anon',
        created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      },
      {
        content: "he told me he was too busy with exams to text, but i literally saw him in the background of a club story popping bottles with his friends. why lie when you can just be honest and let me go? 🥀",
        mood: 'not okay',
        mood_emoji: '🥀',
        mood_color: '#d94478',
        reply_style: 'heart-to-heart',
        show_on_feed: true,
        auto_delete: false,
        device_id: 'sample-3',
        gender: 'anon',
        created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      },
      {
        content: "our college professor accidentally shared his private whatsapp screen during the projector lecture and we all saw the chats with the HOD bitching about our class... college is literally just high school with higher debt 🥴",
        mood: 'cooked',
        mood_emoji: '😮‍💨',
        mood_color: '#ffaac8',
        reply_style: 'roast me',
        show_on_feed: true,
        auto_delete: false,
        device_id: 'sample-4',
        gender: 'anon',
        created_at: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
      },
      {
        content: "my best friend since middle school started dating the guy who bullied me throughout high school. she said 'it's in the past' but it literally feels like the ultimate betrayal.",
        mood: 'melting',
        mood_emoji: '🫠',
        mood_color: '#ff85ae',
        reply_style: 'roast me',
        show_on_feed: true,
        auto_delete: false,
        device_id: 'sample-5',
        gender: 'anon',
        created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
      },
      {
        content: "why does my group project team behave like they are in a silent movie? i ask questions on group chat, they view it, and absolutely nobody replies. guess who's doing the whole presentation alone lol",
        mood: 'totally fine',
        mood_emoji: '🙃',
        mood_color: '#ffc9dd',
        reply_style: 'fr tho',
        show_on_feed: true,
        auto_delete: false,
        device_id: 'sample-6',
        gender: 'anon',
        created_at: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
      },
      {
        content: "pretending to be okay in every group chat while literally falling apart alone in my room lol",
        mood: 'totally fine',
        mood_emoji: '🙃',
        mood_color: '#ffc9dd',
        reply_style: 'fr tho',
        show_on_feed: true,
        auto_delete: false,
        device_id: 'sample-7',
        gender: 'anon',
        created_at: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
      },
      {
        content: "my roommate plays valorant till 4 AM screaming at his mic and i have an 8 AM class. if i tell him, he acts like i'm the dramatic one.",
        mood: 'cooked',
        mood_emoji: '🥴',
        mood_color: '#ffaac8',
        reply_style: 'fr tho',
        show_on_feed: true,
        auto_delete: false,
        device_id: 'sample-8',
        gender: 'anon',
        created_at: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
      },
      {
        content: "i have 43 unread texts and the anxiety of replying to them is making me ghost everyone completely lol",
        mood: 'totally fine',
        mood_emoji: '🙃',
        mood_color: '#ffc9dd',
        reply_style: 'roast me',
        show_on_feed: true,
        auto_delete: false,
        device_id: 'sample-9',
        gender: 'anon',
        created_at: new Date(Date.now() - 1000 * 60 * 700).toISOString(),
      },
      {
        content: "sometimes i just want to pack my bags, change my name, and move to a quiet town where nobody knows my mistakes.",
        mood: 'melting',
        mood_emoji: '🫠',
        mood_color: '#ff85ae',
        reply_style: 'heart-to-heart',
        show_on_feed: true,
        auto_delete: false,
        device_id: 'sample-10',
        gender: 'anon',
        created_at: new Date(Date.now() - 1000 * 60 * 800).toISOString(),
      }
    ];

    const { error } = await supabaseClient
      .from('vents')
      .insert(starterVents);

    if (error) {
      console.error('❌ Error seeding starter vents:', error);
    } else {
      console.log('✅ Successfully seeded starter vents!');
    }
  } catch (err) {
    console.error('❌ seedStarterVents error:', err);
  }
}

// GET — Fetch feed (paginated, filtered)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mood = searchParams.get('mood') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || 'latest';
    const style = searchParams.get('style') || 'all';

    let vents = [];
    if (supabase) {
      // Build query
      let query = supabase
        .from('vents')
        .select('*, replies(count)')
        .eq('show_on_feed', true);

      // Filter by mood
      if (mood && mood !== 'all') {
        query = query.eq('mood', mood);
      }

      // Filter by reply style
      if (style && style !== 'all') {
        query = query.eq('reply_style', style);
      }

      // Filter out expired vents
      query = query.or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

      // Order and pagination
      const start = (page - 1) * limit;
      
      if (sort === 'popular') {
        query = query.order('reply_count', { ascending: false }).order('created_at', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      let { data, error } = await query.range(start, start + limit - 1);

      if (error) {
        console.error('Supabase fetch feed error:', error);
        throw error;
      }

      // If database is completely empty on the first page, seed starter vents!
      if ((!data || data.length === 0) && page === 1 && mood === 'all' && style === 'all') {
        await seedStarterVents(supabase);
        // Fetch again after seeding
        const refetch = await supabase
          .from('vents')
          .select('*, replies(count)')
          .eq('show_on_feed', true)
          .order('created_at', { ascending: false })
          .range(start, start + limit - 1);
        
        if (!refetch.error && refetch.data) {
          data = refetch.data;
        }
      }

      // Standardize schema fields
      vents = (data || []).map((item: any) => ({
        id: item.id,
        content: item.content,
        mood: item.mood,
        moodEmoji: item.mood_emoji,
        moodColor: item.mood_color,
        replyStyle: item.reply_style,
        showOnFeed: item.show_on_feed,
        autoDelete: item.auto_delete,
        deviceId: item.device_id,
        replyCount: item.replies?.[0]?.count || 0,
        gender: item.gender || 'anon',
        createdAt: item.created_at,
        expiresAt: item.expires_at,
      }));
    } else {
      vents = await mockDb.getVents({ mood, page, limit, sort, replyStyle: style });
    }

    return NextResponse.json({
      vents,
      page,
      hasMore: vents.length === limit,
    });
  } catch (error) {
    console.error('Error fetching vents:', error);
    return NextResponse.json(
      { error: 'failed to fetch vents' },
      { status: 500 }
    );
  }
}
