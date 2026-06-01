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
      const { data, error } = await supabase
        .from('vents')
        .insert({
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
        })
        .select()
        .single();

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
        .select('*')
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

      const { data, error } = await query.range(start, start + limit - 1);

      if (error) {
        console.error('Supabase fetch feed error:', error);
        throw error;
      }

      // Standardize schema fields
      vents = data.map((item: any) => ({
        id: item.id,
        content: item.content,
        mood: item.mood,
        moodEmoji: item.mood_emoji,
        moodColor: item.mood_color,
        replyStyle: item.reply_style,
        showOnFeed: item.show_on_feed,
        autoDelete: item.auto_delete,
        deviceId: item.device_id,
        replyCount: item.reply_count,
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
