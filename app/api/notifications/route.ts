import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';
import { mockDb } from '@/lib/mock-db';

// GET — Retrieve new replies to the user's own vents (notifications)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('deviceId');
    const userId = searchParams.get('userId');

    if (!deviceId) {
      return NextResponse.json(
        { error: 'missing deviceId' },
        { status: 400 }
      );
    }

    let userVentIds: string[] = [];

    // 1. Fetch the user's vents to know what vents they own
    if (supabase) {
      let data = null;
      let error = null;

      if (userId && userId !== 'null' && userId !== 'undefined') {
        // Try querying with user_id first (defensively check for missing column errors)
        const res = await supabase
          .from('vents')
          .select('id')
          .or(`user_id.eq.${userId},device_id.eq.${deviceId}`);
        
        if (res.error) {
          console.warn('⚠️ user_id notifications query failed (possibly column missing). Falling back to device_id only.', res.error.message);
          const fallbackRes = await supabase
            .from('vents')
            .select('id')
            .eq('device_id', deviceId);
          data = fallbackRes.data;
          error = fallbackRes.error;
        } else {
          data = res.data;
          error = res.error;
        }
      } else {
        const res = await supabase
          .from('vents')
          .select('id')
          .eq('device_id', deviceId);
        data = res.data;
        error = res.error;
      }

      if (!error && data) {
        userVentIds = data.map((v: any) => v.id);
      }
    } else {
      let mockVents = await mockDb.getVents({ limit: 100 });
      if (userId && userId !== 'null' && userId !== 'undefined') {
        mockVents = mockVents.filter(v => v.deviceId === deviceId || (v as any).userId === userId);
      } else {
        mockVents = mockVents.filter(v => v.deviceId === deviceId);
      }
      userVentIds = mockVents.map(v => v.id);
    }

    if (userVentIds.length === 0) {
      return NextResponse.json({ replies: [] });
    }

    // 2. Fetch replies for those vents (excluding their own replies)
    let replies: any[] = [];
    if (supabase) {
      const { data, error } = await supabase
        .from('replies')
        .select('*')
        .in('vent_id', userVentIds)
        .order('created_at', { ascending: false });

      if (!error && data) {
        replies = data
          .filter((r: any) => r.device_id !== deviceId) // exclude their own replies
          .map((r: any) => ({
            id: r.id,
            ventId: r.vent_id,
            content: r.content,
            deviceId: r.device_id,
            createdAt: r.created_at,
          }));
      }
    } else {
      const allReplies: any[] = [];
      for (const vId of userVentIds) {
        const reps = await mockDb.getReplies(vId);
        allReplies.push(...reps);
      }
      replies = allReplies
        .filter((r: any) => r.deviceId !== deviceId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return NextResponse.json({ replies });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'failed to fetch notifications' },
      { status: 500 }
    );
  }
}
